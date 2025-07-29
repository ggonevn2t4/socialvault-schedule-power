import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, Heart, Calendar, Clock } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

interface AnalyticsOverviewProps {
  dateRange: DateRange | undefined;
}

const mockMetrics = [
  {
    title: 'Total Reach',
    value: '124.5K',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Eye,
    trend: 'up' as const,
  },
  {
    title: 'Engagement Rate',
    value: '4.8%',
    change: '+0.3%',
    changeType: 'positive' as const,
    icon: Heart,
    trend: 'up' as const,
  },
  {
    title: 'Click-through Rate',
    value: '2.1%',
    change: '-0.2%',
    changeType: 'negative' as const,
    icon: MousePointer,
    trend: 'down' as const,
  },
  {
    title: 'Follower Growth',
    value: '+2.3K',
    change: '+8.7%',
    changeType: 'positive' as const,
    icon: Users,
    trend: 'up' as const,
  },
];

const bestPerformingPost = {
  title: 'Summer Campaign Launch',
  thumbnail: '/placeholder.svg',
  likes: 1247,
  comments: 89,
  shares: 156,
  reach: '45.2K',
};

const topEngagementTime = {
  day: 'Tuesday',
  time: '2:00 PM',
  engagementRate: '6.2%',
};

export function AnalyticsOverview({ dateRange }: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockMetrics.map((metric) => {
          const Icon = metric.icon;
          const changeColor = {
            positive: "text-success",
            negative: "text-destructive",
            neutral: "text-muted-foreground"
          }[metric.changeType];

          return (
            <Card key={metric.title} className="card-premium hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {metric.value}
                    </div>
                    <p className={`text-xs font-medium ${changeColor} flex items-center`}>
                      {metric.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {metric.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                      <span>{metric.change}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performing Post */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Best Performing Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gradient-subtle rounded-lg flex items-center justify-center">
                <img 
                  src={bestPerformingPost.thumbnail} 
                  alt={bestPerformingPost.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">
                  {bestPerformingPost.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{bestPerformingPost.likes} likes</Badge>
                  <Badge variant="secondary">{bestPerformingPost.comments} comments</Badge>
                  <Badge variant="secondary">{bestPerformingPost.shares} shares</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Reached {bestPerformingPost.reach} people
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Engagement Time */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Peak Engagement Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {topEngagementTime.day}s at {topEngagementTime.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Average engagement rate: {topEngagementTime.engagementRate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}