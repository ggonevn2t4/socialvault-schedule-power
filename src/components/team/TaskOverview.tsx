import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useTasks, Task } from '@/hooks/useTasks';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TaskOverviewProps {
  teamId?: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-destructive/10 text-destructive';
    case 'medium': return 'bg-warning/10 text-warning';
    case 'low': return 'bg-muted/10 text-muted-foreground';
    default: return 'bg-muted/10 text-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-success';
    case 'in_progress': return 'text-primary';
    case 'review': return 'text-warning';
    case 'overdue': return 'text-destructive';
    case 'pending': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'in_progress': return Clock;
    case 'review': return User;
    case 'overdue': return AlertTriangle;
    default: return Clock;
  }
};

export function TaskOverview({ teamId }: TaskOverviewProps) {
  const { tasks, createTask, updateTaskProgress, isLoading } = useTasks(teamId);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    due_date: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });

  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
  const dueSoon = tasks.filter(task => {
    if (!task.due_date) return false;
    const daysUntilDue = (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilDue <= 2 && daysUntilDue > 0;
  }).length;

  const handleCreateTask = async () => {
    if (!teamId || !newTask.title.trim()) return;

    const success = await createTask({
      ...newTask,
      team_id: teamId,
      due_date: newTask.due_date || undefined,
    });

    if (success) {
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowCreateDialog(false);
    }
  };

  const handleProgressUpdate = async (taskId: string, progress: number) => {
    await updateTaskProgress(taskId, progress);
  };

  return (
    <Card className="card-premium">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Task Overview</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            {overdueTasks > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueTasks} overdue
              </Badge>
            )}
            {dueSoon > 0 && (
              <Badge variant="outline" className="text-xs text-warning">
                {dueSoon} due soon
              </Badge>
            )}
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description (optional)"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setNewTask(prev => ({ ...prev, priority: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => {
              const StatusIcon = getStatusIcon(task.status);
              const isOverdue = task.status === 'overdue';
              const daysToDue = task.due_date ? 
                Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
                null;
            
            return (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                  isOverdue ? 'border-destructive/20 bg-destructive/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`h-5 w-5 mt-0.5 ${getStatusColor(task.status)}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <Progress 
                      value={task.progress} 
                      className="h-2 cursor-pointer" 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newProgress = Math.round((clickX / rect.width) * 100);
                        handleProgressUpdate(task.id, Math.max(0, Math.min(100, newProgress)));
                      }}
                    />
                  </div>
                
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        {task.due_date ? (
                          isOverdue 
                            ? `${Math.abs(daysToDue!)} days overdue`
                            : daysToDue === 0 
                            ? 'Due today'
                            : daysToDue === 1 
                            ? 'Due tomorrow'
                            : `Due in ${daysToDue} days`
                        ) : (
                          'No due date'
                        )}
                      </span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs capitalize">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
              </div>
              );
            })}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks found. Create your first task to get started!</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}