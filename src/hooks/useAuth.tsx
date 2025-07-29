import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { username?: string; display_name?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { username?: string; display_name?: string; bio?: string; avatar_url?: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: { username?: string; display_name?: string }) => {
    try {
      // Check password strength before signup
      const { data: passwordCheck } = await supabase.rpc('check_password_strength', { password });
      
      if (passwordCheck && typeof passwordCheck === 'object' && 'is_strong' in passwordCheck && !passwordCheck.is_strong) {
        toast.error('Password does not meet security requirements');
        return { error: new Error('Weak password'), passwordFeedback: passwordCheck.feedback };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData || {}
        }
      });

      if (error) {
        // Log failed signup attempt
        await supabase.rpc('log_login_attempt', {
          p_email: email,
          p_user_id: null,
          p_status: 'failed',
          p_user_agent: navigator.userAgent,
          p_failure_reason: error.message
        });
        
        toast.error(error.message);
        return { error };
      }

      // Log successful signup
      if (data.user) {
        await supabase.rpc('log_login_attempt', {
          p_email: email,
          p_user_id: data.user.id,
          p_status: 'success',
          p_user_agent: navigator.userAgent
        });
      }

      toast.success('Check your email for confirmation link!');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign up';
      toast.error(message);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log failed login attempt
        await supabase.rpc('log_login_attempt', {
          p_email: email,
          p_user_id: null,
          p_status: 'failed',
          p_user_agent: navigator.userAgent,
          p_failure_reason: error.message
        });
        
        toast.error(error.message);
        return { error };
      }

      // Log successful login
      if (data.user) {
        await supabase.rpc('log_login_attempt', {
          p_email: email,
          p_user_id: data.user.id,
          p_status: 'success',
          p_user_agent: navigator.userAgent
        });

        // Create session record
        const sessionToken = data.session?.access_token || '';
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        await supabase.from('user_sessions_enhanced').insert({
          user_id: data.user.id,
          session_token: sessionToken,
          user_agent: navigator.userAgent,
          status: 'active',
          is_current: true,
          expires_at: expiresAt.toISOString()
        });

        // Log security event
        await supabase.from('security_audit_log').insert({
          user_id: data.user.id,
          action: 'user_signin',
          details: { email: data.user.email },
          risk_level: 'low',
          user_agent: navigator.userAgent
        });
      }

      toast.success('Welcome back!');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign in';
      toast.error(message);
      return { error };
    }
  };

  const updateProfile = async (updates: { username?: string; display_name?: string; bio?: string; avatar_url?: string }) => {
    try {
      if (!user) {
        return { error: new Error('No user found') };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred updating profile';
      toast.error(message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Log security event before signout
      if (user) {
        await supabase.from('security_audit_log').insert({
          user_id: user.id,
          action: 'user_signout',
          details: { email: user.email },
          risk_level: 'low',
          user_agent: navigator.userAgent
        });

        // Terminate active sessions
        await supabase
          .from('user_sessions_enhanced')
          .update({
            status: 'terminated',
            terminated_at: new Date().toISOString(),
            terminated_reason: 'user_logout'
          })
          .eq('user_id', user.id)
          .eq('status', 'active');
      }

      // Clean up auth state
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}