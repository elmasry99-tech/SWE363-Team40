import { cn } from "@/lib/utils";

export function Card({ children, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-[var(--border-light)] bg-[var(--surface-card)] text-[var(--text-main)] shadow-[0_18px_42px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
