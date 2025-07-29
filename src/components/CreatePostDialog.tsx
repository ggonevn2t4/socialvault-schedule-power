import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreatePost } from '@/hooks/usePosts';
import { Loader2, PenTool } from 'lucide-react';

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim() || undefined,
      });
      
      // Reset form and close dialog
      setTitle('');
      setContent('');
      setOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!createPost.isPending) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setTitle('');
        setContent('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PenTool className="h-5 w-5 mr-2" />
            Tạo bài viết mới
          </DialogTitle>
          <DialogDescription>
            Tạo nội dung mới cho chiến dịch marketing của bạn.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề bài viết *</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề hấp dẫn..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createPost.isPending}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              placeholder="Viết nội dung bài viết của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={createPost.isPending}
              className="min-h-[120px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createPost.isPending}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="btn-premium"
              disabled={createPost.isPending || !title.trim()}
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <PenTool className="h-4 w-4 mr-2" />
                  Tạo bài viết
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}