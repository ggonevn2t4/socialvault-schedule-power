import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FolderPlus, 
  Star, 
  Archive, 
  Hash, 
  Search,
  ChevronRight,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ContentLibrarySidebarProps {
  currentFolder: string | null;
  onFolderChange: (folder: string | null) => void;
}

interface FolderItem {
  id: string;
  name: string;
  color: string;
  count: number;
  children?: FolderItem[];
}

const mockFolders: FolderItem[] = [
  {
    id: 'campaigns',
    name: 'Campaigns',
    color: 'bg-blue-500',
    count: 145,
    children: [
      { id: 'summer-2024', name: 'Summer 2024', color: 'bg-blue-400', count: 67 },
      { id: 'winter-sale', name: 'Winter Sale', color: 'bg-blue-400', count: 43 },
      { id: 'brand-awareness', name: 'Brand Awareness', color: 'bg-blue-400', count: 35 }
    ]
  },
  {
    id: 'brands',
    name: 'Brands',
    color: 'bg-purple-500',
    count: 89,
    children: [
      { id: 'main-brand', name: 'Main Brand', color: 'bg-purple-400', count: 56 },
      { id: 'sub-brand-a', name: 'Sub Brand A', color: 'bg-purple-400', count: 23 },
      { id: 'sub-brand-b', name: 'Sub Brand B', color: 'bg-purple-400', count: 10 }
    ]
  },
  {
    id: 'content-types',
    name: 'Content Types',
    color: 'bg-green-500',
    count: 234,
    children: [
      { id: 'social-posts', name: 'Social Posts', color: 'bg-green-400', count: 156 },
      { id: 'blog-images', name: 'Blog Images', color: 'bg-green-400', count: 45 },
      { id: 'product-photos', name: 'Product Photos', color: 'bg-green-400', count: 33 }
    ]
  }
];

const mockTags = [
  { name: 'summer', count: 45, color: 'bg-orange-100 text-orange-800' },
  { name: 'product', count: 34, color: 'bg-blue-100 text-blue-800' },
  { name: 'hero', count: 28, color: 'bg-purple-100 text-purple-800' },
  { name: 'campaign', count: 67, color: 'bg-green-100 text-green-800' },
  { name: 'social', count: 89, color: 'bg-pink-100 text-pink-800' }
];

export function ContentLibrarySidebar({ currentFolder, onFolderChange }: ContentLibrarySidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['campaigns', 'brands']);
  const [tagSearch, setTagSearch] = useState('');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const filteredTags = mockTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Library</h2>
          <Button variant="ghost" size="sm">
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Quick Access */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Access</h3>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-10"
            onClick={() => onFolderChange(null)}
          >
            <Folder className="h-4 w-4 mr-3" />
            All Content
            <Badge variant="secondary" className="ml-auto">1,247</Badge>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-10"
          >
            <Star className="h-4 w-4 mr-3 text-warning" />
            Starred
            <Badge variant="secondary" className="ml-auto">23</Badge>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-10"
          >
            <Archive className="h-4 w-4 mr-3 text-muted-foreground" />
            Archived
            <Badge variant="secondary" className="ml-auto">45</Badge>
          </Button>
        </div>

        {/* Folders */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {mockFolders.map((folder) => (
              <Collapsible
                key={folder.id}
                open={expandedFolders.includes(folder.id)}
                onOpenChange={() => toggleFolder(folder.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 px-2"
                  >
                    {expandedFolders.includes(folder.id) ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <div className={`w-3 h-3 rounded mr-3 ${folder.color}`} />
                    <span className="flex-1 text-left">{folder.name}</span>
                    <Badge variant="secondary" className="text-xs">{folder.count}</Badge>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1 ml-6">
                  {folder.children?.map((child) => (
                    <Button
                      key={child.id}
                      variant="ghost"
                      className="w-full justify-start h-9 px-2"
                      onClick={() => onFolderChange(child.id)}
                    >
                      <div className={`w-2 h-2 rounded mr-3 ${child.color}`} />
                      <span className="flex-1 text-left text-sm">{child.name}</span>
                      <Badge variant="outline" className="text-xs">{child.count}</Badge>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
            <Button variant="ghost" size="sm">
              <Hash className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className={`text-xs cursor-pointer hover:opacity-80 ${tag.color}`}
              >
                #{tag.name}
                <span className="ml-1">({tag.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}