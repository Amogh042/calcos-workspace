import { Upload, FileSpreadsheet, FileText, FileBarChart } from "lucide-react";

const types = [
  { l: "P&L Statement", c: "from-emerald-500/20 to-emerald-500/5" },
  { l: "Balance Sheet", c: "from-sky-500/20 to-sky-500/5" },
  { l: "Salary Sheet", c: "from-primary/20 to-primary/5" },
  { l: "Invoice", c: "from-rose-500/20 to-rose-500/5" },
  { l: "Trial Balance", c: "from-violet-500/20 to-violet-500/5" },
];

export default function Documents() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="mt-1 text-sm text-secondary">Files are processed locally — never sent to servers.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 h-10 rounded-pill bg-card border border-white/10 hover:border-primary/40 text-sm font-medium flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" /> Import from Excel
          </button>
          <button className="px-4 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-secondary">Storage</span>
          <span className="text-tertiary">2.3 MB of 100 MB used</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <div className="h-full bg-gradient-orange rounded-full" style={{ width: "2.3%" }} />
        </div>
      </div>

      <button className="card-surface w-full p-12 border-dashed flex flex-col items-center gap-3 hover:bg-primary/[0.03] transition-colors">
        <div className="h-14 w-14 rounded-xl bg-primary/10 grid place-items-center">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <div>
          <div className="font-semibold">Drop files here or click to upload</div>
          <div className="text-xs text-secondary mt-1">Supported: Excel (.xlsx .xls), PDF, CSV</div>
        </div>
      </button>

      <div className="card-surface p-6">
        <h3 className="font-semibold flex items-center gap-2">
          <FileBarChart className="h-4 w-4 text-primary" /> Smart Import
        </h3>
        <p className="text-xs text-secondary mt-1">
          Drop your Excel file and CalcOS will detect what it contains
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((t) => (
            <span key={t.l} className={`text-xs px-3 py-1.5 rounded-pill bg-gradient-to-r ${t.c} border border-white/10`}>
              {t.l}
            </span>
          ))}
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="px-5 py-3 grid grid-cols-12 text-[10px] uppercase tracking-wider text-tertiary font-semibold border-b border-white/[0.06] bg-white/[0.02]">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">Uploaded</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="py-16 text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-card-elevated grid place-items-center mb-3">
            <FileText className="h-6 w-6 text-tertiary" />
          </div>
          <div className="text-sm font-medium">No documents yet</div>
          <div className="text-xs text-secondary mt-1">Upload an Excel or PDF to get started</div>
        </div>
      </div>
    </div>
  );
}
