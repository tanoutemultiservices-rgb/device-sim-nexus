import {
  LayoutDashboard,
  Smartphone,
  CreditCard,
  Users,
  PlayCircle,
  Coins,
  Plus,
  LogOut,
  UserCircle,
  History,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  // Admin menu items
  {
    title: "لوحة التحكم",
    url: "/",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    title: "الأجهزة",
    url: "/devices",
    icon: Smartphone,
    roles: ["ADMIN"],
  },
  {
    title: "بطاقات SIM",
    url: "/sim-cards",
    icon: CreditCard,
    roles: ["ADMIN"],
  },
  {
    title: "المستخدمون",
    url: "/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "جميع التفعيلات",
    url: "/activations",
    icon: PlayCircle,
    roles: ["ADMIN"],
  },
  {
    title: "جميع الشحنات",
    url: "/topups",
    icon: Coins,
    roles: ["ADMIN"],
  },
  // Customer menu items
  {
    title: "تفعيل بطاقة",
    url: "/activation-request",
    icon: Plus,
    roles: ["CUSTOMER"],
  },
  {
    title: "شحن",
    url: "/topup-request",
    icon: Plus,
    roles: ["CUSTOMER"],
  },
  {
    title: "سجل التفعيلات",
    url: "/activations",
    icon: History,
    roles: ["CUSTOMER"],
  },
  {
    title: "سجل الشحنات",
    url: "/topups",
    icon: History,
    roles: ["CUSTOMER"],
  },
  {
    title: "الملف الشخصي",
    url: "/profile",
    icon: UserCircle,
    roles: ["ADMIN", "CUSTOMER"],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  // Handle database typo: CUSTMER should be CUSTOMER
  const normalizedRole = user.ROLE === "CUSTMER" ? "CUSTOMER" : user.ROLE;
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(normalizedRole)
  );

  return (
    <Sidebar collapsible="icon" dir="rtl">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight">chargi.store</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && "القائمة الرئيسية"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-secondary"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg border border-border">
              <Coins className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">الرصيد</span>
                <span className="text-sm font-bold text-foreground">
                  {Number(user.BALANCE || 0).toFixed(2)} درهم
                </span>
              </div>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="justify-start"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>تسجيل الخروج</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
