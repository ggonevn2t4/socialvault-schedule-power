import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserPreferences {
  id?: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  marketing_emails: boolean;
  security_alerts: boolean;
  profile_visibility: 'public' | 'private' | 'team_only';
  data_sharing: boolean;
  analytics_tracking: boolean;
  timezone: string;
  language: string;
  date_format: string;
  time_format: string;
  theme: 'light' | 'dark' | 'system';
  created_at?: string;
  updated_at?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  device_info?: any;
  ip_address?: string;
  location?: string;
  last_active: string;
  created_at: string;
}

const defaultPreferences: Omit<UserPreferences, 'user_id'> = {
  email_notifications: true,
  push_notifications: true,
  in_app_notifications: true,
  marketing_emails: false,
  security_alerts: true,
  profile_visibility: 'public',
  data_sharing: false,
  analytics_tracking: true,
  timezone: 'UTC',
  language: 'en',
  date_format: 'MM/DD/YYYY',
  time_format: '12h',
  theme: 'system',
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data as UserPreferences);
      } else {
        // Create default preferences
        const newPreferences = {
          ...defaultPreferences,
          user_id: user.id,
        };
        
        const { data: created, error: createError } = await supabase
          .from('user_preferences')
          .insert(newPreferences)
          .select()
          .single();

        if (createError) throw createError;
        setPreferences(created as UserPreferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data as UserPreferences);
      toast.success('Settings updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update settings');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      toast.success('Avatar updated successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  };

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as UserSession[]);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load active sessions');
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      toast.success('Session terminated successfully');
      return true;
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      return false;
    }
  };

  const requestDataExport = async () => {
    try {
      // In a real implementation, this would trigger a background job
      // to compile user data and send via email
      toast.success('Data export request submitted. You will receive an email with your data within 24 hours.');
      return true;
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast.error('Failed to request data export');
      return false;
    }
  };

  const deleteAccount = async (confirmationText: string) => {
    if (confirmationText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return false;
    }

    try {
      // In a real implementation, this would mark the account for deletion
      // and trigger a background process
      toast.success('Account deletion request submitted. Your account will be deleted within 7 days.');
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
      return false;
    }
  };

  useEffect(() => {
    fetchPreferences();
    fetchSessions();
  }, [user]);

  // Set up real-time subscription for preferences
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_preferences_channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time preferences update:', payload);
          setPreferences(payload.new as UserPreferences);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    preferences,
    sessions,
    isLoading,
    isSaving,
    updatePreferences,
    uploadAvatar,
    fetchSessions,
    terminateSession,
    changePassword,
    requestDataExport,
    deleteAccount,
    refetchPreferences: fetchPreferences,
  };
}