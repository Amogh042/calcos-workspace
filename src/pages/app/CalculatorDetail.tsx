import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronRight, Calculator, Upload, Download, Save, Sparkles,
  Share2, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FY = ["FY 2024-25", "FY 2023-24", "FY 2022-25"];
const AGE = ["Below 60", "60-80", "Above 80"];

export default function CalculatorDetail() {
  const { slug = "income-tax" } = useParams();
  const [income, setIncome] = useState("");
  const [fy, setFy] = useState(FY[0]);
  const [regime, setRegime] = useState<"old" | "new">("new");
  const [age, setAge] = useState(AGE[0]);
  const [calculated, setCalculated] = useState(false);

  const fmt = (n: number) => "₹ " + n.toLocaleString("en-IN");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link to="/dashboard" className="hover:text-white">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/calculators/tax" className="hover:text-white">Tax Tools</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white capitalize">{slug.replace(/-/g, " ")}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income Tax Calculator</h1>
          <p className="mt-1 text-secondary text-sm flex items-center gap-2 flex-wrap">
            Slab-wise tax for FY 2024-25
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-card border border-white/10 text-xs">
              🇮🇳 India
            </span>
          </p>
        </div>
        <div className="text-xs text-tertiary">
          Last calculated: <span className="text-secondary">{calculated ? "Just now" : "Never"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* INPUTS */}
        <div className="space-y-4">
          <div className="card-surface p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tertiary">Inputs</h2>

            <Field label="Annual Income">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">₹</span>
                <input
                  inputMode="numeric"
                  value={income}
                  onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  className="w-full h-11 pl-8 pr-3 rounded-lg bg-card-elevated border border-white/10 text-base font-medium focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
                {income && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-tertiary">
                    {Number(income).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </Field>

            <Field label="Financial Year">
              <select
                value={fy}
                onChange={(e) => setFy(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-card-elevated border border-white/10 text-sm focus:outline-none focus:border-primary/40"
              >
                {FY.map((f) => <option key={f}>{f}</option>)}
              </select>
            </Field>

            <Field label="Tax Regime">
              <div className="grid grid-cols-2 p-1 rounded-lg bg-card-elevated border border-white/10">
                {(["old", "new"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegime(r)}
                    className={cn(
                      "py-2 text-sm font-medium rounded-md transition-all capitalize",
                      regime === r ? "bg-gradient-orange text-white glow-orange" : "text-secondary hover:text-white"
                    )}
                  >
                    {r} Regime
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Age Group">
              <div className="flex gap-2">
                {AGE.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-pill text-xs font-medium border transition-all",
                      age === a
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "bg-card-elevated border-white/10 text-secondary hover:border-primary/30"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Basic Salary (optional, for HRA)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">₹</span>
                <input
                  placeholder="0"
                  className="w-full h-11 pl-8 pr-3 rounded-lg bg-card-elevated border border-white/10 text-sm focus:outline-none focus:border-primary/40"
                />
              </div>
            </Field>

            <button
              onClick={() => setCalculated(true)}
              className="w-full h-12 rounded-lg bg-gradient-orange text-white font-semibold glow-orange hover:glow-orange-strong transition-all flex items-center justify-center gap-2"
            >
              Calculate Tax →
            </button>
            <button
              onClick={() => { setIncome(""); setCalculated(false); }}
              className="w-full text-xs text-tertiary hover:text-white flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <div className="card-surface p-5 border-dashed">
            <button className="w-full flex flex-col items-center gap-2 py-4 text-secondary hover:text-white transition-colors">
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Import from Excel</span>
              <span className="text-xs text-tertiary">Or drop a salary slip PDF here</span>
            </button>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="space-y-4">
          {!calculated ? (
            <div className="card-surface p-10 text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 grid place-items-center mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div className="font-semibold">Enter your income to see results</div>
              <div className="mt-1 text-xs text-secondary">Results update instantly</div>
            </div>
          ) : (
            <>
              <div className="card-surface p-6">
                <div className="text-xs text-tertiary uppercase tracking-wide font-medium">Total Tax Payable</div>
                <div className="mt-2 text-4xl md:text-5xl font-bold text-gradient-orange">{fmt(239200)}</div>
                <div className="mt-2 text-sm text-secondary">Effective Rate: <span className="text-white font-medium">11.9%</span></div>
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
                      {[
                        ["Up to ₹3L", "3,00,000", "0%", "0"],
                        ["₹3L - ₹7L", "4,00,000", "5%", "20,000"],
                        ["₹7L - ₹10L", "3,00,000", "10%", "30,000"],
                        ["₹10L - ₹12L", "2,00,000", "15%", "30,000"],
                        ["₹12L - ₹15L", "3,00,000", "20%", "60,000"],
                        ["Above ₹15L", "3,00,000", "30%", "90,000"],
                        ["Cess (4%)", "—", "4%", "9,200"],
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 ? "bg-white/[0.02]" : ""}>
                          <td className="px-5 py-2 text-secondary">{row[0]}</td>
                          <td className="px-3 py-2 text-right">{row[1]}</td>
                          <td className="px-3 py-2 text-right text-tertiary">{row[2]}</td>
                          <td className="px-5 py-2 text-right font-medium">{row[3]}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-primary/20 bg-primary/5">
                        <td className="px-5 py-2.5 font-bold">Total</td>
                        <td colSpan={2}></td>
                        <td className="px-5 py-2.5 text-right font-bold text-primary">₹ 2,39,200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-surface p-5">
                <div className="text-sm font-semibold mb-3">Income vs Tax</div>
                <div className="space-y-2">
                  {[
                    { label: "Total Income", val: 1800000, color: "bg-card-elevated", text: "₹ 18,00,000" },
                    { label: "Total Tax", val: 239200, color: "bg-gradient-orange", text: "₹ 2,39,200" },
                    { label: "Take Home", val: 1560800, color: "bg-success/70", text: "₹ 15,60,800" },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-secondary">{b.label}</span>
                        <span className="font-medium">{b.text}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full`} style={{ width: `${(b.val / 1800000) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MiniStat label="Monthly Tax" value="₹17,850" />
                <MiniStat label="Take-home/mo" value="₹1,30,067" />
                <MiniStat label="vs Old Regime" value="₹24,600" green />
              </div>

              <div className="card-surface p-3 flex flex-wrap gap-2">
                <ActionBtn icon={Download} label="Export PDF" />
                <ActionBtn icon={Save} label="Save to Client" />
                <ActionBtn icon={Sparkles} label="Ask CalcAI" highlight />
                <ActionBtn icon={Share2} label="Share" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-secondary mb-1.5">{label}</label>
    {children}
  </div>
);

const MiniStat = ({ label, value, green }: { label: string; value: string; green?: boolean }) => (
  <div className="card-surface p-3">
    <div className="text-[10px] uppercase tracking-wide text-tertiary">{label}</div>
    <div className={cn("mt-1 text-base font-bold", green && "text-success")}>{value}</div>
  </div>
);

const ActionBtn = ({ icon: Icon, label, highlight }: any) => (
  <button className={cn(
    "flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
    highlight
      ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
      : "border-white/10 text-secondary hover:border-primary/40 hover:text-white"
  )}>
    <Icon className="h-3.5 w-3.5" /> {label}
  </button>
);
