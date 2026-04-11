import { cn } from "@/lib/utils";

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    active: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    accent: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  };

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
