import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PenTool, Calendar, BarChart3, Users, Zap, Target } from "lucide-react";

const actions = [
  {
    icon: PenTool,
    title: "Tạo bài viết",
    description: "Tạo nội dung mới",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Calendar,
    title: "Lên lịch",
    description: "Xem lịch trình",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: BarChart3,
    title: "Phân tích",
    description: "Xem báo cáo",
    color: "bg-success/10 text-success",
  },
  {
    icon: Users,
    title: "Tài khoản",
    description: "Quản lý kết nối",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Zap,
    title: "Tăng tương tác",
    description: "Boost engagement",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Target,
    title: "Mục tiêu",
    description: "Thiết lập KPI",
    color: "bg-muted/30 text-muted-foreground",
  },
];

export function QuickActions() {
  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const ActionButton = (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            );

            if (action.title === "Tạo bài viết") {
              return (
                <CreatePostDialog key={index}>
                  {ActionButton}
                </CreatePostDialog>
              );
            }

            return ActionButton;
          })}
        </div>
      </CardContent>
    </Card>
  );
}