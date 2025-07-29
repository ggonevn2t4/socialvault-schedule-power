import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DateRange } from 'react-day-picker';

interface PerformanceChartsProps {
  dateRange: DateRange | undefined;
}

export function PerformanceCharts({ dateRange }: PerformanceChartsProps) {
  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Performance Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interactive charts coming soon - Line charts, bar charts, pie charts, heatmaps, scatter plots, and funnel charts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}