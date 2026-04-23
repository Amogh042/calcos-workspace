import { useState, useRef, useEffect } from "react";
import { Bell, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { CountrySelector } from "./CountrySelector";

const ALL_CALCS = [
  { slug: "income-tax", name: "Income Tax Calculator", keywords: "slab tax regime" },
  { slug: "emi", name: "EMI Calculator", keywords: "loan instalment" },
  { slug: "gst", name: "GST Calculator", keywords: "indirect tax vat" },
  { slug: "salary", name: "Salary Breakup", keywords: "ctc take home payroll" },
  { slug: "sip", name: "SIP Calculator", keywords: "mutual fund investment" },
  { slug: "gratuity", name: "Gratuity Calculator", keywords: "retirement hr" },
  { slug: "pf", name: "PF Calculator", keywords: "provident fund epf" },
  { slug: "hra", name: "HRA Exemption", keywords: "house rent allowance" },
  { slug: "stcg", name: "Capital Gains STCG", keywords: "shares equity tax" },
  { slug: "wdv", name: "WDV Depreciation", keywords: "written down value asset" },
  { slug: "ltcg", name: "Capital Gains LTCG", keywords: "long term indexation" },
  { slug: "advance-tax", name: "Advance Tax", keywords: "quarterly payment" },
  { slug: "current-ratio", name: "Financial Ratios Dashboard", keywords: "liquidity analysis" },
  { slug: "break-even", name: "Break Even Calculator", keywords: "fixed variable cost" },
  { slug: "compound-interest", name: "Compound Interest", keywords: "FD savings growth" },
  { slug: "loan-eligibility", name: "Loan Eligibility", keywords: "home loan foir" },
  { slug: "home-loan", name: "Home Loan EMI", keywords: "mortgage property" },
  { slug: "rental-yield", name: "Rental Yield", keywords: "property investment" },
  { slug: "npv", name: "NPV Calculator", keywords: "net present value dcf" },
  { slug: "tds", name: "TDS Calculator", keywords: "tax deducted source" },
  { slug: "ppf", name: "PPF Calculator", keywords: "public provident fund" },
  { slug: "slm", name: "Straight Line Depreciation", keywords: "equal depreciation" },
  { slug: "materiality", name: "Audit Materiality", keywords: "planning performance" },
  { slug: "stamp-duty", name: "Stamp Duty", keywords: "property registration" },
  { slug: "wacc", name: "WACC Calculator", keywords: "cost of capital" },
  { slug: "dcf", name: "DCF Valuation", keywords: "discounted cash flow" },
  { slug: "sample-size", name: "Audit Sample Size", keywords: "statistical sampling" },
  { slug: "80c-planner", name: "80C/80D Planner", keywords: "deduction tax saving" },
  { slug: "balance-transfer", name: "Balance Transfer", keywords: "loan switching" },
  { slug: "dividend-tax", name: "Dividend Tax", keywords: "domestic foreign" },
  { slug: "roe", name: "ROE DuPont Analysis", keywords: "return equity profitability" },
  { slug: "irr", name: "IRR Calculator", keywords: "internal rate return mirr" },
  { slug: "payback", name: "Payback Period", keywords: "investment recovery" },
  { slug: "lumpsum", name: "Lumpsum Calculator", keywords: "one time investment" },
  { slug: "esi", name: "ESI Calculator", keywords: "employee state insurance" },
  { slug: "car-loan", name: "Car Loan EMI", keywords: "vehicle finance" },
  { slug: "personal-loan", name: "Personal Loan", keywords: "unsecured apr" },
  { slug: "prepayment", name: "Loan Prepayment", keywords: "foreclosure saving" },
  { slug: "gst-late-fee", name: "GST Late Fee", keywords: "penalty interest filing" },
  { slug: "itc-reconciliation", name: "ITC Reconciliation", keywords: "gstr-2b claimed" },
  { slug: "uk-income-tax", name: "UK Income Tax", keywords: "paye national insurance" },
  { slug: "us-federal-tax", name: "US Federal Tax", keywords: "1040 fica brackets" },
  { slug: "uae-vat", name: "UAE VAT", keywords: "5 percent indirect" },
  { slug: "uk-vat", name: "UK VAT", keywords: "hmrc 20 percent" },
  { slug: "sg-income-tax", name: "Singapore Income Tax", keywords: "cpf resident" },
  { slug: "debt-equity", name: "Debt to Equity", keywords: "leverage solvency" },
  { slug: "leave-encashment", name: "Leave Encashment", keywords: "tax exempt section" },
  { slug: "capital-gains-property", name: "Property Capital Gains", keywords: "ltcg stcg indexation" },
  { slug: "depreciation-it", name: "IT Act Depreciation", keywords: "income tax block asset" },
  { slug: "net-worth", name: "Net Worth Calculator", keywords: "assets liabilities wealth" },
  { slug: "working-capital", name: "Working Capital", keywords: "current ratio ccc" },
  { slug: "bond-valuation", name: "Bond Valuation", keywords: "coupon yield maturity" },
  { slug: "depreciation-syd", name: "SYD Depreciation", keywords: "sum of years digits" },
  { slug: "profitability-ratios", name: "Profitability Ratios", keywords: "margin ebitda roce" },
  { slug: "rent-vs-buy", name: "Rent vs Buy", keywords: "property decision" },
  { slug: "huf-tax", name: "HUF Tax Calculator", keywords: "hindu undivided family" },
  { slug: "form-16", name: "Form 16 Computation", keywords: "salary tax part b" },
  { slug: "tds-salary", name: "TDS on Salary 192", keywords: "monthly deduction" },
  { slug: "gst-composition", name: "GST Composition Scheme", keywords: "44ad small business" },
  { slug: "export-under-gst", name: "Export GST", keywords: "lut zero rated refund" },
  { slug: "mis-calculator", name: "Post Office MIS", keywords: "monthly income scheme" },
  { slug: "sukanya-samriddhi", name: "Sukanya Samriddhi", keywords: "girl child ssy" },
  { slug: "nps-calculator", name: "NPS Calculator", keywords: "pension retirement annuity" },
  { slug: "senior-citizen-fd", name: "Senior Citizen FD", keywords: "fixed deposit 15h" },
  { slug: "gratuity-eligibility", name: "Gratuity Eligibility", keywords: "5 years service detailed" },
  { slug: "cash-flow", name: "Cash Flow Statement", keywords: "operating investing financing" },
  { slug: "budget-variance", name: "Budget vs Actual", keywords: "variance favourable adverse" },
  { slug: "invoice-gst", name: "GST Invoice", keywords: "cgst sgst igst computation" },
  { slug: "partnership-profit", name: "Partnership Profit", keywords: "sharing ratio appropriation" },
  { slug: "depreciation-comparison", name: "Depreciation Comparison", keywords: "slm wdv syd ddb" },
  { slug: "equity-valuation", name: "Equity Valuation", keywords: "ddm pe fair value" },
  { slug: "emi-moratorium", name: "EMI Moratorium", keywords: "covid deferment interest" },
  { slug: "income-tax-notice", name: "IT Notice Interest", keywords: "234 demand penalty" },
  { slug: "startup-valuation", name: "Startup Valuation", keywords: "berkus vc revenue multiple" },
  { slug: "tax-planning", name: "Tax Planning Optimizer", keywords: "saving regime comparison" },
  { slug: "receivables-aging", name: "Receivables Aging", keywords: "debtor provision bucket" },
  { slug: "tds-26as", name: "TDS 26AS Reconciliation", keywords: "traces refund itr" },
  { slug: "salary-hike", name: "Salary Hike Calculator", keywords: "ctc revision increment" },
  { slug: "gst-annual-return", name: "GSTR-9 Annual Return", keywords: "reconciliation late fee" },
  { slug: "crypto-tax", name: "Crypto Tax India", keywords: "vda 30 percent 115bbh" },
  { slug: "marginal-relief", name: "Marginal Relief", keywords: "surcharge threshold" },
  { slug: "presumptive-tax", name: "Presumptive Tax 44AD", keywords: "turnover profit scheme" },
  { slug: "employees-stock", name: "ESOP Tax", keywords: "vesting exercise perquisite" },
  { slug: "foreign-income", name: "Foreign Income DTAA", keywords: "double taxation relief" },
  { slug: "audit-checklist", name: "Audit Checklist Score", keywords: "internal controls risk" },
  { slug: "gold-returns", name: "Gold Returns", keywords: "sgb etf physical cagr" },
  { slug: "retrenchment-compensation", name: "Retrenchment Compensation", keywords: "vrs section 10" },
  { slug: "tds-property", name: "TDS on Property 194IA", keywords: "26qb buyer seller" },
  { slug: "advance-ruling", name: "GST Liability Estimator", keywords: "rcm exempt zero rated" },
  { slug: "customs-duty", name: "Customs Duty Import", keywords: "bcd sws igst landed" },
  { slug: "pf-withdrawal", name: "PF Withdrawal Tax", keywords: "epf 5 years tds pan" },
  { slug: "nri-tax", name: "NRI Tax Calculator", keywords: "non resident india dtaa" },
  { slug: "home-loan-tax", name: "Home Loan Tax Benefit", keywords: "section 24 80c interest" },
  { slug: "itr-form-selector", name: "ITR Form Selector", keywords: "which form to file" },
  { slug: "balance-sheet-analysis", name: "Balance Sheet Analyser", keywords: "strength ratios equity" },
  { slug: "rebate-87a", name: "Section 87A Rebate", keywords: "nil tax 7 lakh" },
  { slug: "salary-restructure", name: "Salary Restructuring", keywords: "optimize components nps" },
  { slug: "interest-income", name: "Interest Income Tax", keywords: "fd savings 80tta ttb" },
  { slug: "ltcg-mutual-fund", name: "Mutual Fund Capital Gains", keywords: "equity debt redemption" },
  { slug: "professional-tax", name: "Professional Tax State", keywords: "maharashtra karnataka pt" },
];

/* Page-level nav links for non-calculator searches */
const PAGES = [
  { slug: "dashboard", name: "Dashboard", keywords: "home overview stats" },
  { slug: "clients", name: "Clients", keywords: "manage roster compliance" },
  { slug: "compliance", name: "Compliance Tracker", keywords: "filing deadline gstr tds" },
  { slug: "documents", name: "Document Center", keywords: "upload excel pdf import" },
  { slug: "ai", name: "CalcAI Assistant", keywords: "ask question chat gemini" },
  { slug: "settings", name: "Settings", keywords: "profile preferences account" },
];

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

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "#f97316", fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export const TopBar = () => {
  const title = useTitle();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results
  const results = query.trim().length > 0
    ? [
        ...ALL_CALCS.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.keywords.toLowerCase().includes(query.toLowerCase())
        ).map(c => ({ type: "calc" as const, slug: c.slug, name: c.name })),
        ...PAGES.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.keywords.toLowerCase().includes(query.toLowerCase())
        ).map(p => ({ type: "page" as const, slug: p.slug, name: p.name })),
      ].slice(0, 7)
    : [];

  // Click outside closes dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const goTo = (result: (typeof results)[0]) => {
    const path = result.type === "calc" ? `/calculator/${result.slug}` : `/${result.slug}`;
    navigate(path);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(results[selectedIdx]);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center gap-4 px-6 glass-topbar">
      <h1
        className="text-base font-semibold tracking-tight md:min-w-[160px]"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative" ref={dropdownRef}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "rgba(255,255,255,0.35)" }}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search 100+ calculators..."
          className="glass-input w-full h-9 pl-9 pr-16 text-sm"
          style={{ color: "rgba(255,255,255,0.85)" }}
        />
        {query ? (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 rounded grid place-items-center hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
        <kbd
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          ⌘K
        </kbd>

        {/* Dropdown Results */}
        {open && results.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 overflow-hidden"
            style={{
              background: "#1a1a1a",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          >
            {results.map((r, i) => (
              <button
                key={r.slug}
                onClick={() => goTo(r)}
                onMouseEnter={() => setSelectedIdx(i)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{
                  background: i === selectedIdx ? "rgba(255,255,255,0.06)" : "transparent",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <Search className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.30)" }} />
                <span className="flex-1 truncate">{highlightMatch(r.name, query)}</span>
                {r.type === "page" && (
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.40)" }}
                  >
                    Page
                  </span>
                )}
                {i === selectedIdx && (
                  <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "10px" }}>Enter ↵</span>
                )}
              </button>
            ))}
            <div
              className="px-4 py-2 text-[10px] border-t border-white/[0.06]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              ↑↓ to navigate · Enter to select · Esc to close
            </div>
          </div>
        )}

        {open && query.trim() && results.length === 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 px-4 py-6 text-center"
            style={{
              background: "#1a1a1a",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          >
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
              No calculators match "{query}"
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="h-[18px] w-[18px]" style={{ color: "rgba(255,255,255,0.70)" }} />
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