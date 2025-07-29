import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Download,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostData, Platform } from '@/types/post';
import { getCharacterCount } from '@/utils/postFormatting';
import { FacebookPreview } from './FacebookPreview';
import { InstagramPreview } from './InstagramPreview';
import { LinkedInPreview } from './LinkedInPreview';
import { TwitterPreview } from './TwitterPreview';

interface PreviewContainerProps {
  postData: PostData;
  platforms: Platform[];
  className?: string;
}

export function PreviewContainer({ postData, platforms, className }: PreviewContainerProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<string>('');

  // Get enabled platforms
  const enabledPlatforms = platforms.filter(p => p.enabled);
  
  // Set default active tab to first enabled platform
  React.useEffect(() => {
    if (enabledPlatforms.length > 0 && !activeTab) {
      setActiveTab(enabledPlatforms[0].id);
    }
  }, [enabledPlatforms, activeTab]);

  const renderPreview = (platform: Platform) => {
    const props = { postData, platform };
    
    switch (platform.id) {
      case 'facebook':
        return <FacebookPreview {...props} />;
      case 'instagram':
        return <InstagramPreview {...props} />;
      case 'linkedin':
        return <LinkedInPreview {...props} />;
      case 'twitter':
        return <TwitterPreview {...props} />;
      default:
        return (
          <div className="p-8 text-center text-gray-500 border rounded-lg">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Preview for {platform.name} not available</p>
          </div>
        );
    }
  };

  const getCharacterStatus = (platform: Platform) => {
    const charData = getCharacterCount(postData.content || '', platform.id);
    return charData;
  };

  if (enabledPlatforms.length === 0) {
    return (
      <div className={cn("bg-muted/30 rounded-lg", className)}>
        <div className="p-8 text-center text-muted-foreground">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="font-semibold mb-2">No Preview Available</h3>
          <p className="text-sm">Select at least one platform to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          <h3 className="font-semibold">Preview</h3>
          <Badge variant="outline" className="text-xs">
            {enabledPlatforms.length} platform{enabledPlatforms.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="h-7 px-2"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="h-7 px-2"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Action Buttons */}
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Platform Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {enabledPlatforms.map(platform => {
            const charStatus = getCharacterStatus(platform);
            return (
              <TabsTrigger 
                key={platform.id} 
                value={platform.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-lg">{platform.icon}</span>
                <span className="hidden sm:inline">{platform.name}</span>
                <Badge 
                  variant={charStatus.status === 'error' ? 'destructive' : 
                          charStatus.status === 'warning' ? 'outline' : 'secondary'}
                  className="text-xs ml-1"
                >
                  {charStatus.count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Preview Content */}
        <div className={cn(
          "mt-6 rounded-lg border bg-gray-50 p-6",
          viewMode === 'mobile' ? "max-w-sm mx-auto" : "w-full"
        )}>
          <ScrollArea className="h-[600px]">
            {enabledPlatforms.map(platform => (
              <TabsContent 
                key={platform.id} 
                value={platform.id}
                className="mt-0 focus-visible:outline-none"
              >
                <div className={cn(
                  "transition-all duration-200",
                  viewMode === 'mobile' ? "max-w-sm mx-auto" : "max-w-2xl mx-auto"
                )}>
                  {renderPreview(platform)}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </div>
      </Tabs>

      {/* Character Count Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {enabledPlatforms.map(platform => {
          const charStatus = getCharacterStatus(platform);
          return (
            <div 
              key={platform.id}
              className={cn(
                "p-3 rounded-lg border text-center",
                charStatus.status === 'error' ? "border-red-200 bg-red-50" :
                charStatus.status === 'warning' ? "border-yellow-200 bg-yellow-50" :
                "border-green-200 bg-green-50"
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">{platform.icon}</span>
                <span className="font-medium text-sm">{platform.name}</span>
              </div>
              <div className={cn(
                "text-xs",
                charStatus.status === 'error' ? "text-red-700" :
                charStatus.status === 'warning' ? "text-yellow-700" :
                "text-green-700"
              )}>
                {charStatus.count} / {platform.limit}
              </div>
              {charStatus.status === 'error' && (
                <div className="text-xs text-red-600 mt-1">
                  Over limit by {charStatus.count - platform.limit}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}