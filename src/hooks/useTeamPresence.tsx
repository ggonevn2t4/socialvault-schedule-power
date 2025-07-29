import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TeamMember {
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
}

export interface PresenceState {
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy';
  last_activity: string;
}

export function useTeamPresence(teamId?: string) {
  const [presences, setPresences] = useState<Record<string, PresenceState>>({});
  const [onlineCount, setOnlineCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!teamId || !user) return;

    const channel = supabase.channel(`team_${teamId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track current user presence
    const trackPresence = async () => {
      const presenceState: PresenceState = {
        user_id: user.id,
        username: user.user_metadata?.username,
        display_name: user.user_metadata?.display_name,
        avatar_url: user.user_metadata?.avatar_url,
        status: 'online',
        last_activity: new Date().toISOString(),
      };

      await channel.track(presenceState);
    };

    // Listen to presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        console.log('Presence sync:', newState);
        
        const formattedPresences: Record<string, PresenceState> = {};
        Object.entries(newState).forEach(([userId, presenceArray]) => {
          if (Array.isArray(presenceArray) && presenceArray.length > 0) {
            const presence = presenceArray[0];
            if (presence && typeof presence === 'object' && 
                'user_id' in presence && 'status' in presence && 'last_activity' in presence) {
              formattedPresences[userId] = presence as unknown as PresenceState;
            }
          }
        });
        
        setPresences(formattedPresences);
        setOnlineCount(Object.keys(formattedPresences).length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await trackPresence();
        }
      });

    // Update presence every 30 seconds to keep it fresh
    const presenceInterval = setInterval(async () => {
      if (channel.state === 'joined') {
        await trackPresence();
      }
    }, 30000);

    // Handle browser visibility changes
    const handleVisibilityChange = async () => {
      if (!document.hidden && channel.state === 'joined') {
        await trackPresence();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      clearInterval(presenceInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [teamId, user]);

  const updateStatus = async (status: 'online' | 'away' | 'busy') => {
    if (!teamId || !user) return;

    const channel = supabase.channel(`team_${teamId}`);
    const presenceState: PresenceState = {
      user_id: user.id,
      username: user.user_metadata?.username,
      display_name: user.user_metadata?.display_name,
      avatar_url: user.user_metadata?.avatar_url,
      status,
      last_activity: new Date().toISOString(),
    };

    await channel.track(presenceState);
  };

  const getOnlineMembers = (): PresenceState[] => {
    return Object.values(presences).filter(p => p.status === 'online');
  };

  const getMemberStatus = (userId: string): 'online' | 'away' | 'busy' | 'offline' => {
    const presence = presences[userId];
    if (!presence) return 'offline';
    
    // Check if last activity was more than 5 minutes ago
    const lastActivity = new Date(presence.last_activity);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    if (lastActivity < fiveMinutesAgo) {
      return 'away';
    }
    
    return presence.status;
  };

  return {
    presences,
    onlineCount,
    getOnlineMembers,
    getMemberStatus,
    updateStatus,
  };
}
