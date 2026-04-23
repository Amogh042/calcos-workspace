import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calculator, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const FY = ["FY 2024-25", "FY 2023-24", "FY 2022-23"];
const AGE = ["Below 60", "60-80", "Above 80"];

type CalculatorComponent = () => JSX.Element;

const CALC_REGISTRY: Record<string, CalculatorComponent> = {
  "income-tax": IncomeTaxCalc,
  emi: EMICalc,
  gst: GSTCalc,
  salary: SalaryCalc,
  sip: SIPCalc,
  gratuity: GratuityCalc,
  pf: PFCalc,
  hra: HRACalc,
  stcg: STCGCalc,
  wdv: WDVCalc,
  ltcg: LTCGCalc,
  "advance-tax": AdvanceTaxCalc,
  "current-ratio": FinancialRatiosCalc,
  "break-even": BreakEvenCalc,
  "compound-interest": CompoundInterestCalc,
  "loan-eligibility": LoanEligibilityCalc,
  "home-loan": HomeLoanCalc,
  "rental-yield": RentalYieldCalc,
  npv: NPVCalc,
  tds: TDSCalc,
  ppf: PPFCalc,
  slm: SLMCalc,
  materiality: MaterialityCalc,
  "stamp-duty": StampDutyCalc,
  wacc: WACCCalc,
  dcf: DCFCalc,
  "sample-size": SampleSizeCalc,
  "80c-planner": Section80CCalc,
  "balance-transfer": BalanceTransferCalc,
  "dividend-tax": DividendTaxCalc,
  roe: ROEDetailCalc,
  irr: IRRCalc,
  payback: PaybackCalc,
  lumpsum: LumpsumCalc,
  esi: ESICalc,
  "car-loan": CarLoanCalc,
  "personal-loan": PersonalLoanCalc,
  prepayment: PrepaymentCalc,
  "gst-late-fee": GSTLateFeeCalc,
  "itc-reconciliation": ITCReconciliationCalc,
  "uk-income-tax": UKIncomeTaxCalc,
  "us-federal-tax": USFederalTaxCalc,
  "uae-vat": UAEVATCalc,
  "uk-vat": UKVATCalc,
  "sg-income-tax": SGIncomeTaxCalc,
  "debt-equity": DebtEquityCalc,
  "leave-encashment": LeaveEncashmentCalc,
  "capital-gains-property": CapitalGainsPropertyCalc,
  "depreciation-it": ITDepreciationCalc,
  "net-worth": NetWorthCalc,
  "working-capital": WorkingCapitalCalc,
  "bond-valuation": BondValuationCalc,
  "depreciation-syd": SYDCalc,
  "profitability-ratios": ProfitabilityRatiosCalc,
  "rent-vs-buy": RentVsBuyCalc,
  "huf-tax": HUFTaxCalc,
  "form-16": Form16Calc,
  "tds-salary": TDSSalaryCalc,
  "gst-composition": GSTCompositionCalc,
  "export-under-gst": ExportGSTCalc,
  "mis-calculator": MISCalc,
  "sukanya-samriddhi": SSYCalc,
  "nps-calculator": NPSCalc,
  "senior-citizen-fd": SCFDCalc,
  "gratuity-eligibility": GratuityEligibilityCalc,
};

const titleMap: Record<string, string> = {
  "income-tax": "Income Tax Calculator",
  emi: "EMI Calculator",
  gst: "GST Calculator",
  salary: "Salary Breakup Calculator",
  sip: "SIP Calculator",
  gratuity: "Gratuity Calculator",
  pf: "PF Calculator",
  hra: "HRA Exemption Calculator",
  stcg: "STCG Calculator",
  wdv: "WDV Depreciation Calculator",
  ltcg: "LTCG Calculator",
  "advance-tax": "Advance Tax Calculator",
  "current-ratio": "Financial Ratios Dashboard",
  "break-even": "Break-even Calculator",
  "compound-interest": "Compound Interest Calculator",
  "loan-eligibility": "Loan Eligibility Calculator",
  "home-loan": "Home Loan Calculator",
  "rental-yield": "Rental Yield Calculator",
  npv: "NPV Calculator",
  tds: "TDS Calculator",
  ppf: "PPF Calculator",
  slm: "Straight Line Depreciation",
  materiality: "Audit Materiality Calculator",
  "stamp-duty": "Stamp Duty Calculator",
  wacc: "WACC Calculator",
  dcf: "DCF Valuation",
  "sample-size": "Audit Sample Size Calculator",
  "80c-planner": "Section 80C / 80D Deduction Planner",
  "balance-transfer": "Loan Balance Transfer Calculator",
  "dividend-tax": "Dividend Tax Calculator",
  roe: "Return on Equity (ROE) — DuPont Analysis",
  irr: "IRR Calculator",
  payback: "Payback Period Calculator",
  lumpsum: "Lumpsum Investment Calculator",
  esi: "ESI (Employee State Insurance) Calculator",
  "car-loan": "Car Loan EMI Calculator",
  "personal-loan": "Personal Loan Calculator",
  prepayment: "Loan Prepayment Savings Calculator",
  "gst-late-fee": "GST Late Fee Calculator",
  "itc-reconciliation": "GST ITC Reconciliation",
  "uk-income-tax": "UK Income Tax Calculator",
  "us-federal-tax": "US Federal Income Tax Calculator",
  "uae-vat": "UAE VAT Calculator",
  "uk-vat": "UK VAT Calculator",
  "sg-income-tax": "Singapore Income Tax Calculator",
  "debt-equity": "Debt to Equity & Leverage Ratios",
  "leave-encashment": "Leave Encashment Tax Calculator",
  "capital-gains-property": "Property Capital Gains Calculator",
  "depreciation-it": "Income Tax Act Depreciation",
  "net-worth": "Personal Net Worth Calculator",
  "working-capital": "Working Capital Analysis",
  "bond-valuation": "Bond Valuation Calculator",
  "depreciation-syd": "Sum of Years Digits Depreciation",
  "profitability-ratios": "Profitability Ratios Dashboard",
  "rent-vs-buy": "Rent vs Buy Analysis",
  "huf-tax": "HUF Tax Calculator",
  "form-16": "Form 16 / Salary Tax Computation",
  "tds-salary": "TDS on Salary Calculator (Section 192)",
  "gst-composition": "GST Composition Scheme Calculator",
  "export-under-gst": "GST on Exports Calculator",
  "mis-calculator": "Post Office MIS Calculator",
  "sukanya-samriddhi": "Sukanya Samriddhi Yojana Calculator",
  "nps-calculator": "NPS (National Pension System) Calculator",
  "senior-citizen-fd": "Senior Citizen FD & Savings Calculator",
  "gratuity-eligibility": "Gratuity Eligibility & Computation (Detailed)",
};

const categoryMap: Record<string, string> = {
  "income-tax": "tax",
  emi: "loans",
  gst: "gst",
  salary: "payroll",
  sip: "investment",
  gratuity: "payroll",
  pf: "payroll",
  hra: "tax",
  stcg: "tax",
  wdv: "depreciation",
  ltcg: "tax",
  "advance-tax": "tax",
  "current-ratio": "ratios",
  "break-even": "ratios",
  "compound-interest": "investment",
  "loan-eligibility": "loans",
  "home-loan": "loans",
  "rental-yield": "realestate",
  npv: "valuation",
  tds: "tax",
  ppf: "investment",
  slm: "depreciation",
  materiality: "audit",
  "stamp-duty": "realestate",
  wacc: "valuation",
  dcf: "valuation",
  "sample-size": "audit",
  "80c-planner": "tax",
  "balance-transfer": "loans",
  "dividend-tax": "tax",
  roe: "ratios",
  irr: "valuation",
  payback: "valuation",
  lumpsum: "investment",
  esi: "payroll",
  "car-loan": "loans",
  "personal-loan": "loans",
  prepayment: "loans",
  "gst-late-fee": "gst",
  "itc-reconciliation": "gst",
  "uk-income-tax": "tax",
  "us-federal-tax": "tax",
  "uae-vat": "gst",
  "uk-vat": "gst",
  "sg-income-tax": "tax",
  "debt-equity": "ratios",
  "leave-encashment": "tax",
  "capital-gains-property": "tax",
  "depreciation-it": "depreciation",
  "net-worth": "ratios",
  "working-capital": "ratios",
  "bond-valuation": "valuation",
  "depreciation-syd": "depreciation",
  "profitability-ratios": "ratios",
  "rent-vs-buy": "realestate",
  "huf-tax": "tax",
  "form-16": "tax",
  "tds-salary": "tax",
  "gst-composition": "gst",
  "export-under-gst": "gst",
  "mis-calculator": "investment",
  "sukanya-samriddhi": "investment",
  "nps-calculator": "investment",
  "senior-citizen-fd": "investment",
  "gratuity-eligibility": "payroll",
};

const WDV_DEFAULT_RATES: Record<string, number> = {
  Buildings: 10,
  "Plant & Machinery": 15,
  Computers: 40,
  Furniture: 10,
  Vehicles: 30,
};

const CII_TABLE: Record<number, number> = {
  2001: 100,
  2005: 117,
  2010: 167,
  2015: 254,
  2020: 301,
  2021: 317,
  2022: 331,
  2023: 348,
  2024: 363,
};

const TDS_CONFIG = {
  "Professional/Technical fees (194J)": {
    section: "194J",
    threshold: 30000,
    residentRate: 10,
    nriRate: 20,
  },
  "Rent - Plant & Machinery (194I)": {
    section: "194I",
    threshold: 240000,
    residentRate: 2,
    nriRate: 30,
  },
  "Rent - Land/Building (194I)": {
    section: "194I",
    threshold: 240000,
    residentRate: 10,
    nriRate: 30,
  },
  "Contractor payment (194C)": {
    section: "194C",
    threshold: 30000,
    residentRate: 1,
    residentCompanyRate: 2,
    nriRate: 20,
  },
  "Commission/Brokerage (194H)": {
    section: "194H",
    threshold: 15000,
    residentRate: 5,
    nriRate: 20,
  },
  "Interest from banks (194A)": {
    section: "194A",
    threshold: 40000,
    residentRate: 10,
    nriRate: 30,
  },
  "Salary (192)": {
    section: "192",
    threshold: 0,
    residentRate: 0,
    nriRate: 30,
  },
  "Director remuneration (194J)": {
    section: "194J",
    threshold: 30000,
    residentRate: 10,
    nriRate: 20,
  },
} as const;

const STAMP_DUTY_RATES = {
  Maharashtra: { residential: 5, commercial: 6 },
  Karnataka: { residential: 5.6, commercial: 5.6 },
  Delhi: { residentialWomen: 4, residentialMen: 6, commercial: 6 },
  "Tamil Nadu": { residential: 7, commercial: 7 },
  Gujarat: { residential: 4.9, commercial: 4.9 },
  Telangana: { residential: 5, commercial: 5 },
  Rajasthan: { residential: 5, commercial: 6 },
} as const;

type TdsPaymentType = keyof typeof TDS_CONFIG;

type Slab = { min: number; max: number | null; rate: number; label: string };
type SlabRow = { slab: string; income: number; rate: number; tax: number };

const NEW_REGIME_SLABS: Slab[] = [
  { min: 0, max: 300000, rate: 0, label: "Up to ₹3L" },
  { min: 300000, max: 700000, rate: 5, label: "₹3L - ₹7L" },
  { min: 700000, max: 1000000, rate: 10, label: "₹7L - ₹10L" },
  { min: 1000000, max: 1200000, rate: 15, label: "₹10L - ₹12L" },
  { min: 1200000, max: 1500000, rate: 20, label: "₹12L - ₹15L" },
  { min: 1500000, max: null, rate: 30, label: "Above ₹15L" },
];

const OLD_REGIME_SLABS: Slab[] = [
  { min: 0, max: 250000, rate: 0, label: "Up to ₹2.5L" },
  { min: 250000, max: 500000, rate: 5, label: "₹2.5L - ₹5L" },
  { min: 500000, max: 1000000, rate: 20, label: "₹5L - ₹10L" },
  { min: 1000000, max: null, rate: 30, label: "Above ₹10L" },
];

function toNum(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatINR(value: number): string {
  return `₹ ${Math.max(0, value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatCurrency(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, value));
}

function formatGBP(value: number): string {
  return formatCurrency(value, "en-GB", "GBP");
}

function formatUSD(value: number): string {
  return formatCurrency(value, "en-US", "USD");
}

function formatSGD(value: number): string {
  return formatCurrency(value, "en-SG", "SGD");
}

function formatAED(value: number): string {
  return formatCurrency(value, "en-AE", "AED");
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatNum(value: number, digits = 2): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function getCIIForYear(year: number): number {
  return CII_TABLE[year] ?? 0;
}

function calculateSlabTax(taxableIncome: number, slabs: Slab[]): { slabBreakdown: SlabRow[]; baseTax: number } {
  let baseTax = 0;
  const slabBreakdown = slabs.map((slab) => {
    const upper = slab.max ?? Number.POSITIVE_INFINITY;
    const taxedIncome = Math.max(0, Math.min(taxableIncome, upper) - slab.min);
    const tax = (taxedIncome * slab.rate) / 100;
    baseTax += tax;
    return {
      slab: slab.label,
      income: taxedIncome,
      rate: slab.rate,
      tax,
    };
  });
  return { slabBreakdown, baseTax };
}

function calculateEMIFromPrincipal(principal: number, annualRate: number, tenureMonths: number): number {
  const p = Math.max(0, principal);
  const n = Math.max(0, tenureMonths);
  const r = annualRate / 12 / 100;
  if (!p || !n) return 0;
  if (r === 0) return p / n;
  return (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

function calculateLoanFromEMI(emi: number, annualRate: number, tenureMonths: number): number {
  const monthlyEmi = Math.max(0, emi);
  const n = Math.max(0, tenureMonths);
  const r = annualRate / 12 / 100;
  if (!monthlyEmi || !n) return 0;
  if (r === 0) return monthlyEmi * n;
  return monthlyEmi * (((1 + r) ** n - 1) / (r * (1 + r) ** n));
}

export default function CalculatorDetail() {
  const { slug = "income-tax" } = useParams();
  const CalcComponent = CALC_REGISTRY[slug];
  const title = titleMap[slug] ?? slug.replace(/-/g, " ");
  const category = categoryMap[slug] ?? "tax";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link to="/dashboard" className="hover:text-white">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/calculators/${category}`} className="hover:text-white">Calculators</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white capitalize">{title}</span>
      </nav>

      {CalcComponent ? <CalcComponent /> : <ComingSoonCard slug={slug} />}
    </div>
  );
}

