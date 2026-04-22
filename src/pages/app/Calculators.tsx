import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, Search, Receipt, Landmark, TrendingDown, BarChart3, Briefcase, ShieldCheck, DollarSign, Building2, LineChart, FileText } from "lucide-react";
import { CalcCard, CalcMeta } from "@/components/calc/CalcCard";
import { cn } from "@/lib/utils";

const categoryMeta: Record<string, { title: string; subtitle: string; calcs: CalcMeta[] }> = {
  tax: {
    title: "Tax Calculators",
    subtitle: "18 tools across 10 jurisdictions",
    calcs: [
      { slug: "income-tax", name: "Income Tax Slab", desc: "Old vs New regime, all FYs", flags: ["🇮🇳"], icon: Receipt },
      { slug: "tds", name: "TDS Calculator", desc: "Section-wise rates, surcharge", flags: ["🇮🇳"], icon: Receipt },
      { slug: "advance-tax", name: "Advance Tax", desc: "Quarter-wise obligation", flags: ["🇮🇳"], icon: Receipt },
      { slug: "hra", name: "HRA Exemption", desc: "Metro vs non-metro calculation", flags: ["🇮🇳"], icon: Receipt },
      { slug: "stcg", name: "Capital Gains STCG", desc: "Short term with exemptions", flags: ["🇮🇳"], icon: TrendingDown },
      { slug: "ltcg", name: "Capital Gains LTCG", desc: "Indexation + 10% flat", flags: ["🇮🇳"], icon: TrendingDown },
      { slug: "80c-planner", name: "80C/80D Planner", desc: "Deduction optimizer", flags: ["🇮🇳"], pro: true, icon: Receipt },
      { slug: "uk-income-tax", name: "UK Income Tax", desc: "PAYE, NI, personal allowance", flags: ["🇬🇧"], pro: true, icon: Receipt },
      { slug: "us-federal-tax", name: "US Federal Tax", desc: "1040, brackets, FICA", flags: ["🇺🇸"], pro: true, icon: Receipt },
      { slug: "gst", name: "GST Calculator", desc: "All slabs, forward & reverse", flags: ["🇮🇳"], icon: FileText },
      { slug: "capital-gains-property", name: "Capital Gains Property", desc: "With indexation benefit", flags: ["🇮🇳"], pro: true, icon: Building2 },
      { slug: "dividend-tax", name: "Dividend Tax", desc: "Domestic + foreign", flags: ["🇮🇳"], pro: true, icon: DollarSign },
    ],
  },
  loans: {
    title: "Loans & EMI",
    subtitle: "12 calculators for borrowers and lenders",
    calcs: [
      { slug: "emi", name: "EMI Calculator", desc: "Monthly instalment + amortisation", flags: ["🇮🇳", "🇬🇧", "🇺🇸"], icon: Landmark },
      { slug: "home-loan", name: "Home Loan EMI", desc: "With prepayment scenarios", flags: ["🇮🇳"], icon: Building2 },
      { slug: "car-loan", name: "Car Loan EMI", desc: "Monthly + total interest", flags: ["🇮🇳"], icon: Landmark },
      { slug: "personal-loan", name: "Personal Loan", desc: "Quick EMI estimate", flags: ["🇮🇳"], icon: Landmark },
      { slug: "loan-eligibility", name: "Loan Eligibility", desc: "Based on income & FOIR", flags: ["🇮🇳"], pro: true, icon: Landmark },
      { slug: "balance-transfer", name: "Balance Transfer", desc: "Savings calculator", flags: ["🇮🇳"], pro: true, icon: Landmark },
    ],
  },
  depreciation: {
    title: "Depreciation",
    subtitle: "8 methods across regimes",
    calcs: [
      { slug: "wdv", name: "WDV Method", desc: "Written down value depreciation", flags: ["🇮🇳"], icon: TrendingDown },
      { slug: "slm", name: "Straight Line", desc: "Equal annual depreciation", flags: ["🇮🇳", "🇬🇧"], icon: TrendingDown },
      { slug: "income-tax-dep", name: "IT Act Depreciation", desc: "As per Income Tax Act", flags: ["🇮🇳"], pro: true, icon: TrendingDown },
    ],
  },
  ratios: {
    title: "Financial Ratios",
    subtitle: "14 ratios from your statements",
    calcs: [
      { slug: "ratios", name: "All-in-one Ratios", desc: "20+ ratios from P&L + Balance Sheet", flags: ["🇮🇳", "🇬🇧"], icon: BarChart3 },
      { slug: "current-ratio", name: "Current Ratio", desc: "Liquidity health check", flags: ["🇮🇳"], icon: BarChart3 },
      { slug: "debt-equity", name: "Debt to Equity", desc: "Leverage analysis", flags: ["🇮🇳"], icon: BarChart3 },
    ],
  },
  payroll: {
    title: "Payroll & HR",
    subtitle: "10 payroll calculations",
    calcs: [
      { slug: "salary", name: "Salary Breakup", desc: "CTC to take-home breakdown", flags: ["🇮🇳"], icon: Briefcase },
      { slug: "gratuity", name: "Gratuity", desc: "As per Payment of Gratuity Act", flags: ["🇮🇳"], icon: Briefcase },
      { slug: "pf", name: "PF Calculator", desc: "Employee + employer share", flags: ["🇮🇳"], icon: Briefcase },
      { slug: "leave-encashment", name: "Leave Encashment", desc: "Tax-exempt amount", flags: ["🇮🇳"], pro: true, icon: Briefcase },
    ],
  },
  audit: {
    title: "Audit Tools",
    subtitle: "9 standards-aligned tools",
    calcs: [
      { slug: "materiality", name: "Materiality", desc: "Planning materiality + tolerable misstatement", flags: ["🇮🇳", "🇬🇧"], pro: true, icon: ShieldCheck },
      { slug: "sample-size", name: "Sample Size", desc: "Statistical sampling", flags: ["🇮🇳"], pro: true, icon: ShieldCheck },
    ],
  },
  valuation: {
    title: "Valuation",
    subtitle: "8 valuation models",
    calcs: [
      { slug: "dcf", name: "DCF", desc: "Discounted cash flow valuation", flags: ["🇮🇳", "🇺🇸"], pro: true, icon: DollarSign },
      { slug: "wacc", name: "WACC", desc: "Weighted average cost of capital", flags: ["🇮🇳"], pro: true, icon: DollarSign },
    ],
  },
  realestate: {
    title: "Real Estate",
    subtitle: "7 property calculators",
    calcs: [
      { slug: "rental-yield", name: "Rental Yield", desc: "Gross & net yield", flags: ["🇮🇳"], icon: Building2 },
      { slug: "stamp-duty", name: "Stamp Duty", desc: "State-wise rates", flags: ["🇮🇳"], icon: Building2 },
    ],
  },
  investment: {
    title: "Investment",
    subtitle: "8 investment planners",
    calcs: [
      { slug: "sip", name: "SIP Calculator", desc: "Future value of monthly investment", flags: ["🇮🇳"], icon: LineChart },
      { slug: "lumpsum", name: "Lumpsum", desc: "One-time investment growth", flags: ["🇮🇳"], icon: LineChart },
      { slug: "ppf", name: "PPF Calculator", desc: "15-year tax-free returns", flags: ["🇮🇳"], icon: LineChart },
    ],
  },
  gst: {
    title: "GST / VAT",
    subtitle: "10 indirect tax tools",
    calcs: [
      { slug: "gst", name: "GST Calculator", desc: "Forward & reverse, all slabs", flags: ["🇮🇳"], icon: FileText },
      { slug: "uk-vat", name: "UK VAT", desc: "Standard 20% + reduced rates", flags: ["🇬🇧"], pro: true, icon: FileText },
      { slug: "uae-vat", name: "UAE VAT", desc: "5% standard rate", flags: ["🇦🇪"], pro: true, icon: FileText },
    ],
  },
};

const filters = ["All", "India", "UK", "USA", "UAE"];
const flagMap: Record<string, string> = { India: "🇮🇳", UK: "🇬🇧", USA: "🇺🇸", UAE: "🇦🇪" };

export default function Calculators() {
  const { category = "tax" } = useParams();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const meta = categoryMeta[category] ?? { title: "Calculators", subtitle: "Coming soon", calcs: [] };

  const filtered = meta.calcs.filter((c) => {
    if (filter !== "All" && !c.flags.includes(flagMap[filter])) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link to="/dashboard" className="hover:text-white">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white">{meta.title}</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="mt-1 text-secondary text-sm">{meta.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-pill text-xs font-medium border transition-all",
                filter === f
                  ? "bg-gradient-orange text-white border-transparent glow-orange"
                  : "bg-card border-white/10 text-secondary hover:border-primary/40 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="md:ml-auto relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in category..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-card border border-white/[0.08] text-sm focus:outline-none focus:border-primary/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => <CalcCard key={c.slug} calc={c} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-secondary text-sm">No calculators match your filter.</div>
      )}
    </div>
  );
}
