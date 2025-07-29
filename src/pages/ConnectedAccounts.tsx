import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Link,
  Unlink,
  Settings,
  Shield,
  Calendar,
  BarChart3
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  isConnected: boolean;
  avatar?: string;
  followers?: number;
  lastSync?: string;
  status: 'active' | 'error' | 'pending';
  permissions: string[];
}

const socialPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Manage Facebook pages and posts'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Share photos and stories'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    color: 'text-gray-900',
    bgColor: 'bg-gray-50',
    description: 'Post tweets and threads'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    description: 'Professional networking and content'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Upload and manage videos'
  }
];

export default function ConnectedAccounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: '1',
      platform: 'facebook',
      username: '@mypage',
      isConnected: true,
      followers: 12500,
      lastSync: '5 phút trước',
      status: 'active',
      permissions: ['post', 'read', 'manage']
    },
    {
      id: '2',
      platform: 'instagram',
      username: '@myinstagram',
      isConnected: true,
      followers: 8200,
      lastSync: '10 phút trước',
      status: 'error',
      permissions: ['post', 'read']
    },
    {
      id: '3',
      platform: 'twitter',
      username: '@mytwitter',
      isConnected: false,
      followers: 0,
      lastSync: '',
      status: 'pending',
      permissions: []
    }
  ]);

  const handleConnect = (platformId: string) => {
    // Simulate OAuth connection
    toast({
      title: "Đang kết nối...",
      description: "Chuyển hướng đến trang đăng nhập của platform...",
    });
    
    // In real implementation, this would redirect to OAuth
    setTimeout(() => {
      setAccounts(prev => prev.map(account => 
        account.platform === platformId 
          ? { ...account, isConnected: true, status: 'active' as const }
          : account
      ));
      
      toast({
        title: "Kết nối thành công!",
        description: `Đã kết nối thành công với ${platformId}`,
      });
    }, 2000);
  };

  const handleDisconnect = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, isConnected: false, status: 'pending' as const }
        : account
    ));
    
    toast({
      title: "Đã ngắt kết nối",
      description: "Tài khoản đã được ngắt kết nối",
    });
  };

  const handleToggleAutoPost = (accountId: string, enabled: boolean) => {
    toast({
      title: enabled ? "Bật đăng bài tự động" : "Tắt đăng bài tự động",
      description: enabled ? "Nội dung sẽ được đăng tự động" : "Đăng bài thủ công",
    });
  };

  const getStatusBadge = (status: SocialAccount['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground">Hoạt động</Badge>;
      case 'error':
        return <Badge variant="destructive">Lỗi</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ kết nối</Badge>;
    }
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.icon : Link;
  };

  const getPlatformInfo = (platformId: string) => {
    return socialPlatforms.find(p => p.id === platformId);
  };

  const connectedAccounts = accounts.filter(acc => acc.isConnected);
  const availablePlatforms = socialPlatforms.filter(platform => 
    !accounts.some(acc => acc.platform === platform.id && acc.isConnected)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Tài khoản liên kết</h1>
          <p className="text-muted-foreground">
            Kết nối và quản lý các tài khoản mạng xã hội
          </p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Tài khoản đã kết nối</h2>
        
        {connectedAccounts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Chưa có tài khoản nào được kết nối</h3>
              <p className="text-sm text-muted-foreground">
                Kết nối tài khoản mạng xã hội để bắt đầu đăng bài
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {connectedAccounts.map((account) => {
              const Icon = getPlatformIcon(account.platform);
              const platformInfo = getPlatformInfo(account.platform);
              
              return (
                <Card key={account.id} className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${platformInfo?.bgColor} ${platformInfo?.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-foreground">{platformInfo?.name}</h3>
                            {getStatusBadge(account.status)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-1">{account.username}</p>
                          
                          {account.followers && (
                            <p className="text-sm text-muted-foreground">
                              {account.followers.toLocaleString()} người theo dõi
                            </p>
                          )}
                          
                          {account.lastSync && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Đồng bộ lần cuối: {account.lastSync}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(account.id)}
                        >
                          <Unlink className="h-4 w-4 mr-2" />
                          Ngắt kết nối
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Account Settings */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">Đăng bài tự động</span>
                          </div>
                          <Switch 
                            defaultChecked={true}
                            onCheckedChange={(checked) => handleToggleAutoPost(account.id, checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">Thu thập số liệu</span>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">Xác thực 2FA</span>
                          </div>
                          <Switch defaultChecked={account.status === 'active'} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Platforms */}
      {availablePlatforms.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Kết nối thêm tài khoản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms.map((platform) => {
              const Icon = platform.icon;
              
              return (
                <Card key={platform.id} className="card-premium hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${platform.bgColor} ${platform.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {platform.description}
                        </p>
                        
                        <Button 
                          size="sm" 
                          onClick={() => handleConnect(platform.id)}
                          className="w-full"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Kết nối
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}