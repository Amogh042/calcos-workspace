import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, FileText, FileBarChart, X } from "lucide-react";

const types = [
  { l: "P&L Statement",  c: "from-emerald-500/20 to-emerald-500/5" },
  { l: "Balance Sheet",  c: "from-sky-500/20 to-sky-500/5" },
  { l: "Salary Sheet",   c: "from-primary/20 to-primary/5" },
  { l: "Invoice",        c: "from-rose-500/20 to-rose-500/5" },
  { l: "Trial Balance",  c: "from-violet-500/20 to-violet-500/5" },
];

type UploadedFile = {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function detectType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("p&l") || n.includes("pnl") || n.includes("profit")) return "P&L Statement";
  if (n.includes("balance")) return "Balance Sheet";
  if (n.includes("salary") || n.includes("payroll")) return "Salary Sheet";
  if (n.includes("invoice") || n.includes("inv")) return "Invoice";
  if (n.includes("trial")) return "Trial Balance";
  if (n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".csv")) return "Excel / CSV";
  if (n.endsWith(".pdf")) return "PDF";
  return "Document";
}

export default function Documents() {
  const [files, setFiles]       = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const now = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      size: formatSize(f.size),
      type: detectType(f.name),
      uploadedAt: now,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const totalKB = files.reduce((acc, f) => {
    const n = parseFloat(f.size);
    return acc + (f.size.includes("MB") ? n * 1024 : n);
  }, 0);
  const usedMB = (totalKB / 1024).toFixed(1);
  const usedPct = Math.min((totalKB / (100 * 1024)) * 100, 100).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
            Files are processed locally — never sent to servers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 h-10 rounded-pill bg-card border border-white/10 hover:border-primary/40 text-sm font-medium flex items-center gap-2 transition-all"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            <FileSpreadsheet className="h-4 w-4 text-primary" /> Import from Excel
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 h-10 rounded-pill bg-gradient-orange text-white text-sm font-semibold glow-orange hover:glow-orange-strong transition-all flex items-center gap-2"
          >
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>
      </div>

      {/* Storage bar */}
      <div className="card-surface p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: "rgba(255,255,255,0.65)" }}>Storage</span>
          <span style={{ color: "rgba(255,255,255,0.40)" }}>
            {files.length === 0 ? "0 MB" : `${usedMB} MB`} of 100 MB used
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full bg-gradient-orange rounded-full transition-all duration-500"
            style={{ width: files.length === 0 ? "0%" : `${usedPct}%` }}
          />
        </div>
      </div>

      {/* Drop zone */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.pdf"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className="card-surface w-full p-12 flex flex-col items-center gap-3 transition-all"
        style={{
          borderStyle: "dashed",
          borderColor: dragging ? "rgba(249,115,22,0.6)" : "rgba(255,255,255,0.12)",
          background: dragging ? "rgba(249,115,22,0.04)" : undefined,
        }}
      >
        <div className="h-14 w-14 rounded-xl bg-primary/10 grid place-items-center">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <div>
          <div
            className="font-semibold text-center"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            {dragging ? "Drop files here!" : "Drop files here or click to upload"}
          </div>
          <div
            className="text-xs mt-1 text-center"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            Supported: Excel (.xlsx .xls), PDF, CSV
          </div>
        </div>
      </button>

      {/* Smart Import */}
      <div className="card-surface p-6">
        <h3
          className="font-semibold flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.90)" }}
        >
          <FileBarChart className="h-4 w-4 text-primary" /> Smart Import
        </h3>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
          Drop your Excel file and CalcOS will detect what it contains
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((t) => (
            <span
              key={t.l}
              className={`text-xs px-3 py-1.5 rounded-pill bg-gradient-to-r ${t.c} border border-white/10`}
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              {t.l}
            </span>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="card-surface overflow-hidden">
        <div
          className="px-5 py-3 grid grid-cols-12 text-[10px] uppercase tracking-wider font-semibold border-b border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.40)" }}
        >
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Uploaded</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {files.length === 0 ? (
          <div className="py-16 text-center">
            <div
              className="h-12 w-12 mx-auto rounded-xl grid place-items-center mb-3"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <FileText className="h-6 w-6" style={{ color: "rgba(255,255,255,0.30)" }} />
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              No documents yet
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              Upload an Excel or PDF to get started
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {files.map((f, i) => (
              <div
                key={i}
                className="px-5 py-3 grid grid-cols-12 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span
                    className="text-sm truncate"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {f.name}
                  </span>
                </div>
                <div
                  className="col-span-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {f.type}
                </div>
                <div
                  className="col-span-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {f.size}
                </div>
                <div
                  className="col-span-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.40)" }}
                >
                  {f.uploadedAt}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeFile(i)}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md grid place-items-center hover:bg-destructive/20 transition-all"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}