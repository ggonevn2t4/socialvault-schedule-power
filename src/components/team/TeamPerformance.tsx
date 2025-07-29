import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target,
  Users,
  Clock,
  CheckCircle,
  BarChart3
} from 'lucide-react';

// Mock performance data
const teamMetrics = {
  overall: {
    score: 94,
    change: 5,
    trend: 'up'
  },
  productivity: {
    score: 87,
    change: -2,
    trend: 'down'
  },
  quality: {
    score: 96,
    change: 8,
    trend: 'up'
  },
  collaboration: {
    score: 92,
    change: 3,
    trend: 'up'
  }
};

const memberPerformance = [
  { name: 'Sarah Johnson', score: 96, tasksCompleted: 24, efficiency: 98 },
  { name: 'Emma Wilson', score: 94, tasksCompleted: 31, efficiency: 91 },
  { name: 'Michael Chen', score: 89, tasksCompleted: 18, efficiency: 94 },
  { name: 'James Rodriguez', score: 88, tasksCompleted: 12, efficiency: 87 }
];

const projectStats = [
  { name: 'On Time Delivery', value: 89, target: 95, color: 'bg-success' },
  { name: 'Quality Score', value: 96, target: 90, color: 'bg-primary' },
  { name: 'Client Satisfaction', value: 92, target: 85, color: 'bg-warning' },
  { name: 'Team Utilization', value: 84, target: 80, color: 'bg-purple-500' }
];

export function TeamPerformance() {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(teamMetrics).map(([key, metric]) => (
          <Card key={key} className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {key === 'overall' ? 'Overall Score' : key}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{metric.score}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  key === 'overall' ? 'bg-primary/10' :
                  key === 'productivity' ? 'bg-warning/10' :
                  key === 'quality' ? 'bg-success/10' :
                  'bg-purple-500/10'
                }`}>
                  {key === 'overall' && <Award className="h-6 w-6 text-primary" />}
                  {key === 'productivity' && <Target className="h-6 w-6 text-warning" />}
                  {key === 'quality' && <CheckCircle className="h-6 w-6 text-success" />}
                  {key === 'collaboration' && <Users className="h-6 w-6 text-purple-500" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Individual Performance */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Individual Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberPerformance.map((member, index) => (
                <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.tasksCompleted} tasks • {member.efficiency}% efficiency
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={member.score >= 95 ? 'default' : member.score >= 90 ? 'secondary' : 'outline'}>
                      {member.score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Statistics */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projectStats.map((stat) => (
                <div key={stat.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{stat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Target: {stat.target}%
                      </span>
                      <Badge variant={stat.value >= stat.target ? 'default' : 'secondary'}>
                        {stat.value}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={stat.value} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>Target: {stat.target}%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 text-warning mx-auto mb-2" />
              <h3 className="font-medium text-foreground">Top Performer</h3>
              <p className="text-lg font-bold text-primary">Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">96% performance score</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-medium text-foreground">Fastest Delivery</h3>
              <p className="text-lg font-bold text-primary">2.3 days</p>
              <p className="text-sm text-muted-foreground">Average task completion</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-foreground">Improvement</h3>
              <p className="text-lg font-bold text-primary">+12%</p>
              <p className="text-sm text-muted-foreground">Team growth this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}