import React from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePullToRefresh } from '@/hooks/use-mobile';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const { isRefreshing, pullDistance, handlers } = usePullToRefresh(onRefresh);

  const refreshProgress = Math.min(pullDistance / 50, 1);
  const shouldShowIndicator = pullDistance > 10;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...handlers}
    >
      {/* Pull indicator */}
      {shouldShowIndicator && (
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200"
          style={{
            height: `${Math.min(pullDistance, 60)}px`,
            opacity: refreshProgress,
          }}
        >
          <div className="flex items-center space-x-2 text-primary">
            <RotateCcw
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isRefreshing && "animate-spin",
                !isRefreshing && `rotate-${Math.floor(refreshProgress * 360)}`
              )}
              style={{
                transform: !isRefreshing ? `rotate(${refreshProgress * 360}deg)` : undefined
              }}
            />
            <span className="text-sm font-medium">
              {isRefreshing 
                ? 'Refreshing...' 
                : pullDistance > 50 
                  ? 'Release to refresh' 
                  : 'Pull to refresh'
              }
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.min(pullDistance, 60)}px)` : undefined
        }}
      >
        {children}
      </div>
    </div>
  );
}