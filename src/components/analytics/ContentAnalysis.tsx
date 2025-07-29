import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DateRange } from 'react-day-picker';

interface ContentAnalysisProps {
  dateRange: DateRange | undefined;
}

export function ContentAnalysis({ dateRange }: ContentAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Content Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content performance analysis, hashtag tracking, and competitor benchmarking coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}