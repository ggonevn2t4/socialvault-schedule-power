import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserConsent, usePrivacy } from '@/hooks/usePrivacy';
import { CheckCircle, XCircle, Shield, BarChart, Mail, Zap, Target } from 'lucide-react';

interface ConsentManagementProps {
  consents: UserConsent[];
  loading: boolean;
}

export function ConsentManagement({ consents, loading }: ConsentManagementProps) {
  const { updateConsent } = usePrivacy();

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getConsentIcon = (type: string) => {
    switch (type) {
      case 'functional':
        return <Shield className="h-5 w-5" />;
      case 'analytics':
        return <BarChart className="h-5 w-5" />;
      case 'marketing':
        return <Mail className="h-5 w-5" />;
      case 'performance':
        return <Zap className="h-5 w-5" />;
      case 'targeting':
        return <Target className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getConsentDescription = (type: string) => {
    switch (type) {
      case 'functional':
        return 'Essential cookies required for the platform to function properly. These cannot be disabled.';
      case 'analytics':
        return 'Help us understand how you use the platform to improve our services.';
      case 'marketing':
        return 'Allow us to send you promotional emails and marketing communications.';
      case 'performance':
        return 'Monitor platform performance and user experience improvements.';
      case 'targeting':
        return 'Show you personalized content and advertisements based on your interests.';
      default:
        return 'Data processing consent for platform functionality.';
    }
  };

  const formatConsentType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleConsentToggle = (type: UserConsent['consent_type'], isGiven: boolean) => {
    if (type === 'functional') {
      // Functional consents cannot be disabled
      return;
    }
    updateConsent(type, isGiven);
  };

  return (
    <div className="space-y-4">
      {consents.map((consent) => (
        <Card key={consent.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getConsentIcon(consent.consent_type)}
                <CardTitle className="text-base">
                  {formatConsentType(consent.consent_type)} Consent
                </CardTitle>
                {consent.is_given ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Granted
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Given
                  </Badge>
                )}
              </div>
              <Switch
                checked={consent.is_given}
                onCheckedChange={(checked) => handleConsentToggle(consent.consent_type, checked)}
                disabled={consent.consent_type === 'functional'}
              />
            </div>
            <CardDescription className="text-sm">
              {getConsentDescription(consent.consent_type)}
            </CardDescription>
          </CardHeader>
          
          {(consent.given_at || consent.withdrawn_at) && (
            <CardContent className="pt-0">
              <div className="text-xs text-muted-foreground">
                {consent.is_given && consent.given_at && (
                  <p>Granted on: {new Date(consent.given_at).toLocaleString()}</p>
                )}
                {!consent.is_given && consent.withdrawn_at && (
                  <p>Withdrawn on: {new Date(consent.withdrawn_at).toLocaleString()}</p>
                )}
                <p>Consent version: {consent.consent_version}</p>
              </div>
            </CardContent>
          )}
          
          {consent.consent_type === 'functional' && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            </div>
          )}
        </Card>
      ))}
      
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              You can change these consent preferences at any time. 
              Some features may not work properly if certain consents are withdrawn.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}