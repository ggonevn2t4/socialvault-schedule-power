import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, FileText, BarChart3, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const bottomNavItems = [
  { 
    title: "Trang chủ", 
    url: "/", 
    icon: Home, 
    badge: null 
  },
  { 
    title: "Lịch trình", 
    url: "/calendar", 
    icon: Calendar, 
    badge: null 
  },
  { 
    title: "Bài viết", 
    url: "/posts", 
    icon: FileText, 
    badge: 3 
  },
  { 
    title: "Phân tích", 
    url: "/analytics", 
    icon: BarChart3, 
    badge: null 
  },
  { 
    title: "Thêm", 
    url: "/more", 
    icon: MoreHorizontal, 
    badge: null 
  },
];

export function MobileBottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/more") {
      // More tab is active for any route not in the main bottom nav
      return !bottomNavItems.slice(0, 4).some(item => currentPath === item.url);
    }
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 safe-area-pb lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item) => {
          const active = isActive(item.url);
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center justify-center min-h-[44px] px-3 py-2 rounded-lg transition-all duration-200 relative ${
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground border-0 text-[10px] h-4 min-w-4 flex items-center justify-center p-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}