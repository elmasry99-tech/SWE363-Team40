"use client";

import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}) {
  const variants = {
    primary:
      "bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-slate-950 shadow-[0_12px_28px_rgba(23,147,170,0.24)]",
    secondary:
      "border border-[var(--border-light)] bg-white text-[var(--text-main)]",
    ghost: "border border-[var(--border-dark)] bg-white/5 text-slate-100",
    dark: "bg-[linear-gradient(135deg,#17314d,#1f4266)] text-white shadow-[0_12px_28px_rgba(23,49,77,0.24)]",
    muted: "bg-slate-100 text-[var(--text-main)]",
    danger: "bg-[linear-gradient(135deg,#d96570,#bf5460)] text-white",
  };

  return (
    <button
      className={cn(
        "rounded-[14px] px-4 py-2 text-sm font-medium transition",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
