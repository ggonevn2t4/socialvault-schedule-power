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
import { format, formatDistanceToNow } from 'date-fns';

// Mock task data
const mockTasks = [
  {
    id: '1',
    title: 'Summer Campaign Content Review',
    assignee: 'Sarah Johnson',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    priority: 'high',
    status: 'in_progress',
    progress: 75,
    type: 'review'
  },
  {
    id: '2',
    title: 'Q1 Analytics Report',
    assignee: 'James Rodriguez',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: 'medium',
    status: 'pending',
    progress: 30,
    type: 'analysis'
  },
  {
    id: '3',
    title: 'Product Demo Video Edit',
    assignee: 'Michael Chen',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    priority: 'high',
    status: 'review',
    progress: 90,
    type: 'content'
  },
  {
    id: '4',
    title: 'Brand Guidelines Update',
    assignee: 'Emma Wilson',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
    priority: 'medium',
    status: 'overdue',
    progress: 100,
    type: 'documentation'
  },
  {
    id: '5',
    title: 'Social Media Calendar',
    assignee: 'Sarah Johnson',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: 'low',
    status: 'pending',
    progress: 10,
    type: 'planning'
  }
];

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

export function TaskOverview() {
  const overdueTasks = mockTasks.filter(task => task.status === 'overdue').length;
  const dueSoon = mockTasks.filter(task => {
    const daysUntilDue = (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilDue <= 2 && daysUntilDue > 0;
  }).length;

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
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTasks.slice(0, 5).map((task) => {
            const StatusIcon = getStatusIcon(task.status);
            const isOverdue = task.status === 'overdue';
            const daysToDue = Math.ceil((task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
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
                    <div>
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
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
                  <Progress value={task.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                      {isOverdue 
                        ? `${Math.abs(daysToDue)} days overdue`
                        : daysToDue === 0 
                        ? 'Due today'
                        : daysToDue === 1 
                        ? 'Due tomorrow'
                        : `Due in ${daysToDue} days`
                      }
                    </span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs capitalize">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}