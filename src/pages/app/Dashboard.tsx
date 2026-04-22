import { Link } from "react-router-dom";
import {
  AlertTriangle, ArrowRight, Calculator, Receipt, Landmark,
  FileText, TrendingUp, Briefcase, BarChart3, Calendar, CheckCircle2,
} from "lucide-react";

const stats = [
  { label: "Active Clients", value: "0", sub: "Add your first client →", to: "/clients" },
  { label: "Calculations Today", value: "0", sub: "Start calculating", to: "/calculators/tax" },
  { label: "Filings Due", value: "3", sub: "This month", accent: true, to: "/compliance" },
  { label: "Tools Available", value: "100+", sub: "Pro plan", to: "/calculators/tax" },
];

const quickActions = [
  { to: "/calculator/income-tax", icon: Receipt, name: "Income Tax", desc: "Slab-wise tax for FY 2024-25" },
  { to: "/calculator/emi", icon: Landmark, name: "EMI Calculator", desc: "Monthly instalment + amortisation" },
  { to: "/calculator/gst", icon: FileText, name: "GST Calculator", desc: "Forward & reverse GST" },
  { to: "/calculator/capital-gains", icon: TrendingUp, name: "Capital Gains", desc: "STCG & LTCG with indexation" },
  { to: "/calculator/salary", icon: Briefcase, name: "Salary Breakup", desc: "CTC to take-home breakdown" },
  { to: "/calculator/ratios", icon: BarChart3, name: "Financial Ratios", desc: "20+ ratios from P&L + Balance Sheet" },
];

const compliance = [
  { dot: "bg-destructive", name: "GSTR-3B", date: "Due Jan 20, 2025" },
  { dot: "bg-warning", name: "TDS Return Q3", date: "Due Jan 31, 2025" },
  { dot: "bg-success", name: "Advance Tax Q3", date: "Due Mar 15, 2025" },
];

export default function Dashboard() {
  return (
    <div className="relative">
      {/* Decorative background growth line */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 right-0 w-full h-[200px]"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="dashFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(249,115,22,0.05)" />
            <stop offset="100%" stopColor="rgba(249,115,22,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,180 C200,170 350,140 500,110 C650,80 800,70 950,45 C1080,25 1150,15 1200,10 L1200,200 L0,200 Z"
          fill="url(#dashFill)"
        />
        <path
          className="dashboard-bg-line"
          d="M0,180 C200,170 350,140 500,110 C650,80 800,70 950,45 C1080,25 1150,15 1200,10"
          fill="none"
          stroke="rgba(249,115,22,0.15)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto space-y-8" style={{ zIndex: 1 }}>
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Good morning, <span className="text-gradient-orange">Amogh</span>
        </h1>
        <p className="mt-2 flex items-center gap-2 text-warning text-sm">
          <AlertTriangle className="h-4 w-4" />
          You have 3 compliance deadlines this week
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card-surface p-5 block">
            <div className="text-xs text-tertiary font-medium uppercase tracking-wide">{s.label}</div>
            <div className={`mt-2 text-3xl font-bold ${s.accent ? "text-gradient-orange" : ""}`}>
              {s.value}
            </div>
            <div className="mt-1 text-xs text-secondary">{s.sub}</div>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-semibold">Jump back in</h2>
          <Link to="/calculators/tax" className="text-xs text-primary hover:underline">View all calculators →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="card-surface p-5 group flex items-start gap-4 hover:-translate-y-0.5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center group-hover:bg-gradient-orange transition-all shrink-0">
                <a.icon className="h-5 w-5 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-xs text-secondary mt-0.5">{a.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Calculations</h3>
            <Link to="/history" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="py-12 text-center">
            <div className="h-12 w-12 mx-auto rounded-xl bg-card-elevated grid place-items-center mb-3">
              <Calculator className="h-6 w-6 text-tertiary" />
            </div>
            <div className="text-sm font-medium">No calculations yet</div>
            <div className="text-xs text-secondary mt-1">Your recent work will appear here</div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Upcoming Compliance</h3>
            <Link to="/compliance" className="text-xs text-primary hover:underline">View calendar →</Link>
          </div>
          <ul className="space-y-2">
            {compliance.map((c) => (
              <li key={c.name} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-secondary flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {c.date}
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-xs px-2.5 py-1 rounded-md border border-white/10 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Mark filed
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>
    </div>
  );
}
