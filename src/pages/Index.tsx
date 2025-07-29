import { Layout } from "@/components/layout/Layout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { RecentPosts } from "@/components/dashboard/RecentPosts";

// Mock data for stat cards
const statsData = [
  {
    title: "Tổng bài viết",
    value: "847",
    change: 12.5,
    changeType: "increase" as const,
    subtitle: "Tháng này",
    sparklineData: [
      { value: 65 }, { value: 68 }, { value: 62 }, { value: 70 }, 
      { value: 75 }, { value: 72 }, { value: 78 }
    ]
  },
  {
    title: "Bài viết đã lên lịch",
    value: "156",
    change: 0,
    changeType: "neutral" as const,
    subtitle: "7 ngày tới",
    sparklineData: [
      { value: 45 }, { value: 50 }, { value: 48 }, { value: 52 }, 
      { value: 49 }, { value: 51 }, { value: 50 }
    ]
  },
  {
    title: "Tỷ lệ tương tác",
    value: "8.2%",
    change: 8.7,
    changeType: "increase" as const,
    subtitle: "So với tháng trước",
    sparklineData: [
      { value: 7.2 }, { value: 7.5 }, { value: 7.8 }, { value: 8.0 }, 
      { value: 8.1 }, { value: 8.0 }, { value: 8.2 }
    ]
  },
  {
    title: "Tăng trưởng người theo dõi",
    value: "24,591",
    change: -2.3,
    changeType: "decrease" as const,
    subtitle: "Tổng trên tất cả nền tảng",
    sparklineData: [
      { value: 24800 }, { value: 24750 }, { value: 24680 }, { value: 24650 }, 
      { value: 24620 }, { value: 24600 }, { value: 24591 }
    ]
  }
];

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Performance Overview */}
        <PerformanceOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Posts and Activities */}
          <div className="xl:col-span-2 space-y-8">
            <RecentPosts />
            <RecentActivityFeed />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-8">
            <QuickActionsPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
