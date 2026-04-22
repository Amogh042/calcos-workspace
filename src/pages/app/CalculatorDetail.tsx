import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calculator, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const FY = ["FY 2024-25", "FY 2023-24", "FY 2022-23"];
const AGE = ["Below 60", "60-80", "Above 80"];

type CalculatorComponent = () => JSX.Element;

const calculatorRegistry: Record<string, CalculatorComponent> = {
  "income-tax": IncomeTaxCalc,
  emi: EMICalc,
  gst: GSTCalc,
  salary: SalaryCalc,
  sip: SIPCalc,
};

const titleMap: Record<string, string> = {
  "income-tax": "Income Tax Calculator",
  emi: "EMI Calculator",
  gst: "GST Calculator",
  salary: "Salary Breakup Calculator",
  sip: "SIP Calculator",
};

const categoryMap: Record<string, string> = {
  "income-tax": "tax",
  emi: "loans",
  gst: "gst",
  salary: "payroll",
  sip: "investment",
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
  const CalcComponent = calculatorRegistry[slug];
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
