import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FolderOpen, CalendarCheck, Clock,
  Receipt, Landmark, TrendingDown, BarChart3, Briefcase,
  ShieldCheck, DollarSign, Building2, LineChart, FileText,
  Sparkles, Download, Settings,
} from "lucide-react";
import { Logo } from "./Logo";
import { CountrySelector } from "./CountrySelector";
import { cn } from "@/lib/utils";

const workspace = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/compliance", label: "Compliance", icon: CalendarCheck },
  { to: "/history", label: "History", icon: Clock },
];

const calculators = [
  { to: "/calculators/tax", label: "Tax Tools", icon: Receipt, badge: 18 },
  { to: "/calculators/loans", label: "Loans & EMI", icon: Landmark, badge: 12 },
  { to: "/calculators/depreciation", label: "Depreciation", icon: TrendingDown, badge: 8 },
  { to: "/calculators/ratios", label: "Financial Ratios", icon: BarChart3, badge: 14 },
  { to: "/calculators/payroll", label: "Payroll & HR", icon: Briefcase, badge: 10 },
  { to: "/calculators/audit", label: "Audit Tools", icon: ShieldCheck, badge: 9 },
  { to: "/calculators/valuation", label: "Valuation", icon: DollarSign, badge: 8 },
  { to: "/calculators/realestate", label: "Real Estate", icon: Building2, badge: 7 },
  { to: "/calculators/investment", label: "Investment", icon: LineChart, badge: 8 },
  { to: "/calculators/gst", label: "GST / VAT", icon: FileText, badge: 10 },
];

const tools = [
  { to: "/ai", label: "CalcAI Assistant", icon: Sparkles, glow: true },
  { to: "/reports", label: "Reports", icon: Download },
];

const SectionHeader = ({ children }: { children: string }) => (
  <div
    className="px-5 pt-5 pb-2 text-[10px] font-semibold uppercase text-tertiary"
    style={{ letterSpacing: "0.08em" }}
  >
    {children}
  </div>
);

const NavItem = ({ to, label, icon: Icon, badge, glow }: any) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "group relative flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-all",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-secondary hover:text-white hover:bg-white/[0.04]"
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-primary rounded-r" />
        )}
        <div className="relative">
          <Icon className="h-[18px] w-[18px]" />
          {glow && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary pulse-glow" />
          )}
        </div>
        <span className="flex-1 truncate">{label}</span>
        {badge != null && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-tertiary group-hover:bg-primary/15 group-hover:text-primary transition-colors">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-[hsl(var(--surface-sidebar))] border-r border-white/[0.06]">
      <div className="px-5 pt-5 pb-3">
        <Logo />
      </div>

      <div className="px-3 pb-3">
        <CountrySelector />
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin pb-3">
        <SectionHeader>Workspace</SectionHeader>
        {workspace.map((i) => <NavItem key={i.to} {...i} />)}

        <SectionHeader>Calculators</SectionHeader>
        {calculators.map((i) => <NavItem key={i.to} {...i} />)}

        <SectionHeader>Tools</SectionHeader>
        {tools.map((i) => <NavItem key={i.to} {...i} />)}
      </nav>

      <div className="border-t border-white/[0.06] p-3 space-y-2">
        <NavItem to="/settings" label="Settings" icon={Settings} />

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-orange grid place-items-center text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Amogh</div>
            <div className="text-[11px] text-tertiary">amogh@calcos.com</div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-primary/15 text-primary">
            Free
          </span>
        </div>

        <div className="rounded-xl p-3 bg-gradient-orange/10 border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-orange opacity-10" />
          <div className="relative">
            <div className="text-xs font-semibold mb-1">Unlock all 100+ tools</div>
            <div className="text-[11px] text-secondary mb-2">PDF export, CalcAI, premium calculators</div>
            <button className="w-full text-xs font-semibold py-1.5 rounded-md bg-gradient-orange text-white glow-orange hover:glow-orange-strong transition-shadow">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
