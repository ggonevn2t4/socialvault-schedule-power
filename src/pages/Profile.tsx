import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { 
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Mail
} from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: profile?.username || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || ''
  });

  const [preferences, setPreferences] = useState({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
    twoFactorEnabled: false,
    autoSave: true,
    compactMode: false
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Đã cập nhật tùy chọn",
      description: "Tùy chọn đã được lưu tự động",
    });
  };

  const handleAvatarUpload = () => {
    // Simulate file upload
    toast({
      title: "Đang tải ảnh lên...",
      description: "Ảnh đại diện đang được tải lên",
    });
    
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random()
      }));
      
      toast({
        title: "Đã cập nhật ảnh đại diện",
        description: "Ảnh đại diện mới đã được lưu",
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và tùy chọn
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar_url || profile?.avatar_url} />
                  <AvatarFallback>
                    {formData.display_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarUpload}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Đổi ảnh đại diện
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG hoặc GIF. Tối đa 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên người dùng</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Tên hiển thị</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tên của bạn"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email không thể thay đổi. Liên hệ hỗ trợ nếu cần thiết.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Mô tả</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Giới thiệu về bản thân..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfile.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Chỉnh sửa hồ sơ
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Tùy chọn chung</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ngôn ngữ</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => handlePreferenceChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Múi giờ</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => handlePreferenceChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Giao diện</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Theo hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động lưu</Label>
                    <p className="text-sm text-muted-foreground">
                      Tự động lưu các thay đổi khi chỉnh sửa
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chế độ compact</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị giao diện gọn gàng hơn
                    </p>
                  </div>
                  <Switch
                    checked={preferences.compactMode}
                    onCheckedChange={(checked) => handlePreferenceChange('compactMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Cài đặt thông báo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Thông báo email</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo qua email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Thông báo đẩy</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo trên thiết bị
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Báo cáo hàng tuần</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận báo cáo tổng kết hàng tuần
                    </p>
                  </div>
                  <Switch
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked) => handlePreferenceChange('weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận email về tính năng mới và khuyến mãi
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Bảo mật</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Xác thực 2 yếu tố (2FA)</Label>
                    <p className="text-sm text-muted-foreground">
                      Bảo vệ tài khoản với lớp bảo mật bổ sung
                    </p>
                  </div>
                  <Switch
                    checked={preferences.twoFactorEnabled}
                    onCheckedChange={(checked) => handlePreferenceChange('twoFactorEnabled', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Đổi mật khẩu</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu hiện tại"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Mật khẩu mới"
                  />
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <Button>
                    <Lock className="h-4 w-4 mr-2" />
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phiên đăng nhập</Label>
                <p className="text-sm text-muted-foreground">
                  Quản lý các thiết bị đang đăng nhập vào tài khoản
                </p>
                <Button variant="outline">
                  Xem phiên đăng nhập
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}