import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Grid3X3,
  List,
  Clock,
  Filter
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreatePostDialog } from '../CreatePostDialog';
import { usePosts } from '@/hooks/usePosts';

interface PostCalendarProps {
  className?: string;
}

type ViewMode = 'month' | 'week' | 'day' | 'list';

const mockPosts = [
  { id: '1', date: new Date(2024, 1, 15), title: 'Launch announcement', platform: 'twitter', status: 'scheduled' },
  { id: '2', date: new Date(2024, 1, 15), title: 'Behind the scenes', platform: 'instagram', status: 'draft' },
  { id: '3', date: new Date(2024, 1, 18), title: 'Weekly newsletter', platform: 'linkedin', status: 'published' },
  { id: '4', date: new Date(2024, 1, 20), title: 'Product demo', platform: 'facebook', status: 'scheduled' },
];

const platformColors = {
  twitter: '#1DA1F2',
  facebook: '#1877F2', 
  instagram: '#E4405F',
  linkedin: '#0077B5',
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function PostCalendar({ className }: PostCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const { data: posts = [] } = usePosts();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getPostsForDate = (date: Date) => {
    return mockPosts.filter(post => 
      post.date.toDateString() === date.toDateString()
    );
  };

  const ViewModeSelector = () => (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      {[
        { mode: 'month' as ViewMode, icon: Grid3X3, label: 'Month' },
        { mode: 'list' as ViewMode, icon: List, label: 'List' },
      ].map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode(mode)}
          className="h-8"
        >
          <Icon className="h-4 w-4 mr-1" />
          {label}
        </Button>
      ))}
    </div>
  );

  if (viewMode === 'list') {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Content Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <ViewModeSelector />
            <CreatePostDialog>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </CreatePostDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platformColors[post.platform as keyof typeof platformColors] }}
                  />
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(post.date, 'MMM d, yyyy')} • {post.platform}
                    </p>
                  </div>
                </div>
                <Badge className={statusColors[post.status as keyof typeof statusColors]}>
                  {post.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Content Calendar
        </CardTitle>
        <div className="flex items-center gap-2">
          <ViewModeSelector />
          <CreatePostDialog>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </CreatePostDialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-sm font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map(day => {
            const dayPosts = getPostsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            
            return (
              <CreatePostDialog key={day.toISOString()}>
                <div
                  className={cn(
                    "min-h-[100px] p-2 border border-muted cursor-pointer transition-colors hover:bg-muted/50",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                    isTodayDate && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      isTodayDate && "text-primary"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayPosts.length > 0 && (
                      <Badge variant="secondary" className="text-xs h-5">
                        {dayPosts.length}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map(post => (
                      <div
                        key={post.id}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          statusColors[post.status as keyof typeof statusColors]
                        )}
                        style={{
                          borderLeft: `2px solid ${platformColors[post.platform as keyof typeof platformColors]}`
                        }}
                      >
                        {post.title}
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayPosts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </CreatePostDialog>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span className="text-sm text-muted-foreground">Draft</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-muted-foreground">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Published</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Failed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}