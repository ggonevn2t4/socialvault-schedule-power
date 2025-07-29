import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportingFeatures() {
  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Reporting Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Automated reports, white-label options, and custom report builder coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}