import { 
  Calendar, 
  BarChart3, 
  PenTool, 
  Settings, 
  Users, 
  Home,
  Plus,
  Zap,
  Target
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { title: "Trang chủ", url: "/", icon: Home },
  { title: "Lịch trình", url: "/calendar", icon: Calendar },
  { title: "Tạo bài viết", url: "/create", icon: PenTool },
  { title: "Phân tích", url: "/analytics", icon: BarChart3 },
  { title: "Tài khoản MXH", url: "/accounts", icon: Users },
];

const quickActions = [
  { title: "Tạo nhanh", url: "/quick-create", icon: Plus },
  { title: "Tăng tương tác", url: "/boost", icon: Zap },
  { title: "Mục tiêu", url: "/goals", icon: Target },
];

const settingsItems = [
  { title: "Cài đặt", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClass = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      className={`border-r border-border/50 ${isCollapsed ? "w-16" : "w-72"}`}
      collapsible="icon"
    >
      <SidebarContent className="bg-card/30 backdrop-blur-md">
        {/* Quick Create Button */}
        <div className="p-4">
          <Button 
            className="w-full btn-premium rounded-lg h-12 font-medium"
            size={isCollapsed ? "icon" : "default"}
          >
            <Plus className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Tạo bài viết</span>}
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Điều hướng chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 px-4">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center space-x-3 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Thao tác nhanh
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-4">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center space-x-3 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings - Bottom */}
        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-12 px-4">
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center space-x-3 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Upgrade Banner */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="card-premium p-4 text-center">
              <div className="mb-3">
                <Zap className="h-8 w-8 text-warning mx-auto" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Nâng cấp Pro</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Mở khóa tính năng cao cấp
              </p>
              <Button size="sm" className="w-full btn-premium text-xs h-8">
                Nâng cấp ngay
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}