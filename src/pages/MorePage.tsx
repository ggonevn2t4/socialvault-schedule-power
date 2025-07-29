import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  CreditCard, 
  Users, 
  HelpCircle,
  Bell,
  User,
  Link,
  Workflow,
  FolderOpen,
  Palette,
  Rss
} from "lucide-react";

const moreOptions = [
  {
    title: "Thành viên nhóm",
    description: "Quản lý thành viên và quyền",
    icon: Users,
    url: "/team",
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Quy trình duyệt",
    description: "Thiết lập quy trình phê duyệt",
    icon: Workflow,
    url: "/approval",
    color: "bg-secondary/10 text-secondary",
    badge: 1
  },
  {
    title: "Thư viện nội dung",
    description: "Quản lý tài nguyên media",
    icon: FolderOpen,
    url: "/content-library",
    color: "bg-success/10 text-success"
  },
  {
    title: "Phân tích đối thủ",
    description: "Theo dõi chiến lược đối thủ",
    icon: Users,
    url: "/competitors",
    color: "bg-warning/10 text-warning",
    badge: 2
  },
  {
    title: "RSS Feeds",
    description: "Quản lý nguồn cấp dữ liệu",
    icon: Rss,
    url: "/rss-feeds",
    color: "bg-violet-500/10 text-violet-500"
  },
  {
    title: "Hướng dẫn thương hiệu",
    description: "Tiêu chuẩn thiết kế và nội dung",
    icon: Palette,
    url: "/brand-guidelines",
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    title: "Tài khoản liên kết",
    description: "Kết nối mạng xã hội",
    icon: Link,
    url: "/connected-accounts",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Thanh toán",
    description: "Quản lý gói và thanh toán",
    icon: CreditCard,
    url: "/billing",
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    title: "Hồ sơ cá nhân",
    description: "Cài đặt tài khoản",
    icon: User,
    url: "/profile",
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    title: "Tích hợp",
    description: "API và ứng dụng bên thứ ba",
    icon: Settings,
    url: "/integrations",
    color: "bg-gray-500/10 text-gray-500"
  },
  {
    title: "Thông báo",
    description: "Cài đặt thông báo",
    icon: Bell,
    url: "/notifications",
    color: "bg-red-500/10 text-red-500"
  },
  {
    title: "Trợ giúp & Hỗ trợ",
    description: "Tài liệu và liên hệ hỗ trợ",
    icon: HelpCircle,
    url: "/help",
    color: "bg-indigo-500/10 text-indigo-500"
  }
];

export default function MorePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Thêm</h1>
          <p className="text-muted-foreground">
            Truy cập tất cả công cụ và cài đặt
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {moreOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.title}
              className="card-premium hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              onClick={() => navigate(option.url)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${option.color} relative`}>
                    <Icon className="h-6 w-6" />
                    {option.badge && (
                      <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full text-xs h-5 min-w-5 flex items-center justify-center">
                        {option.badge}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}