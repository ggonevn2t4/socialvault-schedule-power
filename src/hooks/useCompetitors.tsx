import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Competitor {
  id: string;
  team_id: string;
  name: string;
  website_url?: string;
  description?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  logo_url?: string;
  social_handles: Record<string, string>;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export function useCompetitors(teamId?: string) {
  return useQuery({
    queryKey: ['competitors', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Competitor[];
    },
    enabled: !!teamId,
  });
}

export function useCreateCompetitor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('competitors')
        .insert(competitor)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      toast({
        title: "Success!",
        description: "Competitor added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add competitor.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCompetitor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Competitor> }) => {
      const { data, error } = await supabase
        .from('competitors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      toast({
        title: "Success!",
        description: "Competitor updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update competitor.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCompetitor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('competitors')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      toast({
        title: "Success!",
        description: "Competitor removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove competitor.",
        variant: "destructive",
      });
    },
  });
}