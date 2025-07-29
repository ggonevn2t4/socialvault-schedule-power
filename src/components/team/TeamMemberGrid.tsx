import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  User, 
  MoreHorizontal, 
  Mail, 
  Edit, 
  UserMinus,
  Clock,
  Shield,
  Eye,
  Edit3,
  UserPlus
} from 'lucide-react';

interface TeamMemberGridProps {
  detailed?: boolean;
}

// Mock data for team members
const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'admin',
    email: 'sarah@company.com',
    avatar: '',
    status: 'online',
    lastActive: new Date(),
    joinedAt: new Date('2024-01-15'),
    tasksCompleted: 24,
    performance: 96
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'editor',
    email: 'michael@company.com',
    avatar: '',
    status: 'away',
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    joinedAt: new Date('2024-02-01'),
    tasksCompleted: 18,
    performance: 89
  },
  {
    id: '3',
    name: 'Emma Wilson',
    role: 'content_creator',
    email: 'emma@company.com',
    avatar: '',
    status: 'busy',
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    joinedAt: new Date('2024-02-10'),
    tasksCompleted: 31,
    performance: 94
  },
  {
    id: '4',
    name: 'James Rodriguez',
    role: 'analyst',
    email: 'james@company.com',
    avatar: '',
    status: 'offline',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    joinedAt: new Date('2024-01-20'),
    tasksCompleted: 12,
    performance: 88
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-success';
    case 'away': return 'bg-warning';
    case 'busy': return 'bg-destructive';
    case 'offline': return 'bg-muted-foreground';
    default: return 'bg-muted-foreground';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'editor': return Edit3;
    case 'content_creator': return User;
    case 'analyst': return Eye;
    default: return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-destructive/10 text-destructive';
    case 'editor': return 'bg-primary/10 text-primary';
    case 'content_creator': return 'bg-success/10 text-success';
    case 'analyst': return 'bg-warning/10 text-warning';
    default: return 'bg-muted/10 text-muted-foreground';
  }
};

export function TeamMemberGrid({ detailed = false }: TeamMemberGridProps) {
  if (detailed) {
    return (
      <Card className="card-premium">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTeamMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getRoleColor(member.role)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.role.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {member.tasksCompleted} tasks • {member.performance}% performance
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {member.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.status === 'online' ? 'Active now' : 
                         `${Math.floor((Date.now() - member.lastActive.getTime()) / (1000 * 60))}m ago`}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTeamMembers.slice(0, 6).map((member) => {
            const RoleIcon = getRoleIcon(member.role);
            
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm truncate">
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <RoleIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground capitalize">
                      {member.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Members
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}