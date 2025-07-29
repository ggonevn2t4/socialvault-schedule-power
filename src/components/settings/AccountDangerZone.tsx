import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { AlertTriangle, Download, Trash2, Loader2, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function AccountDangerZone() {
  const { requestDataExport, deleteAccount } = useUserPreferences();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDataExport = async () => {
    setIsExporting(true);
    await requestDataExport();
    setIsExporting(false);
  };

  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    const success = await deleteAccount(deleteConfirmation);
    
    if (success) {
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
    
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download a copy of all your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h4 className="font-medium">Export your data</h4>
              <p className="text-sm text-muted-foreground">
                Get a complete copy of your account data including posts, analytics, team information, and preferences. 
                This may take up to 24 hours to process.
              </p>
              <div className="text-sm text-muted-foreground">
                <strong>Includes:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Profile information and settings</li>
                  <li>All published and draft posts</li>
                  <li>Analytics and performance data</li>
                  <li>Team memberships and activity</li>
                  <li>Account activity logs</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={handleDataExport}
              disabled={isExporting}
              className="min-w-32"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your data export will be sent to your registered email address as a secure download link. 
              The link will expire after 7 days for security purposes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="card-premium border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> These actions are permanent and cannot be undone. 
              Please make sure you understand the consequences before proceeding.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be reversed.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong>This will delete:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Your profile and account settings</li>
                    <li>All posts, drafts, and scheduled content</li>
                    <li>Analytics and performance history</li>
                    <li>Team memberships (you'll be removed from all teams)</li>
                    <li>Connected social media accounts</li>
                    <li>All uploaded files and media</li>
                  </ul>
                </div>
              </div>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Warning:</strong> You will lose access to all your content, analytics, and team data. 
                        Consider exporting your data first.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="delete-confirmation">
                        Type <strong>DELETE</strong> to confirm account deletion
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Type DELETE here"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setDeleteConfirmation('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleAccountDeletion}
                      disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Before you delete your account:</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Download your data using the export feature above</li>
              <li>• Remove yourself from any teams where you're the only admin</li>
              <li>• Cancel any active subscriptions</li>
              <li>• Save any important content or analytics data</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Options */}
      <Card className="card-premium border-warning/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Shield className="h-5 w-5" />
            Account Recovery
          </CardTitle>
          <CardDescription>
            Account deactivation as an alternative to deletion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h4 className="font-medium">Deactivate Account</h4>
              <p className="text-sm text-muted-foreground">
                Temporarily deactivate your account instead of permanently deleting it. 
                You can reactivate it later by logging in.
              </p>
              <div className="text-sm text-muted-foreground">
                <strong>When deactivated:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Your profile will be hidden from others</li>
                  <li>Scheduled posts will be paused</li>
                  <li>You won't receive notifications</li>
                  <li>Your data will be preserved for 90 days</li>
                </ul>
              </div>
            </div>
            
            <Button variant="outline" disabled>
              <Shield className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          </div>

          <Alert className="border-warning/50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Account deactivation is a safer alternative to deletion. Your data will be preserved 
              and you can reactivate your account anytime within 90 days.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}