import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { FloatingActionButton } from "@/components/mobile/FloatingActionButton";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isMobile } = useMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <main className="pt-14 pb-20 px-4">
          {children}
        </main>
        <MobileBottomNav />
        <FloatingActionButton />
      </div>
    );
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Mobile Header - Shown only on mobile */}
          <div className="lg:hidden">
            <MobileHeader />
          </div>
          
          {/* Desktop Header - Shown only on desktop */}
          <div className="hidden lg:block">
            <Header />
          </div>
          
          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </main>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}