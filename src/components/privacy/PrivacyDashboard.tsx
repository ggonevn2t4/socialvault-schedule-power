import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Eye, FileText, Download, Trash2, UserX } from 'lucide-react';
import { PrivacySettingsPanel } from './PrivacySettingsPanel';
import { ConsentManagement } from './ConsentManagement';
import { PrivacyRequestsTable } from './PrivacyRequestsTable';
import { DataExportsTable } from './DataExportsTable';
import { usePrivacy } from '@/hooks/usePrivacy';

export function PrivacyDashboard() {
  const {
    privacySettings,
    consents,
    privacyRequests,
    dataExports,
    loading
  } = usePrivacy();

  // Calculate privacy score
  const calculatePrivacyScore = () => {
    if (!privacySettings || !consents.length) return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // Profile visibility (20 points)
    if (privacySettings.profile_visibility === 'private') score += 20;
    else if (privacySettings.profile_visibility === 'team_only') score += 15;
    else score += 5;
    
    // Data processing controls (30 points)
    if (!privacySettings.allow_data_processing) score += 15;
    if (!privacySettings.allow_marketing_emails) score += 10;
    if (!privacySettings.allow_analytics_tracking) score += 5;
    
    // Consent management (30 points)
    const marketingConsent = consents.find(c => c.consent_type === 'marketing');
    const analyticsConsent = consents.find(c => c.consent_type === 'analytics');
    const targetingConsent = consents.find(c => c.consent_type === 'targeting');
    
    if (!marketingConsent?.is_given) score += 10;
    if (!analyticsConsent?.is_given) score += 10;
    if (!targetingConsent?.is_given) score += 10;
    
    // Data retention (20 points)
    if (privacySettings.data_retention_preference === 'minimum') score += 15;
    else if (privacySettings.data_retention_preference === 'default') score += 10;
    else score += 5;
    
    if (privacySettings.auto_delete_inactive_data) score += 5;
    
    return Math.min(score, maxScore);
  };

  const privacyScore = calculatePrivacyScore();
  const pendingRequests = privacyRequests.filter(req => req.status === 'pending').length;
  const completedExports = dataExports.filter(exp => exp.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Privacy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              privacyScore >= 80 ? 'text-green-500' : 
              privacyScore >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {privacyScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall privacy protection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Visibility</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {privacySettings?.profile_visibility || 'Public'}
            </div>
            <p className="text-xs text-muted-foreground">
              Who can see your profile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Privacy requests in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Exports</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedExports}</div>
            <p className="text-xs text-muted-foreground">
              Available downloads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Management Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
          <TabsTrigger value="consents">Consent Management</TabsTrigger>
          <TabsTrigger value="requests">Privacy Requests</TabsTrigger>
          <TabsTrigger value="exports">Data Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is used and who can see your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacySettingsPanel settings={privacySettings} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>
                Manage your consent for different types of data processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsentManagement consents={consents} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Requests</CardTitle>
              <CardDescription>
                Submit and track requests for data access, correction, or deletion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacyRequestsTable requests={privacyRequests} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>
                Download your data or request new exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataExportsTable exports={dataExports} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}