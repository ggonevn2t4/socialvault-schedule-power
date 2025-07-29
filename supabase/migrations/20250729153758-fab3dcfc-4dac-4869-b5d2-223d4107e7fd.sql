-- Phase 2: Data Protection & Privacy Database Setup

-- Create enum for data classification levels
CREATE TYPE public.data_classification AS ENUM ('public', 'internal', 'confidential', 'restricted');

-- Create enum for privacy request types
CREATE TYPE public.privacy_request_type AS ENUM ('export', 'delete', 'anonymize', 'correction', 'portability');

-- Create enum for privacy request status
CREATE TYPE public.privacy_request_status AS ENUM ('pending', 'in_progress', 'completed', 'rejected', 'cancelled');

-- Create enum for consent types
CREATE TYPE public.consent_type AS ENUM ('marketing', 'analytics', 'functional', 'performance', 'targeting');

-- Data classification table for content and data categorization
CREATE TABLE public.data_classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL, -- 'post', 'profile', 'media', etc.
    resource_id UUID NOT NULL,
    classification data_classification NOT NULL DEFAULT 'internal',
    reason TEXT,
    classified_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Privacy requests table for GDPR compliance
CREATE TABLE public.privacy_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type privacy_request_type NOT NULL,
    status privacy_request_status DEFAULT 'pending',
    description TEXT,
    requested_data JSONB, -- Specify what data is requested
    processing_notes TEXT,
    processed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User consent management
CREATE TABLE public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type consent_type NOT NULL,
    is_given BOOLEAN DEFAULT false,
    given_at TIMESTAMP WITH TIME ZONE,
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    consent_version TEXT DEFAULT '1.0',
    ip_address INET,
    user_agent TEXT,
    legal_basis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, consent_type)
);

-- Data retention policies
CREATE TABLE public.data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    data_type TEXT NOT NULL, -- 'posts', 'analytics', 'logs', etc.
    retention_period INTERVAL NOT NULL, -- e.g., '2 years'
    auto_delete BOOLEAN DEFAULT false,
    legal_hold BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Data export logs for tracking exports
CREATE TABLE public.data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    export_type TEXT NOT NULL, -- 'full', 'posts', 'profile', etc.
    file_path TEXT,
    file_size BIGINT,
    export_format TEXT DEFAULT 'json',
    status TEXT DEFAULT 'pending',
    initiated_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Privacy settings for granular privacy control
CREATE TABLE public.privacy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'team_only')),
    show_activity_status BOOLEAN DEFAULT true,
    allow_data_processing BOOLEAN DEFAULT true,
    allow_marketing_emails BOOLEAN DEFAULT false,
    allow_analytics_tracking BOOLEAN DEFAULT true,
    data_retention_preference TEXT DEFAULT 'default' CHECK (data_retention_preference IN ('minimum', 'default', 'extended')),
    auto_delete_inactive_data BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Data anonymization log
CREATE TABLE public.data_anonymization_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    original_user_id UUID NOT NULL, -- Keep original for audit
    anonymization_method TEXT NOT NULL,
    affected_tables TEXT[] NOT NULL,
    performed_by UUID REFERENCES auth.users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.data_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_anonymization_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for data classifications
CREATE POLICY "Users can view their own data classifications"
ON public.data_classifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create data classifications"
ON public.data_classifications FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all data classifications"
ON public.data_classifications FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for privacy requests
CREATE POLICY "Users can view their own privacy requests"
ON public.privacy_requests FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create privacy requests"
ON public.privacy_requests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage privacy requests"
ON public.privacy_requests FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for user consents
CREATE POLICY "Users can manage their own consents"
ON public.user_consents FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view consents for compliance"
ON public.user_consents FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for data retention policies
CREATE POLICY "Team members can view retention policies"
ON public.data_retention_policies FOR SELECT
TO authenticated
USING (public.is_team_member(auth.uid(), team_id));

