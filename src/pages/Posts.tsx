import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePosts, useUserPosts, useDeletePost } from "@/hooks/usePosts";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { useState } from "react";
import { Plus, Trash2, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Posts() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: userPosts, isLoading } = useUserPosts();
  const deletePostMutation = useDeletePost();

  const handleDeletePost = (postId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      deletePostMutation.mutate(postId);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bài viết của tôi</h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi tất cả bài viết của bạn
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải bài viết...</p>
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Eye className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {post.content && (
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Chưa có bài viết nào</h3>
                    <p className="text-muted-foreground">
                      Bắt đầu tạo bài viết đầu tiên của bạn ngay bây giờ
                    </p>
                  </div>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo bài viết đầu tiên
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Post Modal */}
        <CreatePostModal 
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />
      </div>
    </Layout>
  );
}