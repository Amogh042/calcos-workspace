import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { CountrySelector } from "./CountrySelector";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/documents": "Documents",
  "/compliance": "Compliance",
  "/history": "History",
  "/ai": "CalcAI",
  "/reports": "Reports",
  "/settings": "Settings",
};

const useTitle = () => {
  const { pathname } = useLocation();
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/calculators/")) return "Calculators";
  if (pathname.startsWith("/calculator/")) return "Calculator";
  return "CalcOS";
};

export const TopBar = () => {
  const title = useTitle();
  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center gap-4 px-6 bg-background/95 backdrop-blur-md border-b border-white/[0.06]">
      <h1 className="text-base font-semibold tracking-tight md:min-w-[160px]">{title}</h1>

      <div className="flex-1 max-w-xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tertiary" />
        <input
          placeholder="Search 100+ calculators..."
          className="w-full h-9 pl-9 pr-16 rounded-lg bg-card border border-white/[0.08] text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 text-tertiary">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="h-[18px] w-[18px] text-secondary" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <CountrySelector compact />
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="h-8 w-8 rounded-full bg-gradient-orange grid place-items-center text-xs font-bold">A</div>
          <span className="hidden lg:block text-sm font-medium">Amogh</span>
        </div>
      </div>
    </header>
  );
};
