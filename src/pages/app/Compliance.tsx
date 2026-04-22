import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, UserPlus, Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_FILINGS = [
  { name: "GSTR-3B", date: "2026-04-20", status: "overdue" as const },
  { name: "GSTR-1", date: "2026-04-11", status: "filed" as const },
  { name: "TDS Return Q4", date: "2026-05-31", status: "pending" as const },
  { name: "Advance Tax Q1 FY27", date: "2026-06-15", status: "pending" as const },
  { name: "GSTR-1", date: "2026-05-11", status: "pending" as const },
  { name: "GSTR-3B", date: "2026-05-20", status: "pending" as const },
  { name: "ITR Filing", date: "2026-07-31", status: "pending" as const },
  { name: "TDS Return Q1", date: "2026-07-31", status: "pending" as const },
  { name: "Advance Tax Q2 FY27", date: "2026-09-15", status: "pending" as const },
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const statusStyles: Record<string, { dot: string; badge: string }> = {
  overdue: { dot: "bg-destructive", badge: "bg-destructive/15 text-destructive" },
  pending: { dot: "bg-warning",     badge: "bg-warning/15 text-warning" },
  filed:   { dot: "bg-success",     badge: "bg-success/15 text-success" },
};

function groupFilings(filings: typeof ALL_FILINGS) {
  const today = new Date();
  const weekLater = new Date(today); weekLater.setDate(today.getDate() + 7);
  const monthLater = new Date(today); monthLater.setDate(today.getDate() + 30);

  const overdue: typeof ALL_FILINGS = [];
  const thisWeek: typeof ALL_FILINGS = [];
  const thisMonth: typeof ALL_FILINGS = [];
  const later: typeof ALL_FILINGS = [];

  filings.forEach((f) => {
    const d = new Date(f.date);
    if (f.status === "filed") return;
    if (d < today) overdue.push(f);
    else if (d <= weekLater) thisWeek.push(f);
    else if (d <= monthLater) thisMonth.push(f);
    else later.push(f);
  });

  return { overdue, thisWeek, thisMonth, later };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Compliance() {
  const now = new Date();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [filings, setFilings] = useState(ALL_FILINGS);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const markFiled = (name: string, date: string) => {
    setFilings(prev => prev.map(f => f.name === name && f.date === date ? { ...f, status: "filed" as const } : f));
  };

  const visibleFilings = filings.filter(f => {
    const d = new Date(f.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const allGrouped = groupFilings(filings);

  const filed   = filings.filter(f => f.status === "filed").length;
  const pending = filings.filter(f => f.status === "pending").length;
  const overdue = filings.filter(f => {
    return f.status !== "filed" && new Date(f.date) < new Date();
  }).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Tracker</h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
            Never miss a filing deadline again.
          </p>
        </div>
        <button className="px-4 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange hover:glow-orange-strong transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Filing
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="h-9 w-9 grid place-items-center rounded-lg bg-card border border-white/10 hover:border-primary/40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-sm w-36 text-center">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} className="h-9 w-9 grid place-items-center rounded-lg bg-card border border-white/10 hover:border-primary/40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-4 text-xs">
          <Stat label="Filed"   value={filed}   color="text-success"     dot="bg-success" />
          <Stat label="Pending" value={pending} color="text-warning"     dot="bg-warning" />
          <Stat label="Overdue" value={overdue} color="text-destructive" dot="bg-destructive" />
        </div>

        <div className="grid grid-cols-2 p-1 rounded-lg bg-card border border-white/10">
          {[
            { v: "list",     icon: List,     label: "List" },
            { v: "calendar", icon: Calendar, label: "Calendar" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setView(o.v as any)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                view === o.v
                  ? "bg-gradient-orange text-white"
                  : "hover:text-white"
              )}
              style={{ color: view === o.v ? undefined : "rgba(255,255,255,0.65)" }}
            >
              <o.icon className="h-3.5 w-3.5" /> {o.label}
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <div className="space-y-6">
          {(
            [
              { label: "Overdue",    items: allGrouped.overdue },
              { label: "This Week",  items: allGrouped.thisWeek },
              { label: "This Month", items: allGrouped.thisMonth },
              { label: "Later",      items: allGrouped.later },
            ] as const
          ).map(({ label, items }) => {
            if (!items.length) return null;
            return (
              <div key={label}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "rgba(255,255,255,0.40)" }}>
                  {label}
                </h3>
                <div className="card-surface divide-y divide-white/[0.04] overflow-hidden">
                  {items.map((f, i) => {
                    const s = statusStyles[f.status];
                    return (
                      <div key={i} className="group flex items-center gap-4 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm" style={{ color: "rgba(255,255,255,0.90)" }}>
                            {f.name}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                            Unassigned
                          </div>
                        </div>
                        <div className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.65)" }}>
                          {formatDate(f.date)}
                        </div>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-pill capitalize", s.badge)}>
                          {f.status}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => markFiled(f.name, f.date)}
                            className="text-xs px-2.5 py-1 rounded-md border border-white/10 hover:border-primary/40 hover:text-primary flex items-center gap-1"
                            style={{ color: "rgba(255,255,255,0.65)" }}
                          >
                            <CheckCircle2 className="h-3 w-3" /> Mark Filed
                          </button>
                          <button
                            className="text-xs px-2.5 py-1 rounded-md border border-white/10 hover:border-primary/40 hover:text-primary flex items-center gap-1"
                            style={{ color: "rgba(255,255,255,0.65)" }}
                          >
                            <UserPlus className="h-3 w-3" /> Assign
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!allGrouped.overdue.length && !allGrouped.thisWeek.length &&
           !allGrouped.thisMonth.length && !allGrouped.later.length && (
            <div className="card-surface p-12 text-center">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-success" />
              <div className="font-semibold">All caught up!</div>
              <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>
                No pending filings right now.
              </div>
            </div>
          )}
        </div>
      ) : (
        <CalendarView month={month} year={year} filings={visibleFilings} />
      )}
    </div>
  );
}

const Stat = ({ label, value, color, dot }: any) => (
  <div className="flex items-center gap-2">
    <span className={`h-2 w-2 rounded-full ${dot}`} />
    <span style={{ color: "rgba(255,255,255,0.40)" }}>{label}</span>
    <span className={cn("font-bold", color)}>{value}</span>
  </div>
);

const CalendarView = ({ month, year, filings }: {
  month: number; year: number; filings: typeof ALL_FILINGS;
}) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const dotMap: Record<number, string> = {};
  filings.forEach(f => {
    const d = new Date(f.date).getDate();
    if (f.status === "overdue" || (f.status !== "filed" && new Date(f.date) < today)) {
      dotMap[d] = "bg-destructive";
    } else if (f.status === "pending") {
      dotMap[d] = dotMap[d] || "bg-warning";
    } else if (f.status === "filed") {
      dotMap[d] = dotMap[d] || "bg-success";
    }
  });

  return (
    <div className="card-surface p-5">
      <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-wide mb-2"
        style={{ color: "rgba(255,255,255,0.40)" }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`pad-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const isToday =
            today.getDate() === d &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          return (
            <button
              key={d}
              className={cn(
                "aspect-square rounded-lg border transition-all flex flex-col items-center justify-center text-xs",
                isToday
                  ? "border-primary/60 bg-primary/10 text-primary font-bold"
                  : "border-white/[0.04] hover:border-primary/40 hover:bg-primary/5"
              )}
              style={{ color: isToday ? undefined : "rgba(255,255,255,0.75)" }}
            >
              <span>{d}</span>
              {dotMap[d] && (
                <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${dotMap[d]}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};