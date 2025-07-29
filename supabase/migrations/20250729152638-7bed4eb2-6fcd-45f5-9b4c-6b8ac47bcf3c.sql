-- Phase 1: Core Authentication & Access Control Database Setup

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'manager', 'member', 'viewer');

-- Create enum for login attempt status
CREATE TYPE public.login_status AS ENUM ('success', 'failed', 'blocked', 'suspicious');

-- Create enum for session status
CREATE TYPE public.session_status AS ENUM ('active', 'expired', 'terminated', 'suspicious');

-- User roles table for RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'member',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Login attempts tracking for security monitoring
CREATE TABLE public.login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status login_status NOT NULL,
    failure_reason TEXT,
    location_country TEXT,
    location_city TEXT,
    is_suspicious BOOLEAN DEFAULT false,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced session management
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    location_country TEXT,
    location_city TEXT,
    status session_status DEFAULT 'active',
    is_current BOOLEAN DEFAULT false,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    terminated_at TIMESTAMP WITH TIME ZONE,
    terminated_reason TEXT
);

-- Security audit log
CREATE TABLE public.security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Password policy tracking
CREATE TABLE public.password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_history ENABLE ROW LEVEL SECURITY;

-- Security definer functions for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id 
        AND role = _role 
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > now())
    )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id 
        AND role IN ('super_admin', 'admin')
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > now())
    )
$$;

-- RLS Policies

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Login attempts policies
CREATE POLICY "Users can view their own login attempts"
ON public.login_attempts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all login attempts"
ON public.login_attempts FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert login attempts"
ON public.login_attempts FOR INSERT
TO authenticated
WITH CHECK (true);

-- User sessions policies
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions"
ON public.user_sessions FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions"
ON public.user_sessions FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can manage sessions"
ON public.user_sessions FOR ALL
TO authenticated
USING (true);

-- Security audit log policies
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
ON public.security_audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Password history policies
CREATE POLICY "Users can view their password history"
ON public.password_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can manage password history"
ON public.password_history FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to assign default role to new users
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Assign default member role to new users
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'member', NEW.id);
    
    -- Log the account creation
    INSERT INTO public.security_audit_log (user_id, action, details, risk_level)
    VALUES (NEW.id, 'account_created', 
            jsonb_build_object('email', NEW.email), 'low');
    
    RETURN NEW;
END;
$$;

-- Trigger to assign default role on user creation
CREATE TRIGGER on_auth_user_created_assign_role
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_default_role();

-- Function to log authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Log significant authentication events
    IF TG_OP = 'UPDATE' THEN
        -- Check for email changes
        IF OLD.email != NEW.email THEN
            INSERT INTO public.security_audit_log (user_id, action, details, risk_level)
            VALUES (NEW.id, 'email_changed', 
                    jsonb_build_object('old_email', OLD.email, 'new_email', NEW.email), 'medium');
        END IF;
        
        -- Check for email confirmation
        IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
            INSERT INTO public.security_audit_log (user_id, action, details, risk_level)
            VALUES (NEW.id, 'email_confirmed', 
                    jsonb_build_object('email', NEW.email), 'low');
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to log auth events
CREATE TRIGGER on_auth_user_updated_log_events
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.log_auth_event();

-- Indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_login_attempts_user_id ON public.login_attempts(user_id);
CREATE INDEX idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX idx_login_attempts_attempted_at ON public.login_attempts(attempted_at);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_status ON public.user_sessions(status);
CREATE INDEX idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX idx_password_history_user_id ON public.password_history(user_id);