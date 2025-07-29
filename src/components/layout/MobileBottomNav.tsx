import { Home, Calendar, Plus, BarChart3, Users } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Schedule', path: '/calendar' },
  { icon: Plus, label: 'Create', path: '/create', isAction: true },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Team', path: '/team' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [createPressed, setCreatePressed] = useState(false);

  const handleCreatePress = () => {
    setCreatePressed(true);
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setTimeout(() => setCreatePressed(false), 150);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t border-border/50" />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around h-16 px-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          if (item.isAction) {
            return (
              <Button
                key={item.path}
                size="lg"
                className={cn(
                  "h-12 w-12 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200",
                  createPressed && "scale-95"
                )}
                onTouchStart={handleCreatePress}
                asChild
              >
                <NavLink to={item.path}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </NavLink>
              </Button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-3 py-2 transition-all duration-200",
                "touch-manipulation select-none",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-all duration-200",
                active && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  active && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-200",
                active && "text-primary"
              )}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}