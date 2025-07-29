-- Fix search path security warnings for functions
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.team_members
        WHERE user_id = _user_id AND team_id = _team_id
    )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID, _team_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT role FROM public.team_members
    WHERE user_id = _user_id AND team_id = _team_id
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_team()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;