CREATE POLICY "Admins can manage retention policies"
ON public.data_retention_policies FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for data exports
CREATE POLICY "Users can view their own exports"
ON public.data_exports FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create exports"
ON public.data_exports FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all exports"
ON public.data_exports FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for privacy settings
CREATE POLICY "Users can manage their own privacy settings"
ON public.privacy_settings FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for anonymization log
CREATE POLICY "Admins can view anonymization logs"
ON public.data_anonymization_log FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert anonymization logs"
ON public.data_anonymization_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Triggers for updated_at columns
CREATE TRIGGER update_data_classifications_updated_at
    BEFORE UPDATE ON public.data_classifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_privacy_requests_updated_at
    BEFORE UPDATE ON public.privacy_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_consents_updated_at
    BEFORE UPDATE ON public.user_consents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_retention_policies_updated_at
    BEFORE UPDATE ON public.data_retention_policies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_privacy_settings_updated_at
    BEFORE UPDATE ON public.privacy_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create default privacy settings for new users
CREATE OR REPLACE FUNCTION public.create_default_privacy_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Create default privacy settings
    INSERT INTO public.privacy_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create default consents
    INSERT INTO public.user_consents (user_id, consent_type, is_given, given_at, ip_address, user_agent)
    VALUES 
        (NEW.id, 'functional', true, now(), null, null),
        (NEW.id, 'analytics', false, null, null, null),
        (NEW.id, 'marketing', false, null, null, null),
        (NEW.id, 'performance', false, null, null, null),
        (NEW.id, 'targeting', false, null, null, null)
    ON CONFLICT (user_id, consent_type) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Trigger to create default privacy settings
CREATE TRIGGER on_auth_user_created_privacy_settings
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_default_privacy_settings();

-- Function to anonymize user data
CREATE OR REPLACE FUNCTION public.anonymize_user_data(
    p_user_id UUID,
    p_method TEXT DEFAULT 'hash_replacement'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    anonymized_email TEXT;
    anonymized_id TEXT;
    affected_tables TEXT[] := '{}';
BEGIN
    -- Generate anonymized identifiers
    anonymized_email := 'anonymous_' || encode(sha256(p_user_id::text::bytea), 'hex') || '@deleted.local';
    anonymized_id := 'anon_' || encode(sha256(p_user_id::text::bytea), 'hex');
    
    -- Anonymize profiles
    UPDATE public.profiles 
    SET 
        username = anonymized_id,
        display_name = 'Anonymous User',
        bio = null,
        avatar_url = null
    WHERE user_id = p_user_id;
    affected_tables := array_append(affected_tables, 'profiles');
    
    -- Anonymize posts content (keep structure for analytics)
    UPDATE public.posts 
    SET 
        title = 'Anonymous Post',
        content = '[Content removed for privacy]'
    WHERE user_id = p_user_id;
    affected_tables := array_append(affected_tables, 'posts');
    
    -- Log the anonymization
    INSERT INTO public.data_anonymization_log (
        original_user_id, 
        anonymization_method, 
        affected_tables,
        performed_by,
        reason
    ) VALUES (
        p_user_id, 
        p_method, 
        affected_tables,
        auth.uid(),
        'User data anonymization request'
    );
    
    RETURN true;
END;
$$;

-- Indexes for performance
CREATE INDEX idx_data_classifications_user_id ON public.data_classifications(user_id);
CREATE INDEX idx_data_classifications_resource ON public.data_classifications(resource_type, resource_id);
CREATE INDEX idx_privacy_requests_user_id ON public.privacy_requests(user_id);
CREATE INDEX idx_privacy_requests_status ON public.privacy_requests(status);
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_data_exports_user_id ON public.data_exports(user_id);
CREATE INDEX idx_data_exports_status ON public.data_exports(status);
CREATE INDEX idx_privacy_settings_user_id ON public.privacy_settings(user_id);