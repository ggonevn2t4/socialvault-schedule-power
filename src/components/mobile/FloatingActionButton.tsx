import React, { useState } from 'react';
import { Plus, Camera, FileText, Calendar, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

interface FABAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  path?: string;
  onClick?: () => void;
  color?: string;
}

const actions: FABAction[] = [
  {
    id: 'photo',
    icon: Camera,
    label: 'Photo Post',
    path: '/create?type=photo',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'text',
    icon: FileText,
    label: 'Text Post',
    path: '/create?type=text',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'gallery',
    icon: Image,
    label: 'Gallery',
    path: '/create?type=gallery',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'schedule',
    icon: Calendar,
    label: 'Schedule',
    path: '/create?type=schedule',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
];

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const haptic = useHapticFeedback();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    haptic.medium();
  };

  const handleActionClick = () => {
    setIsExpanded(false);
    haptic.light();
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col space-y-3 mb-3 transition-all duration-300",
        isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          const ActionButton = (
            <Button
              size="lg"
              className={cn(
                "h-12 w-12 rounded-full shadow-lg transition-all duration-200",
                "animate-fade-in",
                action.color || "bg-secondary hover:bg-secondary/90"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              onClick={() => {
                handleActionClick();
                action.onClick?.();
              }}
            >
              <Icon className="h-5 w-5 text-white" />
            </Button>
          );

          return (
            <div key={action.id} className="relative group">
              {action.path ? (
                <Link to={action.path} onClick={handleActionClick}>
                  {ActionButton}
                </Link>
              ) : (
                ActionButton
              )}
              
              {/* Label */}
              <div className={cn(
                "absolute right-14 top-1/2 transform -translate-y-1/2 transition-all duration-200",
                "bg-foreground text-background text-xs py-1 px-2 rounded-md whitespace-nowrap",
                "opacity-0 group-hover:opacity-100 pointer-events-none"
              )}>
                {action.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={handleToggle}
        className={cn(
          "h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-200",
          "border-4 border-background",
          isExpanded && "rotate-45"
        )}
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Button>
    </div>
  );
}