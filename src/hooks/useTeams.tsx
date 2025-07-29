import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'viewer' | 'editor' | 'content_creator' | 'analyst';
  status: 'offline' | 'online' | 'away' | 'busy';
  last_active?: string;
  joined_at: string;
  profile?: {
    id: string;
    username?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTeams = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
      
      // Set first team as current if none selected
      if (data && data.length > 0 && !currentTeam) {
        setCurrentTeam(data[0]);
        localStorage.setItem('currentTeamId', data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      toast.error('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profile:profiles(id, username, display_name, avatar_url)
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      setTeamMembers((data || []) as unknown as TeamMember[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
      toast.error('Failed to load team members');
    }
  };

  const createTeam = async (teamData: CreateTeamData) => {
    if (!user) {
      toast.error('You must be logged in to create teams');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          ...teamData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTeams(prev => [data, ...prev]);
      toast.success('Team created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create team';
      setError(message);
      toast.error(message);
      return null;
    }
  };

  const updateTeam = async (teamId: string, updates: Partial<Team>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;

      setTeams(prev => prev.map(team => team.id === teamId ? data : team));
      if (currentTeam?.id === teamId) {
        setCurrentTeam(data);
      }
      toast.success('Team updated successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update team';
      setError(message);
      toast.error(message);
      return null;
    }
  };

  const switchTeam = (team: Team) => {
    setCurrentTeam(team);
    localStorage.setItem('currentTeamId', team.id);
    fetchTeamMembers(team.id);
  };

  const inviteToTeam = async (teamId: string, email: string, role: 'admin' | 'viewer' = 'viewer') => {
    try {
      // In a real app, this would send an invitation email
      // For now, we'll just show a success message
      toast.success(`Invitation sent to ${email}`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invitation';
      toast.error(message);
      return false;
    }
  };

  const removeFromTeam = async (teamId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(member => member.user_id !== userId));
      toast.success('Member removed from team');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove member';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const updateMemberRole = async (teamId: string, userId: string, role: 'admin' | 'viewer') => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .select(`
          *,
          profile:profiles(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setTeamMembers(prev => prev.map(member => 
        member.user_id === userId ? data as unknown as TeamMember : member
      ));
      toast.success('Member role updated');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update member role';
      setError(message);
      toast.error(message);
      return null;
    }
  };

  useEffect(() => {
    fetchTeams();
    
    // Load saved current team
    const savedTeamId = localStorage.getItem('currentTeamId');
    if (savedTeamId) {
      fetchTeamMembers(savedTeamId);
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

  // Set up real-time subscriptions for teams
  useEffect(() => {
    if (!user) return;

    const teamsChannel = supabase
      .channel('teams_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams'
        },
        (payload) => {
          console.log('Real-time teams update:', payload);
          fetchTeams(); // Refetch teams on any change
        }
      )
      .subscribe();

    const membersChannel = supabase
      .channel('team_members_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_members'
        },
        (payload) => {
          console.log('Real-time team members update:', payload);
          if (currentTeam) {
            fetchTeamMembers(currentTeam.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(membersChannel);
    };
  }, [user, currentTeam]);

  return {
    teams,
    currentTeam,
    teamMembers,
    isLoading,
    error,
    createTeam,
    updateTeam,
    switchTeam,
    inviteToTeam,
    removeFromTeam,
    updateMemberRole,
    refetchTeams: fetchTeams,
    refetchMembers: () => currentTeam && fetchTeamMembers(currentTeam.id),
  };
}