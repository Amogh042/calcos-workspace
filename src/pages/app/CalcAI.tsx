import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Plus, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `You are CalcAI, an expert financial assistant built into CalcOS — a professional tool for Chartered Accountants and finance professionals.

You have deep knowledge of:
- Indian tax law: Income Tax Act, TDS, advance tax, capital gains, HRA, 80C/80D deductions
- GST: all slabs, GSTR filings, ITC, RCM, e-way bills
- Audit: ISA/SA standards, materiality, sampling, risk assessment
- Financial analysis: ratios, DCF, WACC, valuations
- Payroll: PF, ESI, gratuity, salary structuring
- UK tax: PAYE, NI, VAT, Self Assessment
- US tax: Federal brackets, FICA, 1040
- IFRS and Indian GAAP accounting standards

Rules:
- Always be specific and cite relevant sections (e.g. Section 80C, Section 194J, GSTR-3B)
- Give practical, actionable answers
- Use Indian number format (lakhs/crores) for Indian context
- Keep answers concise but complete
- If asked to calculate, show the working step by step
- Never give investment advice, only factual tax/accounting information`;

const suggestions = [
  { cat: "TAX",     q: "What is TDS rate for professional fees?" },
  { cat: "TAX",     q: "Explain old vs new regime for ₹12L income" },
  { cat: "AUDIT",   q: "How to calculate planning materiality?" },
  { cat: "AUDIT",   q: "What is statistical sampling in audit?" },
  { cat: "GST",     q: "What is Reverse Charge Mechanism?" },
  { cat: "GST",     q: "GST applicability on residential rent" },
  { cat: "PAYROLL", q: "How is gratuity calculated?" },
  { cat: "PAYROLL", q: "PF contribution rules and limits" },
];

const examples = [
  "Calculate income tax for ₹18L salary — new regime",
  "Difference between CGST, SGST and IGST",
  "Audit checklist for stock valuation",
  "TDS rates for FY 2025-26",
];

type Msg = { role: "user" | "ai"; text: string; error?: boolean };

async function askGemini(question: string, history: Msg[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "paste_your_key_here") {
    return "⚠️ Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file. Get a free key at aistudio.google.com";
  }

  const contents = [
    { role: "user",  parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Understood. I am CalcAI, ready to help with tax, audit, GST, and accounting questions." }] },
    ...history.slice(-8).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: question }] },
  ];

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `API error ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received.";
}

export default function CalcAI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await askGemini(text, [...messages, userMsg]);
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: "ai",
        text: `Error: ${e.message ?? "Something went wrong. Please try again."}`,
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="h-[calc(100vh-60px-2rem-3.5rem)] md:h-[calc(100vh-60px-4rem)] -mx-4 md:-mx-8 -my-6 md:-my-8 flex">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-white/[0.06] p-4"
        style={{ background: "rgba(255,255,255,0.02)" }}>

        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-gradient-orange grid place-items-center glow-orange">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-bold" style={{ color: "rgba(255,255,255,0.95)" }}>CalcAI</h2>
        </div>

        <button
          onClick={() => setMessages([])}
          className="w-full h-9 rounded-lg border border-white/10 hover:border-primary/40 hover:bg-primary/5 text-sm font-medium flex items-center justify-center gap-2 mb-5 transition-all"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          <Plus className="h-4 w-4" /> New chat
        </button>

        <div className="overflow-y-auto scrollbar-thin flex-1 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2 font-semibold px-1"
              style={{ color: "rgba(255,255,255,0.40)" }}>
              Suggested Questions
            </div>
            {Object.entries(
              suggestions.reduce<Record<string, string[]>>((acc, s) => {
                (acc[s.cat] ||= []).push(s.q); return acc;
              }, {})
            ).map(([cat, qs]) => (
              <div key={cat} className="mb-3">
                <div className="text-[10px] font-bold text-primary mb-1 px-1">{cat}</div>
                <div className="space-y-0.5">
                  {qs.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
                      style={{ color: "rgba(255,255,255,0.60)" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2 font-semibold px-1"
              style={{ color: "rgba(255,255,255,0.40)" }}>
              Recent
            </div>
            <div className="text-xs px-2 py-3 text-center"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              No conversations yet
            </div>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6">

          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-12 text-center">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-orange grid place-items-center glow-orange-strong mb-5 pulse-glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ask me anything about{" "}
                <span className="text-gradient-orange">finance</span>
              </h2>
              <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                I know Indian tax law, IFRS, GST, audit standards, and more
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                {examples.map((e) => (
                  <button
                    key={e}
                    onClick={() => send(e)}
                    className="card-surface p-4 text-left text-sm flex items-start gap-3 hover:border-primary/40 transition-all"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "ai" && (
                    <div className="h-8 w-8 rounded-lg bg-gradient-orange grid place-items-center shrink-0 mt-0.5">
                      {m.error
                        ? <AlertCircle className="h-4 w-4 text-white" />
                        : <Sparkles className="h-4 w-4 text-white" />
                      }
                    </div>
                  )}
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed",
                    m.role === "user"
                      ? "bg-gradient-orange text-white rounded-tr-sm"
                      : m.error
                        ? "card-surface rounded-tl-sm border border-destructive/30"
                        : "card-surface rounded-tl-sm"
                  )}
                    style={m.role === "ai" && !m.error
                      ? { color: "rgba(255,255,255,0.85)" }
                      : undefined
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-lg bg-gradient-orange grid place-items-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="card-surface rounded-tl-sm px-4 py-3 rounded-2xl flex items-center gap-2"
                    style={{ color: "rgba(255,255,255,0.50)" }}>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4"
          style={{ background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask CalcAI anything... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="glass-input w-full py-3 pl-4 pr-14 text-sm resize-none overflow-hidden"
                style={{
                  color: "rgba(255,255,255,0.90)",
                  minHeight: "48px",
                  maxHeight: "120px",
                }}
                onInput={e => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-gradient-orange grid place-items-center glow-orange hover:glow-orange-strong transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                  : <Send className="h-4 w-4 text-white" />
                }
              </button>
            </div>
            <div className="mt-2 flex justify-between text-[11px]"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <span>CalcAI may make errors. Verify critical tax figures.</span>
              <span>{input.length} / 2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}