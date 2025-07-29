import { useState, useRef } from 'react';
import { Camera, Image, Type, Video, Mic, Send, X, Plus, Smile, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useHapticFeedback, useSwipeGesture } from '@/hooks/use-mobile';
import { CameraInterface } from './CameraInterface';
import { VoiceToText } from './VoiceToText';
import { MobileImageEditor } from './MobileImageEditor';

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  maxLength: number;
}

const platforms: Platform[] = [
  { id: 'twitter', name: 'Twitter', icon: '𝕏', color: 'bg-black', maxLength: 280 },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500', maxLength: 2200 },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-600', maxLength: 63206 },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', maxLength: 3000 },
];

const quickActions = [
  { id: 'camera', icon: Camera, label: 'Camera' },
  { id: 'gallery', icon: Image, label: 'Gallery' },
  { id: 'voice', icon: Mic, label: 'Voice' },
  { id: 'schedule', icon: Calendar, label: 'Schedule' },
];

export function MobilePostComposer() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeMode, setActiveMode] = useState<'compose' | 'camera' | 'voice' | 'edit'>('compose');
  const [editingImage, setEditingImage] = useState<Blob | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const haptic = useHapticFeedback();
  const swipeGesture = useSwipeGesture(
    () => {
      // Swipe left - next platform
      const currentIndex = platforms.findIndex(p => selectedPlatforms.includes(p.id));
      const nextIndex = (currentIndex + 1) % platforms.length;
      setSelectedPlatforms([platforms[nextIndex].id]);
    },
    () => {
      // Swipe right - previous platform
      const currentIndex = platforms.findIndex(p => selectedPlatforms.includes(p.id));
      const prevIndex = currentIndex === 0 ? platforms.length - 1 : currentIndex - 1;
      setSelectedPlatforms([platforms[prevIndex].id]);
    }
  );

  const currentPlatform = platforms.find(p => selectedPlatforms[0] === p.id) || platforms[0];
  const remainingChars = currentPlatform.maxLength - content.length;

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
    haptic.light();
  };

  const handleQuickAction = (actionId: string) => {
    haptic.medium();
    
    switch (actionId) {
      case 'camera':
        setActiveMode('camera');
        break;
      case 'gallery':
        fileInputRef.current?.click();
        break;
      case 'voice':
        setActiveMode('voice');
        break;
      case 'schedule':
        setIsScheduled(!isScheduled);
        break;
    }
  };

  const handlePhotoCapture = (blob: Blob) => {
    setEditingImage(blob);
    setActiveMode('edit');
  };

  const handleVideoCapture = (blob: Blob) => {
    const file = new File([blob], 'video.webm', { type: 'video/webm' });
    setAttachments(prev => [...prev, file]);
    setActiveMode('compose');
  };

  const handleImageEdit = (editedBlob: Blob) => {
    const file = new File([editedBlob], 'edited-image.jpg', { type: 'image/jpeg' });
    setAttachments(prev => [...prev, file]);
    setActiveMode('compose');
    setEditingImage(null);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setContent(prev => prev + ' ' + transcript);
    setActiveMode('compose');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    haptic.light();
  };

  const handlePost = () => {
    if (!content.trim() && attachments.length === 0) return;
    
    haptic.heavy();
    // Handle post submission
    console.log('Posting:', { content, platforms: selectedPlatforms, attachments, isScheduled });
  };

  // Render different modes
  if (activeMode === 'camera') {
    return (
      <CameraInterface
        onPhotoCapture={handlePhotoCapture}
        onVideoCapture={handleVideoCapture}
        onClose={() => setActiveMode('compose')}
      />
    );
  }

  if (activeMode === 'edit' && editingImage) {
    return (
      <MobileImageEditor
        imageBlob={editingImage}
        onSave={handleImageEdit}
        onClose={() => {
          setActiveMode('compose');
          setEditingImage(null);
        }}
      />
    );
  }

  if (activeMode === 'voice') {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => setActiveMode('compose')}>
            <X className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold">Voice Input</h2>
          <div />
        </div>
        
        <div className="flex-1 p-6">
          <VoiceToText
            onTranscript={handleVoiceTranscript}
            placeholder="Tap the microphone and start speaking..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm">
          <X className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold">Create Post</h2>
        <Button 
          size="sm" 
          onClick={handlePost}
          disabled={!content.trim() && attachments.length === 0}
          className="min-w-[60px]"
        >
          {isScheduled ? <Calendar className="h-4 w-4 mr-1" /> : <Send className="h-4 w-4 mr-1" />}
          {isScheduled ? 'Schedule' : 'Post'}
        </Button>
      </div>

      {/* Platform Selector */}
      <div className="p-4 border-b" {...swipeGesture}>
        <div className="flex space-x-2 overflow-x-auto">
          {platforms.map((platform) => (
            <Button
              key={platform.id}
              variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handlePlatformToggle(platform.id)}
              className={cn(
                "flex-shrink-0",
                selectedPlatforms.includes(platform.id) && platform.color
              )}
            >
              <span className="mr-2">{platform.icon}</span>
              {platform.name}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Swipe left/right to switch platforms quickly
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 space-y-4">
        {/* Text Input */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[120px] text-lg border-none p-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
          />
          
          {/* Character Count */}
          <div className="absolute bottom-2 right-2">
            <Badge 
              variant={remainingChars < 20 ? "destructive" : "secondary"}
              className="text-xs"
            >
              {remainingChars}
            </Badge>
          </div>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Attachments</h4>
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ) : file.type.startsWith('video/') ? (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-24 object-cover rounded-lg"
                      controls={false}
                    />
                  ) : (
                    <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">{file.name}</span>
                    </div>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex justify-around">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                size="lg"
                onClick={() => handleQuickAction(action.id)}
                className={cn(
                  "flex-col h-16 space-y-1",
                  action.id === 'schedule' && isScheduled && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}