import { useState } from "react";
import { Menu, Search, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { MobileSidebar } from "./MobileSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function MobileHeader() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40 lg:hidden">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left - Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Center - Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              SocialVault
            </h1>
          </div>

          {/* Right - Notifications & Avatar */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                {user?.email ? getInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Search Bar - Below header on mobile */}
        <div className="px-4 pb-3 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10 bg-background/50 border-border/50 h-9"
            />
          </div>
        </div>
      </header>

      {/* Desktop Header - Hidden on mobile */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40 hidden lg:block">
        <div className="flex items-center justify-between px-6 h-full">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bài viết, lịch trình... (⌘K)"
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <CreatePostDialog>
              <Button className="btn-premium h-9">
                + Tạo bài viết
              </Button>
            </CreatePostDialog>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Mobile FAB for Create Post */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <CreatePostDialog>
          <Button 
            size="icon"
            className="h-14 w-14 rounded-full btn-premium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl font-bold">+</span>
          </Button>
        </CreatePostDialog>
      </div>
    </>
  );
}