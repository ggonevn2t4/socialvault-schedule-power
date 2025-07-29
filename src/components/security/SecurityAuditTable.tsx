import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SecurityAuditLog } from '@/hooks/useSecurity';
import { Shield, Info, AlertTriangle, AlertCircle } from 'lucide-react';

interface SecurityAuditTableProps {
  auditLogs: SecurityAuditLog[];
  loading: boolean;
}

export function SecurityAuditTable({ auditLogs, loading }: SecurityAuditTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No security events recorded</p>
      </div>
    );
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Risk Level</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Resource</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getRiskIcon(log.risk_level)}
                {getRiskBadge(log.risk_level)}
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {formatAction(log.action)}
            </TableCell>
            <TableCell>
              {new Date(log.created_at).toLocaleString()}
            </TableCell>
            <TableCell>
              {log.resource_type && (
                <div className="text-sm">
                  <div className="font-medium">{log.resource_type}</div>
                  {log.resource_id && (
                    <div className="text-muted-foreground text-xs truncate max-w-[100px]">
                      {log.resource_id}
                    </div>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell>
              {log.details && (
                <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {typeof log.details === 'object' 
                    ? JSON.stringify(log.details).slice(0, 50) + '...'
                    : log.details
                  }
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}