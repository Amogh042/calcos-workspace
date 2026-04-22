import { Calculator } from "lucide-react";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} rounded-lg bg-gradient-orange grid place-items-center glow-orange`}>
        <Calculator className="h-1/2 w-1/2 text-white" strokeWidth={2.5} />
      </div>
      <span className={`${text} font-bold tracking-tight`}>
        Calc<span className="text-gradient-orange">OS</span>
      </span>
    </div>
  );
};
