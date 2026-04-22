import { useState } from "react";
import { Sparkles, Send, Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestions = [
  { cat: "TAX", q: "What is TDS rate for professional fees?" },
  { cat: "TAX", q: "Explain old vs new regime" },
  { cat: "AUDIT", q: "How to calculate materiality?" },
  { cat: "AUDIT", q: "Sample size formula" },
  { cat: "GST", q: "What is RCM?" },
  { cat: "GST", q: "GST on rent" },
  { cat: "PAYROLL", q: "How is gratuity calculated?" },
  { cat: "PAYROLL", q: "PF contribution rules" },
];

const examples = [
  "Calculate income tax for ₹15L salary",
  "Difference between CGST and IGST",
  "Audit checklist for stock valuation",
  "Latest TDS rates for FY 24-25",
];

type Msg = { role: "user" | "ai"; text: string };

export default function CalcAI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text };
    const aiMsg: Msg = {
      role: "ai",
      text: "Great question! This is a placeholder response. CalcAI integration will provide real-time tax, audit, and accounting guidance based on Indian and international standards.",
    };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-60px-2rem-3.5rem)] md:h-[calc(100vh-60px-4rem)] -mx-4 md:-mx-8 -my-6 md:-my-8 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-white/[0.06] bg-[hsl(var(--surface-sidebar))]/50 p-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-gradient-orange grid place-items-center glow-orange">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-bold">CalcAI</h2>
        </div>

        <button
          onClick={() => setMessages([])}
          className="w-full h-9 rounded-lg border border-white/10 hover:border-primary/40 hover:bg-primary/5 text-sm font-medium flex items-center justify-center gap-2 mb-5 transition-all"
        >
          <Plus className="h-4 w-4" /> New chat
        </button>

        <div className="overflow-y-auto scrollbar-thin -mr-2 pr-2 space-y-4 flex-1">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-tertiary mb-2 font-semibold">Suggested Questions</div>
            {Object.entries(
              suggestions.reduce<Record<string, string[]>>((acc, s) => {
                (acc[s.cat] ||= []).push(s.q); return acc;
              }, {})
            ).map(([cat, qs]) => (
              <div key={cat} className="mb-3">
                <div className="text-[10px] font-bold text-primary mb-1">{cat}</div>
                <div className="space-y-1">
                  {qs.map((q) => (
                    <button key={q} onClick={() => send(q)} className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-white/5 text-secondary hover:text-white transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-tertiary mb-2 font-semibold">Recent</div>
            <div className="text-xs text-tertiary px-2 py-3 text-center">No conversations yet</div>
          </div>
        </div>
      </aside>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-12 text-center">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-orange grid place-items-center glow-orange-strong mb-5 pulse-glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ask me anything about <span className="text-gradient-orange">finance</span>
              </h2>
              <p className="mt-2 text-secondary text-sm">
                I know Indian tax law, IFRS, GST, audit standards, and more
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                {examples.map((e) => (
                  <button
                    key={e}
                    onClick={() => send(e)}
                    className="card-surface p-4 text-left text-sm text-secondary hover:text-white flex items-start gap-3"
                  >
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {e}
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
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm max-w-[80%]",
                    m.role === "user"
                      ? "bg-gradient-orange text-white rounded-tr-sm"
                      : "card-surface rounded-tl-sm"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.06] bg-background/95 backdrop-blur p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CalcAI anything..."
                className="glass-input w-full h-12 pl-4 pr-14 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-gradient-orange grid place-items-center glow-orange hover:glow-orange-strong transition-all"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </form>
            <div className="mt-2 flex justify-between text-[11px] text-tertiary">
              <span>CalcAI may make errors. Verify critical tax figures.</span>
              <span>{input.length} / 2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
