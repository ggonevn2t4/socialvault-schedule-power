import { X, LogOut, HelpCircle, Crown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navigationSections = [
  {
    label: "CHÍNH",
    items: [
      { title: "Trang chủ", url: "/", icon: "🏠", badge: null },
      { title: "Lịch trình", url: "/calendar", icon: "📅", badge: null },
      { title: "Bài viết", url: "/posts", icon: "📝", badge: 3 },
      { title: "Phân tích", url: "/analytics", icon: "📊", badge: null },
    ]
  },
  {
    label: "CÔNG CỤ",
    items: [
      { title: "Thư viện nội dung", url: "/content-library", icon: "📁", badge: null },
      { title: "Phân tích đối thủ", url: "/competitors", icon: "🎯", badge: 2 },
      { title: "RSS Feeds", url: "/rss-feeds", icon: "📡", badge: null },
    ]
  },
  {
    label: "NHÓM",
    items: [
      { title: "Thành viên", url: "/team", icon: "👥", badge: null },
      { title: "Quy trình duyệt", url: "/approval", icon: "✅", badge: 1 },
      { title: "Hướng dẫn thương hiệu", url: "/brand-guidelines", icon: "🎨", badge: null },
    ]
  },
  {
    label: "CÀI ĐẶT",
    items: [
      { title: "Tài khoản liên kết", url: "/connected-accounts", icon: "🔗", badge: null },
      { title: "Thanh toán", url: "/billing", icon: "💳", badge: null },
      { title: "Hồ sơ", url: "/profile", icon: "👤", badge: null },
      { title: "Tích hợp", url: "/integrations", icon: "⚙️", badge: null },
    ]
  }
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-card/95 backdrop-blur-md border-r border-border/50 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">SV</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SocialVault
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center space-x-3 p-4 bg-accent/20 rounded-xl">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-primary text-white font-medium">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {user?.user_metadata?.display_name || 'Người dùng'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-warning/10 text-warning border-warning/20 mt-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {navigationSections.map((section) => (
              <div key={section.label} className="mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      onClick={handleLinkClick}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                        isActive(item.url)
                          ? "bg-primary/10 text-primary border-r-4 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="bg-destructive/10 text-destructive border-destructive/20 text-xs h-5 min-w-5 flex items-center justify-center"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-muted-foreground hover:text-foreground"
              onClick={handleLinkClick}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Trợ giúp & Hỗ trợ
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start h-12 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}