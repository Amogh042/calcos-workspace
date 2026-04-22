import { Link } from "react-router-dom";
import { Lock, ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalcMeta = {
  slug: string;
  name: string;
  desc: string;
  flags: string[];
  pro?: boolean;
  icon: LucideIcon;
};

export const CalcCard = ({ calc }: { calc: CalcMeta }) => {
  const Icon = calc.icon;
  return (
    <Link
      to={`/calculator/${calc.slug}`}
      className={cn(
        "card-surface p-5 group relative overflow-hidden flex flex-col",
        calc.pro && "opacity-90"
      )}
    >
      {calc.pro && (
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-pill bg-primary/15 text-primary flex items-center gap-1">
          <Lock className="h-2.5 w-2.5" /> PRO
        </span>
      )}
      <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center group-hover:bg-gradient-orange transition-all">
        <Icon className="h-5 w-5 text-primary group-hover:text-white" />
      </div>
      <div className="mt-4 font-semibold text-sm">{calc.name}</div>
      <div className="mt-1 text-xs text-secondary line-clamp-2 flex-1">{calc.desc}</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1">
          {calc.flags.map((f) => <span key={f} className="text-base">{f}</span>)}
        </div>
        <span className="text-xs font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center gap-1">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
};
