import { useState } from "react";
import { Plus, Search, Users, X, Building2, User, Briefcase, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Client = {
  name: string;
  pan: string;
  gst: string;
  email: string;
  phone: string;
  type: string;
  country: string;
  addedAt: string;
};

const typeIcons: Record<string, any> = {
  Individual:  User,
  Company:     Building2,
  LLP:         Briefcase,
  Partnership: Briefcase,
};

const typeColors: Record<string, string> = {
  Individual:  "bg-sky-500/15 text-sky-300",
  Company:     "bg-violet-500/15 text-violet-300",
  LLP:         "bg-emerald-500/15 text-emerald-300",
  Partnership: "bg-amber-500/15 text-amber-300",
};

export default function Clients() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [clients, setClients]       = useState<Client[]>([]);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");

  const [form, setForm] = useState({
    name: "", pan: "", gst: "", email: "",
    phone: "", type: "Individual", country: "🇮🇳 India",
  });

  const saveClient = () => {
    if (!form.name.trim()) return;
    const now = new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
    setClients(prev => [...prev, { ...form, addedAt: now }]);
    setForm({ name: "", pan: "", gst: "", email: "", phone: "", type: "Individual", country: "🇮🇳 India" });
    setShowDrawer(false);
  };

  const removeClient = (idx: number) =>
    setClients(prev => prev.filter((_, i) => i !== idx));

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All types" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
            Manage your client roster and their compliance.
          </p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="px-4 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange hover:glow-orange-strong transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total clients", v: clients.length.toString() },
          { l: "Active",        v: clients.length.toString() },
          { l: "Filings due",   v: "0", accent: true },
        ].map((s) => (
          <div key={s.l} className="card-surface p-4">
            <div className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "rgba(255,255,255,0.40)" }}>
              {s.l}
            </div>
            <div className={cn("mt-1 text-2xl font-bold", s.accent ? "text-gradient-orange" : "")}
              style={s.accent ? undefined : { color: "rgba(255,255,255,0.95)" }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "rgba(255,255,255,0.35)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="glass-input w-full h-10 pl-9 pr-3 text-sm"
            style={{ color: "rgba(255,255,255,0.85)" }}
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="glass-select h-10 px-3 rounded-[10px] text-sm focus:outline-none"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          <option>All types</option>
          <option>Individual</option>
          <option>Company</option>
          <option>LLP</option>
          <option>Partnership</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card-surface py-20 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 grid place-items-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div className="font-semibold" style={{ color: "rgba(255,255,255,0.90)" }}>
            {clients.length === 0 ? "No clients yet" : "No clients match your search"}
          </div>
          <div className="mt-1 text-sm max-w-xs mx-auto"
            style={{ color: "rgba(255,255,255,0.50)" }}>
            {clients.length === 0
              ? "Add your first client to start tracking their calculations and filings"
              : "Try a different search term or filter"}
          </div>
          {clients.length === 0 && (
            <button
              onClick={() => setShowDrawer(true)}
              className="mt-5 px-5 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Client
            </button>
          )}
        </div>
      )}

      {/* Client grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const Icon = typeIcons[c.type] ?? User;
            return (
              <div key={i} className="card-surface p-5 group relative">
                <button
                  onClick={() => removeClient(clients.indexOf(c))}
                  className="absolute top-3 right-3 h-6 w-6 rounded-md grid place-items-center opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate"
                      style={{ color: "rgba(255,255,255,0.95)" }}>
                      {c.name}
                    </div>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-pill mt-1 inline-block", typeColors[c.type] ?? "bg-white/10 text-white/60")}>
                      {c.type}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {c.pan && (
                    <div className="flex items-center gap-2 text-xs"
                      style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span className="font-mono">PAN:</span>
                      <span style={{ color: "rgba(255,255,255,0.80)" }}>{c.pan}</span>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2 text-xs truncate"
                      style={{ color: "rgba(255,255,255,0.55)" }}>
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate" style={{ color: "rgba(255,255,255,0.75)" }}>{c.email}</span>
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-2 text-xs"
                      style={{ color: "rgba(255,255,255,0.55)" }}>
                      <Phone className="h-3 w-3" />
                      <span style={{ color: "rgba(255,255,255,0.75)" }}>{c.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06] text-[10px]"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  Added {c.addedAt} · {c.country}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
          <div
            onClick={() => setShowDrawer(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md h-full border-l border-white/10 p-6 overflow-y-auto"
            style={{ background: "#111111" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold"
                style={{ color: "rgba(255,255,255,0.95)" }}>
                Add Client
              </h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {([
                ["Full Name *", "name",  "text",  "Acme Industries Pvt Ltd"],
                ["PAN",         "pan",   "text",  "AAAAA0000A"],
                ["GST Number",  "gst",   "text",  "27AAAAA0000A1Z5"],
                ["Email",       "email", "email", "client@example.com"],
                ["Phone",       "phone", "tel",   "+91 98765 43210"],
              ] as const).map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: "rgba(255,255,255,0.65)" }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="glass-input w-full h-10 px-3 text-sm"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-1.5"
                  style={{ color: "rgba(255,255,255,0.65)" }}>
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="glass-select w-full h-10 px-3 rounded-[10px] text-sm"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  <option>Individual</option>
                  <option>Company</option>
                  <option>LLP</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5"
                  style={{ color: "rgba(255,255,255,0.65)" }}>
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={e => setForm(prev => ({ ...prev, country: e.target.value }))}
                  className="glass-select w-full h-10 px-3 rounded-[10px] text-sm"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  <option>🇮🇳 India</option>
                  <option>🇬🇧 UK</option>
                  <option>🇺🇸 USA</option>
                  <option>🇦🇪 UAE</option>
                  <option>🇩🇪 Germany</option>
                  <option>🇸🇬 Singapore</option>
                  <option>🇦🇺 Australia</option>
                </select>
              </div>

              <button
                onClick={saveClient}
                disabled={!form.name.trim()}
                className="w-full h-11 mt-2 rounded-lg bg-gradient-orange text-white font-semibold glow-orange disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}