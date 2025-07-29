import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  PenTool,
  BarChart3
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const Index = () => {
  const stats = [
    {
      title: "Tổng người theo dõi",
      value: "24,591",
      change: "+12.5% từ tháng trước",
      changeType: "positive" as const,
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Tương tác",
      value: "8,429",
      change: "+8.2% từ tuần trước",
      changeType: "positive" as const,
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Bài viết đã lên lịch",
      value: "156",
      change: "Tháng này",
      changeType: "neutral" as const,
      icon: Calendar,
      trend: "stable" as const,
    },
    {
      title: "Tin nhắn",
      value: "89",
      change: "+23 tin nhắn mới",
      changeType: "positive" as const,
      icon: MessageSquare,
      trend: "up" as const,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-90" />
          <div className="relative p-8 lg:p-12 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
                Chào mừng trở lại! 👋
              </h1>
              <p className="text-xl mb-6 text-white/90 animate-slide-up">
                Quản lý toàn bộ hoạt động mạng xã hội của bạn từ một nơi duy nhất. 
                Tăng trưởng thông minh và hiệu quả hơn với SocialVault.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  <PenTool className="mr-2 h-5 w-5" />
                  Tạo bài viết mới
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Xem phân tích
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentPosts />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Achievement Card */}
            <Card className="card-premium bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center text-success">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Thành tựu mới
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Bạn đã đạt được 10,000+ lượt tương tác trong tháng này! 🎉
                </p>
                <Button size="sm" className="w-full btn-premium">
                  <Target className="mr-2 h-4 w-4" />
                  Đặt mục tiêu mới
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="card-premium bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center text-warning">
                  <Zap className="mr-2 h-5 w-5" />
                  Mẹo hôm nay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Đăng bài vào 8-9h sáng để có tương tác cao nhất trên Facebook!
                </p>
                <Button size="sm" variant="outline" className="w-full btn-glass">
                  Xem thêm mẹo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
