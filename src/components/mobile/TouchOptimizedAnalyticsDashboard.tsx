import { useState } from 'react';
import { ArrowLeft, ArrowRight, Filter, Download, Share2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useSwipeGesture, useHapticFeedback } from '@/hooks/use-mobile';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' },
];

const platforms = [
  { id: 'all', name: 'All Platforms', color: '#8b5cf6' },
  { id: 'twitter', name: 'Twitter', color: '#1da1f2' },
  { id: 'instagram', name: 'Instagram', color: '#e4405f' },
  { id: 'facebook', name: 'Facebook', color: '#1877f2' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5' },
];

const engagementData = [
  { date: 'Mon', likes: 245, shares: 45, comments: 32 },
  { date: 'Tue', likes: 312, shares: 67, comments: 48 },
  { date: 'Wed', likes: 198, shares: 34, comments: 25 },
  { date: 'Thu', likes: 445, shares: 89, comments: 72 },
  { date: 'Fri', likes: 367, shares: 78, comments: 55 },
  { date: 'Sat', likes: 523, shares: 112, comments: 89 },
  { date: 'Sun', likes: 456, shares: 95, comments: 67 },
];

const audienceData = [
  { name: '18-24', value: 30, color: '#8b5cf6' },
  { name: '25-34', value: 35, color: '#06b6d4' },
  { name: '35-44', value: 25, color: '#10b981' },
  { name: '45+', value: 10, color: '#f59e0b' },
];

const performanceCards = [
  {
    id: 'reach',
    title: 'Total Reach',
    value: '45.2K',
    change: '+12.5%',
    trend: 'up',
    data: engagementData.map(d => ({ date: d.date, value: d.likes + d.shares + d.comments }))
  },
  {
    id: 'engagement',
    title: 'Engagement Rate',
    value: '4.8%',
    change: '+0.8%',
    trend: 'up',
    data: engagementData.map(d => ({ date: d.date, value: (d.likes + d.shares + d.comments) / 100 }))
  },
  {
    id: 'followers',
    title: 'New Followers',
    value: '1,234',
    change: '+23.1%',
    trend: 'up',
    data: [
      { date: 'Mon', value: 156 },
      { date: 'Tue', value: 189 },
      { date: 'Wed', value: 167 },
      { date: 'Thu', value: 234 },
      { date: 'Fri', value: 201 },
      { date: 'Sat', value: 287 },
      { date: 'Sun', value: 245 },
    ]
  },
  {
    id: 'clicks',
    title: 'Link Clicks',
    value: '892',
    change: '+15.2%',
    trend: 'up',
    data: [
      { date: 'Mon', value: 89 },
      { date: 'Tue', value: 124 },
      { date: 'Wed', value: 98 },
      { date: 'Thu', value: 156 },
      { date: 'Fri', value: 134 },
      { date: 'Sat', value: 178 },
      { date: 'Sun', value: 145 },
    ]
  }
];

export function TouchOptimizedAnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [currentCard, setCurrentCard] = useState(0);
  
  const haptic = useHapticFeedback();

  const swipeGesture = useSwipeGesture(
    () => {
      // Swipe left - next card
      if (currentCard < performanceCards.length - 1) {
        setCurrentCard(currentCard + 1);
        haptic.light();
      }
    },
    () => {
      // Swipe right - previous card
      if (currentCard > 0) {
        setCurrentCard(currentCard - 1);
        haptic.light();
      }
    }
  );

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    haptic.medium();
  };

  const renderChart = (data: any[], type: 'line' | 'area' | 'bar' = 'line', color = '#8b5cf6') => {
    const chartProps = {
      data,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart {...chartProps}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fill={color} 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <BarChart {...chartProps}>
              <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={60}>
            <LineChart {...chartProps}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <div className="flex space-x-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swipeable Performance Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Performance Overview</h2>
            <Badge variant="outline">{currentCard + 1} of {performanceCards.length}</Badge>
          </div>

          <div className="relative" {...swipeGesture}>
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentCard * 100}%)` }}
            >
              {performanceCards.map((card, index) => (
                <div key={card.id} className="w-full flex-shrink-0 px-1">
                  <Card className="touch-manipulation">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{card.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-2xl font-bold">{card.value}</span>
                            <Badge 
                              variant={card.trend === 'up' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {card.change}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderChart(card.data, index % 2 === 0 ? 'area' : 'line')}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-2">
            {performanceCards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  haptic.light();
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentCard ? "bg-primary w-6" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Detailed Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement Breakdown</CardTitle>
            <CardDescription>Daily engagement across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="likes" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="shares" stackId="a" fill="#06b6d4" />
                <Bar dataKey="comments" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-xs">Likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                <span className="text-xs">Shares</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs">Comments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audience Demographics</CardTitle>
            <CardDescription>Age distribution of your followers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {audienceData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <div className="grid grid-cols-2 gap-3">
          {platforms.slice(1).map((platform) => (
            <Card key={platform.id} className="touch-manipulation">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{platform.name}</span>
                    <Badge variant="outline" className="text-xs">+12%</Badge>
                  </div>
                  <div className="text-lg font-bold">2.4K</div>
                  <div className="h-8">
                    {renderChart(
                      engagementData.map(d => ({ date: d.date, value: d.likes })),
                      'area',
                      platform.color
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PullToRefresh>
  );
}