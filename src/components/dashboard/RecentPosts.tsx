import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Facebook, Instagram, Twitter, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const posts = [
  {
    id: 1,
    content: "Khám phá xu hướng marketing mới nhất trong năm 2024! 🚀 #Marketing #Trend",
    platform: "facebook",
    status: "published",
    scheduledTime: "2024-01-15 14:30",
    engagement: "156 lượt thích, 23 bình luận",
  },
  {
    id: 2,
    content: "Behind the scenes tại studio chụp ảnh sản phẩm mới 📸 #BehindTheScenes",
    platform: "instagram",
    status: "scheduled",
    scheduledTime: "2024-01-16 09:00",
    engagement: "Lên lịch",
  },
  {
    id: 3,
    content: "Tips hay ho để tăng engagement trên social media mà bạn nên biết!",
    platform: "twitter",
    status: "draft",
    scheduledTime: "Bản nháp",
    engagement: "Chưa xuất bản",
  },
];

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
};

const statusConfig = {
  published: { label: "Đã đăng", color: "bg-success", icon: CheckCircle },
  scheduled: { label: "Đã lên lịch", color: "bg-warning", icon: Clock },
  draft: { label: "Bản nháp", color: "bg-muted", icon: AlertCircle },
};

export function RecentPosts() {
  return (
    <Card className="card-premium">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Bài viết gần đây</CardTitle>
        <Button variant="outline" size="sm" className="btn-glass">
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => {
          const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons];
          const StatusIcon = statusConfig[post.status as keyof typeof statusConfig].icon;
          
          return (
            <div key={post.id} className="flex items-start space-x-4 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10">
                  <PlatformIcon className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <Badge 
                    variant="secondary" 
                    className={`${statusConfig[post.status as keyof typeof statusConfig].color} text-white`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[post.status as keyof typeof statusConfig].label}
                  </Badge>
                  
                  <span>{post.scheduledTime}</span>
                  <span>•</span>
                  <span>{post.engagement}</span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card/95 backdrop-blur-md border-border/50" align="end">
                  <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                  <DropdownMenuItem>Sao chép</DropdownMenuItem>
                  <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}