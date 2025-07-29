-- Create brand_guidelines table for team brand management
CREATE TABLE public.brand_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  brand_name TEXT NOT NULL,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  primary_font TEXT,
  secondary_font TEXT,
  logo_url TEXT,
  brand_voice TEXT,
  tone_of_voice TEXT DEFAULT 'professional',
  content_style JSONB DEFAULT '{}',
  hashtag_sets JSONB DEFAULT '[]',
  approved_phrases JSONB DEFAULT '[]',
  forbidden_words JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create automation_settings table for scheduling and workflow automation
CREATE TABLE public.automation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  auto_post_enabled BOOLEAN DEFAULT false,
  posting_schedule JSONB DEFAULT '{}',
  content_approval_required BOOLEAN DEFAULT true,
  auto_hashtag_enabled BOOLEAN DEFAULT false,
  auto_cross_post BOOLEAN DEFAULT false,
  platform_settings JSONB DEFAULT '{}',
  webhook_urls JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create content_templates table for reusable content templates
CREATE TABLE public.content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'post', 'story', 'reel', 'carousel'
  content_template TEXT NOT NULL,
  platforms JSONB DEFAULT '[]',
  hashtags JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.brand_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brand_guidelines
CREATE POLICY "Team members can view brand guidelines" ON public.brand_guidelines
FOR SELECT
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can manage brand guidelines" ON public.brand_guidelines
FOR ALL
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

-- Create RLS policies for automation_settings
CREATE POLICY "Team members can view automation settings" ON public.automation_settings
FOR SELECT
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can manage automation settings" ON public.automation_settings
FOR ALL
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

-- Create RLS policies for content_templates
CREATE POLICY "Team members can view content templates" ON public.content_templates
FOR SELECT
USING (is_team_member(auth.uid(), team_id) OR is_public = true);

CREATE POLICY "Team members can create content templates" ON public.content_templates
FOR INSERT
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Template creators and admins can update templates" ON public.content_templates
FOR UPDATE
USING (is_team_member(auth.uid(), team_id) AND (created_by = auth.uid() OR get_user_role(auth.uid(), team_id) = 'admin'::app_role));

CREATE POLICY "Template creators and admins can delete templates" ON public.content_templates
FOR DELETE
USING (is_team_member(auth.uid(), team_id) AND (created_by = auth.uid() OR get_user_role(auth.uid(), team_id) = 'admin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_brand_guidelines_updated_at
BEFORE UPDATE ON public.brand_guidelines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_settings_updated_at
BEFORE UPDATE ON public.automation_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at
BEFORE UPDATE ON public.content_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();