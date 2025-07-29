import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { LocaleSettings } from '@/components/settings/LocaleSettings';
import { AccountDangerZone } from '@/components/settings/AccountDangerZone';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { User, Shield, Bell, Eye, Globe, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { preferences, isLoading, isSaving } = useUserPreferences();

  const settingsTabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your personal information and avatar'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password, 2FA, and session management'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email, push, and in-app notification preferences'
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: Eye,
      description: 'Data sharing and profile visibility settings'
    },
    {
      id: 'locale',
      label: 'Locale',
      icon: Globe,
      description: 'Language, timezone, and format preferences'
    },
    {
      id: 'danger',
      label: 'Account',
      icon: AlertTriangle,
      description: 'Data export and account deletion options'
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              Saving changes...
            </div>
          )}
        </div>

        {/* Settings Navigation - Mobile friendly grid view */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Card 
                key={tab.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTab === tab.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-sm">{tab.label}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{tab.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Main Settings Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs List */}
          <TabsList className="hidden lg:grid w-full grid-cols-6 h-auto p-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col items-center gap-2 h-auto py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className="text-xs opacity-70 hidden xl:block">{tab.description}</div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityDashboard />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <PrivacySettings />
            </TabsContent>

            <TabsContent value="locale" className="space-y-6">
              <LocaleSettings />
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <AccountDangerZone />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}