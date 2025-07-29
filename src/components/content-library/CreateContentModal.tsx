import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Mic, 
  Palette,
  Layout,
  Camera,
  Folder
} from 'lucide-react';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createOptions = [
  {
    id: 'upload',
    title: 'Upload Files',
    description: 'Upload images, videos, documents and more',
    icon: Upload,
    color: 'bg-blue-500',
    action: 'upload'
  },
  {
    id: 'image-editor',
    title: 'Image Editor',
    description: 'Create and edit images with built-in tools',
    icon: Palette,
    color: 'bg-purple-500',
    action: 'image-editor'
  },
  {
    id: 'video-editor',
    title: 'Video Editor',
    description: 'Trim and edit videos',
    icon: Video,
    color: 'bg-red-500',
    action: 'video-editor'
  },
  {
    id: 'ai-generator',
    title: 'AI Image Generator',
    description: 'Generate images with AI',
    icon: Camera,
    color: 'bg-green-500',
    action: 'ai-generator'
  },
  {
    id: 'template',
    title: 'Use Template',
    description: 'Start from a pre-designed template',
    icon: Layout,
    color: 'bg-orange-500',
    action: 'template'
  },
  {
    id: 'folder',
    title: 'Create Folder',
    description: 'Organize content with folders',
    icon: Folder,
    color: 'bg-gray-500',
    action: 'folder'
  }
];

export function CreateContentModal({ isOpen, onClose }: CreateContentModalProps) {
  const handleOptionClick = (action: string) => {
    console.log(`Creating content with action: ${action}`);
    // Implement actual content creation logic
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {createOptions.map((option) => {
            const Icon = option.icon;
            
            return (
              <Card
                key={option.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleOptionClick(option.action)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Upload Area */}
        <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              Drag and drop files here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button variant="outline">
              Choose Files
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}