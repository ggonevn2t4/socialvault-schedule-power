import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface LoginAttempt {
  id: string;
  email: string;
  status: 'success' | 'failed' | 'blocked' | 'suspicious';
  ip_address?: unknown;
  user_agent?: string;
  failure_reason?: string;
  location_country?: string;
  location_city?: string;
  is_suspicious: boolean;
  attempted_at: string;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  risk_level: string;
  created_at: string;
}

export interface UserSession {
  id: string;
  session_token: string;
  ip_address?: unknown;
  user_agent?: string;
  location_country?: string;
  location_city?: string;
  status: 'active' | 'expired' | 'terminated' | 'suspicious';
  is_current: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

export interface MFASettings {
  id: string;
  is_enabled: boolean;
  backup_codes?: string[];
  recovery_codes_used: number;
  last_used_at?: string;
}

export function useSecurity() {
  const { user } = useAuth();
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [mfaSettings, setMfaSettings] = useState<MFASettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Log login attempt
  const logLoginAttempt = async (
    email: string,
    status: 'success' | 'failed' | 'blocked' | 'suspicious',
    failureReason?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('log_login_attempt', {
        p_email: email,
        p_user_id: user?.id || null,
        p_status: status,
        p_ip_address: null, // Would need IP detection service
        p_user_agent: navigator.userAgent,
        p_failure_reason: failureReason
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  };

  // Log security event
  const logSecurityEvent = async (
    action: string,
    details?: any,
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low',
    resourceType?: string,
    resourceId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: user?.id || null,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          risk_level: riskLevel,
          ip_address: null, // Would need IP detection service
          user_agent: navigator.userAgent
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  // Fetch login attempts for current user
  const fetchLoginAttempts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('attempted_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLoginAttempts(data || []);
    } catch (error) {
      console.error('Error fetching login attempts:', error);
      toast.error('Failed to load login history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch audit logs for current user
  const fetchAuditLogs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_sessions_enhanced')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setActiveSessions(data || []);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      toast.error('Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  // Terminate session
  const terminateSession = async (sessionId: string, reason: string = 'user_requested') => {
    try {
      const { error } = await supabase
        .from('user_sessions_enhanced')
        .update({
          status: 'terminated',
          terminated_at: new Date().toISOString(),
          terminated_reason: reason
        })
        .eq('id', sessionId);

      if (error) throw error;

      await logSecurityEvent('session_terminated', {
        session_id: sessionId,
        reason
      }, 'medium');

      toast.success('Session terminated successfully');
      await fetchActiveSessions();
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  // Fetch MFA settings
  const fetchMfaSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setMfaSettings(data);
    } catch (error) {
      console.error('Error fetching MFA settings:', error);
    }
  };

  // Enable MFA
  const enableMfa = async () => {
    if (!user) return;

    try {
      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 15)
      );

      const { data, error } = await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: user.id,
          is_enabled: true,
          backup_codes: backupCodes,
          recovery_codes_used: 0
        })
        .select()
        .single();

      if (error) throw error;

      await logSecurityEvent('mfa_enabled', {
        backup_codes_generated: backupCodes.length
      }, 'medium');

      setMfaSettings(data);
      toast.success('Multi-factor authentication enabled successfully');
      return backupCodes;
    } catch (error) {
      console.error('Error enabling MFA:', error);
      toast.error('Failed to enable MFA');
      return null;
    }
  };

  // Disable MFA
  const disableMfa = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_mfa_settings')
        .update({
          is_enabled: false,
          backup_codes: null,
          recovery_codes_used: 0
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await logSecurityEvent('mfa_disabled', {}, 'medium');

      setMfaSettings(prev => prev ? { ...prev, is_enabled: false, backup_codes: undefined } : null);
      toast.success('Multi-factor authentication disabled');
    } catch (error) {
      console.error('Error disabling MFA:', error);
      toast.error('Failed to disable MFA');
    }
  };

  // Check password strength
  const checkPasswordStrength = async (password: string) => {
    try {
      const { data, error } = await supabase.rpc('check_password_strength', {
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking password strength:', error);
      return {
        score: 0,
        max_score: 5,
        is_strong: false,
        feedback: ['Error checking password strength']
      };
    }
  };

  useEffect(() => {
    if (user) {
      fetchLoginAttempts();
      fetchAuditLogs();
      fetchActiveSessions();
      fetchMfaSettings();
    }
  }, [user]);

  return {
    loginAttempts,
    auditLogs,
    activeSessions,
    mfaSettings,
    loading,
    logLoginAttempt,
    logSecurityEvent,
    fetchLoginAttempts,
    fetchAuditLogs,
    fetchActiveSessions,
    terminateSession,
    enableMfa,
    disableMfa,
    checkPasswordStrength
  };
}