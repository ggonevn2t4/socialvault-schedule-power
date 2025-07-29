import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useTeams } from './useTeams';
import { useToast } from '@/hooks/use-toast';

export interface AutomationSettings {
  id: string;
  team_id: string;
  auto_post_enabled: boolean;
  posting_schedule: Record<string, any>;
  content_approval_required: boolean;
  auto_hashtag_enabled: boolean;
  auto_cross_post: boolean;
  platform_settings: Record<string, any>;
  webhook_urls: Record<string, any>;
  notification_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface AutomationSettingsInput {
  auto_post_enabled?: boolean;
  posting_schedule?: Record<string, any>;
  content_approval_required?: boolean;
  auto_hashtag_enabled?: boolean;
  auto_cross_post?: boolean;
  platform_settings?: Record<string, any>;
  webhook_urls?: Record<string, any>;
  notification_settings?: Record<string, any>;
}

export function useAutomationSettings() {
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentTeam } = useTeams();
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!currentTeam?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('team_id', currentTeam.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data as AutomationSettings);
    } catch (error) {
      console.error('Error fetching automation settings:', error);
      toast({
        title: "Error",
        description: "Failed to load automation settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSettings = async (input: AutomationSettingsInput) => {
    if (!currentTeam?.id || !user?.id) {
      throw new Error('Team or user not available');
    }

    try {
      const { data, error } = await supabase
        .from('automation_settings')
        .insert({
          ...input,
          team_id: currentTeam.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data as AutomationSettings);
      toast({
        title: "Success",
        description: "Automation settings created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating automation settings:', error);
      toast({
        title: "Error",
        description: "Failed to create automation settings",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSettings = async (updates: Partial<AutomationSettingsInput>) => {
    if (!settings?.id) {
      throw new Error('No settings to update');
    }

    try {
      const { data, error } = await supabase
        .from('automation_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data as AutomationSettings);
      toast({
        title: "Success",
        description: "Automation settings updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating automation settings:', error);
      toast({
        title: "Error",
        description: "Failed to update automation settings",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [currentTeam?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!currentTeam?.id) return;

    const channel = supabase
      .channel('automation_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'automation_settings',
          filter: `team_id=eq.${currentTeam.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setSettings(payload.new as AutomationSettings);
          } else if (payload.eventType === 'DELETE') {
            setSettings(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTeam?.id]);

  return {
    settings,
    loading,
    createSettings,
    updateSettings,
    refetch: fetchSettings,
  };
}