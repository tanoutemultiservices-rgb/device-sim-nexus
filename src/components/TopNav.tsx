import { LayoutDashboard, Smartphone, CreditCard, Users, PlayCircle, Coins, Plus, LogOut, UserCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "لوحة التحكم", url: "/", icon: LayoutDashboard, roles: ['ADMIN'] },
  { title: "الأجهزة", url: "/devices", icon: Smartphone, roles: ['ADMIN'] },
  { title: "بطاقات SIM", url: "/sim-cards", icon: CreditCard, roles: ['ADMIN'] },
  { title: "المستخدمون", url: "/users", icon: Users, roles: ['ADMIN'] },
  { title: "التفعيلات", url: "/activations", icon: PlayCircle, roles: ['ADMIN', 'CUSTOMER'] },
  { title: "الشحنات", url: "/topups", icon: Coins, roles: ['ADMIN', 'CUSTOMER'] },
  { title: "طلب شحن", url: "/topup-request", icon: Plus, roles: ['CUSTOMER'] },
  { title: "طلب تفعيل", url: "/activation-request", icon: Plus, roles: ['CUSTOMER'] },
];

export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm" dir="rtl">
      <div className="flex h-16 items-center px-6">
        <div className="mr-8 flex items-center space-x-3 space-x-reverse">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">مدير الاتصالات</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse flex-1">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <NavLink
            to="/profile"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <UserCircle className="h-5 w-5" />
            <span>{user.username} ({user.role})</span>
          </NavLink>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
