import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserSession, useSecurity } from '@/hooks/useSecurity';
import { Monitor, Smartphone, Tablet, LogOut, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ActiveSessionsTableProps {
  sessions: UserSession[];
  loading: boolean;
}

export function ActiveSessionsTable({ sessions, loading }: ActiveSessionsTableProps) {
  const { terminateSession } = useSecurity();
  const [terminating, setTerminating] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No active sessions found</p>
      </div>
    );
  }

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown Device';
    
    // Extract browser and OS info
    const ua = userAgent;
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // Detect browser
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return `${browser} on ${os}`;
  };

  const handleTerminateSession = async (sessionId: string) => {
    setTerminating(sessionId);
    try {
      await terminateSession(sessionId, 'user_requested');
      toast.success('Session terminated successfully');
    } catch (error) {
      toast.error('Failed to terminate session');
    } finally {
      setTerminating(null);
    }
  };

  const formatLastActivity = (lastActivity: string) => {
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffMs = now.getTime() - activity.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Device</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getDeviceIcon(session.user_agent)}
                <div>
                  <div className="font-medium">{getDeviceInfo(session.user_agent)}</div>
                  {session.is_current && (
                    <Badge variant="outline" className="text-xs">Current Session</Badge>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">
                  {session.location_city && session.location_country 
                    ? `${session.location_city}, ${session.location_country}`
                    : 'Unknown Location'
                  }
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={session.status === 'active' ? 'default' : 'secondary'}
                className={session.status === 'active' ? 'bg-green-500' : ''}
              >
                {session.status}
              </Badge>
            </TableCell>
            <TableCell>
              {formatLastActivity(session.last_activity)}
            </TableCell>
            <TableCell>
              {new Date(session.expires_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              {!session.is_current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session.id)}
                  disabled={terminating === session.id}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {terminating === session.id ? 'Terminating...' : 'Terminate'}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}