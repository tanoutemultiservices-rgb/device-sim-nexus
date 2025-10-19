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
  Menu,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
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
    title: " تفعيل بطاقة",
    url: "/activation-request",
    icon: Plus,
    roles: ["CUSTOMER"],
  },
  {
    title: "تعبئة",
    url: "/topup-request",
    icon: Plus,
    roles: ["CUSTOMER"],
  },
  {
    title: "ACTIVATIONS",
    url: "/activations",
    icon: History,
    roles: ["CUSTOMER"],
  },
  {
    title: "RECHARGES",
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
export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  // Handle database typo: CUSTMER should be CUSTOMER
  const normalizedRole = user.ROLE === "CUSTMER" ? "CUSTOMER" : user.ROLE;
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(normalizedRole));
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm" dir="rtl">
      <div className="flex h-16 items-center px-4 md:px-6 gap-2 md:gap-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg md:text-xl tracking-tight">chargi.store</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2 space-x-reverse flex-1 mx-4">
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
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden flex-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64" dir="rtl">
              <div className="flex flex-col gap-2 mt-8">
                {filteredMenuItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    end={item.url === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2 px-3 md:px-6 py-2 bg-secondary/50 rounded-lg border border-border">
          <Coins className="h-4 md:h-5 w-4 md:w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">الرصيد</span>
            <span className="text-xs md:text-sm font-bold text-foreground">{Number(user.BALANCE || 0).toFixed(2)} درهم</span>
          </div>
        </div>
        <div className="flex items-center">
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
