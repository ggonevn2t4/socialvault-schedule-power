import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Task {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  created_by: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignee_id?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  team_id: string;
}

export function useTasks(teamId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!teamId || !user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data || []) as Task[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    if (!user) {
      toast.error('You must be logged in to create tasks');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_by: user.id,
        })
        .select('*')
        .single();

      if (error) throw error;

      setTasks(prev => [data as Task, ...prev]);
      toast.success('Task created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      toast.error(message);
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select('*')
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => task.id === taskId ? data as Task : task));
      toast.success('Task updated successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      toast.error(message);
      return null;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const updateTaskProgress = async (taskId: string, progress: number) => {
    const status = progress === 100 ? 'completed' : 
                  progress > 0 ? 'in_progress' : 'pending';
    
    return updateTask(taskId, { 
      progress,
      status,
      ...(progress === 100 && { completed_at: new Date().toISOString() })
    });
  };

  useEffect(() => {
    fetchTasks();
  }, [teamId, user]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskProgress,
    refetchTasks: fetchTasks,
  };
}