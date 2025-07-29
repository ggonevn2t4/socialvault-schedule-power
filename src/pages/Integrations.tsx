import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap,
  Webhook,
  Key,
  Settings,
  ExternalLink,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'automation' | 'analytics' | 'storage' | 'ai';
  isEnabled: boolean;
  status: 'active' | 'error' | 'pending';
  lastSync?: string;
  config?: Record<string, any>;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'error';
  lastTriggered?: string;
}

const availableIntegrations = [
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Tự động hóa quy trình làm việc với 5000+ ứng dụng',
    icon: '⚡',
    category: 'automation' as const,
    isEnabled: true,
    status: 'active' as const,
    lastSync: '2 phút trước'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Theo dõi hiệu suất nội dung và traffic',
    icon: '📊',
    category: 'analytics' as const,
    isEnabled: false,
    status: 'pending' as const
  },
  {
    id: 'canva',
    name: 'Canva',
    description: 'Tạo thiết kế chuyên nghiệp',
    icon: '🎨',
    category: 'ai' as const,
    isEnabled: true,
    status: 'active' as const,
    lastSync: '1 giờ trước'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Lưu trữ và chia sẻ tệp tin',
    icon: '💾',
    category: 'storage' as const,
    isEnabled: false,
    status: 'pending' as const
  }
];

export default function Integrations() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Mobile App API',
      key: 'sk_live_...',
      permissions: ['read', 'write'],
      createdAt: '2024-01-15',
      lastUsed: '2 giờ trước',
      isActive: true
    }
  ]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Post Published',
      url: 'https://example.com/webhook',
      events: ['post.published', 'post.scheduled'],
      status: 'active',
      lastTriggered: '5 phút trước'
    }
  ]);

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, isEnabled: enabled, status: enabled ? 'active' : 'pending' }
        : integration
    ));
    
    toast({
      title: enabled ? "Đã kích hoạt tích hợp" : "Đã tắt tích hợp",
      description: enabled ? "Tích hợp đã được kích hoạt" : "Tích hợp đã được tắt",
    });
  };

  const handleCreateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ['read'],
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    
    setApiKeys(prev => [...prev, newKey]);
    
    toast({
      title: "API Key đã được tạo",
      description: "API Key mới đã được tạo thành công",
    });
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast({
      title: "Đã xóa API Key",
      description: "API Key đã được xóa thành công",
    });
  };

  const handleCreateWebhook = () => {
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: 'New Webhook',
      url: '',
      events: [],
      status: 'active'
    };
    
    setWebhooks(prev => [...prev, newWebhook]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Đã sao chép vào clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground">Hoạt động</Badge>;
      case 'error':
        return <Badge variant="destructive">Lỗi</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ kích hoạt</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-blue-50 text-blue-600';
      case 'analytics': return 'bg-green-50 text-green-600';
      case 'storage': return 'bg-purple-50 text-purple-600';
      case 'ai': return 'bg-orange-50 text-orange-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Tích hợp</h1>
          <p className="text-muted-foreground">
            Quản lý tích hợp với ứng dụng bên thứ ba và API
          </p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg text-2xl ${getCategoryColor(integration.category)}`}>
                        {integration.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-foreground">{integration.name}</h3>
                          {getStatusBadge(integration.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {integration.description}
                        </p>
                        
                        {integration.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Đồng bộ lần cuối: {integration.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={integration.isEnabled}
                        onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                      />
                      
                      {integration.isEnabled && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý khóa API để truy cập vào hệ thống
              </p>
            </div>
            <Button onClick={handleCreateApiKey}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo API Key
            </Button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{apiKey.name}</h4>
                        {apiKey.isActive ? (
                          <Badge variant="default" className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Không hoạt động
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {apiKey.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Tạo: {apiKey.createdAt}</span>
                        {apiKey.lastUsed && <span>Sử dụng lần cuối: {apiKey.lastUsed}</span>}
                        <span>Quyền: {apiKey.permissions.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có sự kiện xảy ra trong hệ thống
              </p>
            </div>
            <Button onClick={handleCreateWebhook}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Webhook
            </Button>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{webhook.name}</h4>
                        {getStatusBadge(webhook.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {webhook.url}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(webhook.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Sự kiện: {webhook.events.join(', ')}</span>
                        {webhook.lastTriggered && (
                          <span>Kích hoạt lần cuối: {webhook.lastTriggered}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}