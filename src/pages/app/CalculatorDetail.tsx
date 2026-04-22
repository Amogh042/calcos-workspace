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
