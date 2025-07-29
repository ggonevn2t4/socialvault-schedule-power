import { ChevronRight, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

const routeMapping: Record<string, BreadcrumbItemData[]> = {
  "/": [{ label: "Trang chủ" }],
  "/calendar": [
    { label: "Trang chủ", href: "/" },
    { label: "Lịch trình" }
  ],
  "/posts": [
    { label: "Trang chủ", href: "/" },
    { label: "Bài viết" }
  ],
  "/create": [
    { label: "Trang chủ", href: "/" },
    { label: "Bài viết", href: "/posts" },
    { label: "Tạo bài viết" }
  ],
  "/analytics": [
    { label: "Trang chủ", href: "/" },
    { label: "Phân tích" }
  ],
  "/content-library": [
    { label: "Trang chủ", href: "/" },
    { label: "Công cụ", href: "/more" },
    { label: "Thư viện nội dung" }
  ],
  "/competitors": [
    { label: "Trang chủ", href: "/" },
    { label: "Công cụ", href: "/more" },
    { label: "Phân tích đối thủ" }
  ],
  "/team": [
    { label: "Trang chủ", href: "/" },
    { label: "Nhóm", href: "/more" },
    { label: "Thành viên" }
  ],
  "/profile": [
    { label: "Trang chủ", href: "/" },
    { label: "Cài đặt", href: "/more" },
    { label: "Hồ sơ" }
  ],
  "/billing": [
    { label: "Trang chủ", href: "/" },
    { label: "Cài đặt", href: "/more" },
    { label: "Thanh toán" }
  ],
  "/more": [
    { label: "Trang chủ", href: "/" },
    { label: "Thêm" }
  ]
};

export function Breadcrumb() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const breadcrumbs = routeMapping[currentPath] || [
    { label: "Trang chủ", href: "/" },
    { label: "Trang không xác định" }
  ];

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb for single items
  }

  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <NavLink to={item.href}>
                    {item.label}
                  </NavLink>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}