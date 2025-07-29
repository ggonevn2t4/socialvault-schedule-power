import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Bell, Mail, Smartphone, Monitor, MessageSquare, Calendar, TrendingUp, Users } from 'lucide-react';

export function NotificationSettings() {
  const { preferences, updatePreferences, isSaving } = useUserPreferences();

  const handleNotificationToggle = (key: keyof typeof preferences, value: boolean) => {
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
              {Array.from({ length: 5 }).map((_, i) => (
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
      {/* Email Notifications */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose what email notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                General email notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive general updates and important account information
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => handleNotificationToggle('email_notifications', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="security-alerts" className="text-base font-medium">
                Security alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about important security events
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={preferences.security_alerts}
              onCheckedChange={(checked) => handleNotificationToggle('security_alerts', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketing-emails" className="text-base font-medium">
                Marketing emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) => handleNotificationToggle('marketing_emails', checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage push notifications on your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your mobile device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => handleNotificationToggle('push_notifications', checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Control notifications while using the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="in-app-notifications" className="text-base font-medium">
                In-app notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Show notifications while using the app
              </p>
            </div>
            <Switch
              id="in-app-notifications"
              checked={preferences.in_app_notifications}
              onCheckedChange={(checked) => handleNotificationToggle('in_app_notifications', checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Notifications */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Content & Activity Notifications
          </CardTitle>
          <CardDescription>
            Get notified about content performance and team activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">Post engagement</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified when your posts receive likes, comments, or shares
              </p>
            </div>
            <Switch defaultChecked disabled={isSaving} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">Scheduled posts</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified when scheduled posts are published or fail
              </p>
            </div>
            <Switch defaultChecked disabled={isSaving} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">Analytics reports</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive weekly and monthly analytics summaries
              </p>
            </div>
            <Switch defaultChecked disabled={isSaving} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">Team activity</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified about team member activity and collaboration
              </p>
            </div>
            <Switch defaultChecked disabled={isSaving} />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Summary */}
      <Card className="card-premium border-muted">
        <CardHeader>
          <CardTitle className="text-lg">Notification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <Mail className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs text-muted-foreground">
                {preferences.email_notifications ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="space-y-2">
              <Smartphone className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Push</div>
              <div className="text-xs text-muted-foreground">
                {preferences.push_notifications ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="space-y-2">
              <Monitor className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">In-App</div>
              <div className="text-xs text-muted-foreground">
                {preferences.in_app_notifications ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="space-y-2">
              <Bell className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Security</div>
              <div className="text-xs text-muted-foreground">
                {preferences.security_alerts ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          Test Notifications
        </Button>
        <Button variant="outline" className="flex-1">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}