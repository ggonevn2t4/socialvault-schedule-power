import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useTeams } from './useTeams';
import { useToast } from '@/hooks/use-toast';

export interface ContentTemplate {
  id: string;
  team_id: string;
  name: string;
  template_type: string;
  content_template: string;
  platforms: string[];
  hashtags: string[];
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ContentTemplateInput {
  name: string;
  template_type: string;
  content_template: string;
  platforms?: string[];
  hashtags?: string[];
  is_public?: boolean;
}

export function useContentTemplates() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentTeam } = useTeams();
  const { toast } = useToast();

  const fetchTemplates = async () => {
    if (!currentTeam?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data as ContentTemplate[]);
    } catch (error) {
      console.error('Error fetching content templates:', error);
      toast({
        title: "Error",
        description: "Failed to load content templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (input: ContentTemplateInput) => {
    if (!currentTeam?.id || !user?.id) {
      throw new Error('Team or user not available');
    }

    try {
      const { data, error } = await supabase
        .from('content_templates')
        .insert({
          ...input,
          team_id: currentTeam.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [data as ContentTemplate, ...prev]);
      toast({
        title: "Success",
        description: "Content template created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating content template:', error);
      toast({
        title: "Error",
        description: "Failed to create content template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ContentTemplateInput>) => {
    try {
      const { data, error } = await supabase
        .from('content_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => 
        prev.map(template => 
          template.id === id ? data as ContentTemplate : template
        )
      );

      toast({
        title: "Success",
        description: "Content template updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating content template:', error);
      toast({
        title: "Error",
        description: "Failed to update content template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== id));
      toast({
        title: "Success",
        description: "Content template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting content template:', error);
      toast({
        title: "Error",
        description: "Failed to delete content template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const incrementUsage = async (id: string) => {
    try {
      const template = templates.find(t => t.id === id);
      if (!template) return;

      const { error } = await supabase
        .from('content_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev =>
        prev.map(template =>
          template.id === id
            ? { ...template, usage_count: template.usage_count + 1 }
            : template
        )
      );
    } catch (error) {
      console.error('Error incrementing template usage:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentTeam?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!currentTeam?.id) return;

    const channel = supabase
      .channel('content_templates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_templates',
          filter: `team_id=eq.${currentTeam.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTemplates(prev => [payload.new as ContentTemplate, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTemplates(prev =>
              prev.map(template =>
                template.id === payload.new.id ? payload.new as ContentTemplate : template
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setTemplates(prev => prev.filter(template => template.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTeam?.id]);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
    refetch: fetchTemplates,
  };
}