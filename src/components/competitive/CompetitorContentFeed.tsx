import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Heart, MessageCircle, Share, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CompetitorContentProps {
  content: Array<{
    id: string;
    platform: string;
    content_type: string;
    content_text?: string;
    media_urls: string[];
    engagement_metrics: Record<string, any>;
    post_url?: string;
    published_at?: string;
    sentiment_score?: number;
    hashtags: string[];
    competitor_monitoring: {
      competitor_id: string;
      platform: string;
      account_handle: string;
      competitors: {
        name: string;
        logo_url?: string;
      };
    };
  }>;
}

export function CompetitorContentFeed({ content }: CompetitorContentProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'bg-blue-500';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'linkedin':
        return 'bg-blue-700';
      default:
        return 'bg-gray-500';
    }
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return 'secondary';
    if (score > 0.1) return 'default';
    if (score < -0.1) return 'destructive';
    return 'secondary';
  };

  const getSentimentLabel = (score?: number) => {
    if (!score) return 'Neutral';
    if (score > 0.1) return 'Positive';
    if (score < -0.1) return 'Negative';
    return 'Neutral';
  };

  if (content.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold">No content monitored yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Content will appear here as competitors post on social media
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={item.competitor_monitoring.competitors.logo_url} 
                      alt={item.competitor_monitoring.competitors.name}
                    />
                    <AvatarFallback>
                      {item.competitor_monitoring.competitors.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getPlatformColor(item.platform)} border-2 border-background`} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {item.competitor_monitoring.competitors.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    @{item.competitor_monitoring.account_handle} • {item.platform}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {item.content_type}
                </Badge>
                {item.sentiment_score !== undefined && (
                  <Badge variant={getSentimentColor(item.sentiment_score) as any} className="text-xs">
                    {getSentimentLabel(item.sentiment_score)}
                  </Badge>
                )}
                {item.post_url && (
                  <a
                    href={item.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {item.content_text && (
              <p className="text-sm mb-3 line-clamp-3">
                {item.content_text}
              </p>
            )}

            {item.media_urls.length > 0 && (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2">
                  {item.media_urls.slice(0, 4).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Content media"
                      className="rounded-md object-cover aspect-video"
                    />
                  ))}
                </div>
              </div>
            )}

            {item.hashtags.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {item.hashtags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {item.hashtags.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.hashtags.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                {item.engagement_metrics.likes && (
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{item.engagement_metrics.likes}</span>
                  </div>
                )}
                {item.engagement_metrics.comments && (
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{item.engagement_metrics.comments}</span>
                  </div>
                )}
                {item.engagement_metrics.shares && (
                  <div className="flex items-center space-x-1">
                    <Share className="h-3 w-3" />
                    <span>{item.engagement_metrics.shares}</span>
                  </div>
                )}
              </div>
              {item.published_at && (
                <span>
                  {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}