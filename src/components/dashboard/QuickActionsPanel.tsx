import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { 
  PenTool, 
  Calendar, 
  Rss, 
  Upload, 
  Sparkles, 
  Eye,
  Plus,
  ArrowRight,
  Clock,
  Zap
} from "lucide-react";

const quickActions = [
  {
    id: "create-post",
    title: "Tạo bài viết mới",
    subtitle: "Viết nội dung sáng tạo cho mạng xã hội",
    icon: PenTool,
    color: "bg-primary/10 text-primary",
    prominent: true,
    component: "dialog"
  },
  {
    id: "quick-schedule",
    title: "Lên lịch hôm nay",
    subtitle: "Đăng bài nhanh cho ngày hôm nay",
    icon: Clock,
    color: "bg-success/10 text-success",
    badge: "3 khe trống"
  },
  {
    id: "import-rss",
    title: "Nhập từ RSS",
    subtitle: "Đồng bộ nội dung từ nguồn RSS",
    icon: Rss,
    color: "bg-warning/10 text-warning",
    badge: "12 mới"
  },
  {
    id: "bulk-upload",
    title: "Tải lên hàng loạt",
    subtitle: "Upload nhiều bài viết cùng lúc",
    icon: Upload,
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "ai-content", 
    title: "Tạo nội dung AI",
    subtitle: "Sử dụng AI để tạo nội dung",
    icon: Sparkles,
    color: "bg-violet-500/10 text-violet-500",
    badge: "Mới"
  },
  {
    id: "view-calendar",
    title: "Xem lịch trình",
    subtitle: "Quản lý lịch đăng bài tháng này",
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-500"
  }
];

export function QuickActionsPanel() {
  const handleAction = (actionId: string) => {
    console.log(`Executing action: ${actionId}`);
    // In real app, implement actual action handlers
  };

  const renderActionButton = (action: typeof quickActions[0]) => {
    const Icon = action.icon;
    
    const buttonContent = (
      <div className={`group relative overflow-hidden rounded-xl border border-border/50 p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] bg-card/50 backdrop-blur-sm ${
        action.prominent ? "ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5" : ""
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              <Icon className={`h-6 w-6 ${action.prominent ? "h-7 w-7" : ""}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors ${
                action.prominent ? "text-lg" : "text-base"
              }`}>
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {action.subtitle}
              </p>
              
              {action.badge && (
                <Badge 
                  variant="secondary" 
                  className="mt-3 text-xs bg-muted/50 border-0"
                >
                  {action.badge}
                </Badge>
              )}
            </div>
          </div>
          
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
        </div>
        
        {action.prominent && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </div>
    );

    if (action.component === "dialog") {
      return (
        <CreatePostDialog key={action.id}>
          <Button variant="ghost" className="h-auto p-0 w-full">
            {buttonContent}
          </Button>
        </CreatePostDialog>
      );
    }

    return (
      <Button 
        key={action.id}
        variant="ghost" 
        className="h-auto p-0 w-full"
        onClick={() => handleAction(action.id)}
      >
        {buttonContent}
      </Button>
    );
  };

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Thao tác nhanh</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            6 hành động
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prominent Create Post Action */}
        <div className="grid grid-cols-1 gap-4">
          {quickActions.filter(a => a.prominent).map(renderActionButton)}
        </div>
        
        {/* Regular Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {quickActions.filter(a => !a.prominent).map(renderActionButton)}
        </div>
        
        {/* Additional Actions */}
        <div className="pt-4 border-t border-border/50">
          <Button variant="outline" className="w-full h-12 font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Xem tất cả hành động
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}