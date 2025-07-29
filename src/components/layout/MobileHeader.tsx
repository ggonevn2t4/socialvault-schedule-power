import { useState, useEffect } from 'react';
import { Search, Bell, Menu, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { NotificationDropdown } from '@/components/NotificationDropdown';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  onMenuClick?: () => void;
}

export function MobileHeader({ title = "SocialVault", showSearch = true, onMenuClick }: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsVoiceActive(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsVoiceActive(false);
    };

    recognition.onerror = () => {
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognition.start();
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 md:hidden transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="flex items-center justify-between h-14 px-4 safe-area-top">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          {onMenuClick && (
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {!searchFocused && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-lg font-semibold text-foreground truncate">
                {title}
              </h1>
            </div>
          )}
        </div>

        {/* Search bar (when focused) */}
        {searchFocused && showSearch && (
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setSearchFocused(false)}
                className="pl-10 pr-12 h-10"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={startVoiceSearch}
                className={cn(
                  "absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0",
                  isVoiceActive && "text-destructive animate-pulse"
                )}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {!searchFocused && showSearch && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSearchFocused(true)}
              className="min-h-[44px] min-w-[44px]"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative min-h-[44px] min-w-[44px]"
          >
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {user && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                {user?.email ? getInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}