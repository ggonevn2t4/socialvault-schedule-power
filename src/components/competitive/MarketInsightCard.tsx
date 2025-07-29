import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { MarketInsight } from '@/hooks/useCompetitiveIntelligence';
import { formatDistanceToNow } from 'date-fns';

interface MarketInsightCardProps {
  insight: MarketInsight;
}

export function MarketInsightCard({ insight }: MarketInsightCardProps) {
  const getImpactIcon = () => {
    switch (insight.impact_level) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4 text-warning" />;
      case 'low':
        return <Info className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getImpactColor = () => {
    switch (insight.impact_level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{insight.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{insight.category}</Badge>
              <Badge variant={getImpactColor() as any}>
                {getImpactIcon()}
                <span className="ml-1 capitalize">{insight.impact_level} Impact</span>
              </Badge>
              {insight.confidence_score && (
                <Badge variant="secondary">
                  {Math.round(insight.confidence_score * 100)}% Confidence
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {insight.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {insight.description}
          </p>
        )}
        
        {Object.keys(insight.data_points).length > 0 && (
          <div className="space-y-2 mb-3">
            <h4 className="text-sm font-medium">Key Data Points:</h4>
            <div className="grid gap-2">
              {Object.entries(insight.data_points).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {insight.sources.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Sources:</h4>
            <div className="text-xs text-muted-foreground">
              {insight.sources.slice(0, 2).join(', ')}
              {insight.sources.length > 2 && ` +${insight.sources.length - 2} more`}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Generated {formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
}