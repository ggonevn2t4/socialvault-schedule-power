import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentItem, ThumbnailSize } from '@/pages/ContentLibrary';
import { 
  Star, 
  MoreHorizontal, 
  Download, 
  Edit, 
  Trash2, 
  Share,
  Eye,
  TrendingUp,
  Play,
  FileText,
  Image as ImageIcon,
  Volume2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface ContentGridProps {
  items: ContentItem[];
  thumbnailSize: ThumbnailSize;
  selectedItems: string[];
  onItemSelect: (itemId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

const sizeClasses = {
  small: 'w-32 h-24',
  medium: 'w-48 h-36',
  large: 'w-64 h-48'
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getTypeIcon = (type: ContentItem['type']) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="h-4 w-4" />;
    case 'video':
      return <Play className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    case 'audio':
      return <Volume2 className="h-4 w-4" />;
    case 'gif':
      return <ImageIcon className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function ContentGrid({ 
  items, 
  thumbnailSize, 
  selectedItems, 
  onItemSelect, 
  onSelectAll 
}: ContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <div className="p-6">
      {/* Select All Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedItems.length > 0 ? `${selectedItems.length} selected` : `${items.length} items`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid gap-4 ${
        thumbnailSize === 'small' ? 'grid-cols-6 xl:grid-cols-8' :
        thumbnailSize === 'medium' ? 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
        'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const isHovered = hoveredItem === item.id;

          return (
            <Card
              key={item.id}
              className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Thumbnail */}
              <div className={`relative ${sizeClasses[thumbnailSize]} bg-gradient-subtle`}>
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onItemSelect(item.id, checked as boolean)}
                    className="bg-white/90 data-[state=checked]:bg-primary"
                  />
                </div>

                {/* Type Icon */}
                <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded">
                  {getTypeIcon(item.type)}
                </div>

                {/* Star */}
                {item.starred && (
                  <div className="absolute bottom-2 right-2">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                  </div>
                )}

                {/* Performance Badge */}
                {item.performance && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-black/70 text-white border-none">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {item.performance.engagement}%
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(item.size)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}