import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ContentLibraryHeader } from '@/components/content-library/ContentLibraryHeader';
import { ContentLibrarySidebar } from '@/components/content-library/ContentLibrarySidebar';
import { ContentGrid } from '@/components/content-library/ContentGrid';
import { ContentList } from '@/components/content-library/ContentList';
import { BulkActionsBar } from '@/components/content-library/BulkActionsBar';
import { CreateContentModal } from '@/components/content-library/CreateContentModal';

export type ViewMode = 'grid' | 'list';
export type ThumbnailSize = 'small' | 'medium' | 'large';
export type SortOption = 'date-created' | 'date-modified' | 'performance' | 'alphabetical';

export interface ContentItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'gif';
  thumbnail: string;
  url: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  tags: string[];
  category: string;
  folder?: string;
  starred: boolean;
  archived: boolean;
  performance?: {
    views: number;
    engagement: number;
    shares: number;
  };
  usage: {
    platforms: string[];
    campaigns: string[];
  };
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

export default function ContentLibrary() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [thumbnailSize, setThumbnailSize] = useState<ThumbnailSize>('medium');
  const [sortBy, setSortBy] = useState<SortOption>('date-created');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Mock data for demonstration
  const mockContent: ContentItem[] = [
    {
      id: '1',
      name: 'Summer Campaign Hero Image',
      type: 'image',
      thumbnail: '/placeholder.svg',
      url: '/placeholder.svg',
      size: 2.5 * 1024 * 1024, // 2.5MB
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2024-01-20'),
      tags: ['summer', 'hero', 'campaign'],
      category: 'Marketing',
      folder: 'Summer 2024',
      starred: true,
      archived: false,
      performance: {
        views: 15420,
        engagement: 8.2,
        shares: 234
      },
      usage: {
        platforms: ['Instagram', 'Facebook'],
        campaigns: ['Summer Launch', 'Brand Awareness']
      },
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true
      }
    },
    {
      id: '2', 
      name: 'Product Demo Video',
      type: 'video',
      thumbnail: '/placeholder.svg',
      url: '/placeholder.svg',
      size: 45 * 1024 * 1024, // 45MB
      createdAt: new Date('2024-01-10'),
      modifiedAt: new Date('2024-01-18'),
      tags: ['product', 'demo', 'video'],
      category: 'Product',
      folder: 'Product Demos',
      starred: false,
      archived: false,
      performance: {
        views: 8940,
        engagement: 12.7,
        shares: 156
      },
      usage: {
        platforms: ['YouTube', 'LinkedIn'],
        campaigns: ['Product Launch']
      },
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false
      }
    },
    {
      id: '3',
      name: 'Brand Guidelines PDF',
      type: 'document',
      thumbnail: '/placeholder.svg',
      url: '/placeholder.svg',
      size: 8.2 * 1024 * 1024, // 8.2MB
      createdAt: new Date('2024-01-05'),
      modifiedAt: new Date('2024-01-25'),
      tags: ['brand', 'guidelines', 'documentation'],
      category: 'Brand',
      folder: 'Brand Assets',
      starred: true,
      archived: false,
      usage: {
        platforms: ['Internal'],
        campaigns: ['Brand Consistency']
      },
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false
      }
    }
  ];

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action} on items:`, selectedItems);
    // Implement bulk actions
  };

  const handleItemSelect = (itemId: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(mockContent.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        {/* Sidebar */}
        <ContentLibrarySidebar 
          currentFolder={currentFolder}
          onFolderChange={setCurrentFolder}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <ContentLibraryHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            thumbnailSize={thumbnailSize}
            onThumbnailSizeChange={setThumbnailSize}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showAdvancedFilters={showAdvancedFilters}
            onToggleAdvancedFilters={setShowAdvancedFilters}
            onCreateContent={() => setShowCreateModal(true)}
          />

          {/* Bulk Actions Bar */}
          {selectedItems.length > 0 && (
            <BulkActionsBar
              selectedCount={selectedItems.length}
              onBulkAction={handleBulkAction}
              onClearSelection={() => setSelectedItems([])}
            />
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'grid' ? (
              <ContentGrid
                items={mockContent}
                thumbnailSize={thumbnailSize}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onSelectAll={handleSelectAll}
              />
            ) : (
              <ContentList
                items={mockContent}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onSelectAll={handleSelectAll}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </Layout>
  );
}