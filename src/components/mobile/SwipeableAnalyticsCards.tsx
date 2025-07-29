import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSwipeGesture, useHapticFeedback } from '@/hooks/use-mobile';

interface AnalyticsCard {
  id: string;
  title: string;
  description: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  data: number[];
}

const analyticsCards: AnalyticsCard[] = [
  {
    id: 'engagement',
    title: 'Engagement Rate',
    description: 'Average across all platforms',
    value: '4.2%',
    change: 12.5,
    trend: 'up',
    color: 'text-green-600',
    data: [65, 68, 72, 69, 75, 78, 82]
  },
  {
    id: 'reach',
    title: 'Total Reach',
    description: 'Last 7 days',
    value: '24.8K',
    change: -3.2,
    trend: 'down',
    color: 'text-blue-600',
    data: [120, 115, 118, 112, 108, 105, 102]
  },
  {
    id: 'followers',
    title: 'New Followers',
    description: 'This week',
    value: '342',
    change: 8.1,
    trend: 'up',
    color: 'text-purple-600',
    data: [45, 52, 48, 58, 62, 55, 65]
  },
  {
    id: 'clicks',
    title: 'Link Clicks',
    description: 'Total clicks this month',
    value: '1,234',
    change: 15.3,
    trend: 'up',
    color: 'text-orange-600',
    data: [200, 220, 245, 268, 295, 312, 334]
  },
  {
    id: 'shares',
    title: 'Shares',
    description: 'Content shared by users',
    value: '89',
    change: 5.7,
    trend: 'up',
    color: 'text-pink-600',
    data: [12, 15, 18, 16, 22, 25, 28]
  }
];

export function SwipeableAnalyticsCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const haptic = useHapticFeedback();

  const swipeGesture = useSwipeGesture(
    () => {
      // Swipe left - next card
      if (currentIndex < analyticsCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        haptic.light();
      }
    },
    () => {
      // Swipe right - previous card
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        haptic.light();
      }
    }
  );

  const goToCard = (index: number) => {
    setCurrentIndex(index);
    haptic.light();
  };

  const renderMiniChart = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => (
          <div
            key={index}
            className={cn("w-1 rounded-full transition-all duration-300", color.replace('text-', 'bg-'))}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '4px'
            }}
          />
        ))}
      </div>
    );
  };

  const currentCard = analyticsCards[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        {...swipeGesture}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {analyticsCards.map((card, index) => (
            <div key={card.id} className="w-full flex-shrink-0 px-1">
              <Card className="h-full touch-manipulation">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {card.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Value and Change */}
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">{card.value}</div>
                        <div className="flex items-center space-x-1">
                          {card.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : card.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span 
                            className={cn(
                              "text-sm font-medium",
                              card.trend === 'up' ? "text-green-600" : 
                              card.trend === 'down' ? "text-red-600" : 
                              "text-muted-foreground"
                            )}
                          >
                            {card.change > 0 ? '+' : ''}{card.change}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Mini Chart */}
                      <div className="w-24">
                        {renderMiniChart(card.data, card.color)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {analyticsCards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToCard(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200 touch-manipulation",
              index === currentIndex 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToCard(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Badge variant="outline" className="px-3 py-1">
          {currentIndex + 1} of {analyticsCards.length}
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToCard(Math.min(analyticsCards.length - 1, currentIndex + 1))}
          disabled={currentIndex === analyticsCards.length - 1}
          className="min-h-[44px]"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}