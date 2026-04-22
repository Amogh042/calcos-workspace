import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, UserPlus, Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";

const filings = [
  { name: "GSTR-3B", date: "Jan 20, 2025", status: "overdue", group: "Overdue", client: null },
  { name: "TDS Return Q3", date: "Jan 31, 2025", status: "pending", group: "This Week", client: null },
  { name: "GSTR-1", date: "Feb 11, 2025", status: "pending", group: "This Month", client: null },
  { name: "GSTR-3B", date: "Feb 20, 2025", status: "pending", group: "This Month", client: null },
  { name: "Advance Tax Q4", date: "Mar 15, 2025", status: "pending", group: "Later", client: null },
  { name: "TDS Return Q4", date: "May 31, 2025", status: "pending", group: "Later", client: null },
  { name: "ITR Filing", date: "Jul 31, 2025", status: "pending", group: "Later", client: null },
];

const statusStyles: Record<string, { dot: string; badge: string }> = {
  overdue: { dot: "bg-destructive", badge: "bg-destructive/15 text-destructive" },
  pending: { dot: "bg-warning", badge: "bg-warning/15 text-warning" },
  filed:   { dot: "bg-success", badge: "bg-success/15 text-success" },
};

export default function Compliance() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const groups = ["Overdue", "This Week", "This Month", "Later"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Tracker</h1>
          <p className="mt-1 text-sm text-secondary">Never miss a filing deadline again.</p>
        </div>
        <button className="px-4 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange hover:glow-orange-strong transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Filing
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <button className="h-9 w-9 grid place-items-center rounded-lg bg-card border border-white/10 hover:border-primary/40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-sm w-32 text-center">January 2025</span>
          <button className="h-9 w-9 grid place-items-center rounded-lg bg-card border border-white/10 hover:border-primary/40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-4 text-xs">
          <Stat label="Filed" value="0" color="text-success" dot="bg-success" />
          <Stat label="Pending" value="6" color="text-warning" dot="bg-warning" />
          <Stat label="Overdue" value="1" color="text-destructive" dot="bg-destructive" />
        </div>

        <div className="grid grid-cols-2 p-1 rounded-lg bg-card border border-white/10">
          {[
            { v: "list", icon: List, label: "List" },
            { v: "calendar", icon: Calendar, label: "Calendar" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setView(o.v as any)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                view === o.v ? "bg-gradient-orange text-white" : "text-secondary hover:text-white"
              )}
            >
              <o.icon className="h-3.5 w-3.5" /> {o.label}
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <div className="space-y-6">
          {groups.map((g) => {
            const items = filings.filter((f) => f.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-2">{g}</h3>
                <div className="card-surface divide-y divide-white/[0.04] overflow-hidden">
                  {items.map((f, i) => {
                    const s = statusStyles[f.status];
                    return (
                      <div key={i} className="group flex items-center gap-4 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                        <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{f.name}</div>
                          <div className="text-xs text-tertiary">{f.client ?? "Unassigned"}</div>
                        </div>
                        <div className="text-xs text-secondary hidden sm:block">{f.date}</div>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-pill capitalize", s.badge)}>
                          {f.status}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs px-2.5 py-1 rounded-md border border-white/10 hover:border-primary/40 hover:text-primary flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Mark Filed
                          </button>
                          <button className="text-xs px-2.5 py-1 rounded-md border border-white/10 hover:border-primary/40 hover:text-primary flex items-center gap-1">
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
        </div>
      ) : (
        <CalendarView />
      )}
    </div>
  );
}

const Stat = ({ label, value, color, dot }: any) => (
  <div className="flex items-center gap-2">
    <span className={`h-2 w-2 rounded-full ${dot}`} />
    <span className="text-tertiary">{label}</span>
    <span className={cn("font-bold", color)}>{value}</span>
  </div>
);

const CalendarView = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const dotsOn: Record<number, string> = { 11: "bg-warning", 20: "bg-destructive", 31: "bg-warning" };
  return (
    <div className="card-surface p-5">
      <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-wide text-tertiary mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 3 }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map((d) => (
          <button
            key={d}
            className="aspect-square rounded-lg border border-white/[0.04] hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-xs"
          >
            <span>{d}</span>
            {dotsOn[d] && <span className={`mt-1 h-1.5 w-1.5 rounded-full ${dotsOn[d]}`} />}
          </button>
        ))}
      </div>
    </div>
  );
};
