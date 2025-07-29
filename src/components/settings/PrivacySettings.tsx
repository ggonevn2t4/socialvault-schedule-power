import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Eye, Shield, Database, Users, Lock, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PrivacySettings() {
  const { preferences, updatePreferences, isSaving } = useUserPreferences();

  const handlePrivacyToggle = (key: keyof typeof preferences, value: boolean | string) => {
    if (!preferences) return;
    updatePreferences({ [key]: value });
  };

  if (!preferences) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                  <div className="h-6 w-11 bg-muted rounded-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="profile-visibility" className="text-base font-medium">
              Profile visibility
            </Label>
            <Select 
              value={preferences.profile_visibility} 
              onValueChange={(value) => handlePrivacyToggle('profile_visibility', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-xs text-muted-foreground">Anyone can view your profile</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="team_only">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Team Only</div>
                      <div className="text-xs text-muted-foreground">Only team members can view</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-muted-foreground">Only you can view your profile</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This affects who can see your posts, activity, and team memberships.
            </p>
          </div>

          {preferences.profile_visibility === 'public' && (
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                Your profile is public. Anyone can view your posts and activity.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & Analytics
          </CardTitle>
          <CardDescription>
            Control how your data is used for analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="analytics-tracking" className="text-base font-medium">
                Analytics tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow us to track your usage to improve the app experience
              </p>
            </div>
            <Switch
              id="analytics-tracking"
              checked={preferences.analytics_tracking}
              onCheckedChange={(checked) => handlePrivacyToggle('analytics_tracking', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="data-sharing" className="text-base font-medium">
                Data sharing
              </Label>
              <p className="text-sm text-muted-foreground">
                Share anonymized data to help improve our services
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={preferences.data_sharing}
              onCheckedChange={(checked) => handlePrivacyToggle('data_sharing', checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security & Access */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Access
          </CardTitle>
          <CardDescription>
            Manage access permissions and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Third-party integrations
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow connected apps to access your data
              </p>
            </div>
            <Switch defaultChecked disabled={isSaving} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                API access
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable API access for developers and integrations
              </p>
            </div>
            <Switch disabled={isSaving} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Location tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow location-based features and analytics
              </p>
            </div>
            <Switch disabled={isSaving} />
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card className="card-premium border-warning/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
          <CardDescription>
            Understand and exercise your data protection rights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Right to Access</h4>
              <p className="text-sm text-muted-foreground mb-3">
                You can request a copy of all personal data we have about you.
              </p>
              <a href="#" className="text-sm text-primary hover:underline">
                Request my data
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Right to Portability</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Export your data in a machine-readable format.
              </p>
              <a href="#" className="text-sm text-primary hover:underline">
                Export data
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Right to Rectification</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Correct any inaccurate personal data we hold about you.
              </p>
              <a href="#" className="text-sm text-primary hover:underline">
                Update information
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Right to Erasure</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Request deletion of your personal data under certain conditions.
              </p>
              <a href="#" className="text-sm text-primary hover:underline">
                Delete account
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Summary */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Summary:</strong> Your profile is {preferences.profile_visibility}, 
          analytics tracking is {preferences.analytics_tracking ? 'enabled' : 'disabled'}, 
          and data sharing is {preferences.data_sharing ? 'enabled' : 'disabled'}.
        </AlertDescription>
      </Alert>
    </div>
  );
}