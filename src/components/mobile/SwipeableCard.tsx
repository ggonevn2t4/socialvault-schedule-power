import React, { useState, useRef } from 'react';
import { Trash2, Edit, Archive, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-mobile';

interface SwipeAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  bgColor: string;
  action: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onShare?: () => void;
  className?: string;
  swipeThreshold?: number;
}

export function SwipeableCard({
  children,
  onDelete,
  onEdit,
  onArchive,
  onShare,
  className,
  swipeThreshold = 80,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const haptic = useHapticFeedback();

  const leftActions: SwipeAction[] = [
    onEdit && {
      id: 'edit',
      icon: Edit,
      label: 'Edit',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      action: onEdit,
    },
    onShare && {
      id: 'share',
      icon: Share,
      label: 'Share',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      action: onShare,
    },
  ].filter(Boolean) as SwipeAction[];

  const rightActions: SwipeAction[] = [
    onArchive && {
      id: 'archive',
      icon: Archive,
      label: 'Archive',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      action: onArchive,
    },
    onDelete && {
      id: 'delete',
      icon: Trash2,
      label: 'Delete',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      action: onDelete,
    },
  ].filter(Boolean) as SwipeAction[];

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartX;
    const maxSwipe = 120;
    
    // Constrain the swipe distance
    const constrainedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setTranslateX(constrainedDiff);

    // Show actions when threshold is reached
    if (Math.abs(constrainedDiff) > swipeThreshold && !showActions) {
      setShowActions(true);
      haptic.light();
    } else if (Math.abs(constrainedDiff) <= swipeThreshold && showActions) {
      setShowActions(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(translateX) > swipeThreshold) {
      // Trigger action
      if (translateX > 0 && leftActions[0]) {
        haptic.medium();
        leftActions[0].action();
      } else if (translateX < 0 && rightActions[0]) {
        haptic.medium();
        rightActions[0].action();
      }
    }
    
    // Reset position
    setTranslateX(0);
    setShowActions(false);
  };

  const renderActions = (actions: SwipeAction[], side: 'left' | 'right') => {
    if (actions.length === 0) return null;

    const isVisible = side === 'left' ? translateX > swipeThreshold : translateX < -swipeThreshold;
    
    return (
      <div
        className={cn(
          "absolute top-0 bottom-0 flex items-center justify-center w-20 transition-opacity duration-200",
          side === 'left' ? "left-0" : "right-0",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-lg",
                action.bgColor
              )}
            >
              <Icon className={cn("h-5 w-5", action.color)} />
              <span className={cn("text-xs font-medium mt-1", action.color)}>
                {action.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left actions */}
      {renderActions(leftActions, 'left')}
      
      {/* Right actions */}
      {renderActions(rightActions, 'right')}
      
      {/* Main card content */}
      <div
        ref={cardRef}
        className={cn(
          "transition-transform duration-200 touch-manipulation",
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}