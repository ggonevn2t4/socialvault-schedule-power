import { useState, useEffect, useRef } from "react";
import { Search, Command, Calendar, FileText, Users, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

const searchSuggestions: SearchSuggestion[] = [
  {
    id: "create-post",
    title: "Tạo bài viết mới",
    description: "Tạo nội dung cho mạng xã hội",
    icon: FileText,
    action: () => console.log("Create post"),
    category: "Hành động"
  },
  {
    id: "calendar",
    title: "Xem lịch trình",
    description: "Quản lý lịch đăng bài",
    icon: Calendar,
    action: () => console.log("Open calendar"),
    category: "Điều hướng"
  },
  {
    id: "team",
    title: "Quản lý nhóm",
    description: "Thành viên và quyền hạn",
    icon: Users,
    action: () => console.log("Open team"),
    category: "Điều hướng"
  },
  {
    id: "settings",
    title: "Cài đặt",
    description: "Tùy chỉnh ứng dụng",
    icon: Settings,
    action: () => console.log("Open settings"),
    category: "Điều hướng"
  }
];

interface AdvancedSearchProps {
  className?: string;
  placeholder?: string;
  showShortcut?: boolean;
}

export function AdvancedSearch({ 
  className = "", 
  placeholder = "Tìm kiếm...",
  showShortcut = true 
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState(searchSuggestions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSuggestions(searchSuggestions);
    } else {
      const filtered = searchSuggestions.filter(
        suggestion =>
          suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions[selectedIndex]) {
        handleSelectSuggestion(filteredSuggestions[selectedIndex]);
      }
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    suggestion.action();
    setIsOpen(false);
    setQuery("");
    
    // Navigation logic based on suggestion
    switch (suggestion.id) {
      case "calendar":
        navigate("/calendar");
        break;
      case "team":
        navigate("/team");
        break;
      case "settings":
        navigate("/more");
        break;
      default:
        break;
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  };

  // Group suggestions by category
  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  return (
    <>
      {/* Search Input */}
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          className="pl-10 pr-20 bg-background/50 border-border/50 cursor-pointer"
          onClick={() => setIsOpen(true)}
          readOnly
        />
        {showShortcut && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs bg-muted/50 border-0 px-2 py-1">
              <Command className="h-3 w-3 mr-1" />
              K
            </Badge>
          </div>
        )}
      </div>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b border-border/50">
            <DialogTitle className="text-left">Tìm kiếm nhanh</DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={inputRef}
                placeholder="Tìm kiếm bài viết, lịch trình, cài đặt..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 border-0 focus:ring-0 text-base"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedSuggestions).map(([category, suggestions]) => (
              <div key={category} className="px-2 py-2">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {suggestions.map((suggestion, index) => {
                  const globalIndex = filteredSuggestions.indexOf(suggestion);
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = suggestion.icon;
                  
                  return (
                    <Button
                      key={suggestion.id}
                      variant="ghost"
                      className={`w-full justify-start h-auto p-4 text-left ${
                        isSelected ? "bg-accent" : ""
                      }`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {suggestion.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            ))}
            
            {filteredSuggestions.length === 0 && query && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p>Không tìm thấy kết quả cho "{query}"</p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-3 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Sử dụng ↑ ↓ để điều hướng, Enter để chọn</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">⌘K</Badge>
                <span>để mở</span>
                <Badge variant="outline" className="text-xs">Esc</Badge>
                <span>để đóng</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}