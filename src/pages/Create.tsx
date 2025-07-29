import { useState } from 'react';
import { MobilePostComposer } from '@/components/mobile/MobilePostComposer';
import { SwipeableAnalyticsCards } from '@/components/mobile/SwipeableAnalyticsCards';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { SwipeableCard } from '@/components/mobile/SwipeableCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Calendar, Image, BarChart3, Users, TrendingUp } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const recentPosts = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'Just launched our new mobile app! 🚀 The user experience is incredibly smooth.',
    timestamp: '2 hours ago',
    engagement: { likes: 42, shares: 12, comments: 8 },
    status: 'published'
  },
  {
    id: '2',
    platform: 'Instagram',
    content: 'Behind the scenes of our latest photoshoot. The creativity never stops! ✨',
    timestamp: '5 hours ago',
    engagement: { likes: 156, shares: 23, comments: 31 },
    status: 'published'
  },
  {
    id: '3',
    platform: 'LinkedIn',
    content: 'Thoughts on the future of social media management and AI integration.',
    timestamp: '1 day ago',
    engagement: { likes: 89, shares: 45, comments: 22 },
    status: 'published'
  },
];

const quickStats = [
  { label: 'Today\'s Posts', value: '8', icon: BarChart3 },
  { label: 'Engagement', value: '4.2%', icon: TrendingUp },
  { label: 'Reach', value: '12.4K', icon: Users },
];

export default function Create() {
  const [showComposer, setShowComposer] = useState(false);
  const { isMobile } = useMobile();

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDeletePost = (id: string) => {
    console.log('Delete post:', id);
  };

  const handleEditPost = (id: string) => {
    console.log('Edit post:', id);
  };

  const handleSharePost = (id: string) => {
    console.log('Share post:', id);
  };

  if (showComposer) {
    return <MobilePostComposer />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Create & Manage</h1>
          <p className="text-muted-foreground">
            Create content, track performance, and manage your posts
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Fast ways to create and manage content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => setShowComposer(true)}
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm">Photo Post</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => setShowComposer(true)}
              >
                <Mic className="h-6 w-6" />
                <span className="text-sm">Voice Post</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => setShowComposer(true)}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2"
                onClick={() => setShowComposer(true)}
              >
                <Image className="h-6 w-6" />
                <span className="text-sm">Gallery</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Performance Overview</h2>
          <SwipeableAnalyticsCards />
        </div>

        {/* Recent Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Badge variant="secondary">{recentPosts.length} posts</Badge>
          </div>
          
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <SwipeableCard
                key={post.id}
                onDelete={() => handleDeletePost(post.id)}
                onEdit={() => handleEditPost(post.id)}
                onShare={() => handleSharePost(post.id)}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{post.platform}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.timestamp}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <p className="text-sm line-clamp-2">{post.content}</p>
                      
                      {/* Engagement */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>❤️ {post.engagement.likes}</span>
                        <span>🔄 {post.engagement.shares}</span>
                        <span>💬 {post.engagement.comments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwipeableCard>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <div className="pb-6">
          <Button
            size="lg"
            onClick={() => setShowComposer(true)}
            className="w-full h-12"
          >
            Create New Post
          </Button>
        </div>
      </div>
    </PullToRefresh>
  );
}