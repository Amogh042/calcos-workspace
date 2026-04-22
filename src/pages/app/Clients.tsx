import { useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Clients() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-secondary">Manage your client roster and their compliance.</p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="px-4 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange hover:glow-orange-strong transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total clients", v: "0" },
          { l: "Active", v: "0" },
          { l: "Filings due", v: "0", accent: true },
        ].map((s) => (
          <div key={s.l} className="card-surface p-4">
            <div className="text-xs text-tertiary uppercase tracking-wide">{s.l}</div>
            <div className={cn("mt-1 text-2xl font-bold", s.accent && "text-gradient-orange")}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tertiary" />
          <input placeholder="Search clients..." className="w-full h-10 pl-9 pr-3 rounded-lg bg-card border border-white/10 text-sm focus:outline-none focus:border-primary/40" />
        </div>
        <select className="h-10 px-3 rounded-lg bg-card border border-white/10 text-sm focus:outline-none focus:border-primary/40">
          <option>All types</option><option>Individual</option><option>Company</option><option>LLP</option>
        </select>
      </div>

      <div className="card-surface py-20 text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 grid place-items-center mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <div className="font-semibold">No clients yet</div>
        <div className="mt-1 text-sm text-secondary max-w-xs mx-auto">
          Add your first client to start tracking their calculations and filings
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="mt-5 px-5 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
          <div onClick={() => setShowDrawer(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <div className="relative w-full max-w-md h-full bg-card border-l border-white/10 p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Add Client</h3>
              <button onClick={() => setShowDrawer(false)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                ["Full Name", "text", "Acme Industries Pvt Ltd"],
                ["PAN", "text", "AAAAA0000A"],
                ["GST Number", "text", "27AAAAA0000A1Z5"],
                ["Email", "email", "client@example.com"],
                ["Phone", "tel", "+91 98765 43210"],
              ].map(([l, t, p]) => (
                <div key={l}>
                  <label className="block text-xs font-medium text-secondary mb-1.5">{l}</label>
                  <input type={t} placeholder={p as string} className="w-full h-10 px-3 rounded-lg bg-card-elevated border border-white/10 text-sm focus:outline-none focus:border-primary/40" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Type</label>
                <select className="w-full h-10 px-3 rounded-lg bg-card-elevated border border-white/10 text-sm">
                  <option>Individual</option><option>Company</option><option>LLP</option><option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Country</label>
                <select className="w-full h-10 px-3 rounded-lg bg-card-elevated border border-white/10 text-sm">
                  <option>🇮🇳 India</option><option>🇬🇧 UK</option><option>🇺🇸 US</option>
                </select>
              </div>
              <button className="w-full h-11 mt-2 rounded-lg bg-gradient-orange text-white font-semibold glow-orange">
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
