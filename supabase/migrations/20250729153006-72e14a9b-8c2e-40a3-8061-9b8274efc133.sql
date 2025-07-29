-- Phase 1: Core Authentication & Access Control Database Setup (Final)

-- Create enum for login attempt status (skip if exists)
DO $$ BEGIN
    CREATE TYPE public.login_status AS ENUM ('success', 'failed', 'blocked', 'suspicious');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for session status (skip if exists)
DO $$ BEGIN
    CREATE TYPE public.session_status AS ENUM ('active', 'expired', 'terminated', 'suspicious');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
CREATE TABLE public.user_sessions_enhanced (
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

-- Multi-factor authentication settings
CREATE TABLE public.user_mfa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    backup_codes TEXT[],
    recovery_codes_used INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table (using existing app_role enum values)
DO $$ BEGIN
    CREATE TABLE public.user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        role app_role NOT NULL DEFAULT 'viewer',
        assigned_by UUID REFERENCES auth.users(id),
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        expires_at TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(user_id, role)
    );
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- Enable RLS on all tables
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;

-- Security definer functions for role checking (update existing)
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
        AND role = 'admin'
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > now())
    )
$$;

-- RLS Policies for user roles (if table was just created)
DO $$ BEGIN
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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for login attempts
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

-- RLS Policies for enhanced sessions
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions_enhanced FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions"
ON public.user_sessions_enhanced FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own sessions"
ON public.user_sessions_enhanced FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own sessions"
ON public.user_sessions_enhanced FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for security audit log
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
ON public.security_audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for password history
CREATE POLICY "Users can view their password history"
ON public.password_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can manage password history"
ON public.password_history FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for MFA settings
CREATE POLICY "Users can view their own MFA settings"
ON public.user_mfa_settings FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own MFA settings"
ON public.user_mfa_settings FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_user_mfa_settings_updated_at
    BEFORE UPDATE ON public.user_mfa_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DO $$ BEGIN
    CREATE TRIGGER update_user_roles_updated_at
        BEFORE UPDATE ON public.user_roles
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Function to assign default role to new users (update existing)
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Assign default viewer role to new users
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'viewer', NEW.id)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Log the account creation
    INSERT INTO public.security_audit_log (user_id, action, details, risk_level)
    VALUES (NEW.id, 'account_created', 
            jsonb_build_object('email', NEW.email), 'low');
    
    RETURN NEW;
END;
$$;

-- Function to log authentication events (update existing)
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

-- Function to log login attempts
CREATE OR REPLACE FUNCTION public.log_login_attempt(
    p_email TEXT,
    p_user_id UUID DEFAULT NULL,
    p_status login_status DEFAULT 'success',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    attempt_id UUID;
BEGIN
    INSERT INTO public.login_attempts (
        user_id, email, status, ip_address, user_agent, failure_reason, is_suspicious
    ) VALUES (
        p_user_id, p_email, p_status, p_ip_address, p_user_agent, p_failure_reason,
        -- Mark as suspicious if multiple failed attempts
        CASE WHEN p_status = 'failed' AND (
            SELECT COUNT(*) FROM public.login_attempts 
            WHERE email = p_email 
            AND status = 'failed' 
            AND attempted_at > now() - INTERVAL '1 hour'
        ) >= 3 THEN true ELSE false END
    ) RETURNING id INTO attempt_id;
    
    RETURN attempt_id;
END;
$$;

-- Function to check password strength
CREATE OR REPLACE FUNCTION public.check_password_strength(password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    score INTEGER := 0;
    feedback TEXT[] := '{}';
BEGIN
    -- Check length
    IF LENGTH(password) >= 8 THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must be at least 8 characters long');
    END IF;
    
    -- Check for uppercase
    IF password ~ '[A-Z]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one uppercase letter');
    END IF;
    
    -- Check for lowercase
    IF password ~ '[a-z]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one lowercase letter');
    END IF;
    
    -- Check for numbers
    IF password ~ '[0-9]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one number');
    END IF;
    
    -- Check for special characters
    IF password ~ '[^a-zA-Z0-9]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one special character');
    END IF;
    
    RETURN jsonb_build_object(
        'score', score,
        'max_score', 5,
        'is_strong', score >= 4,
        'feedback', feedback
    );
END;
$$;

-- Indexes for performance
CREATE INDEX idx_login_attempts_user_id ON public.login_attempts(user_id);
CREATE INDEX idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX idx_login_attempts_attempted_at ON public.login_attempts(attempted_at);
CREATE INDEX idx_login_attempts_status ON public.login_attempts(status);
CREATE INDEX idx_user_sessions_enhanced_user_id ON public.user_sessions_enhanced(user_id);
CREATE INDEX idx_user_sessions_enhanced_status ON public.user_sessions_enhanced(status);
CREATE INDEX idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX idx_security_audit_log_risk_level ON public.security_audit_log(risk_level);
CREATE INDEX idx_password_history_user_id ON public.password_history(user_id);
CREATE INDEX idx_user_mfa_settings_user_id ON public.user_mfa_settings(user_id);