import { Bell, Search, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut } = useAuth();
  
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
      {/* Main Header */}
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Breadcrumb />
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-lg mx-8">
          <AdvancedSearch 
            placeholder="Tìm kiếm bài viết, lịch trình... (⌘K)"
            className="w-full"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <CreatePostDialog>
            <Button className="btn-premium h-9 font-medium">
              + Tạo bài viết
            </Button>
          </CreatePostDialog>

          <ThemeToggle />
          
          <NotificationDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-primary text-white text-sm">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mr-6 bg-card/95 backdrop-blur-md border-border/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.display_name || 'Người dùng'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                💳
                <span className="ml-2">Thanh toán</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}