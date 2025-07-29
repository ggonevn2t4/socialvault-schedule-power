import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoginAttempt } from '@/hooks/useSecurity';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

interface LoginAttemptsTableProps {
  attempts: LoginAttempt[];
  loading: boolean;
}

export function LoginAttemptsTable({ attempts, loading }: LoginAttemptsTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No login attempts recorded</p>
      </div>
    );
  }

  const getStatusIcon = (status: string, isSuspicious: boolean) => {
    if (isSuspicious) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string, isSuspicious: boolean) => {
    if (isSuspicious) return <Badge variant="destructive">Suspicious</Badge>;
    
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'blocked':
        return <Badge variant="secondary">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attempts.map((attempt) => (
          <TableRow key={attempt.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(attempt.status, attempt.is_suspicious)}
                {getStatusBadge(attempt.status, attempt.is_suspicious)}
              </div>
            </TableCell>
            <TableCell className="font-medium">{attempt.email}</TableCell>
            <TableCell>
              {new Date(attempt.attempted_at).toLocaleString()}
            </TableCell>
            <TableCell>
              {attempt.location_city && attempt.location_country 
                ? `${attempt.location_city}, ${attempt.location_country}`
                : 'Unknown'
              }
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                {attempt.user_agent || 'Unknown'}
              </div>
            </TableCell>
            <TableCell>
              {attempt.failure_reason && (
                <div className="text-sm text-muted-foreground max-w-[150px] truncate">
                  {attempt.failure_reason}
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}