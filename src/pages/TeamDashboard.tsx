import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TeamMemberGrid } from '@/components/team/TeamMemberGrid';
import { ActivityTimeline } from '@/components/team/ActivityTimeline';
import { TaskOverview } from '@/components/team/TaskOverview';
import { TeamPerformance } from '@/components/team/TeamPerformance';
import { QuickTeamChat } from '@/components/team/QuickTeamChat';
import { RoleManagement } from '@/components/team/RoleManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, MessageSquare, BarChart3, Calendar, Plus } from 'lucide-react';

export default function TeamDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your team collaboration and workflow
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Team Chat
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-success">+2 this month</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-xs text-success">3 due this week</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-xs text-destructive">2 overdue</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <Settings className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Performance</p>
                  <p className="text-2xl font-bold text-foreground">94%</p>
                  <p className="text-xs text-success">+5% this week</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Members Overview */}
              <div className="lg:col-span-2">
                <TeamMemberGrid />
              </div>
              
              {/* Activity Timeline */}
              <div>
                <ActivityTimeline />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Overview */}
              <TaskOverview teamId="demo-team-id" />
              
              {/* Quick Team Chat */}
              <QuickTeamChat />
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <TeamMemberGrid detailed />
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <TeamPerformance />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Workflow Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced workflow builder and approval systems coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}