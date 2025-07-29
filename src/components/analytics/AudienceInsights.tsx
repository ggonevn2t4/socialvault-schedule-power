import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DateRange } from 'react-day-picker';

interface AudienceInsightsProps {
  dateRange: DateRange | undefined;
}

export function AudienceInsights({ dateRange }: AudienceInsightsProps) {
  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Demographics, activity patterns, and audience growth analytics coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}