function IncomeTaxCalc() {
  const [annualIncome, setAnnualIncome] = useState("1800000");
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [age, setAge] = useState(AGE[0]);
  const [fy, setFy] = useState(FY[0]);
  const [calculatedAt, setCalculatedAt] = useState<string>("Never");
  const [result, setResult] = useState({
    taxableIncome: 0,
    baseTax: 0,
    surcharge: 0,
    cess: 0,
    totalTax: 0,
    effectiveRate: 0,
    monthlyTax: 0,
    monthlyTakeHome: 0,
    slabBreakdown: [] as SlabRow[],
  });

  useEffect(() => {
    const income = toNum(annualIncome);
    const stdDeduction = regime === "new" ? 75000 : 50000;
    const taxableIncome = Math.max(0, income - stdDeduction);
    const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

    const { slabBreakdown, baseTax } = calculateSlabTax(taxableIncome, slabs);

    const surchargeRate = taxableIncome > 10000000 ? 15 : taxableIncome > 5000000 ? 10 : 0;
    const surcharge = (baseTax * surchargeRate) / 100;
    const cess = (baseTax + surcharge) * 0.04;
    const totalTax = baseTax + surcharge + cess;

    setResult({
      taxableIncome,
      baseTax,
      surcharge,
      cess,
      totalTax,
      effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
      monthlyTax: totalTax / 12,
      monthlyTakeHome: (income - totalTax) / 12,
      slabBreakdown,
    });
  }, [annualIncome, regime, age, fy]);

  const incomeValue = toNum(annualIncome);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income Tax Calculator</h1>
          <p className="mt-1 text-secondary text-sm">Slab-wise tax for selected financial year</p>
        </div>
        <div className="text-xs text-tertiary">
          Last calculated: <span className="text-secondary">{calculatedAt}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="space-y-4">
          <div className="card-surface p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

            <Field label="Annual Income">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">₹</span>
                <input
                  inputMode="numeric"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  className="glass-input w-full h-11 pl-8 pr-3 text-base font-medium"
                />
              </div>
            </Field>

            <Field label="Financial Year">
              <select
                value={fy}
                onChange={(e) => setFy(e.target.value)}
                className="glass-select w-full h-11 px-3 rounded-[10px] text-sm focus:outline-none focus:border-[rgba(249,115,22,0.5)]"
              >
                {FY.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>

            <Field label="Tax Regime">
              <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
                {(["old", "new"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setRegime(item)}
                    className={cn(
                      "py-2 text-sm font-medium rounded-md transition-all capitalize",
                      regime === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                    )}
                  >
                    {item} Regime
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Age Group">
              <div className="flex gap-2">
                {AGE.map((item) => (
                  <button
                    key={item}
                    onClick={() => setAge(item)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-pill text-xs font-medium border transition-all",
                      age === item
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "bg-card-elevated border-white/10 text-secondary hover:border-primary/30"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>

            <button
              onClick={() => setCalculatedAt(new Date().toLocaleTimeString("en-IN"))}
              className="w-full h-12 rounded-lg bg-gradient-orange text-white font-semibold glow-orange hover:glow-orange-strong transition-all"
            >
              Calculate Tax
            </button>

            <button
              onClick={() => {
                setAnnualIncome("");
                setCalculatedAt("Never");
              }}
              className="w-full text-xs text-tertiary hover:text-white flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-6">
            <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Total Tax Payable</div>
            <div className="mt-2 text-4xl md:text-5xl font-bold text-gradient-orange">{formatINR(result.totalTax)}</div>
            <div className="mt-2 text-sm text-secondary">Effective Rate: <span className="text-white font-medium">{formatPct(result.effectiveRate)}</span></div>
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Slab Breakdown</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Slab</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Income</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.slabBreakdown.map((row, index) => (
                    <tr key={row.slab} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.slab}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.income)}</td>
                      <td className="px-3 py-2 text-right text-tertiary">{row.rate}%</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.tax)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-5 py-2 text-secondary">Surcharge</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right text-tertiary">Auto</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(result.surcharge)}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-2 text-secondary">Health & Education Cess (4%)</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right text-tertiary">4%</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(result.cess)}</td>
                  </tr>
                  <tr className="border-t border-primary/20 bg-primary/5">
                    <td className="px-5 py-2.5 font-bold">Total</td>
                    <td colSpan={2}></td>
                    <td className="px-5 py-2.5 text-right font-bold text-primary">{formatINR(result.totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Monthly Tax" value={formatINR(result.monthlyTax)} />
            <MiniStat label="Take-home/mo" value={formatINR(result.monthlyTakeHome)} green />
            <MiniStat label="Taxable Income" value={formatINR(result.taxableIncome)} />
            <MiniStat label="Annual Income" value={formatINR(incomeValue)} />
          </div>
        </div>
      </div>
    </>
  );
}

type EMIResult = {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  amortization: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
};

function EMICalc() {
  const [principal, setPrincipal] = useState("1500000");
  const [annualRate, setAnnualRate] = useState("9");
  const [tenureMonths, setTenureMonths] = useState("240");
  const [result, setResult] = useState<EMIResult>({
    monthlyEMI: 0,
    totalAmount: 0,
    totalInterest: 0,
    amortization: [],
  });

  useEffect(() => {
    const p = toNum(principal);
    const n = Math.max(0, Math.floor(toNum(tenureMonths)));
    const annual = toNum(annualRate);
    const r = annual / 12 / 100;

    if (!p || !n) {
      setResult({ monthlyEMI: 0, totalAmount: 0, totalInterest: 0, amortization: [] });
      return;
    }

    const emi = r === 0
      ? p / n
      : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);

    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;

    let balance = p;
    const amortization: EMIResult["amortization"] = [];

    for (let month = 1; month <= Math.min(12, n); month += 1) {
      const interest = r === 0 ? 0 : balance * r;
      const principalPart = Math.min(balance, emi - interest);
      balance = Math.max(0, balance - principalPart);
      amortization.push({
        month,
        principal: principalPart,
        interest,
        balance,
      });
    }

    setResult({ monthlyEMI: emi, totalAmount, totalInterest, amortization });
  }, [principal, annualRate, tenureMonths]);

  return (
    <CalculatorShell
      title="EMI Calculator"
      subtitle="Monthly instalment, total payment, and first 12-month amortisation"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Principal" value={principal} onChange={setPrincipal} />
          <NumberInput label="Annual Interest Rate (%)" value={annualRate} onChange={setAnnualRate} />
          <NumberInput label="Tenure (Months)" value={tenureMonths} onChange={setTenureMonths} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStat label="Monthly EMI" value={formatINR(result.monthlyEMI)} />
            <MiniStat label="Total Amount" value={formatINR(result.totalAmount)} />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Amortisation (First 12 Months)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Month</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Principal</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Interest</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amortization.map((row, index) => (
                    <tr key={row.month} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.month}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.principal)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.interest)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function GSTCalc() {
  const [amount, setAmount] = useState("100000");
  const [gstRate, setGstRate] = useState("18");
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [result, setResult] = useState({
    taxableAmount: 0,
    gstAmount: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
  });

  useEffect(() => {
    const value = toNum(amount);
    const rate = toNum(gstRate);

    if (direction === "add") {
      const gstAmount = (value * rate) / 100;
      const total = value + gstAmount;
      setResult({
        taxableAmount: value,
        gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total,
      });
      return;
    }

    const taxableAmount = rate === 0 ? value : (value * 100) / (100 + rate);
    const gstAmount = value - taxableAmount;
    setResult({
      taxableAmount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      total: value,
    });
  }, [amount, gstRate, direction]);

  return (
    <CalculatorShell
      title="GST Calculator"
      subtitle="Add or remove GST with CGST/SGST split"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Amount" value={amount} onChange={setAmount} />

          <Field label="GST Rate">
            <select
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="glass-select w-full h-11 px-3 rounded-[10px] text-sm focus:outline-none focus:border-[rgba(249,115,22,0.5)]"
            >
              {[5, 12, 18, 28].map((rate) => (
                <option key={rate} value={rate}>{rate}%</option>
              ))}
            </select>
          </Field>

          <Field label="Direction">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["add", "remove"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setDirection(item)}
                  className={cn(
                    "py-2 text-sm font-medium rounded-md transition-all capitalize",
                    direction === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item} GST
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MiniStat label="Taxable Amount" value={formatINR(result.taxableAmount)} />
          <MiniStat label="GST Amount" value={formatINR(result.gstAmount)} />
          <MiniStat label="CGST" value={formatINR(result.cgst)} />
          <MiniStat label="SGST" value={formatINR(result.sgst)} />
          <div className="sm:col-span-2 card-surface p-6">
            <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Total</div>
            <div className="mt-2 text-4xl font-bold text-gradient-orange">{formatINR(result.total)}</div>
          </div>
        </div>
      )}
    />
  );
}

function SalaryCalc() {
  const [ctc, setCtc] = useState("1200000");
  const [result, setResult] = useState({
    basic: 0,
    hra: 0,
    employeePF: 0,
    employerPF: 0,
    pt: 0,
    specialAllowance: 0,
    grossSalary: 0,
    takeHome: 0,
  });

  useEffect(() => {
    const ctcVal = toNum(ctc);
    const basic = 0.4 * ctcVal;
    const hra = 0.5 * basic;
    const employerPF = 0.12 * basic;
    const employeePF = Math.min(0.12 * basic, 1800 * 12);
    const pt = 200 * 12;
    const specialAllowance = ctcVal - basic - hra - employerPF;
    const grossSalary = basic + hra + specialAllowance;
    const takeHome = grossSalary - employeePF - pt;

    setResult({
      basic,
      hra,
      employeePF,
      employerPF,
      pt,
      specialAllowance,
      grossSalary,
      takeHome,
    });
  }, [ctc]);

  return (
    <CalculatorShell
      title="Salary Breakup Calculator"
      subtitle="CTC to annual and monthly take-home"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Annual CTC" value={ctc} onChange={setCtc} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Basic" value={formatINR(result.basic)} />
            <MiniStat label="HRA" value={formatINR(result.hra)} />
            <MiniStat label="Employer PF" value={formatINR(result.employerPF)} />
            <MiniStat label="Employee PF" value={formatINR(result.employeePF)} />
            <MiniStat label="Professional Tax" value={formatINR(result.pt)} />
            <MiniStat label="Special Allowance" value={formatINR(result.specialAllowance)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card-surface p-6">
              <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Gross Salary</div>
              <div className="mt-2 text-3xl font-bold text-white">{formatINR(result.grossSalary)}</div>
            </div>
            <div className="card-surface p-6">
              <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Take Home (Annual)</div>
              <div className="mt-2 text-3xl font-bold text-gradient-orange">{formatINR(result.takeHome)}</div>
              <div className="mt-2 text-xs text-secondary">Monthly: {formatINR(result.takeHome / 12)}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function SIPCalc() {
  const [monthlyAmount, setMonthlyAmount] = useState("10000");
  const [annualRate, setAnnualRate] = useState("12");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState({
    futureValue: 0,
    totalInvested: 0,
    wealthGained: 0,
    returnPercent: 0,
  });

  useEffect(() => {
    const monthly = toNum(monthlyAmount);
    const annual = toNum(annualRate);
    const y = toNum(years);
    const n = Math.max(0, Math.floor(y * 12));
    const r = annual / 12 / 100;

    if (!monthly || !n) {
      setResult({ futureValue: 0, totalInvested: 0, wealthGained: 0, returnPercent: 0 });
      return;
    }

    const futureValue = r === 0
      ? monthly * n
      : monthly * (((1 + r) ** n - 1) / r) * (1 + r);
    const totalInvested = monthly * n;
    const wealthGained = futureValue - totalInvested;
    const returnPercent = totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0;

    setResult({ futureValue, totalInvested, wealthGained, returnPercent });
  }, [monthlyAmount, annualRate, years]);

  return (
    <CalculatorShell
      title="SIP Calculator"
      subtitle="Future value of monthly investments"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Monthly Investment" value={monthlyAmount} onChange={setMonthlyAmount} />
          <NumberInput label="Expected Annual Return (%)" value={annualRate} onChange={setAnnualRate} />
          <NumberInput label="Investment Duration (Years)" value={years} onChange={setYears} />
        </div>
      )}
      outputPanel={(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2 card-surface p-6">
            <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Future Value</div>
            <div className="mt-2 text-4xl font-bold text-gradient-orange">{formatINR(result.futureValue)}</div>
          </div>
          <MiniStat label="Total Invested" value={formatINR(result.totalInvested)} />
          <MiniStat label="Wealth Gained" value={formatINR(result.wealthGained)} green />
          <MiniStat label="Return %" value={formatPct(result.returnPercent)} />
        </div>
      )}
    />
  );
}

function GratuityCalc() {
  const [basicSalary, setBasicSalary] = useState("50000");
  const [yearsOfService, setYearsOfService] = useState("7");
  const [result, setResult] = useState({
    eligible: false,
    gratuityAmount: 0,
    taxFreeLimit: 2000000,
    taxableGratuity: 0,
  });

  useEffect(() => {
    const basic = toNum(basicSalary);
    const years = toNum(yearsOfService);
    const eligible = years >= 5;
    const computedGratuity = (basic * 15 * years) / 26;
    const gratuityAmount = eligible ? computedGratuity : 0;
    const taxFreeLimit = 2000000;
    const taxableGratuity = Math.max(0, gratuityAmount - taxFreeLimit);

    setResult({ eligible, gratuityAmount, taxFreeLimit, taxableGratuity });
  }, [basicSalary, yearsOfService]);

  return (
    <CalculatorShell
      title="Gratuity Calculator"
      subtitle="Estimate gratuity based on last drawn basic salary"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Basic Salary (Monthly)" value={basicSalary} onChange={setBasicSalary} />
          <NumberInput label="Years of Service" value={yearsOfService} onChange={setYearsOfService} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          {!result.eligible && (
            <div className="card-surface p-4 border border-white/10">
              <div className="text-sm font-medium text-secondary">Not eligible (minimum 5 years required)</div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Gratuity Amount" value={formatINR(result.gratuityAmount)} />
            <MiniStat label="Tax-free Limit" value={formatINR(result.taxFreeLimit)} />
            <MiniStat label="Taxable Gratuity" value={formatINR(result.taxableGratuity)} />
          </div>
        </div>
      )}
    />
  );
}

function PFCalc() {
  const [basicSalary, setBasicSalary] = useState("50000");
  const [result, setResult] = useState({
    employeeContribution: 0,
    employerEPF: 0,
    employerEPS: 0,
    adminCharges: 0,
    totalMonthly: 0,
    annualCorpus: 0,
  });

  useEffect(() => {
    const basic = toNum(basicSalary);
    const employeeContribution = basic > 15000 ? 1800 : basic * 0.12;
    const employerEPF = basic * 0.0367;
    const employerEPS = basic * 0.0833;
    const adminCharges = basic * 0.005;
    const totalMonthly = employeeContribution + employerEPF + employerEPS + adminCharges;

    const monthlyInvested = employeeContribution + employerEPF + employerEPS;
    const annualRate = 8.25;
    const years = 30;
    const n = years * 12;
    const r = annualRate / 12 / 100;
    const annualCorpus = r === 0
      ? monthlyInvested * n
      : monthlyInvested * (((1 + r) ** n - 1) / r) * (1 + r);

    setResult({
      employeeContribution,
      employerEPF,
      employerEPS,
      adminCharges,
      totalMonthly,
      annualCorpus,
    });
  }, [basicSalary]);

  return (
    <CalculatorShell
      title="PF Calculator"
      subtitle="Employee and employer PF contribution breakdown"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Basic Salary (Monthly)" value={basicSalary} onChange={setBasicSalary} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Employee Contribution" value={formatINR(result.employeeContribution)} />
            <MiniStat label="Employer EPF (3.67%)" value={formatINR(result.employerEPF)} />
            <MiniStat label="Employer EPS (8.33%)" value={formatINR(result.employerEPS)} />
            <MiniStat label="Admin Charges (0.5%)" value={formatINR(result.adminCharges)} />
            <MiniStat label="Total Monthly" value={formatINR(result.totalMonthly)} />
          </div>
          <div className="card-surface p-6">
            <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Estimated Corpus in 30 Years (8.25%)</div>
            <div className="mt-2 text-4xl font-bold text-gradient-orange">{formatINR(result.annualCorpus)}</div>
          </div>
        </div>
      )}
    />
  );
}

function HRACalc() {
  const [basicSalary, setBasicSalary] = useState("600000");
  const [hraReceived, setHraReceived] = useState("240000");
  const [rentPaid, setRentPaid] = useState("300000");
  const [cityType, setCityType] = useState<"metro" | "non-metro">("metro");
  const [result, setResult] = useState({
    actualHRA: 0,
    rentMinusBasic: 0,
    salaryPercentLimit: 0,
    exemptionAmount: 0,
    taxableHRA: 0,
  });

  useEffect(() => {
    const basic = toNum(basicSalary);
    const hra = toNum(hraReceived);
    const rent = toNum(rentPaid);

    const actualHRA = hra;
    const rentMinusBasic = Math.max(0, rent - basic * 0.1);
    const salaryPercentLimit = cityType === "metro" ? basic * 0.5 : basic * 0.4;
    const exemptionAmount = Math.min(actualHRA, rentMinusBasic, salaryPercentLimit);
    const taxableHRA = Math.max(0, hra - exemptionAmount);

    setResult({
      actualHRA,
      rentMinusBasic,
      salaryPercentLimit,
      exemptionAmount,
      taxableHRA,
    });
  }, [basicSalary, hraReceived, rentPaid, cityType]);

  return (
    <CalculatorShell
      title="HRA Exemption Calculator"
      subtitle="Compute exemption under Section 10(13A)"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Basic Salary (Annual)" value={basicSalary} onChange={setBasicSalary} />
          <MoneyInput label="HRA Received (Annual)" value={hraReceived} onChange={setHraReceived} />
          <MoneyInput label="Rent Paid (Annual)" value={rentPaid} onChange={setRentPaid} />

          <Field label="City Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["metro", "non-metro"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCityType(item)}
                  className={cn(
                    "py-2 text-sm font-medium rounded-md transition-all capitalize",
                    cityType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="a) Actual HRA Received" value={formatINR(result.actualHRA)} />
            <MiniStat label="b) Rent Paid - 10% Basic" value={formatINR(result.rentMinusBasic)} />
            <MiniStat
              label={cityType === "metro" ? "c) 50% of Basic" : "c) 40% of Basic"}
              value={formatINR(result.salaryPercentLimit)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card-surface p-6">
              <div className="text-xs text-tertiary uppercase tracking-wide font-medium">HRA Exemption (Minimum of a/b/c)</div>
              <div className="mt-2 text-3xl font-bold text-gradient-orange">{formatINR(result.exemptionAmount)}</div>
            </div>
            <div className="card-surface p-6">
              <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Taxable HRA</div>
              <div className="mt-2 text-3xl font-bold text-white">{formatINR(result.taxableHRA)}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function STCGCalc() {
  const [purchasePrice, setPurchasePrice] = useState("800000");
  const [salePrice, setSalePrice] = useState("1050000");
  const [purchaseDate, setPurchaseDate] = useState("2025-01-01");
  const [saleDate, setSaleDate] = useState("2025-10-01");
  const [assetType, setAssetType] = useState<"equity" | "property" | "other">("equity");
  const [result, setResult] = useState({
    gainAmount: 0,
    holdingPeriod: 0,
    isSTCG: false,
    taxRate: 0,
    estimatedTax: 0,
  });

  useEffect(() => {
    const buy = toNum(purchasePrice);
    const sell = toNum(salePrice);
    const gainAmount = sell - buy;

    const buyDate = purchaseDate ? new Date(purchaseDate) : null;
    const sellDateObj = saleDate ? new Date(saleDate) : null;

    let holdingPeriod = 0;
    if (buyDate && sellDateObj && !Number.isNaN(buyDate.getTime()) && !Number.isNaN(sellDateObj.getTime())) {
      const yearDiff = sellDateObj.getFullYear() - buyDate.getFullYear();
      const monthDiff = sellDateObj.getMonth() - buyDate.getMonth();
      const dayAdjust = sellDateObj.getDate() < buyDate.getDate() ? -1 : 0;
      holdingPeriod = Math.max(0, yearDiff * 12 + monthDiff + dayAdjust);
    }

    const threshold = assetType === "equity" ? 12 : assetType === "property" ? 24 : Number.POSITIVE_INFINITY;
    const isSTCG = assetType === "other" ? true : holdingPeriod < threshold;

    const taxRate = isSTCG
      ? assetType === "equity"
        ? 20
        : 30
      : 0;
    const estimatedTax = Math.max(0, gainAmount) * (taxRate / 100);

    setResult({ gainAmount, holdingPeriod, isSTCG, taxRate, estimatedTax });
  }, [purchasePrice, salePrice, purchaseDate, saleDate, assetType]);

  return (
    <CalculatorShell
      title="STCG Calculator"
      subtitle="Estimate short-term capital gains tax based on asset and holding period"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
          <MoneyInput label="Sale Price" value={salePrice} onChange={setSalePrice} />

          <Field label="Purchase Date">
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <Field label="Sale Date">
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <Field label="Asset Type">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["equity", "property", "other"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setAssetType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all capitalize",
                    assetType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Gain Amount" value={formatINR(result.gainAmount)} />
            <MiniStat label="Holding Period (Months)" value={result.holdingPeriod.toLocaleString("en-IN")} />
            <MiniStat label="Tax Rate" value={result.isSTCG ? formatPct(result.taxRate) : "0.00%"} />
            <MiniStat label="Estimated Tax" value={formatINR(result.estimatedTax)} />
          </div>

          <div className="card-surface p-4 border border-white/10">
            <div className="text-sm text-secondary">
              {result.isSTCG
                ? assetType === "equity"
                  ? "Classified as STCG. Equity tax rate applied at 20%."
                  : "Classified as STCG. Tax estimated at assumed slab rate of 30%."
                : "Holding period exceeds STCG threshold for this asset type."}
            </div>
          </div>
        </div>
      )}
    />
  );
}

function WDVCalc() {
  const [assetName, setAssetName] = useState<keyof typeof WDV_DEFAULT_RATES>("Plant & Machinery");
  const [purchaseCost, setPurchaseCost] = useState("1000000");
  const [rate, setRate] = useState(String(WDV_DEFAULT_RATES["Plant & Machinery"]));
  const [years, setYears] = useState("5");
  const [result, setResult] = useState({
    schedule: [] as Array<{ year: number; openingValue: number; depreciation: number; closingValue: number }>,
    totalDepreciation: 0,
  });

  useEffect(() => {
    setRate(String(WDV_DEFAULT_RATES[assetName]));
  }, [assetName]);

  useEffect(() => {
    const openingCost = toNum(purchaseCost);
    const depRate = toNum(rate);
    const totalYears = Math.max(0, Math.floor(toNum(years)));

    let openingValue = openingCost;
    let totalDepreciation = 0;
    const schedule: Array<{ year: number; openingValue: number; depreciation: number; closingValue: number }> = [];

    for (let year = 1; year <= totalYears; year += 1) {
      const depreciation = openingValue * (depRate / 100);
      const closingValue = openingValue * (1 - depRate / 100);
      totalDepreciation += depreciation;
      schedule.push({ year, openingValue, depreciation, closingValue });
      openingValue = closingValue;
    }

    setResult({ schedule, totalDepreciation });
  }, [purchaseCost, rate, years]);

  return (
    <CalculatorShell
      title="WDV Depreciation Calculator"
      subtitle="Year-wise depreciation schedule using written down value method"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Asset Type">
            <select
              value={assetName}
              onChange={(e) => setAssetName(e.target.value as keyof typeof WDV_DEFAULT_RATES)}
              className="glass-select w-full h-11 px-3 rounded-[10px] text-sm focus:outline-none focus:border-[rgba(249,115,22,0.5)]"
            >
              {Object.keys(WDV_DEFAULT_RATES).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <MoneyInput label="Purchase Cost" value={purchaseCost} onChange={setPurchaseCost} />
          <NumberInput label="Rate (%)" value={rate} onChange={setRate} />
          <NumberInput label="Years" value={years} onChange={setYears} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Depreciation Schedule</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Opening Value</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Depreciation</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Closing Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.openingValue)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.depreciation)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.closingValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Total Depreciation</div>
            <div className="mt-2 text-3xl font-bold text-gradient-orange">{formatINR(result.totalDepreciation)}</div>
          </div>
        </div>
      )}
    />
  );
}

function LTCGCalc() {
  const [purchasePrice, setPurchasePrice] = useState("1000000");
  const [salePrice, setSalePrice] = useState("1800000");
  const [purchaseYear, setPurchaseYear] = useState("2021");
  const [saleYear, setSaleYear] = useState("2024");
  const [assetType, setAssetType] = useState<"equity" | "property" | "other">("property");
  const [result, setResult] = useState({
    gainAmount: 0,
    indexedCost: 0,
    taxWithIndexation: 0,
    taxWithoutIndexation: 0,
    purchaseCII: 0,
    saleCII: 0,
  });

  useEffect(() => {
    const purchase = toNum(purchasePrice);
    const sale = toNum(salePrice);
    const pYear = Math.floor(toNum(purchaseYear));
    const sYear = Math.floor(toNum(saleYear));
    const purchaseCII = getCIIForYear(pYear);
    const saleCII = getCIIForYear(sYear);

    const indexedCost = assetType === "property" && purchaseCII > 0 && saleCII > 0
      ? purchase * (saleCII / purchaseCII)
      : purchase;

    const gainAmount = sale - indexedCost;
    let taxWithIndexation = 0;
    let taxWithoutIndexation = 0;

    if (assetType === "property") {
      taxWithIndexation = Math.max(0, gainAmount) * 0.2;
      taxWithoutIndexation = Math.max(0, sale - purchase) * 0.125;
    } else if (assetType === "equity") {
      const rawGain = sale - purchase;
      const taxableGain = Math.max(0, rawGain - 125000);
      taxWithoutIndexation = taxableGain * 0.125;
      taxWithIndexation = taxWithoutIndexation;
    } else {
      taxWithIndexation = Math.max(0, gainAmount) * 0.2;
      taxWithoutIndexation = Math.max(0, sale - purchase) * 0.125;
    }

    setResult({
      gainAmount,
      indexedCost,
      taxWithIndexation,
      taxWithoutIndexation,
      purchaseCII,
      saleCII,
    });
  }, [purchasePrice, salePrice, purchaseYear, saleYear, assetType]);

  return (
    <CalculatorShell
      title="LTCG Calculator"
      subtitle="Indexed and non-indexed capital gains tax estimates"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
          <MoneyInput label="Sale Price" value={salePrice} onChange={setSalePrice} />
          <NumberInput label="Purchase Year (e.g. 2021)" value={purchaseYear} onChange={setPurchaseYear} />
          <NumberInput label="Sale Year (e.g. 2024)" value={saleYear} onChange={setSaleYear} />

          <Field label="Asset Type">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["equity", "property", "other"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setAssetType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all capitalize",
                    assetType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <div className="text-xs text-tertiary">
            CII used: Purchase {result.purchaseCII || "N/A"}, Sale {result.saleCII || "N/A"}
          </div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Gain Amount" value={formatINR(result.gainAmount)} />
            <MiniStat label="Indexed Cost" value={formatINR(result.indexedCost)} />
            <MiniStat label="Tax With Indexation" value={formatINR(result.taxWithIndexation)} />
            <MiniStat label="Tax Without Indexation" value={formatINR(result.taxWithoutIndexation)} />
          </div>
        </div>
      )}
    />
  );
}

function AdvanceTaxCalc() {
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState("1800000");
  const [taxAlreadyDeducted, setTaxAlreadyDeducted] = useState("50000");
  const [result, setResult] = useState({
    totalTaxLiability: 0,
    netTaxAfterTDS: 0,
    schedule: [] as Array<{
      quarter: string;
      dueDate: string;
      percentage: number;
      amountDue: number;
      cumulative: number;
    }>,
  });

  useEffect(() => {
    const income = toNum(estimatedAnnualIncome);
    const tds = toNum(taxAlreadyDeducted);
    const taxableIncome = Math.max(0, income - 75000);
    const { baseTax } = calculateSlabTax(taxableIncome, NEW_REGIME_SLABS);
    const totalTaxLiability = baseTax * 1.04;
    const netTaxAfterTDS = Math.max(0, totalTaxLiability - tds);

    const scheduleConfig = [
      { quarter: "Q1", dueDate: "Jun 15", percentage: 15 },
      { quarter: "Q2", dueDate: "Sep 15", percentage: 45 },
      { quarter: "Q3", dueDate: "Dec 15", percentage: 75 },
      { quarter: "Q4", dueDate: "Mar 15", percentage: 100 },
    ];

    let prevCumulative = 0;
    const schedule = netTaxAfterTDS > 10000
      ? scheduleConfig.map((item) => {
        const cumulative = netTaxAfterTDS * (item.percentage / 100);
        const amountDue = Math.max(0, cumulative - prevCumulative);
        prevCumulative = cumulative;
        return {
          ...item,
          amountDue,
          cumulative,
        };
      })
      : [];

    setResult({
      totalTaxLiability,
      netTaxAfterTDS,
      schedule,
    });
  }, [estimatedAnnualIncome, taxAlreadyDeducted]);

  return (
    <CalculatorShell
      title="Advance Tax Calculator"
      subtitle="Quarterly advance tax schedule based on estimated liability"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Estimated Annual Income" value={estimatedAnnualIncome} onChange={setEstimatedAnnualIncome} />
          <MoneyInput label="Tax Already Deducted (TDS)" value={taxAlreadyDeducted} onChange={setTaxAlreadyDeducted} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Total Tax Liability" value={formatINR(result.totalTaxLiability)} />
            <MiniStat label="Net Tax After TDS" value={formatINR(result.netTaxAfterTDS)} />
          </div>

          {result.netTaxAfterTDS <= 10000 ? (
            <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
              Advance tax not applicable (net tax is not above ₹10,000).
            </div>
          ) : (
            <div className="card-surface p-5 overflow-hidden">
              <div className="text-sm font-semibold mb-3">Quarterly Advance Tax Schedule</div>
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-tertiary">
                      <th className="text-left font-medium px-5 py-2 bg-primary/10">Quarter</th>
                      <th className="text-left font-medium px-3 py-2 bg-primary/10">Due Date</th>
                      <th className="text-right font-medium px-3 py-2 bg-primary/10">Percentage</th>
                      <th className="text-right font-medium px-3 py-2 bg-primary/10">Amount Due</th>
                      <th className="text-right font-medium px-5 py-2 bg-primary/10">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row, index) => (
                      <tr key={row.quarter} className={index % 2 ? "bg-white/[0.02]" : ""}>
                        <td className="px-5 py-2 text-secondary">{row.quarter}</td>
                        <td className="px-3 py-2">{row.dueDate}</td>
                        <td className="px-3 py-2 text-right">{row.percentage}%</td>
                        <td className="px-3 py-2 text-right">{formatINR(row.amountDue)}</td>
                        <td className="px-5 py-2 text-right font-medium">{formatINR(row.cumulative)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
}

function FinancialRatiosCalc() {
  const [currentAssets, setCurrentAssets] = useState("1200000");
  const [currentLiabilities, setCurrentLiabilities] = useState("500000");
  const [inventory, setInventory] = useState("200000");
  const [totalRevenue, setTotalRevenue] = useState("3000000");
  const [grossProfit, setGrossProfit] = useState("900000");
  const [netProfit, setNetProfit] = useState("420000");
  const [totalDebt, setTotalDebt] = useState("800000");
  const [totalEquity, setTotalEquity] = useState("1500000");
  const [totalAssets, setTotalAssets] = useState("2600000");
  const [ebit, setEbit] = useState("500000");
  const [interestExpense, setInterestExpense] = useState("120000");
  const [ratios, setRatios] = useState(
    [] as Array<{ name: string; value: number; healthy: boolean; isPercent?: boolean; suffix?: string }>
  );

  useEffect(() => {
    const ca = toNum(currentAssets);
    const cl = toNum(currentLiabilities);
    const inv = toNum(inventory);
    const rev = toNum(totalRevenue);
    const gross = toNum(grossProfit);
    const net = toNum(netProfit);
    const debt = toNum(totalDebt);
    const equity = toNum(totalEquity);
    const assets = toNum(totalAssets);
    const ebitVal = toNum(ebit);
    const interest = toNum(interestExpense);

    const currentRatio = cl > 0 ? ca / cl : 0;
    const quickRatio = cl > 0 ? (ca - inv) / cl : 0;
    const debtToEquity = equity > 0 ? debt / equity : 0;
    const netProfitMargin = rev > 0 ? (net / rev) * 100 : 0;
    const grossProfitMargin = rev > 0 ? (gross / rev) * 100 : 0;
    const roe = equity > 0 ? (net / equity) * 100 : 0;
    const roa = assets > 0 ? (net / assets) * 100 : 0;
    const interestCoverage = interest > 0 ? ebitVal / interest : 0;

    setRatios([
      { name: "Current Ratio", value: currentRatio, healthy: currentRatio > 2, suffix: "x" },
      { name: "Quick Ratio", value: quickRatio, healthy: quickRatio > 1, suffix: "x" },
      { name: "Debt to Equity", value: debtToEquity, healthy: debtToEquity < 2, suffix: "x" },
      { name: "Net Profit Margin", value: netProfitMargin, healthy: netProfitMargin > 10, isPercent: true },
      { name: "Gross Profit Margin", value: grossProfitMargin, healthy: grossProfitMargin > 20, isPercent: true },
      { name: "ROE", value: roe, healthy: roe > 15, isPercent: true },
      { name: "ROA", value: roa, healthy: roa > 5, isPercent: true },
      { name: "Interest Coverage", value: interestCoverage, healthy: interestCoverage > 3, suffix: "x" },
    ]);
  }, [
    currentAssets,
    currentLiabilities,
    inventory,
    totalRevenue,
    grossProfit,
    netProfit,
    totalDebt,
    totalEquity,
    totalAssets,
    ebit,
    interestExpense,
  ]);

  return (
    <CalculatorShell
      title="Financial Ratios Dashboard"
      subtitle="Liquidity, leverage, profitability and coverage metrics"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Current Assets" value={currentAssets} onChange={setCurrentAssets} />
          <MoneyInput label="Current Liabilities" value={currentLiabilities} onChange={setCurrentLiabilities} />
          <MoneyInput label="Inventory" value={inventory} onChange={setInventory} />
          <MoneyInput label="Total Revenue" value={totalRevenue} onChange={setTotalRevenue} />
          <MoneyInput label="Gross Profit" value={grossProfit} onChange={setGrossProfit} />
          <MoneyInput label="Net Profit" value={netProfit} onChange={setNetProfit} />
          <MoneyInput label="Total Debt" value={totalDebt} onChange={setTotalDebt} />
          <MoneyInput label="Total Equity" value={totalEquity} onChange={setTotalEquity} />
          <MoneyInput label="Total Assets" value={totalAssets} onChange={setTotalAssets} />
          <MoneyInput label="EBIT" value={ebit} onChange={setEbit} />
          <MoneyInput label="Interest Expense" value={interestExpense} onChange={setInterestExpense} />
        </div>
      )}
      outputPanel={(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ratios.map((ratio) => (
            <div key={ratio.name} className="card-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs uppercase tracking-wide text-tertiary">{ratio.name}</div>
                <span className={cn(
                  "px-2 py-0.5 rounded-pill text-[10px] font-semibold border",
                  ratio.healthy
                    ? "text-success border-success/40 bg-success/10"
                    : "text-red-400 border-red-400/40 bg-red-400/10"
                )}>
                  {ratio.healthy ? "Healthy" : "Review"}
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold">
                {ratio.isPercent ? `${formatNum(ratio.value)}%` : `${formatNum(ratio.value)}${ratio.suffix ?? ""}`}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function BreakEvenCalc() {
  const [fixedCosts, setFixedCosts] = useState("500000");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("300");
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState("500");
  const [result, setResult] = useState({
    contributionMargin: 0,
    breakEvenUnits: 0,
    breakEvenRevenue: 0,
    contributionMarginRatio: 0,
    scenarios: [] as Array<{ label: string; revenue: number; profit: number }> ,
  });

  useEffect(() => {
    const fixed = toNum(fixedCosts);
    const variable = toNum(variableCostPerUnit);
    const selling = toNum(sellingPricePerUnit);
    const contributionMargin = selling - variable;

    const breakEvenUnits = contributionMargin > 0 ? fixed / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * selling;
    const contributionMarginRatio = selling > 0 ? (contributionMargin / selling) * 100 : 0;

    const levels = [0, 25, 50, 75, 100];
    const scenarios = contributionMargin > 0
      ? levels.map((level) => {
        const units = breakEvenUnits * (1 + level / 100);
        const revenue = units * selling;
        const profit = units * contributionMargin - fixed;
        return {
          label: `${level}% above BEP`,
          revenue,
          profit,
        };
      })
      : levels.map((level) => ({
        label: `${level}% above BEP`,
        revenue: 0,
        profit: 0,
      }));

    setResult({
      contributionMargin,
      breakEvenUnits,
      breakEvenRevenue,
      contributionMarginRatio,
      scenarios,
    });
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit]);

  return (
    <CalculatorShell
      title="Break-even Calculator"
      subtitle="Contribution margin and break-even planning"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} />
          <MoneyInput label="Variable Cost Per Unit" value={variableCostPerUnit} onChange={setVariableCostPerUnit} />
          <MoneyInput label="Selling Price Per Unit" value={sellingPricePerUnit} onChange={setSellingPricePerUnit} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Contribution Margin" value={formatINR(result.contributionMargin)} />
            <MiniStat label="Contribution Margin Ratio" value={formatPct(result.contributionMarginRatio)} />
            <MiniStat label="Break-even Units" value={formatNum(result.breakEvenUnits)} />
            <MiniStat label="Break-even Revenue" value={formatINR(result.breakEvenRevenue)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-xs text-secondary">
            Margin of Safety % = ((Actual Sales - Break-even Sales) / Actual Sales) * 100
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Scenario Table</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Scenario</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Revenue</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {result.scenarios.map((row, index) => (
                    <tr key={row.label} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.label}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.revenue)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState("100000");
  const [annualRate, setAnnualRate] = useState("10");
  const [years, setYears] = useState("10");
  const [compoundingFrequency, setCompoundingFrequency] = useState<"annually" | "semi-annually" | "quarterly" | "monthly">("annually");
  const [result, setResult] = useState({
    finalAmount: 0,
    totalInterest: 0,
    simpleFinalAmount: 0,
    simpleInterest: 0,
    growthTable: [] as Array<{ year: number; amount: number; interestEarned: number }>,
  });

  useEffect(() => {
    const p = toNum(principal);
    const r = toNum(annualRate) / 100;
    const t = Math.max(0, Math.floor(toNum(years)));
    const freqMap = {
      annually: 1,
      "semi-annually": 2,
      quarterly: 4,
      monthly: 12,
    } as const;
    const n = freqMap[compoundingFrequency];

    const finalAmount = p * (1 + r / n) ** (n * t);
    const totalInterest = finalAmount - p;
    const simpleInterest = p * r * t;
    const simpleFinalAmount = p + simpleInterest;

    const growthTable = Array.from({ length: t }, (_, idx) => {
      const year = idx + 1;
      const amount = p * (1 + r / n) ** (n * year);
      return {
        year,
        amount,
        interestEarned: amount - p,
      };
    });

    setResult({
      finalAmount,
      totalInterest,
      simpleFinalAmount,
      simpleInterest,
      growthTable,
    });
  }, [principal, annualRate, years, compoundingFrequency]);

  return (
    <CalculatorShell
      title="Compound Interest Calculator"
      subtitle="Compound growth with simple interest comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Principal" value={principal} onChange={setPrincipal} />
          <NumberInput label="Annual Rate (%)" value={annualRate} onChange={setAnnualRate} />
          <NumberInput label="Years" value={years} onChange={setYears} />

          <Field label="Compounding Frequency">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10 gap-1">
              {(["annually", "semi-annually", "quarterly", "monthly"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCompoundingFrequency(item)}
                  className={cn(
                    "py-2 px-2 text-xs font-medium rounded-md transition-all capitalize",
                    compoundingFrequency === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Final Amount" value={formatINR(result.finalAmount)} />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
            <MiniStat label="Simple Interest Amount" value={formatINR(result.simpleFinalAmount)} />
            <MiniStat label="Simple Interest Earned" value={formatINR(result.simpleInterest)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Year-by-year Growth</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Amount</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {result.growthTable.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.amount)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.interestEarned)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function LoanEligibilityCalc() {
  const [monthlyIncome, setMonthlyIncome] = useState("100000");
  const [existingEMIs, setExistingEMIs] = useState("15000");
  const [interestRate, setInterestRate] = useState("9");
  const [tenureYears, setTenureYears] = useState("20");
  const [result, setResult] = useState({
    availableForEMI: 0,
    maxLoanAmount: 0,
    scenarios: [] as Array<{ label: string; foir: number; emi: number; maxLoan: number }>,
  });

  useEffect(() => {
    const income = toNum(monthlyIncome);
    const existing = toNum(existingEMIs);
    const rate = toNum(interestRate);
    const months = Math.max(0, Math.floor(toNum(tenureYears) * 12));

    const availableForEMI = Math.max(0, income * 0.5 - existing);
    const maxLoanAmount = calculateLoanFromEMI(availableForEMI, rate, months);

    const foirLevels = [
      { label: "Conservative", foir: 40 },
      { label: "Standard", foir: 50 },
      { label: "Aggressive", foir: 60 },
    ];

    const scenarios = foirLevels.map((item) => {
      const emi = Math.max(0, income * (item.foir / 100) - existing);
      const maxLoan = calculateLoanFromEMI(emi, rate, months);
      return {
        label: item.label,
        foir: item.foir,
        emi,
        maxLoan,
      };
    });

    setResult({ availableForEMI, maxLoanAmount, scenarios });
  }, [monthlyIncome, existingEMIs, interestRate, tenureYears]);

  return (
    <CalculatorShell
      title="Loan Eligibility Calculator"
      subtitle="Estimate maximum eligible loan based on FOIR"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Monthly Income" value={monthlyIncome} onChange={setMonthlyIncome} />
          <MoneyInput label="Existing EMIs" value={existingEMIs} onChange={setExistingEMIs} />
          <NumberInput label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
          <NumberInput label="Tenure (Years)" value={tenureYears} onChange={setTenureYears} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Available For EMI (50% FOIR)" value={formatINR(result.availableForEMI)} />
            <MiniStat label="Max Loan Amount" value={formatINR(result.maxLoanAmount)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">FOIR Scenarios</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Scenario</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">FOIR</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Monthly EMI</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Max Loan</th>
                  </tr>
                </thead>
                <tbody>
                  {result.scenarios.map((row, index) => (
                    <tr key={row.label} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.label}</td>
                      <td className="px-3 py-2 text-right">{row.foir}%</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.emi)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.maxLoan)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function HomeLoanCalc() {
  const [propertyValue, setPropertyValue] = useState("8000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [interestRate, setInterestRate] = useState("9");
  const [tenureYears, setTenureYears] = useState("20");
  const [result, setResult] = useState({
    downPayment: 0,
    loanAmount: 0,
    monthlyEMI: 0,
    totalInterest: 0,
    totalPayment: 0,
    interestToLoanRatio: 0,
    rateScenarios: [] as Array<{ label: string; rate: number; emi: number }>,
  });

  useEffect(() => {
    const value = toNum(propertyValue);
    const dpPct = toNum(downPaymentPercent);
    const rate = toNum(interestRate);
    const months = Math.max(0, Math.floor(toNum(tenureYears) * 12));

    const downPayment = value * (dpPct / 100);
    const loanAmount = value * (1 - dpPct / 100);
    const monthlyEMI = calculateEMIFromPrincipal(loanAmount, rate, months);
    const totalPayment = monthlyEMI * months;
    const totalInterest = Math.max(0, totalPayment - loanAmount);
    const interestToLoanRatio = loanAmount > 0 ? (totalInterest / loanAmount) * 100 : 0;

    const rateScenarios = [
      { label: "Rate - 1%", rate: Math.max(0, rate - 1) },
      { label: "Current Rate", rate },
      { label: "Rate + 1%", rate: rate + 1 },
    ].map((item) => ({
      label: item.label,
      rate: item.rate,
      emi: calculateEMIFromPrincipal(loanAmount, item.rate, months),
    }));

    setResult({
      downPayment,
      loanAmount,
      monthlyEMI,
      totalInterest,
      totalPayment,
      interestToLoanRatio,
      rateScenarios,
    });
  }, [propertyValue, downPaymentPercent, interestRate, tenureYears]);

  return (
    <CalculatorShell
      title="Home Loan Calculator"
      subtitle="EMI analysis with rate sensitivity scenarios"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Property Value" value={propertyValue} onChange={setPropertyValue} />
          <NumberInput label="Down Payment (%)" value={downPaymentPercent} onChange={setDownPaymentPercent} />
          <NumberInput label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
          <NumberInput label="Tenure (Years)" value={tenureYears} onChange={setTenureYears} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Loan Amount" value={formatINR(result.loanAmount)} />
            <MiniStat label="Down Payment" value={formatINR(result.downPayment)} />
            <MiniStat label="Monthly EMI" value={formatINR(result.monthlyEMI)} />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
            <MiniStat label="Total Payment" value={formatINR(result.totalPayment)} />
            <MiniStat label="Interest to Loan Ratio" value={formatPct(result.interestToLoanRatio)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.rateScenarios.map((item) => (
              <div key={item.label} className="card-surface p-4">
                <div className="text-xs uppercase tracking-wide text-tertiary">{item.label}</div>
                <div className="mt-1 text-sm text-secondary">{formatPct(item.rate)}</div>
                <div className="mt-2 text-lg font-bold text-gradient-orange">{formatINR(item.emi)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}

function RentalYieldCalc() {
  const [propertyValue, setPropertyValue] = useState("6000000");
  const [monthlyRent, setMonthlyRent] = useState("35000");
  const [annualMaintenance, setAnnualMaintenance] = useState("50000");
  const [annualPropertyTax, setAnnualPropertyTax] = useState("20000");
  const [vacancyRate, setVacancyRate] = useState("5");
  const [result, setResult] = useState({
    grossYield: 0,
    netYield: 0,
    annualGrossIncome: 0,
    annualNetIncome: 0,
    adjustedForVacancy: 0,
    paybackYears: 0,
  });

  useEffect(() => {
    const value = toNum(propertyValue);
    const rent = toNum(monthlyRent);
    const maintenance = toNum(annualMaintenance);
    const tax = toNum(annualPropertyTax);
    const vacancy = toNum(vacancyRate);

    const annualGrossIncome = rent * 12;
    const grossYield = value > 0 ? (annualGrossIncome / value) * 100 : 0;
    const annualNetIncome = annualGrossIncome - maintenance - tax;
    const adjustedForVacancy = annualNetIncome * (1 - vacancy / 100);
    const netYield = value > 0 ? (adjustedForVacancy / value) * 100 : 0;
    const paybackYears = annualNetIncome > 0 ? value / annualNetIncome : 0;

    setResult({
      grossYield,
      netYield,
      annualGrossIncome,
      annualNetIncome,
      adjustedForVacancy,
      paybackYears,
    });
  }, [propertyValue, monthlyRent, annualMaintenance, annualPropertyTax, vacancyRate]);

  return (
    <CalculatorShell
      title="Rental Yield Calculator"
      subtitle="Gross and net rental yield with vacancy adjustment"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Property Value" value={propertyValue} onChange={setPropertyValue} />
          <MoneyInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} />
          <MoneyInput label="Annual Maintenance" value={annualMaintenance} onChange={setAnnualMaintenance} />
          <MoneyInput label="Annual Property Tax" value={annualPropertyTax} onChange={setAnnualPropertyTax} />
          <NumberInput label="Vacancy Rate (%)" value={vacancyRate} onChange={setVacancyRate} />
        </div>
      )}
      outputPanel={(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MiniStat label="Gross Yield" value={formatPct(result.grossYield)} />
          <MiniStat label="Net Yield" value={formatPct(result.netYield)} green />
          <MiniStat label="Annual Gross Income" value={formatINR(result.annualGrossIncome)} />
          <MiniStat label="Annual Net Income" value={formatINR(result.annualNetIncome)} />
          <MiniStat label="Adjusted for Vacancy" value={formatINR(result.adjustedForVacancy)} />
          <MiniStat label="Payback Years" value={formatNum(result.paybackYears)} />
        </div>
      )}
    />
  );
}

function NPVCalc() {
  const [initialInvestment, setInitialInvestment] = useState("1000000");
  const [discountRate, setDiscountRate] = useState("12");
  const [cashFlows, setCashFlows] = useState<string[]>(["300000", "350000", "400000"]);
  const [result, setResult] = useState({
    npv: 0,
    irr: 0,
    paybackPeriod: 0,
    profitabilityIndex: 0,
  });

  useEffect(() => {
    const investment = toNum(initialInvestment);
    const rate = toNum(discountRate) / 100;
    const flows = cashFlows.map((item) => toNum(item));

    let discountedTotal = 0;
    for (let i = 0; i < flows.length; i += 1) {
      discountedTotal += flows[i] / (1 + rate) ** (i + 1);
    }
    const npv = discountedTotal - investment;

    let irr = 0;
    for (let candidate = 0; candidate <= 100; candidate += 0.1) {
      const candidateRate = candidate / 100;
      let candidateNpv = -investment;
      for (let i = 0; i < flows.length; i += 1) {
        candidateNpv += flows[i] / (1 + candidateRate) ** (i + 1);
      }
      if (candidateNpv <= 0) {
        irr = candidate;
        break;
      }
      if (candidate >= 99.9) irr = 100;
    }

    let cumulative = 0;
    let paybackPeriod = 0;
    for (let i = 0; i < flows.length; i += 1) {
      const prevCumulative = cumulative;
      cumulative += flows[i];
      if (!paybackPeriod && cumulative >= investment) {
        const remainingBeforeYear = Math.max(0, investment - prevCumulative);
        const fraction = flows[i] > 0 ? remainingBeforeYear / flows[i] : 0;
        paybackPeriod = i + fraction;
      }
    }

    const profitabilityIndex = investment > 0 ? discountedTotal / investment : 0;

    setResult({ npv, irr, paybackPeriod, profitabilityIndex });
  }, [initialInvestment, discountRate, cashFlows]);

  const addYear = () => {
    if (cashFlows.length >= 10) return;
    setCashFlows((prev) => [...prev, "0"]);
  };

  const updateCashFlow = (index: number, value: string) => {
    setCashFlows((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <CalculatorShell
      title="NPV Calculator"
      subtitle="Discounted cash flow analysis with IRR approximation"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} />
          <NumberInput label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-secondary">Cash Flows</label>
              <button
                onClick={addYear}
                disabled={cashFlows.length >= 10}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-gradient-orange text-white disabled:opacity-50"
              >
                Add Year
              </button>
            </div>
            {cashFlows.map((value, index) => (
              <MoneyInput
                key={`cf-${index + 1}`}
                label={`Year ${index + 1}`}
                value={value}
                onChange={(val) => updateCashFlow(index, val)}
              />
            ))}
          </div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-6">
            <div className="text-xs text-tertiary uppercase tracking-wide font-medium">NPV</div>
            <div className={cn(
              "mt-2 text-4xl font-bold",
              result.npv >= 0 ? "text-success" : "text-red-400"
            )}>
              {formatINR(result.npv)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStat label="IRR" value={formatPct(result.irr)} />
            <MiniStat label="Payback Period (Years)" value={formatNum(result.paybackPeriod)} />
            <MiniStat label="Profitability Index" value={formatNum(result.profitabilityIndex)} />
          </div>
        </div>
      )}
    />
  );
}

function TDSCalc() {
  const paymentTypes = Object.keys(TDS_CONFIG) as TdsPaymentType[];
  const [paymentType, setPaymentType] = useState<TdsPaymentType>("Professional/Technical fees (194J)");
  const [paymentAmount, setPaymentAmount] = useState("100000");
  const [recipientType, setRecipientType] = useState<"resident" | "NRI">("resident");
  const [contractorType, setContractorType] = useState<"individual" | "company">("individual");
  const [result, setResult] = useState({
    tdsAmount: 0,
    netPayment: 0,
    sectionReference: "",
    thresholdLimit: 0,
    thresholdMet: false,
    rateUsed: 0,
    dueDate: "7th of next month",
  });

  useEffect(() => {
    const amount = toNum(paymentAmount);
    const config = TDS_CONFIG[paymentType];
    const thresholdMet = amount >= config.threshold;

    let rateUsed = 0;
    if (paymentType === "Salary (192)") {
      if (recipientType === "resident") {
        const taxableIncome = Math.max(0, amount - 75000);
        const { baseTax } = calculateSlabTax(taxableIncome, NEW_REGIME_SLABS);
        const totalTax = baseTax * 1.04;
        rateUsed = amount > 0 ? (totalTax / amount) * 100 : 0;
      } else {
        rateUsed = config.nriRate;
      }
    } else if (recipientType === "resident") {
      if (paymentType === "Contractor payment (194C)") {
        rateUsed = contractorType === "company" && "residentCompanyRate" in config
          ? config.residentCompanyRate
          : config.residentRate;
      } else {
        rateUsed = config.residentRate;
      }
    } else {
      rateUsed = config.nriRate;
    }

    const tdsAmount = thresholdMet ? amount * (rateUsed / 100) : 0;
    const netPayment = amount - tdsAmount;

    setResult({
      tdsAmount,
      netPayment,
      sectionReference: config.section,
      thresholdLimit: config.threshold,
      thresholdMet,
      rateUsed,
      dueDate: "7th of next month",
    });
  }, [paymentType, paymentAmount, recipientType, contractorType]);

  return (
    <CalculatorShell
      title="TDS Calculator"
      subtitle="Section-wise TDS estimate with threshold checks"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Payment Type">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as TdsPaymentType)}
              className="glass-select w-full h-11 px-3 rounded-[10px] text-sm focus:outline-none focus:border-[rgba(249,115,22,0.5)]"
            >
              {paymentTypes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <MoneyInput label="Payment Amount" value={paymentAmount} onChange={setPaymentAmount} />

          <Field label="Recipient Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["resident", "NRI"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setRecipientType(item)}
                  className={cn(
                    "py-2 text-sm font-medium rounded-md transition-all",
                    recipientType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          {paymentType === "Contractor payment (194C)" && recipientType === "resident" && (
            <Field label="Contractor Type">
              <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
                {(["individual", "company"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setContractorType(item)}
                    className={cn(
                      "py-2 text-sm font-medium rounded-md transition-all capitalize",
                      contractorType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>
          )}
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          {!result.thresholdMet && result.thresholdLimit > 0 && (
            <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
              Threshold warning: Payment is below {formatINR(result.thresholdLimit)}. TDS may not be applicable.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="TDS Amount" value={formatINR(result.tdsAmount)} />
            <MiniStat label="Net Payment" value={formatINR(result.netPayment)} />
            <MiniStat label="Section Reference" value={result.sectionReference} />
            <MiniStat label="Threshold Limit" value={formatINR(result.thresholdLimit)} />
            <MiniStat label="Rate Used" value={formatPct(result.rateUsed)} />
            <MiniStat label="Due Date for Deposit" value={result.dueDate} />
          </div>
        </div>
      )}
    />
  );
}

function PPFCalc() {
  const [annualInvestment, setAnnualInvestment] = useState("150000");
  const [years, setYears] = useState("15");
  const [result, setResult] = useState({
    maturityAmount: 0,
    totalInvested: 0,
    totalInterest: 0,
    effectiveReturn: 0,
    taxBenefit80C: 0,
    usedYears: 15,
    schedule: [] as Array<{ year: number; investment: number; interest: number; balance: number }>,
  });

  useEffect(() => {
    const investment = toNum(annualInvestment);
    const yearInput = Math.floor(toNum(years));
    const usedYears = Math.min(50, Math.max(15, yearInput || 15));

    let balance = 0;
    const schedule: Array<{ year: number; investment: number; interest: number; balance: number }> = [];

    for (let year = 1; year <= usedYears; year += 1) {
      const opening = balance;
      balance = (opening + investment) * 1.071;
      const interest = balance - opening - investment;
      schedule.push({
        year,
        investment,
        interest,
        balance,
      });
    }

    const totalInvested = investment * usedYears;
    const maturityAmount = balance;
    const totalInterest = maturityAmount - totalInvested;
    const effectiveReturn = totalInvested > 0 ? (totalInterest / totalInvested) * 100 : 0;
    const taxBenefit80C = Math.min(investment, 150000);

    setResult({
      maturityAmount,
      totalInvested,
      totalInterest,
      effectiveReturn,
      taxBenefit80C,
      usedYears,
      schedule,
    });
  }, [annualInvestment, years]);

  return (
    <CalculatorShell
      title="PPF Calculator"
      subtitle="7.1% annual compounding with year-wise growth"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Annual Investment" value={annualInvestment} onChange={setAnnualInvestment} />
          <NumberInput label="Years (15 to 50)" value={years} onChange={setYears} />
          <div className="text-xs text-tertiary">Using {result.usedYears} years for calculation.</div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Maturity Amount" value={formatINR(result.maturityAmount)} green />
            <MiniStat label="Total Invested" value={formatINR(result.totalInvested)} />
            <MiniStat label="Interest Earned" value={formatINR(result.totalInterest)} />
            <MiniStat label="Effective Return" value={formatPct(result.effectiveReturn)} />
            <MiniStat label="80C Deduction (Yearly)" value={formatINR(result.taxBenefit80C)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Year-wise PPF Schedule</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Investment</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Interest</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.investment)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.interest)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function SLMCalc() {
  const [assetName, setAssetName] = useState("Asset");
  const [purchaseCost, setPurchaseCost] = useState("1000000");
  const [salvageValue, setSalvageValue] = useState("100000");
  const [usefulLifeYears, setUsefulLifeYears] = useState("10");
  const [result, setResult] = useState({
    annualDepreciation: 0,
    depreciationRate: 0,
    totalDepreciation: 0,
    usedYears: 0,
    table: [] as Array<{ year: number; depreciation: number; accumulated: number; bookValue: number }>,
  });

  useEffect(() => {
    const cost = toNum(purchaseCost);
    const salvage = Math.min(cost, toNum(salvageValue));
    const yearsNum = Math.max(1, Math.floor(toNum(usefulLifeYears)));

    const annualDepreciation = yearsNum > 0 ? (cost - salvage) / yearsNum : 0;
    const depreciationRate = cost > 0 ? (annualDepreciation / cost) * 100 : 0;

    const table: Array<{ year: number; depreciation: number; accumulated: number; bookValue: number }> = [];
    for (let year = 1; year <= yearsNum; year += 1) {
      const accumulated = annualDepreciation * year;
      const bookValue = Math.max(salvage, cost - accumulated);
      table.push({
        year,
        depreciation: annualDepreciation,
        accumulated,
        bookValue,
      });
    }

    const totalDepreciation = annualDepreciation * yearsNum;

    setResult({
      annualDepreciation,
      depreciationRate,
      totalDepreciation,
      usedYears: yearsNum,
      table,
    });
  }, [purchaseCost, salvageValue, usefulLifeYears]);

  return (
    <CalculatorShell
      title="Straight Line Depreciation"
      subtitle="Uniform annual depreciation over useful life"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Asset Name">
            <input
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="Asset"
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <MoneyInput label="Purchase Cost" value={purchaseCost} onChange={setPurchaseCost} />
          <MoneyInput label="Salvage Value" value={salvageValue} onChange={setSalvageValue} />
          <NumberInput label="Useful Life (Years)" value={usefulLifeYears} onChange={setUsefulLifeYears} />
          <div className="text-xs text-tertiary">Asset: {assetName || "Asset"} | Years: {result.usedYears}</div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Annual Depreciation" value={formatINR(result.annualDepreciation)} />
            <MiniStat label="Depreciation Rate" value={formatPct(result.depreciationRate)} />
            <MiniStat label="Total Depreciation" value={formatINR(result.totalDepreciation)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Straight Line Schedule</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Depreciation</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Accumulated</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Book Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.depreciation)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.accumulated)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.bookValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function MaterialityCalc() {
  const [totalRevenue, setTotalRevenue] = useState("50000000");
  const [totalAssets, setTotalAssets] = useState("80000000");
  const [netProfit, setNetProfit] = useState("7000000");
  const [benchmark, setBenchmark] = useState<"revenue" | "assets" | "profit">("revenue");
  const [result, setResult] = useState({
    revenueMateriality: 0,
    assetsMateriality: 0,
    profitMateriality: 0,
    planningMateriality: 0,
    performanceMateriality: 0,
    trivialAmount: 0,
  });

  useEffect(() => {
    const revenue = toNum(totalRevenue);
    const assets = toNum(totalAssets);
    const profit = Math.abs(toNum(netProfit));

    const revenueMateriality = revenue * 0.0075;
    const assetsMateriality = assets * 0.015;
    const profitMateriality = profit * 0.075;

    const planningMateriality = benchmark === "revenue"
      ? revenueMateriality
      : benchmark === "assets"
        ? assetsMateriality
        : profitMateriality;

    const performanceMateriality = planningMateriality * 0.75;
    const trivialAmount = planningMateriality * 0.04;

    setResult({
      revenueMateriality,
      assetsMateriality,
      profitMateriality,
      planningMateriality,
      performanceMateriality,
      trivialAmount,
    });
  }, [totalRevenue, totalAssets, netProfit, benchmark]);

  return (
    <CalculatorShell
      title="Audit Materiality Calculator"
      subtitle="Planning, performance and trivial thresholds"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Total Revenue" value={totalRevenue} onChange={setTotalRevenue} />
          <MoneyInput label="Total Assets" value={totalAssets} onChange={setTotalAssets} />
          <MoneyInput label="Net Profit" value={netProfit} onChange={setNetProfit} />

          <Field label="Benchmark">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["revenue", "assets", "profit"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setBenchmark(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all capitalize",
                    benchmark === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Revenue (0.5% - 1%)</div>
              <div className="mt-2 text-lg font-bold">{formatINR(result.revenueMateriality)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Assets (1% - 2%)</div>
              <div className="mt-2 text-lg font-bold">{formatINR(result.assetsMateriality)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Net Profit (5% - 10%)</div>
              <div className="mt-2 text-lg font-bold">{formatINR(result.profitMateriality)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStat label="Planning Materiality" value={formatINR(result.planningMateriality)} green />
            <MiniStat label="Performance Materiality (75%)" value={formatINR(result.performanceMateriality)} />
            <MiniStat label="Trivial Threshold (4%)" value={formatINR(result.trivialAmount)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Based on ISA 320 / SA 320 guidelines
          </div>
        </div>
      )}
    />
  );
}

function StampDutyCalc() {
  const states = Object.keys(STAMP_DUTY_RATES) as Array<keyof typeof STAMP_DUTY_RATES>;
  const [propertyValue, setPropertyValue] = useState("8000000");
  const [state, setState] = useState<keyof typeof STAMP_DUTY_RATES>("Maharashtra");
  const [propertyType, setPropertyType] = useState<"residential" | "commercial">("residential");
  const [ownerGender, setOwnerGender] = useState<"women" | "men">("women");
  const [result, setResult] = useState({
    stampDuty: 0,
    registrationCharge: 0,
    totalCharges: 0,
    effectiveRate: 0,
    appliedRate: 0,
    rows: [] as Array<{ state: string; rate: number; stampDuty: number; registration: number; total: number }>,
  });

  useEffect(() => {
    const value = toNum(propertyValue);

    const getRate = (
      itemState: keyof typeof STAMP_DUTY_RATES,
      itemPropertyType: "residential" | "commercial",
      gender: "women" | "men"
    ) => {
      if (itemState === "Delhi" && itemPropertyType === "residential") {
        return gender === "women"
          ? STAMP_DUTY_RATES.Delhi.residentialWomen
          : STAMP_DUTY_RATES.Delhi.residentialMen;
      }
      if (itemState === "Delhi") {
        return STAMP_DUTY_RATES.Delhi.commercial;
      }
      return STAMP_DUTY_RATES[itemState][itemPropertyType];
    };

    const appliedRate = getRate(state, propertyType, ownerGender);
    const stampDuty = value * (appliedRate / 100);
    const registrationCharge = value * 0.01;
    const totalCharges = stampDuty + registrationCharge;
    const effectiveRate = value > 0 ? (totalCharges / value) * 100 : 0;

    const rows: Array<{ state: string; rate: number; stampDuty: number; registration: number; total: number }> = [];
    states.forEach((item) => {
      if (item === "Delhi" && propertyType === "residential") {
        ["women", "men"].forEach((gender) => {
          const rate = getRate(item, propertyType, gender as "women" | "men");
          const rowStampDuty = value * (rate / 100);
          const rowRegistration = value * 0.01;
          rows.push({
            state: `Delhi (${gender === "women" ? "Women" : "Men"})`,
            rate,
            stampDuty: rowStampDuty,
            registration: rowRegistration,
            total: rowStampDuty + rowRegistration,
          });
        });
      } else {
        const rate = getRate(item, propertyType, ownerGender);
        const rowStampDuty = value * (rate / 100);
        const rowRegistration = value * 0.01;
        rows.push({
          state: item,
          rate,
          stampDuty: rowStampDuty,
          registration: rowRegistration,
          total: rowStampDuty + rowRegistration,
        });
      }
    });

    setResult({
      stampDuty,
      registrationCharge,
      totalCharges,
      effectiveRate,
      appliedRate,
      rows,
    });
  }, [propertyValue, state, propertyType, ownerGender]);

  return (
    <CalculatorShell
      title="Stamp Duty Calculator"
      subtitle="State-wise stamp duty and registration charges"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Property Value" value={propertyValue} onChange={setPropertyValue} />

          <Field label="State">
            <select
              value={state}
              onChange={(e) => setState(e.target.value as keyof typeof STAMP_DUTY_RATES)}
              className="glass-select w-full h-11 px-3 rounded-[10px] text-sm focus:outline-none focus:border-[rgba(249,115,22,0.5)]"
            >
              {states.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Property Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["residential", "commercial"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setPropertyType(item)}
                  className={cn(
                    "py-2 text-sm font-medium rounded-md transition-all capitalize",
                    propertyType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          {state === "Delhi" && propertyType === "residential" && (
            <Field label="Owner Gender (Delhi residential)">
              <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
                {(["women", "men"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setOwnerGender(item)}
                    className={cn(
                      "py-2 text-sm font-medium rounded-md transition-all capitalize",
                      ownerGender === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>
          )}
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Stamp Duty" value={formatINR(result.stampDuty)} />
            <MiniStat label="Registration Charge (1%)" value={formatINR(result.registrationCharge)} />
            <MiniStat label="Total Charges" value={formatINR(result.totalCharges)} green />
            <MiniStat label="Effective Rate" value={formatPct(result.effectiveRate)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-xs text-secondary">
            Applied Stamp Duty Rate: {formatPct(result.appliedRate)}
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">All States Comparison</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">State</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Stamp Duty</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Registration</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={`${row.state}-${index}`} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.state}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.stampDuty)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.registration)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function WACCCalc() {
  const [equityValue, setEquityValue] = useState("5000000");
  const [debtValue, setDebtValue] = useState("3000000");
  const [costOfEquity, setCostOfEquity] = useState("14");
  const [costOfDebt, setCostOfDebt] = useState("9");
  const [taxRate, setTaxRate] = useState("25");
  const [result, setResult] = useState({
    wacc: 0,
    weightEquity: 0,
    weightDebt: 0,
    afterTaxCostOfDebt: 0,
    formulaText: "",
  });

  useEffect(() => {
    const equity = toNum(equityValue);
    const debt = toNum(debtValue);
    const coe = toNum(costOfEquity);
    const cod = toNum(costOfDebt);
    const tax = toNum(taxRate);

    const totalCapital = equity + debt;
    const weightEquity = totalCapital > 0 ? equity / totalCapital : 0;
    const weightDebt = totalCapital > 0 ? debt / totalCapital : 0;
    const afterTaxCostOfDebt = cod * (1 - tax / 100);
    const wacc = (weightEquity * coe) + (weightDebt * afterTaxCostOfDebt);

    const formulaText = `(${weightEquity.toFixed(4)} x ${coe.toFixed(2)}%) + (${weightDebt.toFixed(4)} x ${afterTaxCostOfDebt.toFixed(2)}%) = ${wacc.toFixed(2)}%`;

    setResult({
      wacc,
      weightEquity: weightEquity * 100,
      weightDebt: weightDebt * 100,
      afterTaxCostOfDebt,
      formulaText,
    });
  }, [equityValue, debtValue, costOfEquity, costOfDebt, taxRate]);

  return (
    <CalculatorShell
      title="WACC Calculator"
      subtitle="Weighted average cost of capital"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Equity Value" value={equityValue} onChange={setEquityValue} />
          <MoneyInput label="Debt Value" value={debtValue} onChange={setDebtValue} />
          <NumberInput label="Cost of Equity (%)" value={costOfEquity} onChange={setCostOfEquity} />
          <NumberInput label="Cost of Debt (%)" value={costOfDebt} onChange={setCostOfDebt} />
          <NumberInput label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="WACC" value={formatPct(result.wacc)} green />
            <MiniStat label="Weight Equity" value={formatPct(result.weightEquity)} />
            <MiniStat label="Weight Debt" value={formatPct(result.weightDebt)} />
            <MiniStat label="After-tax Cost of Debt" value={formatPct(result.afterTaxCostOfDebt)} />
          </div>

          <div className="card-surface p-4 border border-white/10">
            <div className="text-xs uppercase tracking-wide text-tertiary">Formula with Substituted Values</div>
            <div className="mt-2 text-sm text-secondary">{result.formulaText}</div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            A project is viable if its return exceeds WACC of {formatPct(result.wacc)}.
          </div>
        </div>
      )}
    />
  );
}

function DCFCalc() {
  const [cashFlows, setCashFlows] = useState<string[]>(["0", "250000", "300000", "360000", "420000", "480000"]);
  const [terminalGrowth, setTerminalGrowth] = useState("4");
  const [discountRate, setDiscountRate] = useState("12");
  const [netDebt, setNetDebt] = useState("0");
  const [sharesOutstanding, setSharesOutstanding] = useState("0");
  const [result, setResult] = useState({
    enterpriseValue: 0,
    equityValue: 0,
    pricePerShare: 0,
    terminalValue: 0,
    pvTerminalValue: 0,
    terminalPercent: 0,
    rows: [] as Array<{ year: number; fcf: number; pv: number }>,
  });

  useEffect(() => {
    const flows = cashFlows.map((value) => toNum(value));
    const g = toNum(terminalGrowth) / 100;
    const r = toNum(discountRate) / 100;
    const debt = toNum(netDebt);
    const shares = toNum(sharesOutstanding);

    const rows: Array<{ year: number; fcf: number; pv: number }> = [];
    let pvOfFcfs = 0;

    flows.forEach((fcf, year) => {
      const pv = fcf / (1 + r) ** year;
      pvOfFcfs += pv;
      rows.push({ year, fcf, pv });
    });

    const lastFcf = flows.length ? flows[flows.length - 1] : 0;
    const n = Math.max(0, flows.length - 1);
    const terminalValue = r > g ? (lastFcf * (1 + g)) / (r - g) : 0;
    const pvTerminalValue = terminalValue / (1 + r) ** n;

    const enterpriseValue = pvOfFcfs + pvTerminalValue;
    const equityValue = enterpriseValue - debt;
    const pricePerShare = shares > 0 ? equityValue / shares : 0;
    const terminalPercent = enterpriseValue > 0 ? (pvTerminalValue / enterpriseValue) * 100 : 0;

    setResult({
      enterpriseValue,
      equityValue,
      pricePerShare,
      terminalValue,
      pvTerminalValue,
      terminalPercent,
      rows,
    });
  }, [cashFlows, terminalGrowth, discountRate, netDebt, sharesOutstanding]);

  const updateCashFlow = (index: number, value: string) => {
    setCashFlows((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addYear = () => {
    if (cashFlows.length >= 10) return;
    setCashFlows((prev) => [...prev, "0"]);
  };

  return (
    <CalculatorShell
      title="DCF Valuation"
      subtitle="Discounted cash flow enterprise and equity valuation"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
            <button
              onClick={addYear}
              disabled={cashFlows.length >= 10}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-gradient-orange text-white disabled:opacity-50"
            >
              Add Year
            </button>
          </div>

          {cashFlows.map((value, index) => (
            <MoneyInput
              key={`dcf-year-${index}`}
              label={`Year ${index} Free Cash Flow`}
              value={value}
              onChange={(val) => updateCashFlow(index, val)}
            />
          ))}

          <NumberInput label="Terminal Growth Rate (%)" value={terminalGrowth} onChange={setTerminalGrowth} />
          <NumberInput label="Discount Rate / WACC (%)" value={discountRate} onChange={setDiscountRate} />
          <MoneyInput label="Net Debt (Optional)" value={netDebt} onChange={setNetDebt} />
          <NumberInput label="Shares Outstanding (Optional)" value={sharesOutstanding} onChange={setSharesOutstanding} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Enterprise Value" value={formatINR(result.enterpriseValue)} green />
            <MiniStat label="Equity Value" value={formatINR(result.equityValue)} />
            <MiniStat label="Price Per Share" value={formatINR(result.pricePerShare)} />
            <MiniStat label="Terminal Value Contribution" value={formatPct(result.terminalPercent)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-xs text-secondary">
            Terminal Value: {formatINR(result.terminalValue)} | PV of Terminal Value: {formatINR(result.pvTerminalValue)}
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">PV Breakdown</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">FCF</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Present Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">Year {row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.fcf)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.pv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function SampleSizeCalc() {
  const [populationSize, setPopulationSize] = useState("10000");
  const [confidenceLevel, setConfidenceLevel] = useState<"90" | "95" | "99">("95");
  const [tolerableErrorRate, setTolerableErrorRate] = useState("5");
  const [expectedErrorRate, setExpectedErrorRate] = useState("2");
  const [populationValue, setPopulationValue] = useState("50000000");
  const [tolerableMisstatement, setTolerableMisstatement] = useState("1000000");
  const [result, setResult] = useState({
    sampleSize: 0,
    rawN: 0,
    adjustedN: 0,
    musSize: 0,
    zValue: 1.96,
  });

  useEffect(() => {
    const N = Math.max(1, toNum(populationSize));
    const e = Math.max(0.0001, toNum(tolerableErrorRate) / 100);
    const p = Math.min(0.9999, Math.max(0.0001, toNum(expectedErrorRate) / 100));
    const zMap: Record<"90" | "95" | "99", number> = { "90": 1.645, "95": 1.96, "99": 2.576 };
    const zValue = zMap[confidenceLevel];

    const rawN = (zValue ** 2 * p * (1 - p)) / (e ** 2);
    const adjustedN = rawN / (1 + (rawN - 1) / N);
    const sampleSize = Math.ceil(adjustedN);

    const popValue = toNum(populationValue);
    const tolMiss = toNum(tolerableMisstatement);
    const musSize = tolMiss > 0 ? popValue / (tolMiss / zValue) : 0;

    setResult({
      sampleSize,
      rawN,
      adjustedN,
      musSize,
      zValue,
    });
  }, [populationSize, confidenceLevel, tolerableErrorRate, expectedErrorRate, populationValue, tolerableMisstatement]);

  return (
    <CalculatorShell
      title="Audit Sample Size Calculator"
      subtitle="Attribute sampling and MUS estimate"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <NumberInput label="Population Size" value={populationSize} onChange={setPopulationSize} />

          <Field label="Confidence Level">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["90", "95", "99"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setConfidenceLevel(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    confidenceLevel === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}%
                </button>
              ))}
            </div>
          </Field>

          <NumberInput label="Tolerable Error Rate (%)" value={tolerableErrorRate} onChange={setTolerableErrorRate} />
          <NumberInput label="Expected Error Rate (%)" value={expectedErrorRate} onChange={setExpectedErrorRate} />
          <MoneyInput label="Population Value (for MUS)" value={populationValue} onChange={setPopulationValue} />
          <MoneyInput label="Tolerable Misstatement (for MUS)" value={tolerableMisstatement} onChange={setTolerableMisstatement} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Sample Size" value={Math.max(0, result.sampleSize).toLocaleString("en-IN")} green />
            <MiniStat label="MUS Size" value={Math.ceil(Math.max(0, result.musSize)).toLocaleString("en-IN")} />
            <MiniStat label="Raw n" value={formatNum(result.rawN)} />
            <MiniStat label="Adjusted n" value={formatNum(result.adjustedN)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Test {Math.max(0, result.sampleSize).toLocaleString("en-IN")} items from population of {Math.max(1, toNum(populationSize)).toLocaleString("en-IN")} with {confidenceLevel}% confidence.
          </div>
        </div>
      )}
    />
  );
}

function Section80CCalc() {
  const [epf, setEpf] = useState("50000");
  const [ppf, setPpf] = useState("30000");
  const [elss, setElss] = useState("20000");
  const [lic, setLic] = useState("15000");
  const [homePrincipal, setHomePrincipal] = useState("25000");
  const [tuitionFees, setTuitionFees] = useState("10000");
  const [nscFd, setNscFd] = useState("0");
  const [healthSelfFamily, setHealthSelfFamily] = useState("25000");
  const [healthParents, setHealthParents] = useState("25000");
  const [npsAdditional, setNpsAdditional] = useState("50000");
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [isParentsSeniorCitizen, setIsParentsSeniorCitizen] = useState(false);
  const [result, setResult] = useState({
    total80C: 0,
    total80D: 0,
    totalNPS: 0,
    grandTotalDeduction: 0,
    unused80CCapacity: 0,
    taxSavingAt30: 0,
    taxSavingAt20: 0,
    taxSavingAt5: 0,
    raw80C: 0,
  });

  useEffect(() => {
    const raw80C =
      toNum(epf) +
      toNum(ppf) +
      toNum(elss) +
      toNum(lic) +
      toNum(homePrincipal) +
      toNum(tuitionFees) +
      toNum(nscFd);

    const total80C = Math.min(raw80C, 150000);

    const selfFamilyCap = isSeniorCitizen ? 50000 : 25000;
    const parentsCap = isParentsSeniorCitizen ? 50000 : 25000;
    const total80D = Math.min(toNum(healthSelfFamily), selfFamilyCap) + Math.min(toNum(healthParents), parentsCap);

    const totalNPS = Math.min(toNum(npsAdditional), 50000);
    const grandTotalDeduction = total80C + total80D + totalNPS;
    const unused80CCapacity = Math.max(0, 150000 - total80C);

    setResult({
      total80C,
      total80D,
      totalNPS,
      grandTotalDeduction,
      unused80CCapacity,
      taxSavingAt30: grandTotalDeduction * 0.3,
      taxSavingAt20: grandTotalDeduction * 0.2,
      taxSavingAt5: grandTotalDeduction * 0.05,
      raw80C,
    });
  }, [
    epf,
    ppf,
    elss,
    lic,
    homePrincipal,
    tuitionFees,
    nscFd,
    healthSelfFamily,
    healthParents,
    npsAdditional,
    isSeniorCitizen,
    isParentsSeniorCitizen,
  ]);

  return (
    <CalculatorShell
      title="Section 80C / 80D Deduction Planner"
      subtitle="Optimize deductions across 80C, 80D and 80CCD(1B)"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">80C Inputs</h2>
          <MoneyInput label="EPF Contribution" value={epf} onChange={setEpf} />
          <MoneyInput label="PPF Investment" value={ppf} onChange={setPpf} />
          <MoneyInput label="ELSS Mutual Funds" value={elss} onChange={setElss} />
          <MoneyInput label="LIC Premium" value={lic} onChange={setLic} />
          <MoneyInput label="Home Loan Principal" value={homePrincipal} onChange={setHomePrincipal} />
          <MoneyInput label="Tuition Fees" value={tuitionFees} onChange={setTuitionFees} />
          <MoneyInput label="NSC / Tax Saving FD" value={nscFd} onChange={setNscFd} />

          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary pt-2">80D + 80CCD(1B)</h2>
          <MoneyInput label="Self & Family Health Premium" value={healthSelfFamily} onChange={setHealthSelfFamily} />
          <MoneyInput label="Parents Health Premium" value={healthParents} onChange={setHealthParents} />
          <MoneyInput label="NPS Additional (80CCD(1B))" value={npsAdditional} onChange={setNpsAdditional} />

          <Field label="Senior Citizen Status">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10 gap-1">
              <button
                onClick={() => setIsSeniorCitizen((v) => !v)}
                className={cn(
                  "py-2 text-xs font-medium rounded-md transition-all",
                  isSeniorCitizen ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                )}
              >
                Self/Family Senior: {isSeniorCitizen ? "Yes" : "No"}
              </button>
              <button
                onClick={() => setIsParentsSeniorCitizen((v) => !v)}
                className={cn(
                  "py-2 text-xs font-medium rounded-md transition-all",
                  isParentsSeniorCitizen ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                )}
              >
                Parents Senior: {isParentsSeniorCitizen ? "Yes" : "No"}
              </button>
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Total 80C (Capped)" value={formatINR(result.total80C)} />
            <MiniStat label="Unused 80C Capacity" value={formatINR(result.unused80CCapacity)} />
            <MiniStat label="Total 80D" value={formatINR(result.total80D)} />
            <MiniStat label="Total NPS (80CCD(1B))" value={formatINR(result.totalNPS)} />
            <MiniStat label="Grand Total Deduction" value={formatINR(result.grandTotalDeduction)} green />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Tax Saving @ 30%</div>
              <div className="mt-2 text-lg font-bold text-gradient-orange">{formatINR(result.taxSavingAt30)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Tax Saving @ 20%</div>
              <div className="mt-2 text-lg font-bold">{formatINR(result.taxSavingAt20)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Tax Saving @ 5%</div>
              <div className="mt-2 text-lg font-bold">{formatINR(result.taxSavingAt5)}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function BalanceTransferCalc() {
  const [currentLoanBalance, setCurrentLoanBalance] = useState("3000000");
  const [currentInterestRate, setCurrentInterestRate] = useState("10");
  const [currentRemainingTenure, setCurrentRemainingTenure] = useState("180");
  const [newInterestRate, setNewInterestRate] = useState("8.5");
  const [processingFee, setProcessingFee] = useState("1");
  const [prepaymentPenalty, setPrepaymentPenalty] = useState("2");
  const [result, setResult] = useState({
    oldEMI: 0,
    newEMI: 0,
    monthlySaving: 0,
    totalInterestSaved: 0,
    switchingCost: 0,
    netSaving: 0,
    breakevenMonths: 0,
    recommended: false,
  });

  useEffect(() => {
    const balance = toNum(currentLoanBalance);
    const oldRate = toNum(currentInterestRate);
    const tenure = Math.max(1, Math.floor(toNum(currentRemainingTenure)));
    const newRate = toNum(newInterestRate);
    const processPct = toNum(processingFee);
    const penaltyPct = toNum(prepaymentPenalty);

    const oldEMI = calculateEMIFromPrincipal(balance, oldRate, tenure);
    const newEMI = calculateEMIFromPrincipal(balance, newRate, tenure);
    const monthlySaving = oldEMI - newEMI;

    const totalInterestOld = oldEMI * tenure - balance;
    const totalInterestNew = newEMI * tenure - balance;
    const totalInterestSaved = totalInterestOld - totalInterestNew;

    const switchingCost = (processPct / 100) * balance + (penaltyPct / 100) * balance;
    const netSaving = totalInterestSaved - switchingCost;
    const breakevenMonths = monthlySaving > 0 ? switchingCost / monthlySaving : 0;

    setResult({
      oldEMI,
      newEMI,
      monthlySaving,
      totalInterestSaved,
      switchingCost,
      netSaving,
      breakevenMonths,
      recommended: netSaving > 0,
    });
  }, [
    currentLoanBalance,
    currentInterestRate,
    currentRemainingTenure,
    newInterestRate,
    processingFee,
    prepaymentPenalty,
  ]);

  return (
    <CalculatorShell
      title="Loan Balance Transfer Calculator"
      subtitle="Compare refinancing savings against switching cost"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Current Loan Balance" value={currentLoanBalance} onChange={setCurrentLoanBalance} />
          <NumberInput label="Current Interest Rate (%)" value={currentInterestRate} onChange={setCurrentInterestRate} />
          <NumberInput label="Remaining Tenure (Months)" value={currentRemainingTenure} onChange={setCurrentRemainingTenure} />
          <NumberInput label="New Interest Rate (%)" value={newInterestRate} onChange={setNewInterestRate} />
          <NumberInput label="Processing Fee (%)" value={processingFee} onChange={setProcessingFee} />
          <NumberInput label="Prepayment Penalty (%)" value={prepaymentPenalty} onChange={setPrepaymentPenalty} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Old EMI" value={formatINR(result.oldEMI)} />
            <MiniStat label="New EMI" value={formatINR(result.newEMI)} />
            <MiniStat label="Monthly EMI Saving" value={formatINR(result.monthlySaving)} />
            <MiniStat label="Total Interest Saved" value={formatINR(result.totalInterestSaved)} />
            <MiniStat label="Switching Cost" value={formatINR(result.switchingCost)} />
            <MiniStat label="Net Saving" value={formatINR(result.netSaving)} green={result.netSaving > 0} />
            <MiniStat label="Breakeven (Months)" value={formatNum(result.breakevenMonths)} />
          </div>

          <div className={cn(
            "card-surface p-4 border text-sm",
            result.recommended ? "border-success/40 text-success" : "border-red-400/40 text-red-400"
          )}>
            {result.recommended ? "Worth switching" : "Not recommended"}
          </div>
        </div>
      )}
    />
  );
}

function DividendTaxCalc() {
  const [dividendAmount, setDividendAmount] = useState("100000");
  const [shareholderType, setShareholderType] = useState<"individual" | "company" | "NRI">("individual");
  const [taxSlab, setTaxSlab] = useState<"5" | "20" | "30">("30");
  const [hasDTAA, setHasDTAA] = useState(false);
  const [result, setResult] = useState({
    grossDividend: 0,
    tdsDeducted: 0,
    netDividendReceived: 0,
    additionalTaxIfAny: 0,
    totalTaxOnDividend: 0,
    effectiveRate: 0,
  });

  useEffect(() => {
    const gross = toNum(dividendAmount);
    let tdsDeducted = 0;
    let totalTaxOnDividend = 0;

    if (shareholderType === "individual") {
      const slabRate = toNum(taxSlab) / 100;
      totalTaxOnDividend = gross * slabRate;
      tdsDeducted = gross > 5000 ? gross * 0.1 : 0;
    } else if (shareholderType === "company") {
      totalTaxOnDividend = gross * 0.22;
      tdsDeducted = 0;
    } else {
      if (hasDTAA) {
        totalTaxOnDividend = gross * 0.1;
      } else {
        const baseTax = gross * 0.2;
        const surcharge = baseTax * 0.1;
        const cess = (baseTax + surcharge) * 0.04;
        totalTaxOnDividend = baseTax + surcharge + cess;
      }
      tdsDeducted = totalTaxOnDividend;
    }

    const additionalTaxIfAny = Math.max(0, totalTaxOnDividend - tdsDeducted);
    const netDividendReceived = gross - tdsDeducted;
    const effectiveRate = gross > 0 ? (totalTaxOnDividend / gross) * 100 : 0;

    setResult({
      grossDividend: gross,
      tdsDeducted,
      netDividendReceived,
      additionalTaxIfAny,
      totalTaxOnDividend,
      effectiveRate,
    });
  }, [dividendAmount, shareholderType, taxSlab, hasDTAA]);

  return (
    <CalculatorShell
      title="Dividend Tax Calculator"
      subtitle="Estimate withholding and final tax by shareholder type"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Dividend Amount" value={dividendAmount} onChange={setDividendAmount} />

          <Field label="Shareholder Type">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["individual", "company", "NRI"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setShareholderType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all capitalize",
                    shareholderType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tax Slab (Individual)">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["5", "20", "30"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setTaxSlab(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    taxSlab === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}%
                </button>
              ))}
            </div>
          </Field>

          {shareholderType === "NRI" && (
            <Field label="DTAA Available">
              <button
                onClick={() => setHasDTAA((v) => !v)}
                className={cn(
                  "w-full py-2 text-sm font-medium rounded-md transition-all border",
                  hasDTAA
                    ? "bg-gradient-orange text-white glow-orange border-transparent"
                    : "text-secondary border-white/10 hover:text-white"
                )}
              >
                {hasDTAA ? "Yes (Use 10% DTAA rate)" : "No (Use 20% + surcharge + cess)"}
              </button>
            </Field>
          )}
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Gross Dividend" value={formatINR(result.grossDividend)} />
            <MiniStat label="TDS Deducted" value={formatINR(result.tdsDeducted)} />
            <MiniStat label="Net Dividend Received" value={formatINR(result.netDividendReceived)} green />
            <MiniStat label="Additional Tax If Any" value={formatINR(result.additionalTaxIfAny)} />
            <MiniStat label="Total Tax on Dividend" value={formatINR(result.totalTaxOnDividend)} />
            <MiniStat label="Effective Rate" value={formatPct(result.effectiveRate)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            TDS of 10% deducted by company if dividend &gt; ₹5,000 annually
          </div>
        </div>
      )}
    />
  );
}

function ROEDetailCalc() {
  const [netIncome, setNetIncome] = useState("1200000");
  const [revenue, setRevenue] = useState("12000000");
  const [totalAssets, setTotalAssets] = useState("18000000");
  const [shareholderEquity, setShareholderEquity] = useState("6000000");
  const [result, setResult] = useState({
    basicROE: 0,
    netProfitMarginPct: 0,
    assetTurnover: 0,
    equityMultiplier: 0,
    dupontROE: 0,
    driver: "",
  });

  useEffect(() => {
    const ni = toNum(netIncome);
    const rev = toNum(revenue);
    const assets = toNum(totalAssets);
    const equity = toNum(shareholderEquity);

    const basicROE = equity > 0 ? (ni / equity) * 100 : 0;
    const netProfitMarginPct = rev > 0 ? (ni / rev) * 100 : 0;
    const assetTurnover = assets > 0 ? rev / assets : 0;
    const equityMultiplier = equity > 0 ? assets / equity : 0;
    const dupontROE = netProfitMarginPct * assetTurnover * equityMultiplier;

    const marginScore = Math.abs(netProfitMarginPct);
    const efficiencyScore = Math.abs(assetTurnover);
    const leverageScore = Math.abs(equityMultiplier);
    let driver = "Balanced contribution across margin, efficiency, and leverage.";
    if (marginScore >= efficiencyScore && marginScore >= leverageScore) {
      driver = "ROE is primarily driven by profit margin.";
    } else if (efficiencyScore >= marginScore && efficiencyScore >= leverageScore) {
      driver = "ROE is primarily driven by asset efficiency (turnover).";
    } else if (leverageScore >= marginScore && leverageScore >= efficiencyScore) {
      driver = "ROE is primarily driven by financial leverage.";
    }

    setResult({
      basicROE,
      netProfitMarginPct,
      assetTurnover,
      equityMultiplier,
      dupontROE,
      driver,
    });
  }, [netIncome, revenue, totalAssets, shareholderEquity]);

  return (
    <CalculatorShell
      title="Return on Equity (ROE) — DuPont Analysis"
      subtitle="Understand whether ROE is driven by margin, efficiency, or leverage"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Net Income" value={netIncome} onChange={setNetIncome} />
          <MoneyInput label="Revenue" value={revenue} onChange={setRevenue} />
          <MoneyInput label="Total Assets" value={totalAssets} onChange={setTotalAssets} />
          <MoneyInput label="Shareholder Equity" value={shareholderEquity} onChange={setShareholderEquity} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Basic ROE" value={formatPct(result.basicROE)} green />
            <MiniStat label="DuPont ROE" value={formatPct(result.dupontROE)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Net Profit Margin</div>
              <div className="mt-2 text-xl font-bold">{formatPct(result.netProfitMarginPct)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Asset Turnover</div>
              <div className="mt-2 text-xl font-bold">{formatNum(result.assetTurnover)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Equity Multiplier</div>
              <div className="mt-2 text-xl font-bold">{formatNum(result.equityMultiplier)}</div>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            {formatPct(result.netProfitMarginPct)} × {formatNum(result.assetTurnover)} × {formatNum(result.equityMultiplier)} = {formatPct(result.dupontROE)}
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">{result.driver}</div>
        </div>
      )}
    />
  );
}

function IRRCalc() {
  const [initialInvestment, setInitialInvestment] = useState("1000000");
  const [cashFlows, setCashFlows] = useState<string[]>(["250000", "300000", "350000", "400000"]);
  const [reinvestmentRate, setReinvestmentRate] = useState("10");
  const [result, setResult] = useState({
    irr: 0,
    mirr: 0,
    npvProfile: [] as Array<{ rate: number; npv: number }>,
  });

  useEffect(() => {
    const investment = toNum(initialInvestment);
    const flows = cashFlows.map((value) => toNum(value));
    const n = flows.length;
    const reinvestRate = toNum(reinvestmentRate) / 100;

    const npvAtRate = (ratePct: number) => {
      const rate = ratePct / 100;
      return -investment + flows.reduce((sum, cf, idx) => sum + cf / (1 + rate) ** (idx + 1), 0);
    };

    let irr = 0;
    let bestDiff = Number.POSITIVE_INFINITY;
    for (let rate = 0; rate <= 200; rate += 0.01) {
      const npv = npvAtRate(rate);
      const diff = Math.abs(npv);
      if (diff < bestDiff) {
        bestDiff = diff;
        irr = rate;
      }
      if (diff < 1) break;
    }

    const fvPositive = flows.reduce((sum, cf, idx) => {
      if (cf <= 0) return sum;
      return sum + cf * (1 + reinvestRate) ** (n - (idx + 1));
    }, 0);

    const pvNegative = investment + flows.reduce((sum, cf, idx) => {
      if (cf >= 0) return sum;
      return sum + Math.abs(cf) / (1 + reinvestRate) ** (idx + 1);
    }, 0);

    const mirr = n > 0 && pvNegative > 0
      ? ((fvPositive / pvNegative) ** (1 / n) - 1) * 100
      : 0;

    const profileRates = [5, 10, 15, 20, 25, 30];
    const npvProfile = profileRates.map((rate) => ({
      rate,
      npv: npvAtRate(rate),
    }));

    setResult({ irr, mirr, npvProfile });
  }, [initialInvestment, cashFlows, reinvestmentRate]);

  const addYear = () => {
    if (cashFlows.length >= 10) return;
    setCashFlows((prev) => [...prev, "0"]);
  };

  const updateCashFlow = (index: number, value: string) => {
    setCashFlows((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <CalculatorShell
      title="IRR Calculator"
      subtitle="IRR and MIRR analysis with NPV profile"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
            <button
              onClick={addYear}
              disabled={cashFlows.length >= 10}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-gradient-orange text-white disabled:opacity-50"
            >
              Add Year
            </button>
          </div>

          <MoneyInput label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} />
          {cashFlows.map((value, index) => (
            <MoneyInput
              key={`irr-cf-${index + 1}`}
              label={`Year ${index + 1} Cash Flow`}
              value={value}
              onChange={(val) => updateCashFlow(index, val)}
            />
          ))}
          <NumberInput label="Reinvestment Rate (%)" value={reinvestmentRate} onChange={setReinvestmentRate} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="IRR" value={formatPct(result.irr)} green />
            <MiniStat label="MIRR" value={formatPct(result.mirr)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Accept project if IRR &gt; cost of capital.
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">NPV Profile</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">NPV</th>
                  </tr>
                </thead>
                <tbody>
                  {result.npvProfile.map((row, index) => (
                    <tr key={row.rate} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.rate}%</td>
                      <td className={cn("px-5 py-2 text-right font-medium", row.npv >= 0 ? "text-success" : "text-red-400")}>{formatINR(row.npv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function PaybackCalc() {
  const [initialInvestment, setInitialInvestment] = useState("1000000");
  const [discountRate, setDiscountRate] = useState("10");
  const [cashFlows, setCashFlows] = useState<string[]>(["250000", "300000", "350000", "400000"]);
  const [result, setResult] = useState({
    simplePaybackMonths: 0,
    discountedPaybackMonths: 0,
    simpleLabel: "Not achieved",
    discountedLabel: "Not achieved",
    simpleAchievedYear: -1,
    discountedAchievedYear: -1,
    rows: [] as Array<{
      year: number;
      cashFlow: number;
      cumulativeSimple: number;
      pvCashFlow: number;
      cumulativeDiscounted: number;
      highlight: boolean;
    }>,
  });

  useEffect(() => {
    const investment = toNum(initialInvestment);
    const rate = toNum(discountRate) / 100;
    const flows = cashFlows.map((value) => toNum(value));

    let cumulativeSimple = 0;
    let cumulativeDiscounted = 0;
    let simplePaybackMonths = 0;
    let discountedPaybackMonths = 0;
    let simpleFound = false;
    let discountedFound = false;
    let simpleAchievedYear = -1;
    let discountedAchievedYear = -1;

    const rows = flows.map((cf, idx) => {
      const year = idx + 1;

      const prevSimple = cumulativeSimple;
      cumulativeSimple += cf;
      if (!simpleFound && cumulativeSimple >= investment && cf > 0) {
        const fraction = (investment - prevSimple) / cf;
        simplePaybackMonths = Math.max(0, (idx + fraction) * 12);
        simpleFound = true;
        simpleAchievedYear = year;
      }

      const pvCashFlow = cf / (1 + rate) ** year;
      const prevDiscounted = cumulativeDiscounted;
      cumulativeDiscounted += pvCashFlow;
      if (!discountedFound && cumulativeDiscounted >= investment && pvCashFlow > 0) {
        const fraction = (investment - prevDiscounted) / pvCashFlow;
        discountedPaybackMonths = Math.max(0, (idx + fraction) * 12);
        discountedFound = true;
        discountedAchievedYear = year;
      }

      return {
        year,
        cashFlow: cf,
        cumulativeSimple,
        pvCashFlow,
        cumulativeDiscounted,
        highlight: year === simpleAchievedYear || year === discountedAchievedYear,
      };
    });

    const toYearsMonths = (months: number) => {
      const yearsInt = Math.floor(months / 12);
      const monthsInt = Math.round(months % 12);
      return `${yearsInt}y ${monthsInt}m`;
    };

    setResult({
      simplePaybackMonths,
      discountedPaybackMonths,
      simpleLabel: simpleFound ? toYearsMonths(simplePaybackMonths) : "Not achieved",
      discountedLabel: discountedFound ? toYearsMonths(discountedPaybackMonths) : "Not achieved",
      simpleAchievedYear,
      discountedAchievedYear,
      rows,
    });
  }, [initialInvestment, discountRate, cashFlows]);

  const addYear = () => {
    if (cashFlows.length >= 8) return;
    setCashFlows((prev) => [...prev, "0"]);
  };

  const updateCashFlow = (index: number, value: string) => {
    setCashFlows((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <CalculatorShell
      title="Payback Period Calculator"
      subtitle="Simple and discounted payback analysis"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
            <button
              onClick={addYear}
              disabled={cashFlows.length >= 8}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-gradient-orange text-white disabled:opacity-50"
            >
              Add Year
            </button>
          </div>
          <MoneyInput label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} />
          <NumberInput label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} />
          {cashFlows.map((value, index) => (
            <MoneyInput
              key={`payback-cf-${index + 1}`}
              label={`Year ${index + 1} Cash Flow`}
              value={value}
              onChange={(val) => updateCashFlow(index, val)}
            />
          ))}
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Simple Payback" value={result.simpleLabel} green />
            <MiniStat label="Discounted Payback" value={result.discountedLabel} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Cumulative Cash Flow Table</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Cash Flow</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Cumulative Simple</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">PV of CF</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Cumulative Discounted</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={row.year} className={cn(index % 2 ? "bg-white/[0.02]" : "", row.highlight && "bg-primary/10") }>
                      <td className={cn("px-5 py-2 text-secondary", row.highlight && "text-primary font-semibold")}>{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.cashFlow)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.cumulativeSimple)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.pvCashFlow)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.cumulativeDiscounted)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function LumpsumCalc() {
  const [principalAmount, setPrincipalAmount] = useState("1000000");
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [years, setYears] = useState("10");
  const [inflationRate, setInflationRate] = useState("6");
  const [result, setResult] = useState({
    futureValue: 0,
    realValueAfterInflation: 0,
    wealthGained: 0,
    absoluteReturn: 0,
    cagr: 0,
    rows: [] as Array<{ year: number; your: number; fd: number; savings: number; real: number }>,
  });

  useEffect(() => {
    const principal = toNum(principalAmount);
    const nominal = toNum(expectedReturn);
    const y = Math.max(0, Math.floor(toNum(years)));
    const inflation = toNum(inflationRate);

    const futureValue = principal * (1 + nominal / 100) ** y;
    const realReturn = ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
    const realValueAfterInflation = principal * (1 + realReturn / 100) ** y;
    const wealthGained = futureValue - principal;
    const absoluteReturn = principal > 0 ? (wealthGained / principal) * 100 : 0;
    const cagr = y > 0 && principal > 0 ? ((futureValue / principal) ** (1 / y) - 1) * 100 : 0;

    const rows = Array.from({ length: y }, (_, idx) => {
      const year = idx + 1;
      return {
        year,
        your: principal * (1 + nominal / 100) ** year,
        fd: principal * (1 + 7 / 100) ** year,
        savings: principal * (1 + 4 / 100) ** year,
        real: principal * (1 + realReturn / 100) ** year,
      };
    });

    setResult({
      futureValue,
      realValueAfterInflation,
      wealthGained,
      absoluteReturn,
      cagr,
      rows,
    });
  }, [principalAmount, expectedReturn, years, inflationRate]);

  const latest = result.rows[result.rows.length - 1];

  return (
    <CalculatorShell
      title="Lumpsum Investment Calculator"
      subtitle="Nominal and inflation-adjusted growth comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Principal Amount" value={principalAmount} onChange={setPrincipalAmount} />
          <NumberInput label="Expected Return (%)" value={expectedReturn} onChange={setExpectedReturn} />
          <NumberInput label="Years" value={years} onChange={setYears} />
          <NumberInput label="Inflation Rate (%)" value={inflationRate} onChange={setInflationRate} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Future Value" value={formatINR(result.futureValue)} green />
            <MiniStat label="Real Value After Inflation" value={formatINR(result.realValueAfterInflation)} />
            <MiniStat label="Wealth Gained" value={formatINR(result.wealthGained)} />
            <MiniStat label="Absolute Return" value={formatPct(result.absoluteReturn)} />
            <MiniStat label="CAGR" value={formatPct(result.cagr)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Comparison (Final Year)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Instrument</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-2 text-secondary">Your Investment</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(latest?.your ?? 0)}</td>
                  </tr>
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-2 text-secondary">FD @ 7%</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(latest?.fd ?? 0)}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-2 text-secondary">Savings @ 4%</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(latest?.savings ?? 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Year-by-year Growth</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Your Investment</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">FD @ 7%</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Savings @ 4%</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Real Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.your)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.fd)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.savings)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.real)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function ESICalc() {
  const [grossSalary, setGrossSalary] = useState("18000");
  const [result, setResult] = useState({
    applicable: true,
    employeeESI: 0,
    employerESI: 0,
    totalESI: 0,
    annualESI: 0,
    rows: [] as Array<{ salary: number; employee: number; employer: number; total: number }>,
  });

  useEffect(() => {
    const gross = toNum(grossSalary);
    const applicable = gross <= 21000;

    const employeeESI = applicable ? gross * 0.0075 : 0;
    const employerESI = applicable ? gross * 0.0325 : 0;
    const totalESI = employeeESI + employerESI;
    const annualESI = totalESI * 12;

    const rows: Array<{ salary: number; employee: number; employer: number; total: number }> = [];
    for (let salary = 10000; salary <= 21000; salary += 1000) {
      const employee = salary * 0.0075;
      const employer = salary * 0.0325;
      rows.push({ salary, employee, employer, total: employee + employer });
    }

    setResult({
      applicable,
      employeeESI,
      employerESI,
      totalESI,
      annualESI,
      rows,
    });
  }, [grossSalary]);

  return (
    <CalculatorShell
      title="ESI (Employee State Insurance) Calculator"
      subtitle="Monthly and annual ESI contribution breakdown"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Gross Salary (Monthly)" value={grossSalary} onChange={setGrossSalary} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          {!result.applicable && (
            <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
              Not applicable — gross salary exceeds ₹21,000 limit
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Employee ESI (0.75%)" value={formatINR(result.employeeESI)} />
            <MiniStat label="Employer ESI (3.25%)" value={formatINR(result.employerESI)} />
            <MiniStat label="Total ESI (4%)" value={formatINR(result.totalESI)} green />
            <MiniStat label="Annual ESI" value={formatINR(result.annualESI)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Benefits covered: medical, maternity, disability, dependent benefit
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">ESI Contribution Table (₹10,000 to ₹21,000)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Salary</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Employee</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Employer</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={row.salary} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{formatINR(row.salary)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.employee)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.employer)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function CarLoanCalc() {
  const [carPrice, setCarPrice] = useState("1200000");
  const [downPayment, setDownPayment] = useState("200000");
  const [interestRate, setInterestRate] = useState("9");
  const [tenureYears, setTenureYears] = useState("5");
  const [processingFeePercent, setProcessingFeePercent] = useState("1");
  const [insuranceAmount, setInsuranceAmount] = useState("50000");
  const [result, setResult] = useState({
    loanAmount: 0,
    monthlyEMI: 0,
    totalInterest: 0,
    totalCostOfOwnership: 0,
    effectiveInterestRate: 0,
    comparisons: [] as Array<{ years: number; emi: number; totalInterest: number }>,
  });

  useEffect(() => {
    const price = toNum(carPrice);
    const dp = toNum(downPayment);
    const rate = toNum(interestRate);
    const years = Math.max(1, Math.floor(toNum(tenureYears)));
    const insurance = toNum(insuranceAmount);
    const feePct = toNum(processingFeePercent);

    const loanAmount = Math.max(0, price - dp);
    const months = years * 12;
    const monthlyEMI = calculateEMIFromPrincipal(loanAmount, rate, months);
    const totalInterest = monthlyEMI * months - loanAmount;

    const processingFee = loanAmount * feePct / 100;
    const totalCostOfOwnership = dp + monthlyEMI * months + insurance;
    const effectiveInterestRate = loanAmount > 0
      ? ((totalInterest + processingFee) / loanAmount / years) * 100
      : 0;

    const tenures = [3, 5, 7];
    const comparisons = tenures.map((y) => {
      const m = y * 12;
      const emi = calculateEMIFromPrincipal(loanAmount, rate, m);
      const ti = emi * m - loanAmount;
      return { years: y, emi, totalInterest: ti };
    });

    setResult({
      loanAmount,
      monthlyEMI,
      totalInterest,
      totalCostOfOwnership,
      effectiveInterestRate,
      comparisons,
    });
  }, [carPrice, downPayment, interestRate, tenureYears, processingFeePercent, insuranceAmount]);

  return (
    <CalculatorShell
      title="Car Loan EMI Calculator"
      subtitle="On-road financing and tenure comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Car Price" value={carPrice} onChange={setCarPrice} />
          <MoneyInput label="Down Payment" value={downPayment} onChange={setDownPayment} />
          <NumberInput label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
          <NumberInput label="Tenure (Years)" value={tenureYears} onChange={setTenureYears} />
          <NumberInput label="Processing Fee (%)" value={processingFeePercent} onChange={setProcessingFeePercent} />
          <MoneyInput label="Insurance Amount" value={insuranceAmount} onChange={setInsuranceAmount} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Loan Amount" value={formatINR(result.loanAmount)} />
            <MiniStat label="Monthly EMI" value={formatINR(result.monthlyEMI)} />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
            <MiniStat label="Total Cost of Ownership" value={formatINR(result.totalCostOfOwnership)} green />
            <MiniStat label="Effective Interest Rate" value={formatPct(result.effectiveInterestRate)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.comparisons.map((item) => (
              <div key={item.years} className="card-surface p-4">
                <div className="text-xs uppercase tracking-wide text-tertiary">{item.years} Years</div>
                <div className="mt-2 text-sm text-secondary">EMI</div>
                <div className="text-lg font-bold text-gradient-orange">{formatINR(item.emi)}</div>
                <div className="mt-2 text-xs text-secondary">Interest: {formatINR(item.totalInterest)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}

function PersonalLoanCalc() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [interestRate, setInterestRate] = useState("14");
  const [tenureMonths, setTenureMonths] = useState("36");
  const [processingFeePercent, setProcessingFeePercent] = useState("2");
  const [result, setResult] = useState({
    monthlyEMI: 0,
    processingFee: 0,
    totalInterest: 0,
    totalPayment: 0,
    effectiveAPR: 0,
    amortization: [] as Array<{ month: number; principal: number; interest: number; balance: number }>,
  });

  useEffect(() => {
    const principal = toNum(loanAmount);
    const rate = toNum(interestRate);
    const months = Math.max(1, Math.floor(toNum(tenureMonths)));
    const feePct = toNum(processingFeePercent);

    const monthlyEMI = calculateEMIFromPrincipal(principal, rate, months);
    const totalPayment = monthlyEMI * months;
    const totalInterest = totalPayment - principal;
    const processingFee = principal * feePct / 100;
    const effectiveAPR = principal > 0
      ? ((totalInterest + processingFee) / principal / (months / 12)) * 100
      : 0;

    const r = rate / 12 / 100;
    let balance = principal;
    const amortization: Array<{ month: number; principal: number; interest: number; balance: number }> = [];
    for (let month = 1; month <= Math.min(6, months); month += 1) {
      const interest = r === 0 ? 0 : balance * r;
      const principalPart = Math.min(balance, monthlyEMI - interest);
      balance = Math.max(0, balance - principalPart);
      amortization.push({ month, principal: principalPart, interest, balance });
    }

    setResult({
      monthlyEMI,
      processingFee,
      totalInterest,
      totalPayment,
      effectiveAPR,
      amortization,
    });
  }, [loanAmount, interestRate, tenureMonths, processingFeePercent]);

  return (
    <CalculatorShell
      title="Personal Loan Calculator"
      subtitle="EMI, effective APR and first 6-month amortization"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} />
          <NumberInput label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
          <NumberInput label="Tenure (Months)" value={tenureMonths} onChange={setTenureMonths} />
          <NumberInput label="Processing Fee (%)" value={processingFeePercent} onChange={setProcessingFeePercent} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Monthly EMI" value={formatINR(result.monthlyEMI)} />
            <MiniStat label="Processing Fee" value={formatINR(result.processingFee)} />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
            <MiniStat label="Total Payment" value={formatINR(result.totalPayment)} />
            <MiniStat label="Effective APR" value={formatPct(result.effectiveAPR)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Amortization (First 6 Months)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Month</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Principal</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Interest</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amortization.map((row, index) => (
                    <tr key={row.month} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.month}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.principal)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.interest)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function PrepaymentCalc() {
  const [originalLoan, setOriginalLoan] = useState("3000000");
  const [interestRate, setInterestRate] = useState("9");
  const [originalTenureMonths, setOriginalTenureMonths] = useState("240");
  const [monthsPaid, setMonthsPaid] = useState("24");
  const [prepaymentAmount, setPrepaymentAmount] = useState("500000");
  const [prepaymentPenaltyPercent, setPrepaymentPenaltyPercent] = useState("2");
  const [result, setResult] = useState({
    remainingBalance: 0,
    penaltyAmount: 0,
    optionA: { newTenure: 0, monthsSaved: 0, interestSaved: 0, netSaving: 0 },
    optionB: { newEMI: 0, emiSaving: 0, totalSaving: 0 },
  });

  useEffect(() => {
    const principal = toNum(originalLoan);
    const annualRate = toNum(interestRate);
    const tenure = Math.max(1, Math.floor(toNum(originalTenureMonths)));
    const paid = Math.min(tenure - 1, Math.max(0, Math.floor(toNum(monthsPaid))));
    const prepay = Math.max(0, toNum(prepaymentAmount));
    const penaltyPct = toNum(prepaymentPenaltyPercent);

    const emi = calculateEMIFromPrincipal(principal, annualRate, tenure);
    const r = annualRate / 12 / 100;

    let remainingBalance = principal;
    let interestPaidSoFar = 0;
    for (let i = 0; i < paid; i += 1) {
      const interest = r === 0 ? 0 : remainingBalance * r;
      const principalPart = Math.min(remainingBalance, emi - interest);
      remainingBalance = Math.max(0, remainingBalance - principalPart);
      interestPaidSoFar += interest;
    }

    const balanceAfterPrepayment = Math.max(0, remainingBalance - prepay);
    const penaltyAmount = prepay * penaltyPct / 100;
    const remainingTenure = Math.max(1, tenure - paid);

    let newTenureA = 0;
    let interestOnNewBalanceA = 0;
    if (balanceAfterPrepayment > 0) {
      if (r === 0) {
        newTenureA = Math.ceil(balanceAfterPrepayment / emi);
      } else {
        newTenureA = Math.ceil(Math.log(emi / (emi - balanceAfterPrepayment * r)) / Math.log(1 + r));
      }
      let balA = balanceAfterPrepayment;
      for (let i = 0; i < newTenureA; i += 1) {
        const interest = r === 0 ? 0 : balA * r;
        const principalPart = Math.min(balA, emi - interest);
        balA = Math.max(0, balA - principalPart);
        interestOnNewBalanceA += interest;
      }
    }

    const originalTotalInterest = emi * tenure - principal;
    const interestSavedA = originalTotalInterest - interestPaidSoFar - interestOnNewBalanceA;
    const monthsSaved = Math.max(0, remainingTenure - newTenureA);
    const netSavingA = interestSavedA - penaltyAmount;

    const newEMI = calculateEMIFromPrincipal(balanceAfterPrepayment, annualRate, remainingTenure);
    const totalInterestNewB = newEMI * remainingTenure - balanceAfterPrepayment;
    const totalInterestOldRemaining = emi * remainingTenure - remainingBalance;
    const totalSavingB = totalInterestOldRemaining - totalInterestNewB - penaltyAmount;
    const emiSaving = emi - newEMI;

    setResult({
      remainingBalance,
      penaltyAmount,
      optionA: {
        newTenure: newTenureA,
        monthsSaved,
        interestSaved: interestSavedA,
        netSaving: netSavingA,
      },
      optionB: {
        newEMI,
        emiSaving,
        totalSaving: totalSavingB,
      },
    });
  }, [originalLoan, interestRate, originalTenureMonths, monthsPaid, prepaymentAmount, prepaymentPenaltyPercent]);

  return (
    <CalculatorShell
      title="Loan Prepayment Savings Calculator"
      subtitle="Compare reduced tenure vs reduced EMI after prepayment"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Original Loan" value={originalLoan} onChange={setOriginalLoan} />
          <NumberInput label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
          <NumberInput label="Original Tenure (Months)" value={originalTenureMonths} onChange={setOriginalTenureMonths} />
          <NumberInput label="Months Paid" value={monthsPaid} onChange={setMonthsPaid} />
          <MoneyInput label="Prepayment Amount" value={prepaymentAmount} onChange={setPrepaymentAmount} />
          <NumberInput label="Prepayment Penalty (%)" value={prepaymentPenaltyPercent} onChange={setPrepaymentPenaltyPercent} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Remaining Balance" value={formatINR(result.remainingBalance)} />
            <MiniStat label="Penalty Amount" value={formatINR(result.penaltyAmount)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Option A: Reduced Tenure</div>
              <div className="mt-2 text-xs text-secondary">New Tenure: {result.optionA.newTenure.toLocaleString("en-IN")} months</div>
              <div className="text-xs text-secondary">Months Saved: {result.optionA.monthsSaved.toLocaleString("en-IN")}</div>
              <div className="text-xs text-secondary">Interest Saved: {formatINR(result.optionA.interestSaved)}</div>
              <div className="mt-2 text-sm font-semibold">Net Saving: {formatINR(result.optionA.netSaving)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">Option B: Reduced EMI</div>
              <div className="mt-2 text-xs text-secondary">New EMI: {formatINR(result.optionB.newEMI)}</div>
              <div className="text-xs text-secondary">EMI Saving: {formatINR(result.optionB.emiSaving)} / month</div>
              <div className="mt-2 text-sm font-semibold">Total Saving: {formatINR(result.optionB.totalSaving)}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function GSTLateFeeCalc() {
  const [returnType, setReturnType] = useState<"GSTR-1" | "GSTR-3B" | "GSTR-9">("GSTR-3B");
  const [dueDate, setDueDate] = useState("2026-04-20");
  const [filingDate, setFilingDate] = useState("2026-04-25");
  const [taxPayable, setTaxPayable] = useState("100000");
  const [isNilReturn, setIsNilReturn] = useState(false);
  const [result, setResult] = useState({
    daysLate: 0,
    cgstLateFee: 0,
    sgstLateFee: 0,
    lateFee: 0,
    interestAmount: 0,
    totalPenalty: 0,
    dailyRows: [] as Array<{ day: number; cumulativeLateFee: number; cumulativeInterest: number }>,
  });

  useEffect(() => {
    const due = new Date(dueDate);
    const filing = new Date(filingDate);
    const payable = toNum(taxPayable);

    const msPerDay = 24 * 60 * 60 * 1000;
    const rawDays = Math.floor((filing.getTime() - due.getTime()) / msPerDay);
    const daysLate = Math.max(0, Number.isFinite(rawDays) ? rawDays : 0);

    let dailyTotalFee = 0;
    let maxTotalFee = 0;

    if (returnType === "GSTR-9") {
      dailyTotalFee = 200;
      maxTotalFee = payable * 0.0025;
    } else if (isNilReturn) {
      dailyTotalFee = 20;
      maxTotalFee = 1000;
    } else {
      dailyTotalFee = 50;
      maxTotalFee = 20000;
    }

    const lateFee = Math.min(daysLate * dailyTotalFee, maxTotalFee);
    const cgstLateFee = lateFee / 2;
    const sgstLateFee = lateFee / 2;
    const interestAmount = payable > 0 ? payable * 0.18 * daysLate / 365 : 0;
    const totalPenalty = lateFee + interestAmount;

    const dailyRows: Array<{ day: number; cumulativeLateFee: number; cumulativeInterest: number }> = [];
    if (daysLate > 0 && daysLate < 30) {
      for (let day = 1; day <= daysLate; day += 1) {
        const cumulativeLateFee = Math.min(day * dailyTotalFee, maxTotalFee);
        const cumulativeInterest = payable > 0 ? payable * 0.18 * day / 365 : 0;
        dailyRows.push({ day, cumulativeLateFee, cumulativeInterest });
      }
    }

    setResult({
      daysLate,
      cgstLateFee,
      sgstLateFee,
      lateFee,
      interestAmount,
      totalPenalty,
      dailyRows,
    });
  }, [returnType, dueDate, filingDate, taxPayable, isNilReturn]);

  return (
    <CalculatorShell
      title="GST Late Fee Calculator"
      subtitle="Late fee and interest computation by return type"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Return Type">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["GSTR-1", "GSTR-3B", "GSTR-9"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setReturnType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    returnType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Due Date">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <Field label="Filing Date">
            <input
              type="date"
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <MoneyInput label="Tax Payable" value={taxPayable} onChange={setTaxPayable} />

          <Field label="Nil Return">
            <button
              onClick={() => setIsNilReturn((v) => !v)}
              className={cn(
                "w-full py-2 text-sm font-medium rounded-md transition-all border",
                isNilReturn
                  ? "bg-gradient-orange text-white glow-orange border-transparent"
                  : "text-secondary border-white/10 hover:text-white"
              )}
            >
              {isNilReturn ? "Yes" : "No"}
            </button>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Days Late" value={result.daysLate.toLocaleString("en-IN")} />
            <MiniStat label="Late Fee" value={formatINR(result.lateFee)} />
            <MiniStat label="CGST Portion" value={formatINR(result.cgstLateFee)} />
            <MiniStat label="SGST Portion" value={formatINR(result.sgstLateFee)} />
            <MiniStat label="Interest Amount" value={formatINR(result.interestAmount)} />
            <MiniStat label="Total Penalty" value={formatINR(result.totalPenalty)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Penalty Breakdown</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="px-5 py-2 text-secondary">Late fee (CGST)</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(result.cgstLateFee)}</td>
                  </tr>
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-2 text-secondary">Late fee (SGST)</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(result.sgstLateFee)}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-2 text-secondary">Interest @ 18% p.a.</td>
                    <td className="px-5 py-2 text-right font-medium">{formatINR(result.interestAmount)}</td>
                  </tr>
                  <tr className="border-t border-primary/20 bg-primary/5">
                    <td className="px-5 py-2.5 font-bold">Total</td>
                    <td className="px-5 py-2.5 text-right font-bold text-primary">{formatINR(result.totalPenalty)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {result.dailyRows.length > 0 && (
            <div className="card-surface p-5 overflow-hidden">
              <div className="text-sm font-semibold mb-3">Daily Breakdown</div>
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-tertiary">
                      <th className="text-left font-medium px-5 py-2 bg-primary/10">Day</th>
                      <th className="text-right font-medium px-3 py-2 bg-primary/10">Cumulative Late Fee</th>
                      <th className="text-right font-medium px-5 py-2 bg-primary/10">Cumulative Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.dailyRows.map((row, index) => (
                      <tr key={row.day} className={index % 2 ? "bg-white/[0.02]" : ""}>
                        <td className="px-5 py-2 text-secondary">{row.day}</td>
                        <td className="px-3 py-2 text-right">{formatINR(row.cumulativeLateFee)}</td>
                        <td className="px-5 py-2 text-right font-medium">{formatINR(row.cumulativeInterest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
}

function ITCReconciliationCalc() {
  const [igst2B, setIgst2B] = useState("100000");
  const [cgst2B, setCgst2B] = useState("50000");
  const [sgst2B, setSgst2B] = useState("50000");
  const [igstClaimed, setIgstClaimed] = useState("95000");
  const [cgstClaimed, setCgstClaimed] = useState("52000");
  const [sgstClaimed, setSgstClaimed] = useState("50000");
  const [igstReversed, setIgstReversed] = useState("5000");
  const [cgstReversed, setCgstReversed] = useState("2000");
  const [sgstReversed, setSgstReversed] = useState("1000");
  const [result, setResult] = useState({
    rows: [] as Array<{
      type: "IGST" | "CGST" | "SGST";
      available: number;
      claimed: number;
      reversed: number;
      netEligible: number;
      difference: number;
      status: "Excess Claimed" | "Under Claimed" | "Matched";
    }> ,
    totalAvailable: 0,
    totalClaimed: 0,
    totalDifference: 0,
    hasExcess: false,
  });

  useEffect(() => {
    const buildRow = (
      type: "IGST" | "CGST" | "SGST",
      available: number,
      claimed: number,
      reversed: number
    ) => {
      const netEligible = available - reversed;
      const difference = claimed - available;
      const status: "Excess Claimed" | "Under Claimed" | "Matched" = difference > 0
        ? "Excess Claimed"
        : difference < 0
          ? "Under Claimed"
          : "Matched";
      return { type, available, claimed, reversed, netEligible, difference, status };
    };

    const rows = [
      buildRow("IGST", toNum(igst2B), toNum(igstClaimed), toNum(igstReversed)),
      buildRow("CGST", toNum(cgst2B), toNum(cgstClaimed), toNum(cgstReversed)),
      buildRow("SGST", toNum(sgst2B), toNum(sgstClaimed), toNum(sgstReversed)),
    ];

    const totalAvailable = rows.reduce((sum, row) => sum + row.available, 0);
    const totalClaimed = rows.reduce((sum, row) => sum + row.claimed, 0);
    const totalDifference = rows.reduce((sum, row) => sum + row.difference, 0);
    const hasExcess = rows.some((row) => row.status === "Excess Claimed");

    setResult({ rows, totalAvailable, totalClaimed, totalDifference, hasExcess });
  }, [
    igst2B,
    cgst2B,
    sgst2B,
    igstClaimed,
    cgstClaimed,
    sgstClaimed,
    igstReversed,
    cgstReversed,
    sgstReversed,
  ]);

  return (
    <CalculatorShell
      title="GST ITC Reconciliation"
      subtitle="Compare GSTR-2B, claimed ITC and reversals"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MoneyInput label="IGST as per 2B" value={igst2B} onChange={setIgst2B} />
            <MoneyInput label="IGST Claimed" value={igstClaimed} onChange={setIgstClaimed} />
            <MoneyInput label="CGST as per 2B" value={cgst2B} onChange={setCgst2B} />
            <MoneyInput label="CGST Claimed" value={cgstClaimed} onChange={setCgstClaimed} />
            <MoneyInput label="SGST as per 2B" value={sgst2B} onChange={setSgst2B} />
            <MoneyInput label="SGST Claimed" value={sgstClaimed} onChange={setSgstClaimed} />
            <MoneyInput label="IGST Reversed" value={igstReversed} onChange={setIgstReversed} />
            <MoneyInput label="CGST Reversed" value={cgstReversed} onChange={setCgstReversed} />
            <MoneyInput label="SGST Reversed" value={sgstReversed} onChange={setSgstReversed} />
          </div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">ITC Summary</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Type</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Available</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Claimed</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Reversed</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Net Eligible</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Difference</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={row.type} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.type}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.available)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.claimed)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.reversed)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.netEligible)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.difference)}</td>
                      <td className="px-5 py-2 text-right">
                        <span className={cn(
                          "px-2 py-0.5 rounded-pill text-[10px] font-semibold border",
                          row.status === "Excess Claimed"
                            ? "text-red-400 border-red-400/40 bg-red-400/10"
                            : row.status === "Under Claimed"
                              ? "text-warning border-warning/40 bg-warning/10"
                              : "text-success border-success/40 bg-success/10"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-primary/20 bg-primary/5">
                    <td className="px-5 py-2.5 font-bold">Total</td>
                    <td className="px-3 py-2.5 text-right font-bold">{formatINR(result.totalAvailable)}</td>
                    <td className="px-3 py-2.5 text-right font-bold">{formatINR(result.totalClaimed)}</td>
                    <td className="px-3 py-2.5 text-right font-bold">-</td>
                    <td className="px-3 py-2.5 text-right font-bold">-</td>
                    <td className="px-3 py-2.5 text-right font-bold">{formatINR(result.totalDifference)}</td>
                    <td className="px-5 py-2.5 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            {result.hasExcess
              ? "Reverse excess ITC in next return"
              : "No excess claim detected based on current reconciliation."}
          </div>
        </div>
      )}
    />
  );
}

function UKIncomeTaxCalc() {
  const [annualIncome, setAnnualIncome] = useState("65000");
  const [taxYear, setTaxYear] = useState("2025-26");
  const [residency, setResidency] = useState<"England" | "Scotland" | "Wales">("England");
  const [result, setResult] = useState({
    incomeTax: 0,
    nationalInsurance: 0,
    totalDeductions: 0,
    takeHome: 0,
    effectiveIncomeTaxRate: 0,
    effectiveTotalRate: 0,
    taxRows: [] as Array<{ slab: string; taxable: number; rate: number; tax: number }>,
    niRows: [] as Array<{ slab: string; taxable: number; rate: number; amount: number }>,
  });

  useEffect(() => {
    const income = Math.max(0, toNum(annualIncome));

    const englandWalesBands = [
      { min: 0, max: 12570, rate: 0, label: "Personal Allowance" },
      { min: 12570, max: 50270, rate: 20, label: "Basic Rate" },
      { min: 50270, max: 125140, rate: 40, label: "Higher Rate" },
      { min: 125140, max: null as number | null, rate: 45, label: "Additional Rate" },
    ];

    const scotlandBands = [
      { min: 0, max: 12570, rate: 0, label: "Personal Allowance" },
      { min: 12570, max: 14876, rate: 19, label: "Starter Rate" },
      { min: 14876, max: 26561, rate: 20, label: "Basic Rate" },
      { min: 26561, max: 43662, rate: 21, label: "Intermediate Rate" },
      { min: 43662, max: 75000, rate: 42, label: "Higher Rate" },
      { min: 75000, max: null as number | null, rate: 47, label: "Top Rate" },
    ];

    const selectedBands = residency === "Scotland" ? scotlandBands : englandWalesBands;
    const taxRows = selectedBands.map((band) => {
      const upper = band.max ?? Number.POSITIVE_INFINITY;
      const taxable = Math.max(0, Math.min(income, upper) - band.min);
      const tax = taxable * band.rate / 100;
      return { slab: band.label, taxable, rate: band.rate, tax };
    });
    const incomeTax = taxRows.reduce((sum, row) => sum + row.tax, 0);

    const niBands = [
      { min: 0, max: 12570, rate: 0, label: "Primary Threshold" },
      { min: 12570, max: 50270, rate: 8, label: "Main NI Rate" },
      { min: 50270, max: null as number | null, rate: 2, label: "Additional NI Rate" },
    ];
    const niRows = niBands.map((band) => {
      const upper = band.max ?? Number.POSITIVE_INFINITY;
      const taxable = Math.max(0, Math.min(income, upper) - band.min);
      const amount = taxable * band.rate / 100;
      return { slab: band.label, taxable, rate: band.rate, amount };
    });

    const nationalInsurance = niRows.reduce((sum, row) => sum + row.amount, 0);
    const totalDeductions = incomeTax + nationalInsurance;
    const takeHome = Math.max(0, income - totalDeductions);
    const effectiveIncomeTaxRate = income > 0 ? incomeTax / income * 100 : 0;
    const effectiveTotalRate = income > 0 ? totalDeductions / income * 100 : 0;

    setResult({
      incomeTax,
      nationalInsurance,
      totalDeductions,
      takeHome,
      effectiveIncomeTaxRate,
      effectiveTotalRate,
      taxRows,
      niRows,
    });
  }, [annualIncome, taxYear, residency]);

  return (
    <CalculatorShell
      title="UK Income Tax Calculator"
      subtitle="Income tax and National Insurance estimate"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <NumberInput label="Annual Income (GBP)" value={annualIncome} onChange={setAnnualIncome} />

          <Field label="Tax Year">
            <input
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <Field label="Residency">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["England", "Scotland", "Wales"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setResidency(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    residency === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Income Tax" value={formatGBP(result.incomeTax)} />
            <MiniStat label="National Insurance" value={formatGBP(result.nationalInsurance)} />
            <MiniStat label="Total Deductions" value={formatGBP(result.totalDeductions)} />
            <MiniStat label="Take Home" value={formatGBP(result.takeHome)} green />
            <MiniStat label="Effective Income Tax Rate" value={formatPct(result.effectiveIncomeTaxRate)} />
            <MiniStat label="Effective Total Rate" value={formatPct(result.effectiveTotalRate)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Income Tax Slab Breakdown</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Slab</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Taxable Income</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.taxRows.map((row, index) => (
                    <tr key={row.slab} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.slab}</td>
                      <td className="px-3 py-2 text-right">{formatGBP(row.taxable)}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatGBP(row.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">National Insurance Breakdown</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Band</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Income</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">NI</th>
                  </tr>
                </thead>
                <tbody>
                  {result.niRows.map((row, index) => (
                    <tr key={row.slab} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.slab}</td>
                      <td className="px-3 py-2 text-right">{formatGBP(row.taxable)}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatGBP(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function USFederalTaxCalc() {
  const [annualIncome, setAnnualIncome] = useState("120000");
  const [filingStatus, setFilingStatus] = useState<"Single" | "MFJ" | "MFS" | "HoH">("Single");
  const [taxYear, setTaxYear] = useState("2025");
  const [result, setResult] = useState({
    federalTax: 0,
    socialSecurity: 0,
    medicare: 0,
    totalTax: 0,
    effectiveRate: 0,
    marginalRate: 0,
    takeHome: 0,
    taxableIncome: 0,
    bracketRows: [] as Array<{ slab: string; taxable: number; rate: number; tax: number }>,
  });

  useEffect(() => {
    const income = Math.max(0, toNum(annualIncome));
    const standardDeductionMap = {
      Single: 15000,
      MFJ: 30000,
      MFS: 15000,
      HoH: 22500,
    } as const;
    const standardDeduction = standardDeductionMap[filingStatus];
    const taxableIncome = Math.max(0, income - standardDeduction);

    const singleBrackets = [
      { min: 0, max: 11925, rate: 10 },
      { min: 11925, max: 48475, rate: 12 },
      { min: 48475, max: 103350, rate: 22 },
      { min: 103350, max: 197300, rate: 24 },
      { min: 197300, max: 250525, rate: 32 },
      { min: 250525, max: 626350, rate: 35 },
      { min: 626350, max: null as number | null, rate: 37 },
    ];

    const multiplier = filingStatus === "MFJ" ? 2 : 1;
    const brackets = singleBrackets.map((b) => ({
      min: b.min * multiplier,
      max: b.max === null ? null : b.max * multiplier,
      rate: b.rate,
      slab: b.max === null
        ? `Over ${formatUSD(b.min * multiplier)}`
        : `${formatUSD(b.min + 1)} - ${formatUSD(b.max * multiplier)}`,
    }));

    const bracketRows = brackets.map((b) => {
      const upper = b.max ?? Number.POSITIVE_INFINITY;
      const taxable = Math.max(0, Math.min(taxableIncome, upper) - b.min);
      const tax = taxable * b.rate / 100;
      return { slab: b.slab, taxable, rate: b.rate, tax };
    });
    const federalTax = bracketRows.reduce((sum, row) => sum + row.tax, 0);
    const marginalRate = bracketRows.reduce((rate, row) => (row.taxable > 0 ? row.rate : rate), 0);

    const socialSecurity = Math.min(income, 176100) * 0.062;
    const medicareBase = income * 0.0145;
    const additionalMedicare = income > 200000 ? (income - 200000) * 0.009 : 0;
    const medicare = medicareBase + additionalMedicare;

    const totalTax = federalTax + socialSecurity + medicare;
    const takeHome = Math.max(0, income - totalTax);
    const effectiveRate = income > 0 ? totalTax / income * 100 : 0;

    setResult({
      federalTax,
      socialSecurity,
      medicare,
      totalTax,
      effectiveRate,
      marginalRate,
      takeHome,
      taxableIncome,
      bracketRows,
    });
  }, [annualIncome, filingStatus, taxYear]);

  return (
    <CalculatorShell
      title="US Federal Income Tax Calculator"
      subtitle="Federal tax, FICA and take-home estimate"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <NumberInput label="Annual Income (USD)" value={annualIncome} onChange={setAnnualIncome} />

          <Field label="Filing Status">
            <div className="grid grid-cols-2 gap-2">
              {(["Single", "MFJ", "MFS", "HoH"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilingStatus(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md border transition-all",
                    filingStatus === item
                      ? "bg-gradient-orange text-white glow-orange border-transparent"
                      : "text-secondary border-white/10 hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tax Year">
            <input
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Taxable Income" value={formatUSD(result.taxableIncome)} />
            <MiniStat label="Federal Tax" value={formatUSD(result.federalTax)} />
            <MiniStat label="Social Security" value={formatUSD(result.socialSecurity)} />
            <MiniStat label="Medicare" value={formatUSD(result.medicare)} />
            <MiniStat label="Total Tax" value={formatUSD(result.totalTax)} />
            <MiniStat label="Take Home" value={formatUSD(result.takeHome)} green />
            <MiniStat label="Effective Rate" value={formatPct(result.effectiveRate)} />
            <MiniStat label="Marginal Rate" value={formatPct(result.marginalRate)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Federal Bracket Breakdown</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Bracket</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Taxed</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bracketRows.map((row, index) => (
                    <tr key={`${row.slab}-${row.rate}`} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.slab}</td>
                      <td className="px-3 py-2 text-right">{formatUSD(row.taxable)}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatUSD(row.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function UAEVATCalc() {
  const [amount, setAmount] = useState("10000");
  const [vatRate, setVatRate] = useState<5 | 0>(5);
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [result, setResult] = useState({
    baseAmount: 0,
    vatAmount: 0,
    totalAmount: 0,
    estimatedQuarterlyVAT: 0,
    vatRegistrationThreshold: 375000,
  });

  useEffect(() => {
    const inputAmount = Math.max(0, toNum(amount));
    const rate = vatRate / 100;
    let baseAmount = 0;
    let vatAmount = 0;
    let totalAmount = 0;

    if (direction === "add") {
      baseAmount = inputAmount;
      vatAmount = baseAmount * rate;
      totalAmount = baseAmount + vatAmount;
    } else {
      totalAmount = inputAmount;
      baseAmount = rate > 0 ? totalAmount / (1 + rate) : totalAmount;
      vatAmount = totalAmount - baseAmount;
    }

    const estimatedQuarterlyVAT = vatAmount * 4;
    setResult({
      baseAmount,
      vatAmount,
      totalAmount,
      estimatedQuarterlyVAT,
      vatRegistrationThreshold: 375000,
    });
  }, [amount, vatRate, direction]);

  return (
    <CalculatorShell
      title="UAE VAT Calculator"
      subtitle="Add or remove VAT with quarterly liability estimate"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <NumberInput label="Amount (AED)" value={amount} onChange={setAmount} />

          <Field label="VAT Rate">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {([5, 0] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setVatRate(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    vatRate === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}%
                </button>
              ))}
            </div>
          </Field>

          <Field label="Direction">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {([
                { key: "add", label: "Add VAT" },
                { key: "remove", label: "Remove VAT" },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setDirection(item.key)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    direction === item.key ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Base Amount" value={formatAED(result.baseAmount)} />
            <MiniStat label="VAT Amount" value={formatAED(result.vatAmount)} />
            <MiniStat label="Total Amount" value={formatAED(result.totalAmount)} green />
            <MiniStat label="Estimated Quarterly VAT" value={formatAED(result.estimatedQuarterlyVAT)} />
            <MiniStat label="Registration Threshold" value={formatAED(result.vatRegistrationThreshold)} />
          </div>
          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            VAT registration required if taxable supplies exceed AED 375,000/year.
          </div>
        </div>
      )}
    />
  );
}

function UKVATCalc() {
  const [amount, setAmount] = useState("1000");
  const [vatRate, setVatRate] = useState<20 | 5 | 0>(20);
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [result, setResult] = useState({
    netAmount: 0,
    vatAmount: 0,
    grossAmount: 0,
    flatRateSchemeEstimate: 0,
    threshold: 90000,
    hmrcReference: "HMRC VAT Notice 700",
  });

  useEffect(() => {
    const inputAmount = Math.max(0, toNum(amount));
    const rate = vatRate / 100;
    let netAmount = 0;
    let vatAmount = 0;
    let grossAmount = 0;

    if (direction === "add") {
      netAmount = inputAmount;
      vatAmount = netAmount * rate;
      grossAmount = netAmount + vatAmount;
    } else {
      grossAmount = inputAmount;
      netAmount = rate > 0 ? grossAmount / (1 + rate) : grossAmount;
      vatAmount = grossAmount - netAmount;
    }

    const flatRateSchemeEstimate = netAmount * 0.12;
    setResult({
      netAmount,
      vatAmount,
      grossAmount,
      flatRateSchemeEstimate,
      threshold: 90000,
      hmrcReference: "HMRC VAT Notice 700",
    });
  }, [amount, vatRate, direction]);

  return (
    <CalculatorShell
      title="UK VAT Calculator"
      subtitle="Add/remove UK VAT with flat rate comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <NumberInput label="Amount (GBP)" value={amount} onChange={setAmount} />

          <Field label="VAT Rate">
            <div className="grid grid-cols-3 p-1 rounded-lg bg-card-elevated border border-white/10">
              {([20, 5, 0] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setVatRate(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    vatRate === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}%
                </button>
              ))}
            </div>
          </Field>

          <Field label="Direction">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {([
                { key: "add", label: "Add VAT" },
                { key: "remove", label: "Remove VAT" },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setDirection(item.key)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    direction === item.key ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Net Amount" value={formatGBP(result.netAmount)} />
            <MiniStat label="VAT Amount" value={formatGBP(result.vatAmount)} />
            <MiniStat label="Gross Amount" value={formatGBP(result.grossAmount)} green />
            <MiniStat label="Flat Rate Estimate (12%)" value={formatGBP(result.flatRateSchemeEstimate)} />
            <MiniStat label="VAT Threshold" value={formatGBP(result.threshold)} />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            HMRC reference: {result.hmrcReference}
          </div>
          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            VAT registration required if taxable turnover exceeds £90,000.
          </div>
        </div>
      )}
    />
  );
}

function SGIncomeTaxCalc() {
  const [annualIncome, setAnnualIncome] = useState("90000");
  const [residencyStatus, setResidencyStatus] = useState<"Tax Resident" | "Non-Resident">("Tax Resident");
  const [result, setResult] = useState({
    incomeTax: 0,
    cpfContribution: 0,
    effectiveRate: 0,
    slabRows: [] as Array<{ slab: string; taxable: number; rate: number; tax: number }>,
  });

  useEffect(() => {
    const income = Math.max(0, toNum(annualIncome));
    const residentSlabs = [
      { min: 0, max: 20000, rate: 0, slab: "$0 - $20,000" },
      { min: 20000, max: 30000, rate: 2, slab: "$20,001 - $30,000" },
      { min: 30000, max: 40000, rate: 3.5, slab: "$30,001 - $40,000" },
      { min: 40000, max: 80000, rate: 7, slab: "$40,001 - $80,000" },
      { min: 80000, max: 120000, rate: 11.5, slab: "$80,001 - $120,000" },
      { min: 120000, max: 160000, rate: 15, slab: "$120,001 - $160,000" },
      { min: 160000, max: 200000, rate: 18, slab: "$160,001 - $200,000" },
      { min: 200000, max: 240000, rate: 19, slab: "$200,001 - $240,000" },
      { min: 240000, max: 280000, rate: 20, slab: "$240,001 - $280,000" },
      { min: 280000, max: 320000, rate: 22, slab: "$280,001 - $320,000" },
      { min: 320000, max: null as number | null, rate: 24, slab: "Above $320,000" },
    ];

    const slabRows = residentSlabs.map((slab) => {
      const upper = slab.max ?? Number.POSITIVE_INFINITY;
      const taxable = Math.max(0, Math.min(income, upper) - slab.min);
      const tax = taxable * slab.rate / 100;
      return { slab: slab.slab, taxable, rate: slab.rate, tax };
    });

    const residentTax = slabRows.reduce((sum, row) => sum + row.tax, 0);
    const nonResidentFlat = income * 0.15;
    const incomeTax = residencyStatus === "Tax Resident" ? residentTax : Math.max(nonResidentFlat, residentTax);

    const cpfCapAnnual = 6800 * 12;
    const cpfContribution = residencyStatus === "Tax Resident" ? Math.min(income, cpfCapAnnual) * 0.2 : 0;
    const effectiveRate = income > 0 ? incomeTax / income * 100 : 0;

    setResult({
      incomeTax,
      cpfContribution,
      effectiveRate,
      slabRows,
    });
  }, [annualIncome, residencyStatus]);

  return (
    <CalculatorShell
      title="Singapore Income Tax Calculator"
      subtitle="Resident slab tax, CPF and non-resident comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <NumberInput label="Annual Income (SGD)" value={annualIncome} onChange={setAnnualIncome} />

          <Field label="Residency Status">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["Tax Resident", "Non-Resident"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setResidencyStatus(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    residencyStatus === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Income Tax" value={formatSGD(result.incomeTax)} />
            <MiniStat label="CPF Contribution" value={formatSGD(result.cpfContribution)} />
            <MiniStat label="Effective Rate" value={formatPct(result.effectiveRate)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Slab Breakdown (Resident Rates)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Slab</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Taxed</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.slabRows.map((row, index) => (
                    <tr key={row.slab} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.slab}</td>
                      <td className="px-3 py-2 text-right">{formatSGD(row.taxable)}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatSGD(row.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function DebtEquityCalc() {
  const [totalDebt, setTotalDebt] = useState("2500000");
  const [totalEquity, setTotalEquity] = useState("1800000");
  const [totalAssets, setTotalAssets] = useState("5000000");
  const [ebit, setEbit] = useState("900000");
  const [interestExpense, setInterestExpense] = useState("220000");
  const [netIncome, setNetIncome] = useState("600000");
  const [totalRevenue, setTotalRevenue] = useState("7500000");
  const [cards, setCards] = useState(
    [] as Array<{
      key: string;
      label: string;
      value: number;
      healthyRange: string;
      interpretation: string;
      status: "Healthy" | "Caution" | "Risk";
    }>
  );

  useEffect(() => {
    const debt = toNum(totalDebt);
    const equity = toNum(totalEquity);
    const assets = toNum(totalAssets);
    const ebitValue = toNum(ebit);
    const interest = toNum(interestExpense);
    const net = toNum(netIncome);
    const revenue = toNum(totalRevenue);

    const safeDiv = (num: number, den: number): number => (den > 0 ? num / den : 0);
    const debtToEquity = safeDiv(debt, equity);
    const debtToAssets = safeDiv(debt, assets);
    const equityRatio = safeDiv(equity, assets);
    const interestCoverage = safeDiv(ebitValue, interest);
    const financialLeverage = safeDiv(assets, equity);
    const debtServiceCoverage = safeDiv(net, interest);

    const asStatus = (value: number, healthy: (v: number) => boolean, caution: (v: number) => boolean) => {
      if (healthy(value)) return "Healthy" as const;
      if (caution(value)) return "Caution" as const;
      return "Risk" as const;
    };

    setCards([
      {
        key: "de",
        label: "Debt to Equity",
        value: debtToEquity,
        healthyRange: "Healthy: < 2.00",
        interpretation: "Shows leverage relative to shareholder capital.",
        status: asStatus(debtToEquity, (v) => v < 2, (v) => v < 3),
      },
      {
        key: "da",
        label: "Debt to Assets",
        value: debtToAssets,
        healthyRange: "Healthy: < 0.50",
        interpretation: "Indicates what portion of assets is financed by debt.",
        status: asStatus(debtToAssets, (v) => v < 0.5, (v) => v < 0.7),
      },
      {
        key: "eq",
        label: "Equity Ratio",
        value: equityRatio,
        healthyRange: "Healthy: > 0.50",
        interpretation: "Higher ratio means stronger equity cushion.",
        status: asStatus(equityRatio, (v) => v > 0.5, (v) => v > 0.35),
      },
      {
        key: "ic",
        label: "Interest Coverage",
        value: interestCoverage,
        healthyRange: "Healthy: > 3.00",
        interpretation: "Measures capacity to service interest from operating profit.",
        status: asStatus(interestCoverage, (v) => v > 3, (v) => v > 1.5),
      },
      {
        key: "fl",
        label: "Financial Leverage",
        value: financialLeverage,
        healthyRange: "Context-based (lower is safer)",
        interpretation: "Reflects asset base supported by each unit of equity.",
        status: asStatus(financialLeverage, (v) => v <= 2.5, (v) => v <= 4),
      },
      {
        key: "dsc",
        label: "Debt Service Coverage",
        value: debtServiceCoverage,
        healthyRange: "Healthy: > 1.25",
        interpretation: "Tracks ability to meet debt obligations from earnings.",
        status: asStatus(debtServiceCoverage, (v) => v > 1.25, (v) => v > 1),
      },
      {
        key: "rev",
        label: "Debt to Revenue",
        value: safeDiv(debt, revenue),
        healthyRange: "Lower is better",
        interpretation: "Optional leverage context against top-line capacity.",
        status: asStatus(safeDiv(debt, revenue), (v) => v < 0.4, (v) => v < 0.7),
      },
    ].slice(0, 6));
  }, [totalDebt, totalEquity, totalAssets, ebit, interestExpense, netIncome, totalRevenue]);

  return (
    <CalculatorShell
      title="Debt to Equity & Leverage Ratios"
      subtitle="Six key solvency and coverage ratios with health flags"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Total Debt" value={totalDebt} onChange={setTotalDebt} />
          <MoneyInput label="Total Equity" value={totalEquity} onChange={setTotalEquity} />
          <MoneyInput label="Total Assets" value={totalAssets} onChange={setTotalAssets} />
          <MoneyInput label="EBIT" value={ebit} onChange={setEbit} />
          <MoneyInput label="Interest Expense" value={interestExpense} onChange={setInterestExpense} />
          <MoneyInput label="Net Income" value={netIncome} onChange={setNetIncome} />
          <MoneyInput label="Total Revenue" value={totalRevenue} onChange={setTotalRevenue} />
        </div>
      )}
      outputPanel={(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((card) => (
            <div key={card.key} className="card-surface p-4 space-y-2">
              <div className="text-xs uppercase tracking-wide text-tertiary">{card.label}</div>
              <div className="text-2xl font-bold text-gradient-orange">{formatNum(card.value, 2)}x</div>
              <div className="text-[11px] text-secondary">{card.healthyRange}</div>
              <div className="text-xs text-secondary">{card.interpretation}</div>
              <span className={cn(
                "inline-flex px-2 py-0.5 rounded-pill text-[10px] font-semibold border",
                card.status === "Healthy"
                  ? "text-success border-success/40 bg-success/10"
                  : card.status === "Caution"
                    ? "text-warning border-warning/40 bg-warning/10"
                    : "text-red-400 border-red-400/40 bg-red-400/10"
              )}>
                {card.status}
              </span>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function LeaveEncashmentCalc() {
  const [basicSalary, setBasicSalary] = useState("90000");
  const [daPay, setDaPay] = useState("15000");
  const [leavesEncashed, setLeavesEncashed] = useState("180");
  const [totalServiceYears, setTotalServiceYears] = useState("12");
  const [isGovernmentEmployee, setIsGovernmentEmployee] = useState(false);
  const [result, setResult] = useState({
    totalEncashment: 0,
    exemptAmount: 0,
    taxableAmount: 0,
    limits: [] as Array<{ key: "actual" | "tenMonths" | "cashEquivalent" | "statutory"; label: string; value: number }>,
    appliedLimit: "actual" as "actual" | "tenMonths" | "cashEquivalent" | "statutory",
  });

  useEffect(() => {
    const basic = toNum(basicSalary);
    const da = toNum(daPay);
    const leaves = Math.max(0, Math.floor(toNum(leavesEncashed)));
    const years = Math.max(0, Math.floor(toNum(totalServiceYears)));
    const averageSalary = basic + da;
    const totalEncashment = averageSalary / 26 * leaves;

    const maxEarnedLeaveDays = years * 30;
    const eligibleLeaveDays = Math.min(leaves, maxEarnedLeaveDays);
    const cashEquivalent = averageSalary / 26 * eligibleLeaveDays;
    const tenMonthsAverageSalary = averageSalary * 10;
    const statutoryLimit = 2500000;

    const limits: Array<{ key: "actual" | "tenMonths" | "cashEquivalent" | "statutory"; label: string; value: number }> = [
      { key: "actual", label: "Actual leave encashment received", value: totalEncashment },
      { key: "tenMonths", label: "10 months average salary", value: tenMonthsAverageSalary },
      { key: "cashEquivalent", label: "Cash equivalent of earned leave", value: cashEquivalent },
      { key: "statutory", label: "Statutory limit under Section 10(10AA)", value: statutoryLimit },
    ];

    let exemptAmount = totalEncashment;
    let appliedLimit: "actual" | "tenMonths" | "cashEquivalent" | "statutory" = "actual";
    if (!isGovernmentEmployee) {
      const minLimit = limits.reduce((acc, item) => (item.value < acc.value ? item : acc), limits[0]);
      exemptAmount = minLimit.value;
      appliedLimit = minLimit.key;
    }

    const taxableAmount = Math.max(0, totalEncashment - exemptAmount);
    setResult({ totalEncashment, exemptAmount, taxableAmount, limits, appliedLimit });
  }, [basicSalary, daPay, leavesEncashed, totalServiceYears, isGovernmentEmployee]);

  return (
    <CalculatorShell
      title="Leave Encashment Tax Calculator"
      subtitle="Compute exemption and taxable amount under Section 10(10AA)"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Monthly Basic Salary" value={basicSalary} onChange={setBasicSalary} />
          <MoneyInput label="Monthly DA" value={daPay} onChange={setDaPay} />
          <NumberInput label="Leaves Encashed (Days)" value={leavesEncashed} onChange={setLeavesEncashed} />
          <NumberInput label="Total Service Years" value={totalServiceYears} onChange={setTotalServiceYears} />

          <Field label="Government Employee">
            <button
              onClick={() => setIsGovernmentEmployee((v) => !v)}
              className={cn(
                "w-full py-2 text-sm font-medium rounded-md transition-all border",
                isGovernmentEmployee
                  ? "bg-gradient-orange text-white glow-orange border-transparent"
                  : "text-secondary border-white/10 hover:text-white"
              )}
            >
              {isGovernmentEmployee ? "Yes" : "No"}
            </button>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Total Encashment" value={formatINR(result.totalEncashment)} />
            <MiniStat label="Exempt Amount" value={formatINR(result.exemptAmount)} green />
            <MiniStat label="Taxable Amount" value={formatINR(result.taxableAmount)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Exemption Limits</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Limit</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.limits.map((row, index) => (
                    <tr key={row.key} className={cn(index % 2 ? "bg-white/[0.02]" : "", !isGovernmentEmployee && result.appliedLimit === row.key && "bg-primary/10")}>
                      <td className="px-5 py-2 text-secondary">{row.label}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            {isGovernmentEmployee
              ? "Government employee: leave encashment is fully exempt under Section 10(10AA)."
              : "Exempt under Section 10(10AA). Applied limit is highlighted above."}
          </div>
        </div>
      )}
    />
  );
}

function CapitalGainsPropertyCalc() {
  const ciiYears = Object.keys(CII_TABLE).map((y) => Number(y)).sort((a, b) => a - b);
  const [purchasePrice, setPurchasePrice] = useState("4500000");
  const [salePrice, setSalePrice] = useState("8500000");
  const [purchaseYear, setPurchaseYear] = useState(String(ciiYears[ciiYears.length - 3] ?? 2022));
  const [saleYear, setSaleYear] = useState(String(ciiYears[ciiYears.length - 1] ?? 2024));
  const [stampDutyPaid, setStampDutyPaid] = useState("350000");
  const [improvementCost, setImprovementCost] = useState("500000");
  const [brokerageSalePercent, setBrokerageSalePercent] = useState("1.5");
  const [slabRate, setSlabRate] = useState("30");
  const [result, setResult] = useState({
    holdingPeriod: 0,
    gainAmount: 0,
    indexedCost: 0,
    indexedImprovement: 0,
    netSalePrice: 0,
    saleExpenses: 0,
    tax20Indexation: 0,
    tax12_5NoIndexation: 0,
    stcgTaxAtSlab: 0,
    gainType: "LTCG" as "LTCG" | "STCG",
  });

  useEffect(() => {
    const purchase = toNum(purchasePrice);
    const sale = toNum(salePrice);
    const pYear = Math.floor(toNum(purchaseYear));
    const sYear = Math.floor(toNum(saleYear));
    const stampDuty = toNum(stampDutyPaid);
    const improve = toNum(improvementCost);
    const brokeragePct = toNum(brokerageSalePercent);
    const slab = toNum(slabRate);

    const holdingPeriod = Math.max(0, sYear - pYear);
    const saleExpenses = sale * brokeragePct / 100;
    const netSalePrice = Math.max(0, sale - saleExpenses);
    const purchaseCII = getCIIForYear(pYear);
    const saleCII = getCIIForYear(sYear);
    const indexFactor = purchaseCII > 0 ? saleCII / purchaseCII : 1;

    const indexedCost = (purchase + stampDuty) * indexFactor;
    const indexedImprovement = improve * indexFactor;

    if (holdingPeriod >= 2) {
      const ltcgIndexed = Math.max(0, netSalePrice - indexedCost - indexedImprovement);
      const ltcgNoIndex = Math.max(0, netSalePrice - (purchase + stampDuty + improve));
      const tax20Indexation = ltcgIndexed * 0.2;
      const tax12_5NoIndexation = ltcgNoIndex * 0.125;

      setResult({
        holdingPeriod,
        gainAmount: ltcgIndexed,
        indexedCost,
        indexedImprovement,
        netSalePrice,
        saleExpenses,
        tax20Indexation,
        tax12_5NoIndexation,
        stcgTaxAtSlab: 0,
        gainType: "LTCG",
      });
      return;
    }

    const stcg = Math.max(0, netSalePrice - (purchase + stampDuty + improve));
    setResult({
      holdingPeriod,
      gainAmount: stcg,
      indexedCost,
      indexedImprovement,
      netSalePrice,
      saleExpenses,
      tax20Indexation: 0,
      tax12_5NoIndexation: 0,
      stcgTaxAtSlab: stcg * slab / 100,
      gainType: "STCG",
    });
  }, [purchasePrice, salePrice, purchaseYear, saleYear, stampDutyPaid, improvementCost, brokerageSalePercent, slabRate]);

  return (
    <CalculatorShell
      title="Property Capital Gains Calculator"
      subtitle="LTCG/STCG with indexation and tax option comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
          <MoneyInput label="Sale Price" value={salePrice} onChange={setSalePrice} />

          <Field label="Purchase Year (CII)">
            <select
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            >
              {ciiYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </Field>

          <Field label="Sale Year (CII)">
            <select
              value={saleYear}
              onChange={(e) => setSaleYear(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            >
              {ciiYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </Field>

          <MoneyInput label="Stamp Duty Paid" value={stampDutyPaid} onChange={setStampDutyPaid} />
          <MoneyInput label="Improvement Cost" value={improvementCost} onChange={setImprovementCost} />
          <NumberInput label="Brokerage on Sale (%)" value={brokerageSalePercent} onChange={setBrokerageSalePercent} />
          <NumberInput label="Slab Rate for STCG (%)" value={slabRate} onChange={setSlabRate} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Holding Period (Years)" value={result.holdingPeriod.toLocaleString("en-IN")} />
            <MiniStat label="Net Sale Price" value={formatINR(result.netSalePrice)} />
            <MiniStat label="Sale Expenses" value={formatINR(result.saleExpenses)} />
            <MiniStat label="Indexed Cost" value={formatINR(result.indexedCost)} />
            <MiniStat label="Gain Amount" value={formatINR(result.gainAmount)} green />
          </div>

          {result.gainType === "LTCG" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="card-surface p-4">
                <div className="text-xs uppercase tracking-wide text-tertiary">Tax Option 1</div>
                <div className="mt-2 text-sm text-secondary">20% with indexation</div>
                <div className="text-xl font-bold text-gradient-orange">{formatINR(result.tax20Indexation)}</div>
              </div>
              <div className="card-surface p-4">
                <div className="text-xs uppercase tracking-wide text-tertiary">Tax Option 2</div>
                <div className="mt-2 text-sm text-secondary">12.5% without indexation</div>
                <div className="text-xl font-bold text-gradient-orange">{formatINR(result.tax12_5NoIndexation)}</div>
              </div>
            </div>
          ) : (
            <div className="card-surface p-4">
              <div className="text-sm text-secondary">STCG taxed at slab rate</div>
              <div className="text-xl font-bold text-gradient-orange">{formatINR(result.stcgTaxAtSlab)}</div>
            </div>
          )}

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Note: Exemption may be available under Sections 54/54F if reinvested in eligible property.
          </div>
        </div>
      )}
    />
  );
}

function ITDepreciationCalc() {
  const assetRates = {
    "Buildings (residential)": 5,
    "Buildings (commercial)": 10,
    "Furniture & Fittings": 10,
    "Plant & Machinery (general)": 15,
    "Motor Cars": 15,
    "Computers & Software": 40,
    "Intangible Assets": 25,
    Ships: 20,
  } as const;

  const [assetBlock, setAssetBlock] = useState<keyof typeof assetRates>("Plant & Machinery (general)");
  const [purchaseCost, setPurchaseCost] = useState("1000000");
  const [dateOfPurchase, setDateOfPurchase] = useState("2025-11-15");
  const [financialYearEnd, setFinancialYearEnd] = useState("2026-03-31");
  const [result, setResult] = useState({
    fullYearDepreciation: 0,
    applicableDepreciation: 0,
    closingWDV: 0,
    taxSavingAtSlab30: 0,
    schedule: [] as Array<{ year: number; openingWDV: number; rate: number; depreciation: number; closingWDV: number }> ,
  });

  useEffect(() => {
    const cost = Math.max(0, toNum(purchaseCost));
    const rate = assetRates[assetBlock];
    const purchaseDate = new Date(dateOfPurchase);
    const fyEndDate = new Date(financialYearEnd);
    const fyStartYear = fyEndDate.getFullYear() - 1;
    const halfYearCutoff = new Date(fyStartYear, 9, 1);
    const halfYearRule = purchaseDate > halfYearCutoff;

    const fullYearDepreciation = cost * rate / 100;
    const firstYearRate = halfYearRule ? rate / 2 : rate;
    const applicableDepreciation = cost * firstYearRate / 100;
    const closingWDV = Math.max(0, cost - applicableDepreciation);
    const taxSavingAtSlab30 = applicableDepreciation * 0.3;

    const schedule: Array<{ year: number; openingWDV: number; rate: number; depreciation: number; closingWDV: number }> = [];
    let opening = cost;
    for (let y = 1; y <= 5; y += 1) {
      const appliedRate = y === 1 ? firstYearRate : rate;
      const depreciation = opening * appliedRate / 100;
      const closing = Math.max(0, opening - depreciation);
      schedule.push({ year: y, openingWDV: opening, rate: appliedRate, depreciation, closingWDV: closing });
      opening = closing;
    }

    setResult({ fullYearDepreciation, applicableDepreciation, closingWDV, taxSavingAtSlab30, schedule });
  }, [assetBlock, purchaseCost, dateOfPurchase, financialYearEnd]);

  return (
    <CalculatorShell
      title="Income Tax Act Depreciation"
      subtitle="Block-rate depreciation with half-year rule and 5-year WDV schedule"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Asset Block">
            <select
              value={assetBlock}
              onChange={(e) => setAssetBlock(e.target.value as keyof typeof assetRates)}
              className="glass-input w-full h-11 px-3 text-sm"
            >
              {Object.keys(assetRates).map((asset) => (
                <option key={asset} value={asset}>{asset}</option>
              ))}
            </select>
          </Field>

          <MoneyInput label="Purchase Cost" value={purchaseCost} onChange={setPurchaseCost} />

          <Field label="Date of Purchase">
            <input
              type="date"
              value={dateOfPurchase}
              onChange={(e) => setDateOfPurchase(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>

          <Field label="Financial Year End">
            <input
              type="date"
              value={financialYearEnd}
              onChange={(e) => setFinancialYearEnd(e.target.value)}
              className="glass-input w-full h-11 px-3 text-sm"
            />
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Full-Year Depreciation" value={formatINR(result.fullYearDepreciation)} />
            <MiniStat label="Applicable Depreciation" value={formatINR(result.applicableDepreciation)} />
            <MiniStat label="Closing WDV" value={formatINR(result.closingWDV)} />
            <MiniStat label="Tax Saving @ 30%" value={formatINR(result.taxSavingAtSlab30)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">5-Year Depreciation Schedule</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Opening WDV</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Depreciation</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Closing WDV</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.openingWDV)}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.depreciation)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.closingWDV)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function NetWorthCalc() {
  type LineItem = { name: string; value: string };

  const [assets, setAssets] = useState<LineItem[]>([
    { name: "Cash & Bank", value: "500000" },
    { name: "Mutual Funds", value: "700000" },
    { name: "Stocks", value: "450000" },
    { name: "PPF/EPF", value: "600000" },
    { name: "Real Estate", value: "4500000" },
    { name: "Gold", value: "300000" },
    { name: "Vehicle", value: "650000" },
    { name: "Other", value: "100000" },
  ]);

  const [liabilities, setLiabilities] = useState<LineItem[]>([
    { name: "Home Loan", value: "2800000" },
    { name: "Car Loan", value: "250000" },
    { name: "Personal Loan", value: "100000" },
    { name: "Credit Card", value: "45000" },
    { name: "Other Loans", value: "50000" },
  ]);

  const [result, setResult] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    debtToAssetRatio: 0,
    assetBreakdown: [] as Array<{ name: string; value: number; pct: number }>,
    liabilityBreakdown: [] as Array<{ name: string; value: number; pct: number }>,
  });

  useEffect(() => {
    const assetRows = assets.map((item) => ({ name: item.name || "Unnamed Asset", value: toNum(item.value) }));
    const liabilityRows = liabilities.map((item) => ({ name: item.name || "Unnamed Liability", value: toNum(item.value) }));

    const totalAssets = assetRows.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilities = liabilityRows.reduce((sum, item) => sum + item.value, 0);
    const netWorth = totalAssets - totalLiabilities;
    const debtToAssetRatio = totalAssets > 0 ? totalLiabilities / totalAssets * 100 : 0;

    const assetBreakdown = assetRows
      .filter((item) => item.value > 0)
      .map((item) => ({ ...item, pct: totalAssets > 0 ? item.value / totalAssets * 100 : 0 }));

    const liabilityBreakdown = liabilityRows
      .filter((item) => item.value > 0)
      .map((item) => ({ ...item, pct: totalLiabilities > 0 ? item.value / totalLiabilities * 100 : 0 }));

    setResult({ totalAssets, totalLiabilities, netWorth, debtToAssetRatio, assetBreakdown, liabilityBreakdown });
  }, [assets, liabilities]);

  const updateItem = (
    type: "asset" | "liability",
    index: number,
    patch: Partial<{ name: string; value: string }>
  ) => {
    if (type === "asset") {
      setAssets((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
      return;
    }
    setLiabilities((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = (type: "asset" | "liability") => {
    if (type === "asset") {
      setAssets((prev) => (prev.length >= 10 ? prev : [...prev, { name: "", value: "0" }]));
      return;
    }
    setLiabilities((prev) => (prev.length >= 10 ? prev : [...prev, { name: "", value: "0" }]));
  };

  return (
    <CalculatorShell
      title="Personal Net Worth Calculator"
      subtitle="Track assets, liabilities and leverage position"
      inputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Assets</h2>
              <button
                onClick={() => addItem("asset")}
                className="px-3 py-1.5 text-xs rounded-md border border-white/10 text-secondary hover:text-white"
              >
                Add Asset
              </button>
            </div>
            {assets.map((item, index) => (
              <div key={`asset-${index}`} className="grid grid-cols-[1fr_120px] gap-2">
                <input
                  value={item.name}
                  onChange={(e) => updateItem("asset", index, { name: e.target.value })}
                  placeholder="Asset name"
                  className="glass-input h-10 px-3 text-sm"
                />
                <input
                  inputMode="numeric"
                  value={item.value}
                  onChange={(e) => updateItem("asset", index, { value: e.target.value.replace(/[^0-9.]/g, "") })}
                  placeholder="0"
                  className="glass-input h-10 px-3 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="card-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Liabilities</h2>
              <button
                onClick={() => addItem("liability")}
                className="px-3 py-1.5 text-xs rounded-md border border-white/10 text-secondary hover:text-white"
              >
                Add Liability
              </button>
            </div>
            {liabilities.map((item, index) => (
              <div key={`liability-${index}`} className="grid grid-cols-[1fr_120px] gap-2">
                <input
                  value={item.name}
                  onChange={(e) => updateItem("liability", index, { name: e.target.value })}
                  placeholder="Liability name"
                  className="glass-input h-10 px-3 text-sm"
                />
                <input
                  inputMode="numeric"
                  value={item.value}
                  onChange={(e) => updateItem("liability", index, { value: e.target.value.replace(/[^0-9.]/g, "") })}
                  placeholder="0"
                  className="glass-input h-10 px-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Total Assets" value={formatINR(result.totalAssets)} />
            <MiniStat label="Total Liabilities" value={formatINR(result.totalLiabilities)} />
            <div className="card-surface p-3 sm:col-span-2">
              <div className="text-[10px] uppercase tracking-wide text-tertiary">Net Worth</div>
              <div className={cn("mt-1 text-2xl font-bold", result.netWorth >= 0 ? "text-success" : "text-red-400")}>
                ₹ {result.netWorth.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </div>
            </div>
            <MiniStat label="Debt to Asset Ratio" value={formatPct(result.debtToAssetRatio)} />
          </div>

          <div className="card-surface p-4 space-y-3">
            <div className="text-sm font-semibold">Assets Breakdown</div>
            {result.assetBreakdown.map((item) => (
              <div key={`asset-bar-${item.name}`}>
                <div className="flex justify-between text-xs text-secondary mb-1">
                  <span>{item.name}</span>
                  <span>{formatNum(item.pct, 2)}%</span>
                </div>
                <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                  <div className="h-full bg-gradient-orange" style={{ width: `${Math.min(100, item.pct)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface p-4 space-y-3">
            <div className="text-sm font-semibold">Liabilities Breakdown</div>
            {result.liabilityBreakdown.map((item) => (
              <div key={`liability-bar-${item.name}`}>
                <div className="flex justify-between text-xs text-secondary mb-1">
                  <span>{item.name}</span>
                  <span>{formatNum(item.pct, 2)}%</span>
                </div>
                <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                  <div className="h-full bg-red-400/80" style={{ width: `${Math.min(100, item.pct)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}

function WorkingCapitalCalc() {
  const [currentAssets, setCurrentAssets] = useState("2500000");
  const [currentLiabilities, setCurrentLiabilities] = useState("1400000");
  const [inventory, setInventory] = useState("450000");
  const [accountsReceivable, setAccountsReceivable] = useState("380000");
  const [accountsPayable, setAccountsPayable] = useState("300000");
  const [annualRevenue, setAnnualRevenue] = useState("7200000");
  const [annualCOGS, setAnnualCOGS] = useState("4200000");
  const [result, setResult] = useState({
    workingCapital: 0,
    currentRatio: 0,
    quickRatio: 0,
    cashRatio: 0,
    daysReceivable: 0,
    daysPayable: 0,
    daysInventory: 0,
    cashConversionCycle: 0,
  });

  useEffect(() => {
    const ca = toNum(currentAssets);
    const cl = toNum(currentLiabilities);
    const inv = toNum(inventory);
    const ar = toNum(accountsReceivable);
    const ap = toNum(accountsPayable);
    const revenue = toNum(annualRevenue);
    const cogs = toNum(annualCOGS);

    const safeDiv = (num: number, den: number) => (den > 0 ? num / den : 0);
    const workingCapital = ca - cl;
    const currentRatio = safeDiv(ca, cl);
    const quickRatio = safeDiv(ca - inv, cl);
    const cashRatio = safeDiv(ca - inv - ar, cl);
    const daysReceivable = safeDiv(ar, revenue) * 365;
    const daysPayable = safeDiv(ap, cogs) * 365;
    const daysInventory = safeDiv(inv, cogs) * 365;
    const cashConversionCycle = daysReceivable + daysInventory - daysPayable;

    setResult({
      workingCapital,
      currentRatio,
      quickRatio,
      cashRatio,
      daysReceivable,
      daysPayable,
      daysInventory,
      cashConversionCycle,
    });
  }, [currentAssets, currentLiabilities, inventory, accountsReceivable, accountsPayable, annualRevenue, annualCOGS]);

  const ratioStatus = (type: "current" | "quick" | "cash", value: number) => {
    if (type === "current") {
      if (value >= 1.5 && value <= 2.5) return "Healthy";
      if (value >= 1) return "Caution";
      return "Risk";
    }
    if (type === "quick") {
      if (value >= 1) return "Healthy";
      if (value >= 0.7) return "Caution";
      return "Risk";
    }
    if (value >= 0.5) return "Healthy";
    if (value >= 0.2) return "Caution";
    return "Risk";
  };

  const cccText = result.cashConversionCycle < 0
    ? "Negative cycle: business collects cash before paying suppliers."
    : result.cashConversionCycle < 45
      ? "Efficient cycle: lower CCC improves liquidity."
      : "Long cycle: optimize inventory and collections to reduce CCC.";

  return (
    <CalculatorShell
      title="Working Capital Analysis"
      subtitle="Liquidity ratios and cash conversion cycle"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Current Assets" value={currentAssets} onChange={setCurrentAssets} />
          <MoneyInput label="Current Liabilities" value={currentLiabilities} onChange={setCurrentLiabilities} />
          <MoneyInput label="Inventory" value={inventory} onChange={setInventory} />
          <MoneyInput label="Accounts Receivable" value={accountsReceivable} onChange={setAccountsReceivable} />
          <MoneyInput label="Accounts Payable" value={accountsPayable} onChange={setAccountsPayable} />
          <MoneyInput label="Annual Revenue" value={annualRevenue} onChange={setAnnualRevenue} />
          <MoneyInput label="Annual COGS" value={annualCOGS} onChange={setAnnualCOGS} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Working Capital" value={formatINR(result.workingCapital)} green={result.workingCapital > 0} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Current Ratio", value: result.currentRatio, type: "current" as const },
              { label: "Quick Ratio", value: result.quickRatio, type: "quick" as const },
              { label: "Cash Ratio", value: result.cashRatio, type: "cash" as const },
            ].map((row) => {
              const status = ratioStatus(row.type, row.value);
              return (
                <div key={row.label} className="card-surface p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-tertiary">{row.label}</div>
                  <div className="text-xl font-bold text-gradient-orange">{formatNum(row.value, 2)}x</div>
                  <span className={cn(
                    "inline-flex px-2 py-0.5 rounded-pill text-[10px] font-semibold border",
                    status === "Healthy"
                      ? "text-success border-success/40 bg-success/10"
                      : status === "Caution"
                        ? "text-warning border-warning/40 bg-warning/10"
                        : "text-red-400 border-red-400/40 bg-red-400/10"
                  )}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Working Capital Days Table</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Metric</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-2 text-secondary">DRO (Days Receivable Outstanding)</td>
                    <td className="px-5 py-2 text-right font-medium">{result.daysReceivable.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-2 text-secondary">DPO (Days Payable Outstanding)</td>
                    <td className="px-5 py-2 text-right font-medium">{result.daysPayable.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-2 text-secondary">DIO (Days Inventory Outstanding)</td>
                    <td className="px-5 py-2 text-right font-medium">{result.daysInventory.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Cash Conversion Cycle: <span className="font-semibold text-white">{result.cashConversionCycle.toLocaleString("en-IN", { maximumFractionDigits: 2 })} days</span>.
            {" "}{cccText}
          </div>
        </div>
      )}
    />
  );
}

function BondValuationCalc() {
  const [faceValue, setFaceValue] = useState("100000");
  const [couponRate, setCouponRate] = useState("8");
  const [marketRate, setMarketRate] = useState("9");
  const [yearsToMaturity, setYearsToMaturity] = useState("10");
  const [couponFrequency, setCouponFrequency] = useState<"annual" | "semi-annual">("annual");
  const [result, setResult] = useState({
    bondPrice: 0,
    premiumDiscount: 0,
    currentYield: 0,
    cashFlows: [] as Array<{ year: number; couponCashFlow: number; principalCashFlow: number; totalCashFlow: number }>,
  });

  useEffect(() => {
    const fv = toNum(faceValue);
    const cRate = toNum(couponRate);
    const mRate = toNum(marketRate);
    const years = Math.max(1, Math.floor(toNum(yearsToMaturity)));

    const periodsPerYear = couponFrequency === "semi-annual" ? 2 : 1;
    const periodRate = mRate / 100 / periodsPerYear;
    const totalPeriods = years * periodsPerYear;
    const couponPayment = fv * (cRate / 100) / periodsPerYear;

    let pvCoupons = 0;
    if (periodRate === 0) {
      pvCoupons = couponPayment * totalPeriods;
    } else {
      pvCoupons = couponPayment * (1 - (1 + periodRate) ** (-totalPeriods)) / periodRate;
    }
    const pvFaceValue = fv / (1 + periodRate) ** totalPeriods;
    const bondPrice = pvCoupons + pvFaceValue;
    const premiumDiscount = bondPrice - fv;
    const currentYield = bondPrice > 0 ? (couponPayment * periodsPerYear) / bondPrice * 100 : 0;

    const cashFlows = Array.from({ length: years }, (_, idx) => {
      const year = idx + 1;
      const couponCashFlow = couponPayment * periodsPerYear;
      const principalCashFlow = year === years ? fv : 0;
      return {
        year,
        couponCashFlow,
        principalCashFlow,
        totalCashFlow: couponCashFlow + principalCashFlow,
      };
    });

    setResult({ bondPrice, premiumDiscount, currentYield, cashFlows });
  }, [faceValue, couponRate, marketRate, yearsToMaturity, couponFrequency]);

  return (
    <CalculatorShell
      title="Bond Valuation Calculator"
      subtitle="Present value pricing with yield and premium/discount"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Face Value" value={faceValue} onChange={setFaceValue} />
          <NumberInput label="Coupon Rate (%)" value={couponRate} onChange={setCouponRate} />
          <NumberInput label="Market Rate (%)" value={marketRate} onChange={setMarketRate} />
          <NumberInput label="Years to Maturity" value={yearsToMaturity} onChange={setYearsToMaturity} />

          <Field label="Coupon Frequency">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["annual", "semi-annual"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCouponFrequency(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all capitalize",
                    couponFrequency === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Bond Price" value={formatINR(result.bondPrice)} />
            <MiniStat
              label="Premium / Discount"
              value={`₹ ${Math.abs(result.premiumDiscount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              green={result.premiumDiscount >= 0}
            />
            <MiniStat label="Current Yield" value={formatPct(result.currentYield)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Year-by-Year Cash Flows</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Coupon</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Principal</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.cashFlows.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.couponCashFlow)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.principalCashFlow)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.totalCashFlow)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function SYDCalc() {
  const [assetCost, setAssetCost] = useState("1200000");
  const [salvageValue, setSalvageValue] = useState("120000");
  const [usefulLife, setUsefulLife] = useState("6");
  const [result, setResult] = useState({
    sumOfYears: 0,
    yearOneDepreciation: 0,
    schedule: [] as Array<{ year: number; fraction: string; sydDep: number; accumulated: number; bookValue: number; slmDep: number }>,
  });

  useEffect(() => {
    const cost = toNum(assetCost);
    const salvage = toNum(salvageValue);
    const life = Math.max(1, Math.floor(toNum(usefulLife)));
    const depreciable = Math.max(0, cost - salvage);
    const sumOfYears = life * (life + 1) / 2;
    const slmDep = life > 0 ? depreciable / life : 0;

    let accumulated = 0;
    const schedule = Array.from({ length: life }, (_, idx) => {
      const year = idx + 1;
      const numerator = life - year + 1;
      const sydDep = sumOfYears > 0 ? (numerator / sumOfYears) * depreciable : 0;
      accumulated += sydDep;
      const bookValue = Math.max(salvage, cost - accumulated);
      return {
        year,
        fraction: `${numerator}/${sumOfYears}`,
        sydDep,
        accumulated,
        bookValue,
        slmDep,
      };
    });

    setResult({
      sumOfYears,
      yearOneDepreciation: schedule[0]?.sydDep ?? 0,
      schedule,
    });
  }, [assetCost, salvageValue, usefulLife]);

  return (
    <CalculatorShell
      title="Sum of Years Digits Depreciation"
      subtitle="Accelerated depreciation schedule with SLM comparison"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Asset Cost" value={assetCost} onChange={setAssetCost} />
          <MoneyInput label="Salvage Value" value={salvageValue} onChange={setSalvageValue} />
          <NumberInput label="Useful Life (Years)" value={usefulLife} onChange={setUsefulLife} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Sum of Years" value={result.sumOfYears.toLocaleString("en-IN")} />
            <MiniStat label="Year 1 Depreciation" value={formatINR(result.yearOneDepreciation)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">SYD Full Schedule</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Fraction</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Depreciation</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Accumulated</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Book Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right">{row.fraction}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.sydDep)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.accumulated)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.bookValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">SYD vs SLM (Depreciation Per Year)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">SYD</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">SLM</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row, index) => (
                    <tr key={`compare-${row.year}`} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.sydDep)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.slmDep)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function ProfitabilityRatiosCalc() {
  const [revenue, setRevenue] = useState("10000000");
  const [grossProfit, setGrossProfit] = useState("2800000");
  const [ebitda, setEbitda] = useState("2200000");
  const [ebit, setEbit] = useState("1700000");
  const [netIncome, setNetIncome] = useState("1200000");
  const [totalAssets, setTotalAssets] = useState("9000000");
  const [totalEquity, setTotalEquity] = useState("4200000");
  const [capitalEmployed, setCapitalEmployed] = useState("6500000");
  const [cards, setCards] = useState(
    [] as Array<{ label: string; value: number; suffix: string; benchmark: string; status: "Healthy" | "Caution" | "Risk" }>
  );

  useEffect(() => {
    const rev = toNum(revenue);
    const gp = toNum(grossProfit);
    const ebitdaVal = toNum(ebitda);
    const ebitVal = toNum(ebit);
    const net = toNum(netIncome);
    const assets = toNum(totalAssets);
    const equity = toNum(totalEquity);
    const ce = toNum(capitalEmployed);

    const safePct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);
    const safeMul = (num: number, den: number) => (den > 0 ? num / den : 0);

    const baseRatios = [
      { label: "Gross Profit Margin", value: safePct(gp, rev), suffix: "%", benchmark: "Healthy > 20%", healthy: 20 },
      { label: "EBITDA Margin", value: safePct(ebitdaVal, rev), suffix: "%", benchmark: "Healthy > 15%", healthy: 15 },
      { label: "EBIT Margin", value: safePct(ebitVal, rev), suffix: "%", benchmark: "Healthy > 12%", healthy: 12 },
      { label: "Net Profit Margin", value: safePct(net, rev), suffix: "%", benchmark: "Healthy > 10%", healthy: 10 },
      { label: "ROA", value: safePct(net, assets), suffix: "%", benchmark: "Healthy > 5%", healthy: 5 },
      { label: "ROE", value: safePct(net, equity), suffix: "%", benchmark: "Healthy > 15%", healthy: 15 },
      { label: "ROCE", value: safePct(ebitVal, ce), suffix: "%", benchmark: "Healthy > 12%", healthy: 12 },
      { label: "Asset Turnover", value: safeMul(rev, assets), suffix: "x", benchmark: "Healthy > 1.00x", healthy: 1 },
    ];

    const ratios: Array<{ label: string; value: number; suffix: string; benchmark: string; status: "Healthy" | "Caution" | "Risk" }> = baseRatios.map((row) => {
      const status: "Healthy" | "Caution" | "Risk" = row.value > row.healthy
        ? "Healthy"
        : row.value > row.healthy * 0.7
          ? "Caution"
          : "Risk";
      return { label: row.label, value: row.value, suffix: row.suffix, benchmark: row.benchmark, status };
    });

    setCards(ratios);
  }, [revenue, grossProfit, ebitda, ebit, netIncome, totalAssets, totalEquity, capitalEmployed]);

  return (
    <CalculatorShell
      title="Profitability Ratios Dashboard"
      subtitle="Margins, returns and turnover in one view"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Revenue" value={revenue} onChange={setRevenue} />
          <MoneyInput label="Gross Profit" value={grossProfit} onChange={setGrossProfit} />
          <MoneyInput label="EBITDA" value={ebitda} onChange={setEbitda} />
          <MoneyInput label="EBIT" value={ebit} onChange={setEbit} />
          <MoneyInput label="Net Income" value={netIncome} onChange={setNetIncome} />
          <MoneyInput label="Total Assets" value={totalAssets} onChange={setTotalAssets} />
          <MoneyInput label="Total Equity" value={totalEquity} onChange={setTotalEquity} />
          <MoneyInput label="Capital Employed" value={capitalEmployed} onChange={setCapitalEmployed} />
        </div>
      )}
      outputPanel={(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((card) => (
            <div key={card.label} className="card-surface p-4 space-y-2">
              <div className="text-xs uppercase tracking-wide text-tertiary">{card.label}</div>
              <div className="text-xl font-bold text-gradient-orange">
                {card.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}{card.suffix}
              </div>
              <div className="text-[11px] text-secondary">{card.benchmark}</div>
              <span className={cn(
                "inline-flex px-2 py-0.5 rounded-pill text-[10px] font-semibold border",
                card.status === "Healthy"
                  ? "text-success border-success/40 bg-success/10"
                  : card.status === "Caution"
                    ? "text-warning border-warning/40 bg-warning/10"
                    : "text-red-400 border-red-400/40 bg-red-400/10"
              )}>
                {card.status}
              </span>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function RentVsBuyCalc() {
  const [propertyPrice, setPropertyPrice] = useState("9000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [mortgageRate, setMortgageRate] = useState("8.5");
  const [tenureYears, setTenureYears] = useState("20");
  const [monthlyRent, setMonthlyRent] = useState("35000");
  const [rentIncreasePercent, setRentIncreasePercent] = useState("7");
  const [propertyAppreciationPercent, setPropertyAppreciationPercent] = useState("6");
  const [maintenancePercent, setMaintenancePercent] = useState("1");
  const [investmentReturnPercent, setInvestmentReturnPercent] = useState("10");
  const [result, setResult] = useState({
    totalBuyingCost: 0,
    totalRentCost: 0,
    recommendation: "",
    breakEvenYear: 0,
    comparison: [] as Array<{ year: number; cumulativeRent: number; netBuyingCost: number; difference: number }>,
  });

  useEffect(() => {
    const price = toNum(propertyPrice);
    const dpPct = toNum(downPaymentPercent);
    const loanRate = toNum(mortgageRate);
    const years = Math.max(1, Math.floor(toNum(tenureYears)));
    const rent = toNum(monthlyRent);
    const rentInc = toNum(rentIncreasePercent);
    const app = toNum(propertyAppreciationPercent);
    const maintPct = toNum(maintenancePercent);
    const investRet = toNum(investmentReturnPercent);

    const downPayment = price * dpPct / 100;
    const loanAmount = Math.max(0, price - downPayment);
    const months = years * 12;
    const emi = calculateEMIFromPrincipal(loanAmount, loanRate, months);
    const totalMortgageCost = emi * months + downPayment;
    const totalInterest = Math.max(0, totalMortgageCost - price);
    const annualMaintenance = price * maintPct / 100;
    const totalBuyingCost = downPayment + totalInterest + annualMaintenance * years;

    let totalRentCost = 0;
    for (let y = 0; y < years; y += 1) {
      totalRentCost += rent * 12 * (1 + rentInc / 100) ** y;
    }

    const opportunityCost = downPayment * (1 + investRet / 100) ** years;
    const finalPropertyValue = price * (1 + app / 100) ** years;
    const netCostBuying = totalBuyingCost - (finalPropertyValue - price);
    const recommendation = netCostBuying <= totalRentCost
      ? "Buying is financially favorable over the selected horizon."
      : "Renting appears cheaper over the selected horizon.";

    let cumulativeRent = 0;
    const firstTen = Math.min(10, years);
    const comparison: Array<{ year: number; cumulativeRent: number; netBuyingCost: number; difference: number }> = [];
    let breakEvenYear = 0;

    for (let y = 1; y <= firstTen; y += 1) {
      cumulativeRent += rent * 12 * (1 + rentInc / 100) ** (y - 1);
      const cumulativeBuyOutflow = downPayment + emi * 12 * y + annualMaintenance * y;
      const propertyGain = price * ((1 + app / 100) ** y - 1);
      const netBuyingCost = cumulativeBuyOutflow - propertyGain;
      const difference = cumulativeRent - netBuyingCost;
      if (breakEvenYear === 0 && difference >= 0) breakEvenYear = y;
      comparison.push({ year: y, cumulativeRent, netBuyingCost, difference });
    }

    setResult({
      totalBuyingCost: totalBuyingCost + (opportunityCost - downPayment),
      totalRentCost,
      recommendation,
      breakEvenYear,
      comparison,
    });
  }, [
    propertyPrice,
    downPaymentPercent,
    mortgageRate,
    tenureYears,
    monthlyRent,
    rentIncreasePercent,
    propertyAppreciationPercent,
    maintenancePercent,
    investmentReturnPercent,
  ]);

  return (
    <CalculatorShell
      title="Rent vs Buy Analysis"
      subtitle="Compare ownership economics with rent escalation"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Property Price" value={propertyPrice} onChange={setPropertyPrice} />
          <NumberInput label="Down Payment (%)" value={downPaymentPercent} onChange={setDownPaymentPercent} />
          <NumberInput label="Mortgage Rate (%)" value={mortgageRate} onChange={setMortgageRate} />
          <NumberInput label="Tenure (Years)" value={tenureYears} onChange={setTenureYears} />
          <MoneyInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} />
          <NumberInput label="Rent Increase (%)" value={rentIncreasePercent} onChange={setRentIncreasePercent} />
          <NumberInput label="Property Appreciation (%)" value={propertyAppreciationPercent} onChange={setPropertyAppreciationPercent} />
          <NumberInput label="Maintenance (%)" value={maintenancePercent} onChange={setMaintenancePercent} />
          <NumberInput label="Investment Return (%)" value={investmentReturnPercent} onChange={setInvestmentReturnPercent} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Total Buying Cost" value={formatINR(result.totalBuyingCost)} />
            <MiniStat label="Total Rent Cost" value={formatINR(result.totalRentCost)} />
            <MiniStat
              label="Break-even Year"
              value={result.breakEvenYear > 0 ? result.breakEvenYear.toLocaleString("en-IN") : "Not within 10 yrs"}
              green={result.breakEvenYear > 0}
            />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            {result.recommendation}
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Year-by-Year Comparison (First 10 Years)</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Cumulative Rent</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Net Buying Cost</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Rent - Buy</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparison.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.cumulativeRent)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.netBuyingCost)}</td>
                      <td className={cn("px-5 py-2 text-right font-medium", row.difference >= 0 ? "text-success" : "text-red-400")}>
                        {`₹ ${row.difference.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function HUFTaxCalc() {
  type Member = { name: string; income: string };

  const [hufIncome, setHufIncome] = useState("1800000");
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [memberIncomes, setMemberIncomes] = useState<Member[]>([
    { name: "Member 1", income: "600000" },
    { name: "Member 2", income: "450000" },
  ]);
  const [result, setResult] = useState({
    hufTax: 0,
    effectiveRate: 0,
    individualTax: 0,
    taxSaving: 0,
    memberRows: [] as Array<{ name: string; baseIncome: number; withShareIncome: number; tax: number }>,
  });

  useEffect(() => {
    const income = toNum(hufIncome);
    const selectedSlabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
    const hufDeduction80C = regime === "old" ? Math.min(150000, income) : 0;
    const hufTaxable = Math.max(0, income - hufDeduction80C);
    const hufBaseTax = calculateSlabTax(hufTaxable, selectedSlabs).baseTax;
    const hufTax = hufBaseTax * 1.04;

    const validMembers = memberIncomes.filter((m) => m.name.trim() && toNum(m.income) > 0);
    const memberCount = validMembers.length || 1;
    const sharedIncome = income / memberCount;

    const memberRows = validMembers.map((member) => {
      const baseIncome = toNum(member.income);
      const taxable = Math.max(0, baseIncome + sharedIncome);
      const memberTax = calculateSlabTax(taxable, selectedSlabs).baseTax * 1.04;
      return {
        name: member.name,
        baseIncome,
        withShareIncome: taxable,
        tax: memberTax,
      };
    });

    const individualTax = memberRows.reduce((sum, row) => sum + row.tax, 0);
    const taxSaving = Math.max(0, individualTax - hufTax);
    const effectiveRate = income > 0 ? (hufTax / income) * 100 : 0;

    setResult({ hufTax, effectiveRate, individualTax, taxSaving, memberRows });
  }, [hufIncome, regime, memberIncomes]);

  const updateMember = (index: number, key: keyof Member, value: string) => {
    setMemberIncomes((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
  };

  const addMember = () => {
    setMemberIncomes((prev) => (prev.length >= 5 ? prev : [...prev, { name: `Member ${prev.length + 1}`, income: "0" }]));
  };

  return (
    <CalculatorShell
      title="HUF Tax Calculator"
      subtitle="Compare HUF taxation vs income taxed in individual hands"
      inputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">HUF Inputs</h2>
            <MoneyInput label="HUF Income" value={hufIncome} onChange={setHufIncome} />
            <Field label="Regime">
              <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
                {(["new", "old"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setRegime(item)}
                    className={cn(
                      "py-2 text-xs font-medium rounded-md transition-all uppercase",
                      regime === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>
            <div className="text-xs text-tertiary border-t border-white/10 pt-3">
              HUF deduction considered: Section 80C up to ₹1.5L in old regime.
            </div>
          </div>

          <div className="card-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Member Incomes (Max 5)</h2>
              <button
                onClick={addMember}
                className="px-3 py-1.5 text-xs rounded-md border border-white/10 text-secondary hover:text-white"
              >
                Add Member
              </button>
            </div>
            {memberIncomes.map((member, index) => (
              <div key={`${member.name}-${index}`} className="grid grid-cols-[1fr_140px] gap-2">
                <input
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  className="glass-input h-10 px-3 text-sm"
                  placeholder="Member name"
                />
                <input
                  value={member.income}
                  inputMode="numeric"
                  onChange={(e) => updateMember(index, "income", e.target.value.replace(/[^0-9]/g, ""))}
                  className="glass-input h-10 px-3 text-sm text-right"
                  placeholder="Income"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="HUF Tax" value={formatINR(result.hufTax)} />
            <MiniStat label="Effective Rate" value={formatPct(result.effectiveRate)} />
            <MiniStat label="If Taxed in Individual Hands" value={formatINR(result.individualTax)} />
            <MiniStat label="Tax Saving via HUF" value={formatINR(result.taxSaving)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Member Comparison</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Member</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Base Income</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Income + Share</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.memberRows.map((row, index) => (
                    <tr key={row.name + index} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.name}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.baseIncome)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.withShareIncome)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function Form16Calc() {
  const [employerName, setEmployerName] = useState("ABC Private Limited");
  const [tan, setTan] = useState("BLRA12345A");
  const [pan, setPan] = useState("ABCDE1234F");
  const [grossSalary, setGrossSalary] = useState("1800000");
  const [allowances, setAllowances] = useState("240000");
  const [perquisites, setPerquisites] = useState("60000");
  const [hraExemption, setHraExemption] = useState("120000");
  const [ltaExemption, setLtaExemption] = useState("30000");
  const [otherExemption, setOtherExemption] = useState("15000");
  const [ded80c, setDed80c] = useState("150000");
  const [ded80d, setDed80d] = useState("25000");
  const [ded80ccd1b, setDed80ccd1b] = useState("50000");
  const [otherDeduction, setOtherDeduction] = useState("0");
  const [result, setResult] = useState({
    grossIncome: 0,
    exemptIncome: 0,
    netSalary: 0,
    deductions: 0,
    taxableIncome: 0,
    tax: 0,
    cess: 0,
    totalTax: 0,
  });

  useEffect(() => {
    const gross = toNum(grossSalary);
    const allow = toNum(allowances);
    const perq = toNum(perquisites);

    const grossIncome = gross + allow + perq;
    const hra = Math.min(toNum(hraExemption), grossIncome);
    const lta = Math.min(toNum(ltaExemption), grossIncome);
    const otherEx = Math.min(toNum(otherExemption), grossIncome);
    const exemptIncome = Math.min(grossIncome, hra + lta + otherEx);

    const standardDeduction = 75000;
    const d80c = Math.min(toNum(ded80c), 150000);
    const d80d = Math.min(toNum(ded80d), 25000);
    const d80ccd = Math.min(toNum(ded80ccd1b), 50000);
    const otherDed = toNum(otherDeduction);
    const deductions = d80c + d80d + d80ccd + otherDed;

    const netSalary = Math.max(0, grossIncome - exemptIncome);
    const taxableIncome = Math.max(0, netSalary - standardDeduction - deductions);
    const tax = calculateSlabTax(taxableIncome, NEW_REGIME_SLABS).baseTax;
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    setResult({ grossIncome, exemptIncome, netSalary, deductions, taxableIncome, tax, cess, totalTax });
  }, [
    grossSalary,
    allowances,
    perquisites,
    hraExemption,
    ltaExemption,
    otherExemption,
    ded80c,
    ded80d,
    ded80ccd1b,
    otherDeduction,
  ]);

  const rows = [
    { label: "Gross Salary (incl. Allowances & Perquisites)", value: result.grossIncome },
    { label: "Less: Exemptions (HRA + LTA + Other)", value: -result.exemptIncome },
    { label: "Net Salary", value: result.netSalary },
    { label: "Less: Standard Deduction", value: -75000 },
    { label: "Less: Chapter VI-A Deductions", value: -result.deductions },
    { label: "Taxable Income", value: result.taxableIncome },
    { label: "Income Tax (New Regime)", value: result.tax },
    { label: "Health & Education Cess @4%", value: result.cess },
    { label: "Total Tax Liability", value: result.totalTax },
  ];

  return (
    <CalculatorShell
      title="Form 16 / Salary Tax Computation"
      subtitle="Formal Part B style salary tax computation"
      inputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Part A: Employer Details</h2>
            <Field label="Employer Name">
              <input value={employerName} onChange={(e) => setEmployerName(e.target.value)} className="glass-input w-full h-11 px-3 text-sm" />
            </Field>
            <Field label="TAN">
              <input value={tan} onChange={(e) => setTan(e.target.value.toUpperCase())} className="glass-input w-full h-11 px-3 text-sm" />
            </Field>
            <Field label="PAN">
              <input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} className="glass-input w-full h-11 px-3 text-sm" />
            </Field>
          </div>

          <div className="card-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Part B: Income / Exemptions / Deductions</h2>
            <MoneyInput label="Gross Salary" value={grossSalary} onChange={setGrossSalary} />
            <MoneyInput label="Allowances" value={allowances} onChange={setAllowances} />
            <MoneyInput label="Perquisites" value={perquisites} onChange={setPerquisites} />
            <MoneyInput label="HRA Exemption" value={hraExemption} onChange={setHraExemption} />
            <MoneyInput label="LTA Exemption" value={ltaExemption} onChange={setLtaExemption} />
            <MoneyInput label="Other Exemption" value={otherExemption} onChange={setOtherExemption} />
            <MoneyInput label="Deduction 80C" value={ded80c} onChange={setDed80c} />
            <MoneyInput label="Deduction 80D" value={ded80d} onChange={setDed80d} />
            <MoneyInput label="Deduction 80CCD(1B)" value={ded80ccd1b} onChange={setDed80ccd1b} />
            <MoneyInput label="Other Deductions" value={otherDeduction} onChange={setOtherDeduction} />
          </div>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-4 text-xs text-secondary">
            Employer: <span className="text-white font-medium">{employerName}</span> | TAN: <span className="text-white font-medium">{tan}</span> | PAN: <span className="text-white font-medium">{pan}</span>
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Form 16 Part B Computation</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.label} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.label}</td>
                      <td className="px-5 py-2 text-right font-medium">
                        {row.value < 0 ? `- ${formatINR(Math.abs(row.value))}` : formatINR(row.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function TDSSalaryCalc() {
  const [monthlyBasic, setMonthlyBasic] = useState("70000");
  const [monthlyHRA, setMonthlyHRA] = useState("30000");
  const [otherAllowances, setOtherAllowances] = useState("20000");
  const [employerPF, setEmployerPF] = useState("8400");
  const [rentPaid, setRentPaid] = useState("28000");
  const [cityType, setCityType] = useState<"metro" | "non-metro">("metro");
  const [investments80C, setInvestments80C] = useState("150000");
  const [insurance80D, setInsurance80D] = useState("25000");
  const [nps80CCD, setNps80CCD] = useState("50000");
  const [result, setResult] = useState({
    annualTaxableIncome: 0,
    totalAnnualTax: 0,
    monthlyTDS: 0,
    effectiveMonthlyTakeHome: 0,
    monthlyRows: [] as Array<{ month: string; tds: number }>,
  });

  useEffect(() => {
    const basic = toNum(monthlyBasic);
    const hra = toNum(monthlyHRA);
    const other = toNum(otherAllowances);
    const pf = toNum(employerPF);
    const rent = toNum(rentPaid);

    const annualBasic = basic * 12;
    const annualHRA = hra * 12;
    const annualOther = other * 12;
    const annualPF = pf * 12;
    const annualRent = rent * 12;

    const hraLimitByCity = annualBasic * (cityType === "metro" ? 0.5 : 0.4);
    const rentMinus10pctBasic = Math.max(0, annualRent - annualBasic * 0.1);
    const hraExempt = Math.max(0, Math.min(annualHRA, hraLimitByCity, rentMinus10pctBasic));

    const grossAnnual = annualBasic + annualHRA + annualOther + annualPF;
    const deductions = Math.min(toNum(investments80C), 150000) + Math.min(toNum(insurance80D), 25000) + Math.min(toNum(nps80CCD), 50000) + 75000;
    const annualTaxableIncome = Math.max(0, grossAnnual - hraExempt - deductions);

    const tax = calculateSlabTax(annualTaxableIncome, NEW_REGIME_SLABS).baseTax;
    const totalAnnualTax = tax * 1.04;
    const monthlyTDS = Math.max(0, totalAnnualTax / 12);
    const effectiveMonthlyTakeHome = basic + hra + other - monthlyTDS;

    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const monthlyRows = months.map((month) => ({ month, tds: monthlyTDS }));

    setResult({ annualTaxableIncome, totalAnnualTax, monthlyTDS, effectiveMonthlyTakeHome, monthlyRows });
  }, [monthlyBasic, monthlyHRA, otherAllowances, employerPF, rentPaid, cityType, investments80C, insurance80D, nps80CCD]);

  return (
    <CalculatorShell
      title="TDS on Salary Calculator (Section 192)"
      subtitle="Annual tax estimation and equal monthly TDS projection"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Monthly Basic" value={monthlyBasic} onChange={setMonthlyBasic} />
          <MoneyInput label="Monthly HRA" value={monthlyHRA} onChange={setMonthlyHRA} />
          <MoneyInput label="Other Allowances" value={otherAllowances} onChange={setOtherAllowances} />
          <MoneyInput label="Employer PF" value={employerPF} onChange={setEmployerPF} />
          <MoneyInput label="Rent Paid" value={rentPaid} onChange={setRentPaid} />

          <Field label="City Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["metro", "non-metro"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCityType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all capitalize",
                    cityType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <MoneyInput label="Investments 80C" value={investments80C} onChange={setInvestments80C} />
          <MoneyInput label="Insurance 80D" value={insurance80D} onChange={setInsurance80D} />
          <MoneyInput label="NPS 80CCD" value={nps80CCD} onChange={setNps80CCD} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Annual Taxable Income" value={formatINR(result.annualTaxableIncome)} />
            <MiniStat label="Total Annual Tax" value={formatINR(result.totalAnnualTax)} />
            <MiniStat label="Monthly TDS" value={formatINR(result.monthlyTDS)} />
            <MiniStat label="Effective Monthly Take Home" value={formatINR(result.effectiveMonthlyTakeHome)} green />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Month-wise TDS Schedule</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Month</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">TDS</th>
                  </tr>
                </thead>
                <tbody>
                  {result.monthlyRows.map((row, index) => (
                    <tr key={row.month} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.month}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.tds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            TDS adjusted in Dec/Jan if investments not submitted.
          </div>
        </div>
      )}
    />
  );
}

function GSTCompositionCalc() {
  const [businessType, setBusinessType] = useState<"Manufacturer" | "Trader" | "Restaurant" | "Service">("Manufacturer");
  const [annualTurnover, setAnnualTurnover] = useState("12000000");
  const [quarterlyTurnover, setQuarterlyTurnover] = useState("3000000");
  const [result, setResult] = useState({
    compositionTaxAnnual: 0,
    compositionTaxQuarterly: 0,
    regularGSTEstimate: 0,
    potentialSaving: 0,
    eligibilityStatus: "",
    cgstShare: 0,
    sgstShare: 0,
  });

  useEffect(() => {
    const annual = toNum(annualTurnover);
    const quarterly = toNum(quarterlyTurnover);

    const compositionRateMap = {
      Manufacturer: 1,
      Trader: 1,
      Restaurant: 5,
      Service: 6,
    } as const;

    const regularRateMap = {
      Manufacturer: 12,
      Trader: 12,
      Restaurant: 18,
      Service: 18,
    } as const;

    const rate = compositionRateMap[businessType];
    const annualTax = annual * rate / 100;
    const quarterTax = quarterly * rate / 100;
    const regularGSTEstimate = annual * regularRateMap[businessType] / 100;
    const potentialSaving = Math.max(0, regularGSTEstimate - annualTax);
    const eligibilityStatus = annual <= 15000000 ? "Eligible under ₹1.5 Cr limit" : "Not eligible (turnover above ₹1.5 Cr)";

    setResult({
      compositionTaxAnnual: annualTax,
      compositionTaxQuarterly: quarterTax,
      regularGSTEstimate,
      potentialSaving,
      eligibilityStatus,
      cgstShare: annualTax / 2,
      sgstShare: annualTax / 2,
    });
  }, [businessType, annualTurnover, quarterlyTurnover]);

  return (
    <CalculatorShell
      title="GST Composition Scheme Calculator"
      subtitle="Composition liability vs regular GST estimate"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Business Type">
            <div className="grid grid-cols-2 gap-2">
              {(["Manufacturer", "Trader", "Restaurant", "Service"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setBusinessType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md border transition-all",
                    businessType === item
                      ? "bg-gradient-orange text-white glow-orange border-transparent"
                      : "text-secondary border-white/10 hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <MoneyInput label="Annual Turnover" value={annualTurnover} onChange={setAnnualTurnover} />
          <MoneyInput label="Quarterly Turnover" value={quarterlyTurnover} onChange={setQuarterlyTurnover} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Composition Tax (Annual)" value={formatINR(result.compositionTaxAnnual)} />
            <MiniStat label="Composition Tax (Quarterly)" value={formatINR(result.compositionTaxQuarterly)} />
            <MiniStat label="Regular GST Estimate" value={formatINR(result.regularGSTEstimate)} />
            <MiniStat label="Potential Saving" value={formatINR(result.potentialSaving)} green />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Eligibility: <span className="text-white font-medium">{result.eligibilityStatus}</span>. Lower threshold of ₹75L may apply in some states.
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Cannot claim ITC under composition scheme.
          </div>
        </div>
      )}
    />
  );
}

function ExportGSTCalc() {
  const [exportValue, setExportValue] = useState("5000000");
  const [exportType, setExportType] = useState<"Goods" | "Services">("Goods");
  const [hasLUT, setHasLUT] = useState(true);
  const [igstPaidOnInputs, setIgstPaidOnInputs] = useState("300000");
  const [refundType, setRefundType] = useState<"Refund of IGST" | "ITC Refund">("ITC Refund");
  const [result, setResult] = useState({
    exportValue: 0,
    igstLiability: 0,
    refundAmount: 0,
  });

  useEffect(() => {
    const value = toNum(exportValue);
    const itc = toNum(igstPaidOnInputs);
    const igstOnExport = hasLUT ? 0 : value * 0.18;
    const refundAmount = hasLUT ? itc : igstOnExport;

    setResult({
      exportValue: value,
      igstLiability: igstOnExport,
      refundAmount,
    });
  }, [exportValue, hasLUT, igstPaidOnInputs, refundType, exportType]);

  return (
    <CalculatorShell
      title="GST on Exports Calculator"
      subtitle="Zero-rated export treatment with LUT and refund paths"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Export Value" value={exportValue} onChange={setExportValue} />

          <Field label="Export Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["Goods", "Services"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setExportType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    exportType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Has LUT">
            <button
              onClick={() => setHasLUT((v) => !v)}
              className={cn(
                "w-full py-2 text-sm font-medium rounded-md transition-all border",
                hasLUT
                  ? "bg-gradient-orange text-white glow-orange border-transparent"
                  : "text-secondary border-white/10 hover:text-white"
              )}
            >
              {hasLUT ? "Yes" : "No"}
            </button>
          </Field>

          <MoneyInput label="IGST Paid on Inputs" value={igstPaidOnInputs} onChange={setIgstPaidOnInputs} />

          <Field label="Refund Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["Refund of IGST", "ITC Refund"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setRefundType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    refundType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Export Value" value={formatINR(result.exportValue)} />
            <MiniStat label="IGST Liability" value={formatINR(result.igstLiability)} />
            <MiniStat label="Refund Amount" value={formatINR(result.refundAmount)} green />
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Filing LUT is recommended to avoid cash flow blockage.
          </div>
          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Reporting: GSTR-1 required. Refund application through Form RFD-01.
          </div>
          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Typical timeline: Refund processed within 60 days.
          </div>
        </div>
      )}
    />
  );
}

function MISCalc() {
  const [investmentAmount, setInvestmentAmount] = useState("900000");
  const [accountType, setAccountType] = useState<"Single" | "Joint">("Single");
  const [result, setResult] = useState({
    monthlyPayout: 0,
    totalInterestEarned: 0,
    maturityAmount: 0,
    fdMaturity: 0,
    sipFutureValue: 0,
  });

  useEffect(() => {
    const maxLimit = accountType === "Single" ? 900000 : 1500000;
    const principal = Math.min(toNum(investmentAmount), maxLimit);
    const monthlyPayout = principal * 7.4 / 100 / 12;
    const totalInterestEarned = monthlyPayout * 60;
    const maturityAmount = principal;

    const fdMaturity = principal * (1 + 0.07 / 4) ** (4 * 5);
    const monthlySip = principal / 60;
    const r = 0.12 / 12;
    const sipFutureValue = r > 0 ? monthlySip * (((1 + r) ** 60 - 1) / r) * (1 + r) : monthlySip * 60;

    setResult({ monthlyPayout, totalInterestEarned, maturityAmount, fdMaturity, sipFutureValue });
  }, [investmentAmount, accountType]);

  return (
    <CalculatorShell
      title="Post Office MIS Calculator"
      subtitle="Fixed monthly income with principal returned after 5 years"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput
            label={accountType === "Single" ? "Investment Amount (Max ₹9L)" : "Investment Amount (Max ₹15L)"}
            value={investmentAmount}
            onChange={setInvestmentAmount}
          />
          <Field label="Account Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["Single", "Joint"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setAccountType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    accountType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Tenure">
            <input value="5 years (fixed)" disabled className="glass-input w-full h-11 px-3 text-sm opacity-80" />
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Monthly Payout" value={formatINR(result.monthlyPayout)} green />
            <MiniStat label="Total Interest Earned" value={formatINR(result.totalInterestEarned)} />
            <MiniStat label="Maturity Amount (Principal)" value={formatINR(result.maturityAmount)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">FD at 7% (5Y)</div>
              <div className="mt-2 text-xl font-bold text-gradient-orange">{formatINR(result.fdMaturity)}</div>
            </div>
            <div className="card-surface p-4">
              <div className="text-xs uppercase tracking-wide text-tertiary">SIP at 12% (same total outlay)</div>
              <div className="mt-2 text-xl font-bold text-gradient-orange">{formatINR(result.sipFutureValue)}</div>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            No compounding in MIS, fixed monthly payout. Interest is taxable. TDS applicable if interest &gt; ₹40,000/year.
          </div>
        </div>
      )}
    />
  );
}

function SSYCalc() {
  const [annualDeposit, setAnnualDeposit] = useState("150000");
  const [girlAge, setGirlAge] = useState("2");
  const [startYear, setStartYear] = useState(String(new Date().getFullYear()));
  const [result, setResult] = useState({
    maturityAmount: 0,
    totalDeposited: 0,
    totalInterest: 0,
    maturityYear: 0,
    girlAgeAtMaturity: 0,
    rows: [] as Array<{ year: number; age: number; deposit: number; interest: number; closingBalance: number }>,
  });

  useEffect(() => {
    const deposit = Math.min(150000, Math.max(250, toNum(annualDeposit)));
    const age = Math.min(10, Math.max(0, Math.floor(toNum(girlAge))));
    const openYear = Math.floor(toNum(startYear));
    const rate = 0.082;

    let balance = 0;
    let totalDeposited = 0;
    const rows: Array<{ year: number; age: number; deposit: number; interest: number; closingBalance: number }> = [];

    for (let i = 1; i <= 21; i += 1) {
      const depositThisYear = i <= 15 ? deposit : 0;
      const openingWithDeposit = balance + depositThisYear;
      const interest = openingWithDeposit * rate;
      balance = openingWithDeposit + interest;
      totalDeposited += depositThisYear;
      rows.push({
        year: openYear + i - 1,
        age: age + i,
        deposit: depositThisYear,
        interest,
        closingBalance: balance,
      });
    }

    const maturityAmount = balance;
    const totalInterest = maturityAmount - totalDeposited;
    const maturityYear = openYear + 20;
    const girlAgeAtMaturity = age + 21;

    setResult({ maturityAmount, totalDeposited, totalInterest, maturityYear, girlAgeAtMaturity, rows });
  }, [annualDeposit, girlAge, startYear]);

  return (
    <CalculatorShell
      title="Sukanya Samriddhi Yojana Calculator"
      subtitle="15-year deposit period with maturity at 21 years"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Annual Deposit (₹250 to ₹1.5L)" value={annualDeposit} onChange={setAnnualDeposit} />
          <NumberInput label="Girl Age (0-10)" value={girlAge} onChange={setGirlAge} />
          <NumberInput label="Start Year" value={startYear} onChange={setStartYear} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Maturity Amount" value={formatINR(result.maturityAmount)} green />
            <MiniStat label="Total Deposited" value={formatINR(result.totalDeposited)} />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
            <MiniStat label="Maturity Year" value={result.maturityYear.toLocaleString("en-IN")} />
            <MiniStat label="Girl Age At Maturity" value={result.girlAgeAtMaturity.toLocaleString("en-IN")} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Year-wise SSY Projection</div>
            <div className="overflow-x-auto -mx-5 max-h-72">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary sticky top-0">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Year</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Age</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Deposit</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Interest</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Closing Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={row.year} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.year.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right">{row.age.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.deposit)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.interest)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Fully exempt under EEE — deposit, interest and maturity all tax-free.
          </div>
        </div>
      )}
    />
  );
}

function NPSCalc() {
  const [monthlyContribution, setMonthlyContribution] = useState("10000");
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("60");
  const [expectedReturn, setExpectedReturn] = useState("10");
  const [annuityRate, setAnnuityRate] = useState("6");
  const [result, setResult] = useState({
    corpusAtRetirement: 0,
    lumpsum: 0,
    annuityAmount: 0,
    estimatedMonthlyPension: 0,
    totalInvested: 0,
    wealthGained: 0,
    taxBenefit80CCD: 0,
  });

  useEffect(() => {
    const monthly = toNum(monthlyContribution);
    const ageNow = Math.floor(toNum(currentAge));
    const retireAge = Math.max(ageNow + 1, Math.floor(toNum(retirementAge)));
    const years = Math.max(0, retireAge - ageNow);
    const annualReturn = toNum(expectedReturn);
    const annRate = toNum(annuityRate);

    const n = years * 12;
    const r = annualReturn / 12 / 100;
    const corpusAtRetirement = r === 0
      ? monthly * n
      : monthly * (((1 + r) ** n - 1) / r) * (1 + r);

    const mandatoryAnnuity = corpusAtRetirement * 0.4;
    const lumpsum = corpusAtRetirement * 0.6;
    const estimatedMonthlyPension = mandatoryAnnuity * annRate / 100 / 12;
    const totalInvested = monthly * n;
    const wealthGained = Math.max(0, corpusAtRetirement - totalInvested);

    const yearlyContribution = monthly * 12;
    const taxEligible = Math.min(yearlyContribution, 50000);
    const taxBenefit80CCD = taxEligible * 0.3;

    setResult({
      corpusAtRetirement,
      lumpsum,
      annuityAmount: mandatoryAnnuity,
      estimatedMonthlyPension,
      totalInvested,
      wealthGained,
      taxBenefit80CCD,
    });
  }, [monthlyContribution, currentAge, retirementAge, expectedReturn, annuityRate]);

  return (
    <CalculatorShell
      title="NPS (National Pension System) Calculator"
      subtitle="Retirement corpus, mandatory annuity and pension estimate"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} />
          <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} />
          <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} />
          <NumberInput label="Expected Return (%)" value={expectedReturn} onChange={setExpectedReturn} />
          <NumberInput label="Annuity Rate (%)" value={annuityRate} onChange={setAnnuityRate} />
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Corpus At Retirement" value={formatINR(result.corpusAtRetirement)} green />
            <MiniStat label="Lumpsum (60%)" value={formatINR(result.lumpsum)} />
            <MiniStat label="Annuity Amount (40%)" value={formatINR(result.annuityAmount)} />
            <MiniStat label="Estimated Monthly Pension" value={formatINR(result.estimatedMonthlyPension)} />
            <MiniStat label="Total Invested" value={formatINR(result.totalInvested)} />
            <MiniStat label="Wealth Gained" value={formatINR(result.wealthGained)} />
            <MiniStat label="Tax Benefit 80CCD (30% slab)" value={formatINR(result.taxBenefit80CCD)} green />
          </div>
        </div>
      )}
    />
  );
}

function SCFDCalc() {
  const [principal, setPrincipal] = useState("1000000");
  const [tenureMonths, setTenureMonths] = useState("36");
  const [bankName, setBankName] = useState<"SBI" | "HDFC" | "ICICI" | "Post Office TD" | "Small Finance Banks">("SBI");
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(true);
  const [result, setResult] = useState({
    maturityAmount: 0,
    totalInterest: 0,
    effectiveYield: 0,
    tdsDeductible: 0,
    netInterest: 0,
    comparisons: [] as Array<{ bank: string; rate: number; maturity: number; interest: number }>,
  });

  useEffect(() => {
    const p = toNum(principal);
    const months = Math.max(1, Math.floor(toNum(tenureMonths)));
    const years = months / 12;

    const rates = {
      SBI: { regular: 6.5, senior: 7.0 },
      HDFC: { regular: 7.0, senior: 7.5 },
      ICICI: { regular: 7.0, senior: 7.5 },
      "Post Office TD": { regular: 7.5, senior: 7.5 },
      "Small Finance Banks": { regular: 8.5, senior: 9.0 },
    } as const;

    const selectedRate = isSeniorCitizen ? rates[bankName].senior : rates[bankName].regular;
    const maturityAmount = p * (1 + selectedRate / 100 / 4) ** (4 * years);
    const totalInterest = Math.max(0, maturityAmount - p);
    const effectiveYield = p > 0 ? ((maturityAmount / p) ** (1 / years) - 1) * 100 : 0;

    const tdsThreshold = isSeniorCitizen ? 50000 : 40000;
    const tdsDeductible = totalInterest > tdsThreshold ? totalInterest * 0.1 : 0;
    const netInterest = totalInterest - tdsDeductible;

    const comparisons = Object.entries(rates).map(([bank, rateObj]) => {
      const rate = isSeniorCitizen ? rateObj.senior : rateObj.regular;
      const maturity = p * (1 + rate / 100 / 4) ** (4 * years);
      return { bank, rate, maturity, interest: Math.max(0, maturity - p) };
    });

    setResult({ maturityAmount, totalInterest, effectiveYield, tdsDeductible, netInterest, comparisons });
  }, [principal, tenureMonths, bankName, isSeniorCitizen]);

  return (
    <CalculatorShell
      title="Senior Citizen FD & Savings Calculator"
      subtitle="Quarterly-compounded FD comparison with TDS impact"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>
          <MoneyInput label="Principal" value={principal} onChange={setPrincipal} />
          <NumberInput label="Tenure (Months)" value={tenureMonths} onChange={setTenureMonths} />

          <Field label="Bank / Institution">
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value as "SBI" | "HDFC" | "ICICI" | "Post Office TD" | "Small Finance Banks")}
              className="glass-input w-full h-11 px-3 text-sm"
            >
              {["SBI", "HDFC", "ICICI", "Post Office TD", "Small Finance Banks"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Senior Citizen">
            <button
              onClick={() => setIsSeniorCitizen((v) => !v)}
              className={cn(
                "w-full py-2 text-sm font-medium rounded-md transition-all border",
                isSeniorCitizen
                  ? "bg-gradient-orange text-white glow-orange border-transparent"
                  : "text-secondary border-white/10 hover:text-white"
              )}
            >
              {isSeniorCitizen ? "Yes" : "No"}
            </button>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Maturity Amount" value={formatINR(result.maturityAmount)} green />
            <MiniStat label="Total Interest" value={formatINR(result.totalInterest)} />
            <MiniStat label="Effective Yield (%)" value={formatPct(result.effectiveYield)} />
            <MiniStat label="TDS Deductible" value={formatINR(result.tdsDeductible)} />
            <MiniStat label="Net Interest after TDS" value={formatINR(result.netInterest)} />
          </div>

          <div className="card-surface p-5 overflow-hidden">
            <div className="text-sm font-semibold mb-3">Rate & Maturity Comparison</div>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-tertiary">
                    <th className="text-left font-medium px-5 py-2 bg-primary/10">Bank</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Rate</th>
                    <th className="text-right font-medium px-3 py-2 bg-primary/10">Maturity</th>
                    <th className="text-right font-medium px-5 py-2 bg-primary/10">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparisons.map((row, index) => (
                    <tr key={row.bank} className={index % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-5 py-2 text-secondary">{row.bank}</td>
                      <td className="px-3 py-2 text-right">{formatPct(row.rate)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.maturity)}</td>
                      <td className="px-5 py-2 text-right font-medium">{formatINR(row.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Form 15H can be submitted by eligible senior citizens to avoid TDS.
          </div>
        </div>
      )}
    />
  );
}

function GratuityEligibilityCalc() {
  const [employeeType, setEmployeeType] = useState<"Covered" | "Not Covered">("Covered");
  const [lastDrawnBasic, setLastDrawnBasic] = useState("80000");
  const [daPay, setDaPay] = useState("10000");
  const [dateOfJoining, setDateOfJoining] = useState("2019-04-01");
  const [dateOfLeaving, setDateOfLeaving] = useState("2026-04-10");
  const [reasonForLeaving, setReasonForLeaving] = useState<"Resignation" | "Retirement" | "Death" | "Disability">("Resignation");
  const [result, setResult] = useState({
    exactServicePeriod: "0 years, 0 months, 0 days",
    isEligible: false,
    gratuityAmount: 0,
    taxExemptAmount: 0,
    taxableGratuity: 0,
    appliedFourYearRule: false,
    serviceYearsForCalc: 0,
  });

  useEffect(() => {
    const basic = toNum(lastDrawnBasic);
    const da = toNum(daPay);
    const doj = new Date(dateOfJoining);
    const dol = new Date(dateOfLeaving);

    const msDiff = Math.max(0, dol.getTime() - doj.getTime());
    const totalDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));

    let years = dol.getFullYear() - doj.getFullYear();
    let months = dol.getMonth() - doj.getMonth();
    let days = dol.getDate() - doj.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(dol.getFullYear(), dol.getMonth(), 0).getDate();
      days += prevMonth;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const exactServicePeriod = `${Math.max(0, years)} years, ${Math.max(0, months)} months, ${Math.max(0, days)} days`;
    const yearsCompleted = Math.max(0, years);
    const remainingDaysApprox = Math.max(0, totalDays - yearsCompleted * 365);
    const fourYearRuleApplies = reasonForLeaving === "Resignation" && yearsCompleted === 4 && remainingDaysApprox >= 240;

    const isEligible = reasonForLeaving === "Death" || reasonForLeaving === "Disability"
      ? true
      : yearsCompleted >= 5 || fourYearRuleApplies;

    const serviceYearsForCalc = yearsCompleted + (months >= 6 ? 1 : 0) + (fourYearRuleApplies ? 1 : 0);
    const salaryBase = basic + da;
    const gratuityAmount = isEligible
      ? employeeType === "Covered"
        ? salaryBase * 15 / 26 * serviceYearsForCalc
        : salaryBase * 15 / 30 * serviceYearsForCalc
      : 0;

    const exemptByFormula = salaryBase * 15 / 26 * serviceYearsForCalc;
    const taxExemptAmount = Math.min(gratuityAmount, 2000000, exemptByFormula);
    const taxableGratuity = Math.max(0, gratuityAmount - taxExemptAmount);

    setResult({
      exactServicePeriod,
      isEligible,
      gratuityAmount,
      taxExemptAmount,
      taxableGratuity,
      appliedFourYearRule: fourYearRuleApplies,
      serviceYearsForCalc,
    });
  }, [employeeType, lastDrawnBasic, daPay, dateOfJoining, dateOfLeaving, reasonForLeaving]);

  return (
    <CalculatorShell
      title="Gratuity Eligibility & Computation (Detailed)"
      subtitle="Service period-based eligibility with tax exemption calculation"
      inputPanel={(
        <div className="card-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

          <Field label="Employee Type">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
              {(["Covered", "Not Covered"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setEmployeeType(item)}
                  className={cn(
                    "py-2 text-xs font-medium rounded-md transition-all",
                    employeeType === item ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Field>

          <MoneyInput label="Last Drawn Basic" value={lastDrawnBasic} onChange={setLastDrawnBasic} />
          <MoneyInput label="DA (monthly)" value={daPay} onChange={setDaPay} />

          <Field label="Date of Joining">
            <input type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} className="glass-input w-full h-11 px-3 text-sm" />
          </Field>

          <Field label="Date of Leaving">
            <input type="date" value={dateOfLeaving} onChange={(e) => setDateOfLeaving(e.target.value)} className="glass-input w-full h-11 px-3 text-sm" />
          </Field>

          <Field label="Reason for Leaving">
            <select
              value={reasonForLeaving}
              onChange={(e) => setReasonForLeaving(e.target.value as "Resignation" | "Retirement" | "Death" | "Disability")}
              className="glass-input w-full h-11 px-3 text-sm"
            >
              {(["Resignation", "Retirement", "Death", "Disability"] as const).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>
        </div>
      )}
      outputPanel={(
        <div className="space-y-4">
          <div className="card-surface p-4 border border-white/10 text-sm text-secondary">
            Exact Service Period: <span className="text-white font-medium">{result.exactServicePeriod}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat label="Eligibility" value={result.isEligible ? "Eligible" : "Not Eligible"} green={result.isEligible} />
            <MiniStat label="Service Years For Computation" value={result.serviceYearsForCalc.toLocaleString("en-IN")} />
            <MiniStat label="Gratuity Amount" value={formatINR(result.gratuityAmount)} />
            <MiniStat label="Tax Exempt Amount" value={formatINR(result.taxExemptAmount)} green />
            <MiniStat label="Taxable Gratuity" value={formatINR(result.taxableGratuity)} />
          </div>

          {result.appliedFourYearRule && (
            <div className="card-surface p-4 border border-warning/40 text-sm text-warning">
              4 years + 240 days rule applied for resignation eligibility.
            </div>
          )}
        </div>
      )}
    />
  );
}

function CalculatorShell({
  title,
  subtitle,
  inputPanel,
  outputPanel,
}: {
  title: string;
  subtitle: string;
  inputPanel: JSX.Element;
  outputPanel: JSX.Element;
}) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-secondary text-sm">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div>{inputPanel}</div>
        <div>{outputPanel}</div>
      </div>
    </>
  );
}

function ComingSoonCard({ slug }: { slug: string }) {
  return (
    <div className="card-surface p-10 text-center max-w-3xl mx-auto">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 grid place-items-center mb-4">
        <Calculator className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold capitalize">{slug.replace(/-/g, " ")}</h1>
      <p className="mt-2 text-secondary">Coming soon</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-secondary mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function MoneyInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">₹</span>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="0"
          className="glass-input w-full h-11 pl-8 pr-3 text-sm"
        />
      </div>
    </Field>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder="0"
        className="glass-input w-full h-11 px-3 text-sm"
      />
    </Field>
  );
}

function MiniStat({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="card-surface p-3">
      <div className="text-[10px] uppercase tracking-wide text-tertiary">{label}</div>
      <div className={cn("mt-1 text-base font-bold", green && "text-success")}>{value}</div>
    </div>
  );
}
