import { useState } from "react";
import { 
  Home,
  Calendar, 
  FileText, 
  BarChart3, 
  FolderOpen,
  Users,
  Rss,
  Shield,
  Workflow,
  Palette,
  Link,
  CreditCard,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
  HelpCircle,
  LogOut,
  Crown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationSections = [
  {
    label: "CHÍNH",
    items: [
      { title: "Trang chủ", url: "/", icon: Home, badge: null },
      { title: "Lịch trình", url: "/calendar", icon: Calendar, badge: null },
      { title: "Bài viết", url: "/posts", icon: FileText, badge: 3 },
      { title: "Phân tích", url: "/analytics", icon: BarChart3, badge: null },
    ]
  },
  {
    label: "CÔNG CỤ",
    items: [
      { title: "Thư viện nội dung", url: "/content-library", icon: FolderOpen, badge: null },
      { title: "Phân tích đối thủ", url: "/competitive-intelligence", icon: Users, badge: 2 },
      { title: "RSS Feeds", url: "/rss-feeds", icon: Rss, badge: null },
    ]
  },
  {
    label: "NHÓM",
    items: [
      { title: "Thành viên", url: "/team", icon: Users, badge: null },
      { title: "Quy trình duyệt", url: "/approval", icon: Workflow, badge: 1 },
      { title: "Hướng dẫn thương hiệu", url: "/brand-guidelines", icon: Palette, badge: null },
    ]
  },
  {
    label: "CÀI ĐẶT",
    items: [
      { title: "Thương hiệu", url: "/brand-guidelines", icon: Palette, badge: null },
      { title: "Tài khoản liên kết", url: "/connected-accounts", icon: Link, badge: null },
      { title: "Thanh toán", url: "/billing", icon: CreditCard, badge: null },
      { title: "Hồ sơ", url: "/profile", icon: User, badge: null },
      { title: "Tích hợp", url: "/integrations", icon: Settings, badge: null },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [expandedSections, setExpandedSections] = useState<string[]>(["CHÍNH", "CÔNG CỤ"]);
  
  const isCollapsed = state === "collapsed";
  
  const isActive = (path: string) => currentPath === path;
  
  const getNavClass = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-4 border-primary hover:bg-primary/15" 
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50";

  const toggleSection = (sectionLabel: string) => {
    if (isCollapsed) return; // Don't toggle when collapsed
    
    setExpandedSections(prev => 
      prev.includes(sectionLabel) 
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Auto-expand section containing active route
  const activeSectionLabel = navigationSections.find(section => 
    section.items.some(item => isActive(item.url))
  )?.label;

  return (
    <Sidebar 
      className={`border-r border-border/50 ${isCollapsed ? "w-16" : "w-80"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-card/30 backdrop-blur-md flex flex-col h-full">
        {/* Logo Section */}
        <div className={`p-6 ${isCollapsed ? "p-3" : ""}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  SocialVault
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && user && (
          <div className="px-6 pb-6">
            <div className="flex items-center space-x-3 p-4 bg-accent/20 rounded-xl">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                <AvatarFallback className="bg-gradient-primary text-white text-sm font-medium">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.user_metadata?.display_name || 'Người dùng'}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-warning/10 text-warning border-warning/20">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 px-3 space-y-2">
          {navigationSections.map((section) => {
            const isExpanded = isCollapsed || expandedSections.includes(section.label) || activeSectionLabel === section.label;
            
            return (
              <Collapsible
                key={section.label}
                open={isExpanded}
                onOpenChange={() => toggleSection(section.label)}
              >
                {!isCollapsed && (
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-3 h-auto font-medium text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span className="tracking-wider">{section.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                )}
                
                <CollapsibleContent className="space-y-1">
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1">
                        {section.items.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="h-12 px-4">
                              <NavLink 
                                to={item.url} 
                                className={`flex items-center space-x-3 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                              >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!isCollapsed && (
                                  <>
                                    <span className="font-medium flex-1">{item.title}</span>
                                    {item.badge && (
                                      <Badge 
                                        variant="secondary" 
                                        className="bg-destructive/10 text-destructive border-destructive/20 text-xs h-5 min-w-5 flex items-center justify-center"
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-3 border-t border-border/50">
          {/* Upgrade Button */}
          {!isCollapsed && (
            <div className="card-premium p-4 text-center space-y-3">
              <div className="w-10 h-10 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Nâng cấp Premium</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Mở khóa tính năng cao cấp và tăng giới hạn
                </p>
                <Button size="sm" className="w-full btn-premium text-xs h-8">
                  Nâng cấp ngay
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Help & Support */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-muted-foreground hover:text-foreground ${isCollapsed ? "px-3" : "px-4"}`}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="ml-3 text-sm">Trợ giúp & Hỗ trợ</span>}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={`w-full justify-start h-10 text-muted-foreground hover:text-destructive ${isCollapsed ? "px-3" : "px-4"}`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="ml-3 text-sm">Đăng xuất</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}