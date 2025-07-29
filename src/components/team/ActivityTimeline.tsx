import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  User, 
  FileText, 
  Settings, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'content_created',
    user: { name: 'Sarah Johnson', avatar: '' },
    action: 'created new post',
    target: 'Summer Campaign Hero Image',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    status: 'success'
  },
  {
    id: '2',
    type: 'approval_requested',
    user: { name: 'Michael Chen', avatar: '' },
    action: 'requested approval for',
    target: 'Product Demo Video',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    status: 'pending'
  },
  {
    id: '3',
    type: 'member_added',
    user: { name: 'Emma Wilson', avatar: '' },
    action: 'added new team member',
    target: 'James Rodriguez',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    status: 'success'
  },
  {
    id: '4',
    type: 'content_approved',
    user: { name: 'Sarah Johnson', avatar: '' },
    action: 'approved',
    target: 'Brand Guidelines Update',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    status: 'success'
  },
  {
    id: '5',
    type: 'comment_added',
    user: { name: 'James Rodriguez', avatar: '' },
    action: 'commented on',
    target: 'Marketing Campaign Draft',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    status: 'info'
  },
  {
    id: '6',
    type: 'deadline_approaching',
    user: { name: 'System', avatar: '' },
    action: 'deadline approaching for',
    target: 'Q1 Report Content',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    status: 'warning'
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'content_created': return FileText;
    case 'approval_requested': return Clock;
    case 'member_added': return User;
    case 'content_approved': return CheckCircle;
    case 'comment_added': return MessageSquare;
    case 'deadline_approaching': return AlertCircle;
    default: return Settings;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-success';
    case 'warning': return 'text-warning';
    case 'pending': return 'text-primary';
    case 'info': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
};

export function ActivityTimeline() {
  return (
    <Card className="card-premium h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.slice(0, 8).map((activity, index) => {
            const ActivityIcon = getActivityIcon(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="relative">
                  <div className={`p-2 rounded-full bg-muted ${getStatusColor(activity.status)}`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  {index < mockActivities.length - 1 && (
                    <div className="absolute top-10 left-1/2 w-0.5 h-8 bg-border transform -translate-x-1/2" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {activity.user.name !== 'System' && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {activity.user.name}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.action} <span className="font-medium">{activity.target}</span>
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}