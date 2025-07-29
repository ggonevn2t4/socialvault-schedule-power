import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Hash,
  AtSign,
  Smile,
  Image,
  Video,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Save,
  Eye,
  Plus,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCreatePost } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';
import { PostData, Platform } from '@/types/post';
import { PreviewContainer } from './preview/PreviewContainer';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


const defaultPlatforms: Platform[] = [
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2', limit: 280, enabled: false },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2', limit: 63206, enabled: false },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', limit: 2200, enabled: false },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5', limit: 3000, enabled: false },
];

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>(defaultPlatforms);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [currentTab, setCurrentTab] = useState('compose');
  const [isDraft, setIsDraft] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const createPost = useCreatePost();
  const { toast } = useToast();

  // Character count for active platforms
  const activePlatforms = platforms.filter(p => p.enabled);
  const minCharLimit = activePlatforms.length > 0 
    ? Math.min(...activePlatforms.map(p => p.limit))
    : 3000;
  
  const charCount = content.length;
  const isOverLimit = charCount > minCharLimit;

  // Auto-save draft
  useEffect(() => {
    if (content.trim() || title.trim()) {
      setIsDraft(true);
      const timer = setTimeout(() => {
        // Here you would save to localStorage or API
        console.log('Auto-saving draft...');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, title]);

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    if (title.trim()) progress += 20;
    if (content.trim()) progress += 30;
    if (activePlatforms.length > 0) progress += 30;
    if (isScheduled && scheduledDate) progress += 20;
    setProgress(progress);
  }, [title, content, activePlatforms.length, isScheduled, scheduledDate]);

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(p => 
        p.id === platformId ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    if (activePlatforms.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPost.mutateAsync({
        title: title || content.slice(0, 50),
        content,
      });
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const resetForm = () => {
    setContent('');
    setTitle('');
    setPlatforms(defaultPlatforms);
    setScheduledDate(undefined);
    setScheduledTime('');
    setIsScheduled(false);
    setIsDraft(false);
    setProgress(0);
  };

  const formatContent = (type: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      default:
        return;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-xl font-semibold">Create New Post</DialogTitle>
            {isDraft && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Save className="h-3 w-3" />
                Draft saved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <Progress value={progress} className="w-20" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="p-6 space-y-6">
              {/* Mobile Compose Content */}
              <div className="space-y-4">
                {/* Post Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title (Optional)</Label>
                  <Input
                    id="title"
                    placeholder="Give your post a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatContent('bold')}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatContent('italic')}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatContent('underline')}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <Button variant="ghost" size="sm">
                    <Hash className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <AtSign className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Content</Label>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm",
                        isOverLimit ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {charCount}/{minCharLimit}
                      </span>
                      {activePlatforms.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {activePlatforms.map(p => p.name).join(', ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                {/* Media Upload */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Drop files here or click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        Support: Images, Videos, Documents
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Media
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="p-6">
              {/* Mobile Preview Content */}
              <div className="space-y-6">
                <h3 className="font-semibold">Preview</h3>
                {activePlatforms.map(platform => (
                  <div key={platform.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{platform.icon}</span>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <div className="space-y-2">
                      {title && <h4 className="font-medium">{title}</h4>}
                      <p className="text-sm whitespace-pre-wrap">{content || "Your post content will appear here..."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Compose Column */}
          <div className="flex-1 p-6 border-r overflow-y-auto">
            <div className="space-y-6 max-w-2xl">
              {/* Post Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Post Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Give your post a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatContent('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatContent('italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatContent('underline')}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button variant="ghost" size="sm">
                  <Hash className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <AtSign className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <span className={cn(
                    "text-sm",
                    isOverLimit ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {charCount}/{minCharLimit}
                  </span>
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
              </div>

              {/* Media Upload */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Drop files here or click to upload</p>
                    <p className="text-xs text-muted-foreground">
                      Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF)
                    </p>
                  </div>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-4">
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map(platform => (
                    <div 
                      key={platform.id}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                        platform.enabled ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      )}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{platform.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {platform.limit.toLocaleString()} chars
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={platform.enabled}
                        onChange={() => togglePlatform(platform.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Schedule Post</Label>
                  <Switch 
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                </div>
                
                {isScheduled && (
                  <div className="grid grid-cols-2 gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="w-2/5 p-6 bg-muted/30">
            <PreviewContainer 
              postData={{
                title,
                content,
                platforms: activePlatforms.map(p => p.id),
                scheduledDate,
                scheduledTime
              }}
              platforms={platforms}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            {isScheduled && scheduledDate && (
              <Badge variant="secondary">
                Scheduled for {format(scheduledDate, 'MMM d, yyyy')} {scheduledTime}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={!content.trim() || activePlatforms.length === 0 || createPost.isPending}
              className="min-w-[120px]"
            >
              <Send className="h-4 w-4 mr-2" />
              {isScheduled ? 'Schedule' : 'Publish'} Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}