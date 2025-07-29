import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PrivacySettings {
  id: string;
  profile_visibility: string;
  show_activity_status: boolean;
  allow_data_processing: boolean;
  allow_marketing_emails: boolean;
  allow_analytics_tracking: boolean;
  data_retention_preference: string;
  auto_delete_inactive_data: boolean;
}

export interface UserConsent {
  id: string;
  consent_type: 'marketing' | 'analytics' | 'functional' | 'performance' | 'targeting';
  is_given: boolean;
  given_at?: string;
  withdrawn_at?: string;
  consent_version: string;
}

export interface PrivacyRequest {
  id: string;
  request_type: 'export' | 'delete' | 'anonymize' | 'correction' | 'portability';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  description?: string;
  requested_data?: any;
  processing_notes?: string;
  completed_at?: string;
  created_at: string;
}

export interface DataExport {
  id: string;
  export_type: string;
  file_path?: string;
  file_size?: number;
  export_format: string;
  status: string;
  completed_at?: string;
  expires_at?: string;
  download_count: number;
  created_at: string;
}

export function usePrivacy() {
  const { user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [consents, setConsents] = useState<UserConsent[]>([]);
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([]);
  const [dataExports, setDataExports] = useState<DataExport[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch privacy settings
  const fetchPrivacySettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPrivacySettings(data);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  };

  // Update privacy settings
  const updatePrivacySettings = async (updates: Partial<PrivacySettings>) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          ...updates
        })
        .select()
        .single();

      if (error) throw error;

      setPrivacySettings(data);
      toast.success('Privacy settings updated successfully');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user consents
  const fetchConsents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('consent_type');

      if (error) throw error;
      setConsents(data || []);
    } catch (error) {
      console.error('Error fetching consents:', error);
    }
  };

  // Update consent
  const updateConsent = async (
    consentType: UserConsent['consent_type'], 
    isGiven: boolean
  ) => {
    if (!user) return;

    try {
      const updateData = {
        user_id: user.id,
        consent_type: consentType,
        is_given: isGiven,
        given_at: isGiven ? new Date().toISOString() : null,
        withdrawn_at: !isGiven ? new Date().toISOString() : null,
        ip_address: null, // Would need IP detection
        user_agent: navigator.userAgent
      };

      const { error } = await supabase
        .from('user_consents')
        .upsert(updateData);

      if (error) throw error;

      await fetchConsents();
      toast.success(`${consentType} consent ${isGiven ? 'granted' : 'withdrawn'}`);
    } catch (error) {
      console.error('Error updating consent:', error);
      toast.error('Failed to update consent');
    }
  };

  // Submit privacy request
  const submitPrivacyRequest = async (
    requestType: PrivacyRequest['request_type'],
    description?: string,
    requestedData?: any
  ) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('privacy_requests')
        .insert({
          user_id: user.id,
          request_type: requestType,
          description,
          requested_data: requestedData
        });

      if (error) throw error;

      await fetchPrivacyRequests();
      toast.success('Privacy request submitted successfully');
    } catch (error) {
      console.error('Error submitting privacy request:', error);
      toast.error('Failed to submit privacy request');
    } finally {
      setLoading(false);
    }
  };

  // Fetch privacy requests
  const fetchPrivacyRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('privacy_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrivacyRequests(data || []);
    } catch (error) {
      console.error('Error fetching privacy requests:', error);
    }
  };

  // Request data export
  const requestDataExport = async (
    exportType: string = 'full',
    format: string = 'json'
  ) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('data_exports')
        .insert({
          user_id: user.id,
          export_type: exportType,
          export_format: format,
          initiated_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

      if (error) throw error;

      await fetchDataExports();
      toast.success('Data export request submitted. You will be notified when ready.');
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast.error('Failed to request data export');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data exports
  const fetchDataExports = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('data_exports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataExports(data || []);
    } catch (error) {
      console.error('Error fetching data exports:', error);
    }
  };

  // Request account deletion
  const requestAccountDeletion = async (reason?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await submitPrivacyRequest('delete', reason, {
        full_account_deletion: true,
        delete_all_data: true
      });
      
      toast.success('Account deletion request submitted. This process may take up to 30 days.');
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast.error('Failed to submit account deletion request');
    } finally {
      setLoading(false);
    }
  };

  // Request data anonymization
  const requestDataAnonymization = async (reason?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await submitPrivacyRequest('anonymize', reason, {
        anonymize_posts: true,
        anonymize_profile: true,
        keep_analytics: false
      });
      
      toast.success('Data anonymization request submitted.');
    } catch (error) {
      console.error('Error requesting data anonymization:', error);
      toast.error('Failed to submit anonymization request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPrivacySettings();
      fetchConsents();
      fetchPrivacyRequests();
      fetchDataExports();
    }
  }, [user]);

  return {
    privacySettings,
    consents,
    privacyRequests,
    dataExports,
    loading,
    updatePrivacySettings,
    updateConsent,
    submitPrivacyRequest,
    requestDataExport,
    requestAccountDeletion,
    requestDataAnonymization,
    fetchPrivacySettings,
    fetchConsents,
    fetchPrivacyRequests,
    fetchDataExports
  };
}