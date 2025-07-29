import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MFASettings as MFASettingsType, useSecurity } from '@/hooks/useSecurity';
import { Shield, ShieldCheck, ShieldX, Key, Copy, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface MfaSettingsProps {
  settings: MFASettingsType | null;
}

export function MfaSettings({ settings }: MfaSettingsProps) {
  const { enableMfa, disableMfa } = useSecurity();
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [showConfirmDisable, setShowConfirmDisable] = useState(false);

  const handleEnableMfa = async () => {
    setLoading(true);
    try {
      const codes = await enableMfa();
      if (codes) {
        setBackupCodes(codes);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    setLoading(true);
    try {
      await disableMfa();
      setShowConfirmDisable(false);
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    if (backupCodes) {
      navigator.clipboard.writeText(backupCodes.join('\n'));
      toast.success('Backup codes copied to clipboard');
    }
  };

  const downloadBackupCodes = () => {
    if (backupCodes) {
      const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mfa-backup-codes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Backup codes downloaded');
    }
  };

  return (
    <div className="space-y-6">
      {/* MFA Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings?.is_enabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldX className="h-5 w-5 text-yellow-500" />
            )}
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account with two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-muted-foreground">
                {settings?.is_enabled 
                  ? 'Two-factor authentication is enabled and protecting your account'
                  : 'Two-factor authentication is not enabled'
                }
              </p>
            </div>
            <Badge variant={settings?.is_enabled ? 'default' : 'secondary'}>
              {settings?.is_enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {settings?.is_enabled && settings.last_used_at && (
            <div>
              <p className="font-medium">Last Used</p>
              <p className="text-sm text-muted-foreground">
                {new Date(settings.last_used_at).toLocaleString()}
              </p>
            </div>
          )}

          {settings?.is_enabled && settings.backup_codes && (
            <div>
              <p className="font-medium">Recovery Codes Used</p>
              <p className="text-sm text-muted-foreground">
                {settings.recovery_codes_used} of {settings.backup_codes.length} codes used
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {!settings?.is_enabled ? (
              <Button onClick={handleEnableMfa} disabled={loading}>
                <Shield className="h-4 w-4 mr-2" />
                {loading ? 'Enabling...' : 'Enable MFA'}
              </Button>
            ) : (
              <Dialog open={showConfirmDisable} onOpenChange={setShowConfirmDisable}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <ShieldX className="h-4 w-4 mr-2" />
                    Disable MFA
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disable Multi-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to disable MFA? This will make your account less secure.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowConfirmDisable(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDisableMfa} disabled={loading}>
                      {loading ? 'Disabling...' : 'Disable MFA'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backup Codes Dialog */}
      {backupCodes && (
        <Dialog open={!!backupCodes} onOpenChange={() => setBackupCodes(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Your MFA Backup Codes</DialogTitle>
              <DialogDescription>
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These codes will only be shown once. Make sure to save them securely!
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-background rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyBackupCodes} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Codes
              </Button>
              <Button onClick={downloadBackupCodes} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Codes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {settings?.is_enabled ? (
              <ShieldCheck className="h-4 w-4 text-green-500" />
            ) : (
              <ShieldX className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-sm">Enable two-factor authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm">Use a strong, unique password</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm">Regularly review active sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm">Monitor login activity</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}