import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSecurity } from '@/hooks/useSecurity';
import { Shield, AlertTriangle, Activity, Smartphone, Eye, EyeOff } from 'lucide-react';
import { LoginAttemptsTable } from './LoginAttemptsTable';
import { SecurityAuditTable } from './SecurityAuditTable';
import { ActiveSessionsTable } from './ActiveSessionsTable';
import { MfaSettings } from './MfaSettings';

export function SecurityDashboard() {
  const {
    loginAttempts,
    auditLogs,
    activeSessions,
    mfaSettings,
    loading
  } = useSecurity();

  const recentSuspiciousActivity = loginAttempts.filter(attempt => 
    attempt.is_suspicious || attempt.status === 'failed'
  ).slice(0, 5);

  const highRiskAuditEvents = auditLogs.filter(log => 
    log.risk_level === 'high' || log.risk_level === 'critical'
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loginAttempts.filter(a => a.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              In the last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {mfaSettings?.is_enabled ? (
                <>
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Enabled</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">Disabled</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Two-factor authentication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {mfaSettings?.is_enabled ? '85' : '65'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall security rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {(recentSuspiciousActivity.length > 0 || highRiskAuditEvents.length > 0) && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              Recent suspicious activities that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSuspiciousActivity.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Suspicious Login Attempts</h4>
                <div className="space-y-2">
                  {recentSuspiciousActivity.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                      <div>
                        <span className="text-sm font-medium">{attempt.email}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(attempt.attempted_at).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="destructive">{attempt.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highRiskAuditEvents.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">High Risk Events</h4>
                <div className="space-y-2">
                  {highRiskAuditEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                      <div>
                        <span className="text-sm font-medium">{event.action}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="destructive">{event.risk_level}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Details Tabs */}
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="login-history">Login History</TabsTrigger>
          <TabsTrigger value="audit-log">Security Log</TabsTrigger>
          <TabsTrigger value="mfa">Two-Factor Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveSessionsTable sessions={activeSessions} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Review your recent login attempts and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginAttemptsTable attempts={loginAttempts} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Audit Log</CardTitle>
              <CardDescription>
                Detailed log of all security-related events in your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityAuditTable auditLogs={auditLogs} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MfaSettings settings={mfaSettings} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}