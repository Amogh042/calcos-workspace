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
    <header className="sticky top-0 z-30 h-[60px] flex items-center gap-4 px-6 glass-topbar">
      <h1
        className="text-base font-semibold tracking-tight md:min-w-[160px]"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        {title}
      </h1>

      <div className="flex-1 max-w-xl mx-auto relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "rgba(255,255,255,0.35)" }}
        />
        <input
          placeholder="Search 100+ calculators..."
          className="glass-input w-full h-9 pl-9 pr-16 text-sm"
          style={{ color: "rgba(255,255,255,0.85)" }}
        />
        <kbd
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-white/5 transition-colors">
          <Bell
            className="h-[18px] w-[18px]"
            style={{ color: "rgba(255,255,255,0.70)" }}
          />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <CountrySelector compact />

        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="h-8 w-8 rounded-full bg-gradient-orange grid place-items-center text-xs font-bold text-white">
            A
          </div>
          <span
            className="hidden lg:block text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            Amogh
          </span>
        </div>
      </div>
    </header>
  );
};