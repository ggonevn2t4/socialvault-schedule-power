import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Grid3x3, 
  List, 
  SlidersHorizontal, 
  Plus, 
  Upload,
  Settings2,
  Filter
} from 'lucide-react';
import { ViewMode, ThumbnailSize, SortOption } from '@/pages/ContentLibrary';

interface ContentLibraryHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  thumbnailSize: ThumbnailSize;
  onThumbnailSizeChange: (size: ThumbnailSize) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: (show: boolean) => void;
  onCreateContent: () => void;
}

export function ContentLibraryHeader({
  viewMode,
  onViewModeChange,
  thumbnailSize,
  onThumbnailSizeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  onCreateContent
}: ContentLibraryHeaderProps) {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Stats */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Library</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">1,247 files</Badge>
              <Badge variant="secondary">12.4 GB used</Badge>
              <Badge variant="secondary">3 folders</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={onCreateContent} className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Advanced Filters Toggle */}
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-created">Date Created</SelectItem>
                <SelectItem value="date-modified">Date Modified</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnail Size (only for grid view) */}
            {viewMode === 'grid' && (
              <Select value={thumbnailSize} onValueChange={(value) => onThumbnailSizeChange(value as ThumbnailSize)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Settings */}
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    File Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tags
                  </label>
                  <Input placeholder="Enter tags..." />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Date Range
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}