import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { usePosts, useDeletePost } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  published: { label: "Đã đăng", color: "bg-success", icon: CheckCircle },
  scheduled: { label: "Đã lên lịch", color: "bg-warning", icon: Clock },
  draft: { label: "Bản nháp", color: "bg-muted", icon: AlertCircle },
};

export function RecentPosts() {
  const { data: posts, isLoading, error } = usePosts();
  const deletePost = useDeletePost();

  const handleDeletePost = async (postId: string) => {
    await deletePost.mutateAsync(postId);
  };

  if (isLoading) {
    return (
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Bài viết gần đây</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Đang tải...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Bài viết gần đây</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Có lỗi xảy ra khi tải bài viết.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-premium">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Bài viết gần đây</CardTitle>
        <Button variant="outline" size="sm" className="btn-glass">
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.slice(0, 5).map((post) => (
            <div key={post.id} className="flex items-start space-x-4 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
                  {post.title}
                </h3>
                {post.content && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {post.content}
                  </p>
                )}
                
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <Badge 
                    variant="secondary" 
                    className="bg-success text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã tạo
                  </Badge>
                  
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
                  </span>
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
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePost.isPending}
                  >
                    {deletePost.isPending ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Đang xóa...
                      </>
                    ) : (
                      'Xóa'
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Chưa có bài viết nào</p>
            <p className="text-sm text-muted-foreground">Tạo bài viết đầu tiên của bạn!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}