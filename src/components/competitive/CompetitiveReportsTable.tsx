import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { CompetitiveReport } from '@/hooks/useCompetitiveIntelligence';

interface CompetitiveReportsTableProps {
  reports: CompetitiveReport[];
}

export function CompetitiveReportsTable({ reports }: CompetitiveReportsTableProps) {
  const getReportTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'comprehensive':
        return 'default';
      case 'content_analysis':
        return 'secondary';
      case 'market_trends':
        return 'outline';
      case 'competitor_profile':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold">No reports generated</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first competitive analysis report
        </p>
        <Button className="mt-4">
          Generate Report
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Competitors</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="font-medium">{report.report_name}</div>
              </TableCell>
              <TableCell>
                <Badge variant={getReportTypeColor(report.report_type) as any}>
                  {report.report_type.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {report.competitors.length} competitor{report.competitors.length !== 1 ? 's' : ''}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {report.time_period.start && report.time_period.end
                    ? `${new Date(report.time_period.start).toLocaleDateString()} - ${new Date(report.time_period.end).toLocaleDateString()}`
                    : 'Custom period'
                  }
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={report.is_shared ? 'default' : 'secondary'}>
                  {report.is_shared ? 'Shared' : 'Private'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      View Report
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}