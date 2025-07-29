import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Globe, Clock, Calendar, Type } from 'lucide-react';

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2023)' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (Dec 31, 2023)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (31 Dec 2023)' },
];

const timeFormats = [
  { value: '12h', label: '12-hour (2:30 PM)' },
  { value: '24h', label: '24-hour (14:30)' },
];

export function LocaleSettings() {
  const { preferences, updatePreferences, isSaving } = useUserPreferences();

  const handleLocaleChange = (key: keyof typeof preferences, value: string) => {
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
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded"></div>
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
      {/* Language & Region */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Set your preferred language and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => handleLocaleChange('language', value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This will change the interface language
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={preferences.timezone} 
                onValueChange={(value) => handleLocaleChange('timezone', value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Used for scheduling posts and displaying times
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time Format */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date & Time Format
          </CardTitle>
          <CardDescription>
            Choose how dates and times are displayed throughout the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="date-format">Date format</Label>
              <Select 
                value={preferences.date_format} 
                onValueChange={(value) => handleLocaleChange('date_format', value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="time-format">Time format</Label>
              <Select 
                value={preferences.time_format} 
                onValueChange={(value) => handleLocaleChange('time_format', value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="card-premium border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Preview
          </CardTitle>
          <CardDescription>
            See how your locale settings affect the display
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Clock className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Current Time</div>
              <div className="text-lg font-mono">
                {preferences.time_format === '12h' ? 
                  new Date().toLocaleTimeString('en-US', { hour12: true }) :
                  new Date().toLocaleTimeString('en-US', { hour12: false })
                }
              </div>
            </div>

            <div className="space-y-2">
              <Calendar className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Today's Date</div>
              <div className="text-lg font-mono">
                {preferences.date_format === 'MM/DD/YYYY' && new Date().toLocaleDateString('en-US')}
                {preferences.date_format === 'DD/MM/YYYY' && new Date().toLocaleDateString('en-GB')}
                {preferences.date_format === 'YYYY-MM-DD' && new Date().toISOString().split('T')[0]}
                {preferences.date_format === 'DD-MM-YYYY' && new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}
                {preferences.date_format === 'MMM DD, YYYY' && new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                {preferences.date_format === 'DD MMM YYYY' && new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="space-y-2">
              <Globe className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Timezone</div>
              <div className="text-sm text-muted-foreground">
                {preferences.timezone}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Additional Options</CardTitle>
          <CardDescription>
            More locale-specific preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Week starts on</Label>
              <p className="text-sm text-muted-foreground">
                Choose which day your week starts on
              </p>
            </div>
            <Select defaultValue="monday" disabled={isSaving}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Number format</Label>
              <p className="text-sm text-muted-foreground">
                How numbers are formatted in analytics
              </p>
            </div>
            <Select defaultValue="1,234.56" disabled={isSaving}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1,234.56">1,234.56</SelectItem>
                <SelectItem value="1.234,56">1.234,56</SelectItem>
                <SelectItem value="1 234.56">1 234.56</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}