import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface MarketInsight {
  id: string;
  team_id: string;
  insight_type: string;
  title: string;
  description?: string;
  category: string;
  data_points: Record<string, any>;
  sources: string[];
  confidence_score?: number;
  impact_level: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface CompetitiveReport {
  id: string;
  team_id: string;
  report_name: string;
  report_type: string;
  competitors: string[];
  time_period: Record<string, any>;
  metrics: Record<string, any>;
  insights: Record<string, any>;
  charts_data: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_shared: boolean;
}

export interface CompetitorContent {
  id: string;
  monitoring_id: string;
  team_id: string;
  platform: string;
  content_type: string;
  content_text?: string;
  media_urls: string[];
  engagement_metrics: Record<string, any>;
  post_url?: string;
  published_at?: string;
  collected_at: string;
  sentiment_score?: number;
  hashtags: string[];
  mentions: string[];
}

export function useMarketInsights(teamId?: string) {
  return useQuery({
    queryKey: ['market-insights', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      
      const { data, error } = await supabase
        .from('market_insights')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MarketInsight[];
    },
    enabled: !!teamId,
  });
}

export function useCompetitiveReports(teamId?: string) {
  return useQuery({
    queryKey: ['competitive-reports', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      
      const { data, error } = await supabase
        .from('competitive_reports')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CompetitiveReport[];
    },
    enabled: !!teamId,
  });
}

export function useCompetitorContent(teamId?: string, limit: number = 50) {
  return useQuery({
    queryKey: ['competitor-content', teamId, limit],
    queryFn: async () => {
      if (!teamId) return [];
      
      const { data, error } = await supabase
        .from('competitor_content')
        .select(`
          *,
          competitor_monitoring!inner(
            competitor_id,
            platform,
            account_handle,
            competitors!inner(name, logo_url)
          )
        `)
        .eq('team_id', teamId)
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as (CompetitorContent & {
        competitor_monitoring: {
          competitor_id: string;
          platform: string;
          account_handle: string;
          competitors: {
            name: string;
            logo_url?: string;
          };
        };
      })[];
    },
    enabled: !!teamId,
  });
}

export function useCreateMarketInsight() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (insight: Omit<MarketInsight, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('market_insights')
        .insert(insight)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-insights'] });
      toast({
        title: "Success!",
        description: "Market insight created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create market insight.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateCompetitiveReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (report: Omit<CompetitiveReport, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('competitive_reports')
        .insert(report)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitive-reports'] });
      toast({
        title: "Success!",
        description: "Competitive report generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate report.",
        variant: "destructive",
      });
    },
  });
}