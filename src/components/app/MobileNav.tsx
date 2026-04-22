import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calculator, CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/calculators/tax", label: "Tools", icon: Calculator },
  { to: "/compliance", label: "Tasks", icon: CalendarCheck },
  { to: "/ai", label: "AI", icon: Sparkles },
];

export const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[hsl(var(--surface-sidebar))]/95 backdrop-blur-md border-t border-white/[0.06] flex">
    {items.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
            isActive ? "text-primary" : "text-tertiary"
          )
        }
      >
        <Icon className="h-5 w-5" />
        {label}
      </NavLink>
    ))}
  </nav>
);
