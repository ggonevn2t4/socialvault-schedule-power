import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Download, Calendar, Filter, BarChart3 } from "lucide-react";
import { useState } from "react";

// Mock data for charts
const postsOverTimeData = [
  { date: "01/01", posts: 12, engagement: 450 },
  { date: "01/02", posts: 8, engagement: 380 },
  { date: "01/03", posts: 15, engagement: 620 },
  { date: "01/04", posts: 10, engagement: 420 },
  { date: "01/05", posts: 18, engagement: 780 },
  { date: "01/06", posts: 14, engagement: 560 },
  { date: "01/07", posts: 20, engagement: 890 },
];

const platformEngagementData = [
  { platform: "Facebook", engagement: 4500, posts: 45, color: "#1877F2" },
  { platform: "Instagram", engagement: 3200, posts: 38, color: "#E4405F" },
  { platform: "Twitter", engagement: 2100, posts: 52, color: "#1DA1F2" },
  { platform: "LinkedIn", engagement: 1800, posts: 25, color: "#0A66C2" },
];

const contentTypeData = [
  { type: "Hình ảnh", value: 45, color: "#8B5CF6" },
  { type: "Video", value: 30, color: "#06B6D4" },
  { type: "Text", value: 15, color: "#10B981" },
  { type: "Carousel", value: 10, color: "#F59E0B" },
];

const bestTimesData = [
  { hour: "6h", Mon: 20, Tue: 15, Wed: 25, Thu: 18, Fri: 30, Sat: 35, Sun: 22 },
  { hour: "9h", Mon: 45, Tue: 50, Wed: 40, Thu: 55, Fri: 60, Sat: 25, Sun: 30 },
  { hour: "12h", Mon: 70, Tue: 65, Wed: 75, Thu: 68, Fri: 45, Sat: 40, Sun: 35 },
  { hour: "15h", Mon: 55, Tue: 60, Wed: 58, Thu: 62, Fri: 70, Sat: 80, Sun: 75 },
  { hour: "18h", Mon: 85, Tue: 80, Wed: 88, Thu: 82, Fri: 90, Sat: 95, Sun: 85 },
  { hour: "21h", Mon: 65, Tue: 70, Wed: 68, Thu: 72, Fri: 85, Sat: 90, Sun: 80 },
];

export function PerformanceOverview() {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [activeChart, setActiveChart] = useState("posts");

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    // In real app, implement actual export functionality
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="card-premium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Tổng quan hiệu suất</span>
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                  <SelectItem value="90d">3 tháng</SelectItem>
                  <SelectItem value="1y">1 năm</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nền tảng</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("png")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                >
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("csv")}
                >
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "posts", label: "Bài viết theo thời gian" },
          { key: "engagement", label: "Tương tác theo nền tảng" },
          { key: "times", label: "Thời gian đăng tối ưu" },
          { key: "content", label: "Loại nội dung" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeChart === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart(tab.key)}
            className={activeChart === tab.key ? "btn-premium" : ""}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeChart === "posts" && (
          <>
            <Card className="card-premium lg:col-span-2">
              <CardHeader>
                <CardTitle>Bài viết được đăng (30 ngày qua)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={postsOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="posts" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeChart === "engagement" && (
          <>
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Tương tác theo nền tảng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Số lượng bài viết theo nền tảng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformEngagementData.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{platform.posts}</div>
                        <div className="text-sm text-muted-foreground">bài viết</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeChart === "content" && (
          <>
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Loại nội dung hiệu quả nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {contentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Chi tiết loại nội dung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentTypeData.map((type) => (
                    <div key={type.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="font-medium">{type.type}</span>
                        </div>
                        <span className="font-bold">{type.value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${type.value}%`,
                            backgroundColor: type.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeChart === "times" && (
          <Card className="card-premium lg:col-span-2">
            <CardHeader>
              <CardTitle>Thời gian đăng bài tối ưu (Heatmap)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Màu đậm hơn = tương tác cao hơn
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bestTimesData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="hour" type="category" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="Mon" stackId="a" fill="#8B5CF6" />
                    <Bar dataKey="Tue" stackId="a" fill="#06B6D4" />
                    <Bar dataKey="Wed" stackId="a" fill="#10B981" />
                    <Bar dataKey="Thu" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="Fri" stackId="a" fill="#EF4444" />
                    <Bar dataKey="Sat" stackId="a" fill="#8B5CF6" />
                    <Bar dataKey="Sun" stackId="a" fill="#6B7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}