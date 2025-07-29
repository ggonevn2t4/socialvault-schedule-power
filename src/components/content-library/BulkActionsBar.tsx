import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Share, 
  Move, 
  Copy, 
  Star, 
  Archive, 
  Tag, 
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
  onClearSelection: () => void;
}

export function BulkActionsBar({ 
  selectedCount, 
  onBulkAction, 
  onClearSelection 
}: BulkActionsBarProps) {
  return (
    <Card className="mx-6 mb-4 border border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-primary">
                {selectedCount} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Primary Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('download')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('share')}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('move')}
              >
                <Move className="h-4 w-4 mr-2" />
                Move
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('copy')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onBulkAction('star')}>
                    <Star className="h-4 w-4 mr-2" />
                    Add to Starred
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBulkAction('unstar')}>
                    <Star className="h-4 w-4 mr-2" />
                    Remove from Starred
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBulkAction('tag')}>
                    <Tag className="h-4 w-4 mr-2" />
                    Add Tags
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBulkAction('archive')}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onBulkAction('delete')}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Total size: 24.8 MB</span>
            <span>Mixed file types</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}