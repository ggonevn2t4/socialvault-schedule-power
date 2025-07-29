-- Create competitive intelligence tables

-- Competitors table
CREATE TABLE public.competitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  name TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  logo_url TEXT,
  social_handles JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Competitor monitoring table
CREATE TABLE public.competitor_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  team_id UUID NOT NULL,
  platform TEXT NOT NULL,
  account_handle TEXT NOT NULL,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  monitoring_frequency TEXT DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Competitor content table
CREATE TABLE public.competitor_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monitoring_id UUID NOT NULL REFERENCES public.competitor_monitoring(id) ON DELETE CASCADE,
  team_id UUID NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_text TEXT,
  media_urls TEXT[] DEFAULT '{}',
  engagement_metrics JSONB DEFAULT '{}'::jsonb,
  post_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sentiment_score DECIMAL(3,2),
  hashtags TEXT[] DEFAULT '{}',
  mentions TEXT[] DEFAULT '{}'
);

-- Market insights table
CREATE TABLE public.market_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  data_points JSONB DEFAULT '{}'::jsonb,
  sources TEXT[] DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  impact_level TEXT DEFAULT 'medium',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_archived BOOLEAN DEFAULT false
);

-- Competitive analysis reports table
CREATE TABLE public.competitive_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  competitors UUID[] DEFAULT '{}',
  time_period JSONB NOT NULL,
  metrics JSONB DEFAULT '{}'::jsonb,
  insights JSONB DEFAULT '{}'::jsonb,
  charts_data JSONB DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_shared BOOLEAN DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for competitors table
CREATE POLICY "Team members can view competitors" 
ON public.competitors 
FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create competitors" 
ON public.competitors 
FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can update competitors" 
ON public.competitors 
FOR UPDATE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

CREATE POLICY "Team admins can delete competitors" 
ON public.competitors 
FOR DELETE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

-- RLS Policies for competitor_monitoring table
CREATE POLICY "Team members can view monitoring" 
ON public.competitor_monitoring 
FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create monitoring" 
ON public.competitor_monitoring 
FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can update monitoring" 
ON public.competitor_monitoring 
FOR UPDATE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

CREATE POLICY "Team admins can delete monitoring" 
ON public.competitor_monitoring 
FOR DELETE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

-- RLS Policies for competitor_content table
CREATE POLICY "Team members can view competitor content" 
ON public.competitor_content 
FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create competitor content" 
ON public.competitor_content 
FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

-- RLS Policies for market_insights table
CREATE POLICY "Team members can view market insights" 
ON public.market_insights 
FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create market insights" 
ON public.market_insights 
FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can update market insights" 
ON public.market_insights 
FOR UPDATE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

CREATE POLICY "Team admins can delete market insights" 
ON public.market_insights 
FOR DELETE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

-- RLS Policies for competitive_reports table
CREATE POLICY "Team members can view competitive reports" 
ON public.competitive_reports 
FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create competitive reports" 
ON public.competitive_reports 
FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can update competitive reports" 
ON public.competitive_reports 
FOR UPDATE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

CREATE POLICY "Team admins can delete competitive reports" 
ON public.competitive_reports 
FOR DELETE 
USING (get_user_role(auth.uid(), team_id) = 'admin'::app_role);

-- Create indexes for better performance
CREATE INDEX idx_competitors_team_id ON public.competitors(team_id);
CREATE INDEX idx_competitor_monitoring_competitor_id ON public.competitor_monitoring(competitor_id);
CREATE INDEX idx_competitor_monitoring_team_id ON public.competitor_monitoring(team_id);
CREATE INDEX idx_competitor_content_monitoring_id ON public.competitor_content(monitoring_id);
CREATE INDEX idx_competitor_content_team_id ON public.competitor_content(team_id);
CREATE INDEX idx_competitor_content_published_at ON public.competitor_content(published_at);
CREATE INDEX idx_market_insights_team_id ON public.market_insights(team_id);
CREATE INDEX idx_market_insights_category ON public.market_insights(category);
CREATE INDEX idx_competitive_reports_team_id ON public.competitive_reports(team_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_competitors_updated_at
BEFORE UPDATE ON public.competitors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitor_monitoring_updated_at
BEFORE UPDATE ON public.competitor_monitoring
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_insights_updated_at
BEFORE UPDATE ON public.market_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitive_reports_updated_at
BEFORE UPDATE ON public.competitive_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();