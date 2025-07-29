import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useTeams } from './useTeams';
import { useToast } from '@/hooks/use-toast';

export interface BrandGuidelines {
  id: string;
  team_id: string;
  brand_name: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  primary_font?: string;
  secondary_font?: string;
  logo_url?: string;
  brand_voice?: string;
  tone_of_voice: string;
  content_style: Record<string, any>;
  hashtag_sets: string[][];
  approved_phrases: string[];
  forbidden_words: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BrandGuidelinesInput {
  brand_name: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  primary_font?: string;
  secondary_font?: string;
  logo_url?: string;
  brand_voice?: string;
  tone_of_voice?: string;
  content_style?: Record<string, any>;
  hashtag_sets?: string[][];
  approved_phrases?: string[];
  forbidden_words?: string[];
}

export function useBrandGuidelines() {
  const [guidelines, setGuidelines] = useState<BrandGuidelines | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentTeam } = useTeams();
  const { toast } = useToast();

  const fetchGuidelines = async () => {
    if (!currentTeam?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('brand_guidelines')
        .select('*')
        .eq('team_id', currentTeam.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setGuidelines(data as BrandGuidelines);
    } catch (error) {
      console.error('Error fetching brand guidelines:', error);
      toast({
        title: "Error",
        description: "Failed to load brand guidelines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGuidelines = async (input: BrandGuidelinesInput) => {
    if (!currentTeam?.id || !user?.id) {
      throw new Error('Team or user not available');
    }

    try {
      const { data, error } = await supabase
        .from('brand_guidelines')
        .insert({
          ...input,
          team_id: currentTeam.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGuidelines(data as BrandGuidelines);
      toast({
        title: "Success",
        description: "Brand guidelines created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating brand guidelines:', error);
      toast({
        title: "Error", 
        description: "Failed to create brand guidelines",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateGuidelines = async (updates: Partial<BrandGuidelinesInput>) => {
    if (!guidelines?.id) {
      throw new Error('No guidelines to update');
    }

    try {
      const { data, error } = await supabase
        .from('brand_guidelines')
        .update(updates)
        .eq('id', guidelines.id)
        .select()
        .single();

      if (error) throw error;

      setGuidelines(data as BrandGuidelines);
      toast({
        title: "Success",
        description: "Brand guidelines updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating brand guidelines:', error);
      toast({
        title: "Error",
        description: "Failed to update brand guidelines",
        variant: "destructive",
      });
      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    if (!currentTeam?.id) {
      throw new Error('Team not available');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentTeam.id}-logo.${fileExt}`;
      const filePath = `brand-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchGuidelines();
  }, [currentTeam?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!currentTeam?.id) return;

    const channel = supabase
      .channel('brand_guidelines_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_guidelines',
          filter: `team_id=eq.${currentTeam.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setGuidelines(payload.new as BrandGuidelines);
          } else if (payload.eventType === 'DELETE') {
            setGuidelines(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTeam?.id]);

  return {
    guidelines,
    loading,
    createGuidelines,
    updateGuidelines,
    uploadLogo,
    refetch: fetchGuidelines,
  };
}