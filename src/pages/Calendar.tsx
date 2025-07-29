import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PostCalendar } from '@/components/calendar/PostCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Plus, Clock, Users, BarChart3 } from 'lucide-react';
import { CreatePostModal } from '@/components/posts/CreatePostModal';

export default function Calendar() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock data for upcoming posts
  const upcomingPosts = [
    {
      id: 1,
      title: "Product Launch Announcement",
      platforms: ["Facebook", "Twitter", "LinkedIn"],
      scheduledFor: "2024-12-15 10:00",
      status: "scheduled",
      author: "John Doe"
    },
    {
      id: 2,
      title: "Weekly Team Update",
      platforms: ["Twitter", "LinkedIn"],
      scheduledFor: "2024-12-16 14:30",
      status: "draft",
      author: "Jane Smith"
    },
    {
      id: 3,
      title: "Holiday Campaign",
      platforms: ["Facebook", "Instagram"],
      scheduledFor: "2024-12-20 09:00",
      status: "scheduled",
      author: "Mike Johnson"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-500">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'published':
        return <Badge className="bg-blue-500">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Content Calendar
            </h1>
            <p className="text-muted-foreground">
              Plan, schedule, and manage your social media content
            </p>
          </div>
          <Button onClick={() => setShowCreatePost(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Ready to schedule
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Posts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Collaborative content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.8% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Upcoming Posts */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Posts</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <PostCalendar />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Scheduled Posts</CardTitle>
                <CardDescription>
                  Posts scheduled for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(post.scheduledFor).toLocaleString()}
                          <span>•</span>
                          <span>by {post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {post.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>
                  Analytics for your scheduled and published content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Performance analytics coming soon!</p>
                  <p className="text-sm">Track engagement and reach for your scheduled content.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Post Modal */}
        <CreatePostModal
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
        />
      </div>
    </Layout>
  );
}