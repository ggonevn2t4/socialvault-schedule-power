import { useState } from 'react';
import { Plus, Users, TrendingUp, FileBarChart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCompetitors } from '@/hooks/useCompetitors';
import { useMarketInsights, useCompetitiveReports, useCompetitorContent } from '@/hooks/useCompetitiveIntelligence';
import { useTeams } from '@/hooks/useTeams';
import { CompetitorCard } from '@/components/competitive/CompetitorCard';
import { AddCompetitorModal } from '@/components/competitive/AddCompetitorModal';
import { MarketInsightCard } from '@/components/competitive/MarketInsightCard';
import { CompetitorContentFeed } from '@/components/competitive/CompetitorContentFeed';
import { CompetitiveReportsTable } from '@/components/competitive/CompetitiveReportsTable';

export default function CompetitiveIntelligence() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { teams } = useTeams();
  const currentTeam = teams?.[0];
  
  const { data: competitors = [] } = useCompetitors(currentTeam?.id);
  const { data: insights = [] } = useMarketInsights(currentTeam?.id);
  const { data: reports = [] } = useCompetitiveReports(currentTeam?.id);
  const { data: competitorContent = [] } = useCompetitorContent(currentTeam?.id);

  const stats = [
    {
      title: "Tracked Competitors",
      value: competitors.length,
      description: "Active competitor profiles",
      icon: Users,
    },
    {
      title: "Market Insights",
      value: insights.length,
      description: "Generated this month",
      icon: TrendingUp,
    },
    {
      title: "Content Monitored",
      value: competitorContent.length,
      description: "Posts analyzed",
      icon: Eye,
    },
    {
      title: "Reports Generated",
      value: reports.length,
      description: "Competitive analysis reports",
      icon: FileBarChart,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitive Intelligence</h1>
          <p className="text-muted-foreground">
            Monitor competitors, track market trends, and gain strategic insights
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Competitor
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="monitoring">Content Monitoring</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Profiles</CardTitle>
              <CardDescription>
                Manage and track your key competitors across different markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {competitors.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {competitors.map((competitor) => (
                    <CompetitorCard key={competitor.id} competitor={competitor} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No competitors added</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by adding your first competitor to track
                  </p>
                  <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Competitor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                AI-generated insights and trends from competitive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <MarketInsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No insights available</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Insights will appear as we analyze competitor data
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Monitoring</CardTitle>
              <CardDescription>
                Real-time feed of competitor content across social platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitorContentFeed content={competitorContent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Reports</CardTitle>
              <CardDescription>
                Comprehensive analysis reports and benchmarking data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitiveReportsTable reports={reports} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddCompetitorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        teamId={currentTeam?.id}
      />
    </div>
  );
}