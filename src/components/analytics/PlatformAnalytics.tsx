import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DateRange } from 'react-day-picker';

interface PlatformAnalyticsProps {
  dateRange: DateRange | undefined;
}

export function PlatformAnalytics({ dateRange }: PlatformAnalyticsProps) {
  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Platform-specific analytics for Facebook, Instagram, LinkedIn, and Twitter coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}