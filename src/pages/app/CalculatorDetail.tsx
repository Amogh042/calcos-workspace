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
