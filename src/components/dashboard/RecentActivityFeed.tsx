import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Trash2, 
  MoreHorizontal,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Clock,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

interface ActivityItem {
  id: string;
  type: "post" | "comment" | "mention" | "share";
  platform: "facebook" | "instagram" | "twitter" | "linkedin";
  title: string;
  content: string;
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  author?: {
    name: string;
    avatar?: string;
  };
  thumbnail?: string;
}

const mockActivityData: ActivityItem[] = [
  {
    id: "1",
    type: "post",
    platform: "facebook",
    title: "Bài viết mới đã được đăng",
    content: "Tips marketing hiệu quả cho doanh nghiệp nhỏ trong năm 2024. Khám phá những chiến lược...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    engagement: { likes: 156, comments: 23, shares: 12 },
    thumbnail: "📱"
  },
  {
    id: "2", 
    type: "comment",
    platform: "instagram",
    title: "Bình luận mới",
    content: "Nguyễn Văn A đã bình luận: 'Nội dung rất hữu ích, cảm ơn bạn!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    engagement: { likes: 5, comments: 0, shares: 0 },
    author: { name: "Nguyễn Văn A", avatar: undefined }
  },
  {
    id: "3",
    type: "mention",
    platform: "twitter", 
    title: "Được mention",
    content: "@yourhandle được nhắc đến trong một tweet về digital marketing trends",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    engagement: { likes: 28, comments: 4, shares: 8 },
    author: { name: "Marketing Pro", avatar: undefined }
  },
  {
    id: "4",
    type: "share",
    platform: "linkedin",
    title: "Bài viết được chia sẻ",
    content: "Bài viết về 'Xu hướng Social Media 2024' đã được chia sẻ 15 lần",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    engagement: { likes: 89, comments: 12, shares: 15 },
    thumbnail: "📊"
  },
  {
    id: "5",
    type: "post",
    platform: "instagram",
    title: "Story mới được đăng",
    content: "Behind the scenes của buổi chụp sản phẩm mới",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    engagement: { likes: 45, comments: 8, shares: 3 },
    thumbnail: "📸"
  }
];

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

const platformColors = {
  facebook: "text-blue-600",
  instagram: "text-pink-500",
  twitter: "text-blue-400", 
  linkedin: "text-blue-700",
};

const activityTypeLabels = {
  post: "Bài viết",
  comment: "Bình luận",
  mention: "Nhắc đến",
  share: "Chia sẻ",
};

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivityData);
  const [loading, setLoading] = useState(false);

  const handleLike = async (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, engagement: { ...activity.engagement, likes: activity.engagement.likes + 1 }}
          : activity
      )
    );
  };

  const handleDelete = async (activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  const loadMore = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Hoạt động gần đây</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {activities.length} hoạt động
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const PlatformIcon = platformIcons[activity.platform];
            
            return (
              <div 
                key={activity.id}
                className="group relative p-4 rounded-lg border border-border/50 hover:border-border transition-all duration-200 hover:shadow-sm bg-card/30"
              >
                <div className="flex items-start space-x-4">
                  {/* Platform Icon */}
                  <div className={`p-2 rounded-full bg-muted/50 ${platformColors[activity.platform]}`}>
                    <PlatformIcon className="h-4 w-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="secondary" className="text-xs bg-muted/50 border-0">
                            {activityTypeLabels[activity.type]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: vi })}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-foreground mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {activity.thumbnail && (
                            <span className="mr-2">{activity.thumbnail}</span>
                          )}
                          {activity.content}
                        </p>
                        
                        {/* Engagement Stats */}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{activity.engagement.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{activity.engagement.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share className="h-3 w-3" />
                            <span>{activity.engagement.shares}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-md border-border/50">
                          <DropdownMenuItem onClick={() => handleLike(activity.id)}>
                            <Heart className="h-4 w-4 mr-2" />
                            Thích
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Trả lời
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Chia sẻ
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(activity.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                {/* Author info for comments/mentions */}
                {activity.author && (
                  <div className="flex items-center space-x-2 mt-3 ml-12">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {activity.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {activity.author.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Load More */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
            className="w-full h-12"
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              'Tải thêm hoạt động'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}