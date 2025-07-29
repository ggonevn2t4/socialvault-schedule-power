import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivacySettings, usePrivacy } from '@/hooks/usePrivacy';

interface PrivacySettingsPanelProps {
  settings: PrivacySettings | null;
  loading: boolean;
}

export function PrivacySettingsPanel({ settings, loading }: PrivacySettingsPanelProps) {
  const { updatePrivacySettings } = usePrivacy();

  if (loading || !settings) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    );
  }

  const handleSwitchChange = (field: string, value: boolean) => {
    updatePrivacySettings({ [field]: value });
  };

  const handleSelectChange = (field: string, value: string) => {
    updatePrivacySettings({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="space-y-2">
        <Label htmlFor="profile-visibility">Profile Visibility</Label>
        <Select
          value={settings.profile_visibility}
          onValueChange={(value) => handleSelectChange('profile_visibility', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
            <SelectItem value="team_only">Team Only - Only team members can see</SelectItem>
            <SelectItem value="private">Private - Only you can see</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="activity-status">Show Activity Status</Label>
          <p className="text-sm text-muted-foreground">
            Let others see when you're online or active
          </p>
        </div>
        <Switch
          id="activity-status"
          checked={settings.show_activity_status}
          onCheckedChange={(checked) => handleSwitchChange('show_activity_status', checked)}
        />
      </div>

      {/* Data Processing */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="data-processing">Allow Data Processing</Label>
          <p className="text-sm text-muted-foreground">
            Allow us to process your data for service improvements
          </p>
        </div>
        <Switch
          id="data-processing"
          checked={settings.allow_data_processing}
          onCheckedChange={(checked) => handleSwitchChange('allow_data_processing', checked)}
        />
      </div>

      {/* Marketing Emails */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="marketing-emails">Marketing Emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive promotional and marketing communications
          </p>
        </div>
        <Switch
          id="marketing-emails"
          checked={settings.allow_marketing_emails}
          onCheckedChange={(checked) => handleSwitchChange('allow_marketing_emails', checked)}
        />
      </div>

      {/* Analytics Tracking */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="analytics-tracking">Analytics Tracking</Label>
          <p className="text-sm text-muted-foreground">
            Help us improve by sharing anonymous usage data
          </p>
        </div>
        <Switch
          id="analytics-tracking"
          checked={settings.allow_analytics_tracking}
          onCheckedChange={(checked) => handleSwitchChange('allow_analytics_tracking', checked)}
        />
      </div>

      {/* Data Retention Preference */}
      <div className="space-y-2">
        <Label htmlFor="data-retention">Data Retention Preference</Label>
        <Select
          value={settings.data_retention_preference}
          onValueChange={(value) => handleSelectChange('data_retention_preference', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimum">Minimum - Delete data as soon as legally possible</SelectItem>
            <SelectItem value="default">Default - Follow standard retention policies</SelectItem>
            <SelectItem value="extended">Extended - Keep data for maximum allowed period</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Auto Delete Inactive Data */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="auto-delete">Auto-Delete Inactive Data</Label>
          <p className="text-sm text-muted-foreground">
            Automatically delete data after periods of inactivity
          </p>
        </div>
        <Switch
          id="auto-delete"
          checked={settings.auto_delete_inactive_data}
          onCheckedChange={(checked) => handleSwitchChange('auto_delete_inactive_data', checked)}
        />
      </div>
    </div>
  );
}