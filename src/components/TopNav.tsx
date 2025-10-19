import { LayoutDashboard, Smartphone, CreditCard, Users, PlayCircle, Coins } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Devices", url: "/devices", icon: Smartphone },
  { title: "SIM Cards", url: "/sim-cards", icon: CreditCard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Activations", url: "/activations", icon: PlayCircle },
  { title: "Top-ups", url: "/topups", icon: Coins },
];

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <div className="mr-8 flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Telecom Manager</span>
        </div>
        <div className="flex items-center space-x-1 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
