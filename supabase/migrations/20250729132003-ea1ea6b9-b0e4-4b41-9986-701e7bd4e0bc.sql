-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer', 'content_creator', 'analyst');

-- Create enum for user status
CREATE TYPE public.user_status AS ENUM ('online', 'offline', 'away', 'busy');

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create team members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    status user_status NOT NULL DEFAULT 'offline',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(team_id, user_id)
);

-- Create permissions table for granular control
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL -- 'content', 'analytics', 'team', 'billing', etc.
);

-- Create role permissions table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role app_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    UNIQUE(role, permission_id, team_id)
);

-- Create activity log table
CREATE TABLE public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.team_members
        WHERE user_id = _user_id AND team_id = _team_id
    )
$$;

-- Create security definer function to check user role in team
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID, _team_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT role FROM public.team_members
    WHERE user_id = _user_id AND team_id = _team_id
$$;

-- RLS Policies for teams
CREATE POLICY "Users can view teams they belong to"
    ON public.teams FOR SELECT
    USING (public.is_team_member(auth.uid(), id));

CREATE POLICY "Team admins can update teams"
    ON public.teams FOR UPDATE
    USING (public.get_user_role(auth.uid(), id) = 'admin');

CREATE POLICY "Authenticated users can create teams"
    ON public.teams FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for team_members
CREATE POLICY "Team members can view team membership"
    ON public.team_members FOR SELECT
    USING (public.is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can manage members"
    ON public.team_members FOR ALL
    USING (public.get_user_role(auth.uid(), team_id) = 'admin');

CREATE POLICY "Users can join teams"
    ON public.team_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- RLS Policies for permissions (readable by all authenticated users)
CREATE POLICY "Authenticated users can view permissions"
    ON public.permissions FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- RLS Policies for role_permissions
CREATE POLICY "Team members can view role permissions"
    ON public.role_permissions FOR SELECT
    USING (public.is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can manage role permissions"
    ON public.role_permissions FOR ALL
    USING (public.get_user_role(auth.uid(), team_id) = 'admin');

-- RLS Policies for activity_log
CREATE POLICY "Team members can view activity log"
    ON public.activity_log FOR SELECT
    USING (public.is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create activity log entries"
    ON public.activity_log FOR INSERT
    WITH CHECK (public.is_team_member(auth.uid(), team_id));

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
    ('create_content', 'Create new content', 'content'),
    ('edit_content', 'Edit existing content', 'content'),
    ('delete_content', 'Delete content', 'content'),
    ('publish_content', 'Publish content to platforms', 'content'),
    ('view_analytics', 'View analytics and reports', 'analytics'),
    ('export_analytics', 'Export analytics data', 'analytics'),
    ('manage_team', 'Manage team members and roles', 'team'),
    ('manage_billing', 'Access billing and subscription settings', 'billing'),
    ('approve_content', 'Approve content for publishing', 'workflow'),
    ('manage_workflows', 'Create and manage approval workflows', 'workflow');

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically make team creator an admin
CREATE OR REPLACE FUNCTION public.handle_new_team()
RETURNS TRIGGER AS $$
BEGIN
    -- Add the team creator as an admin member
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin');
    
    -- Log the team creation
    INSERT INTO public.activity_log (team_id, user_id, action, details)
    VALUES (NEW.id, NEW.created_by, 'team_created', 
            jsonb_build_object('team_name', NEW.name));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new team creation
CREATE TRIGGER on_team_created
    AFTER INSERT ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_team();