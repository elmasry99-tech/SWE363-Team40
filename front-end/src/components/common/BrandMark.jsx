import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ large = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-[var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        large
          ? "h-16 w-16 rounded-[18px] bg-[linear-gradient(180deg,#19304f,#12233c)]"
          : "h-10 w-10 rounded-[12px] bg-[linear-gradient(180deg,#19304f,#12233c)]",
      )}
    >
      <Shield className={large ? "h-8 w-8" : "h-5 w-5"} />
    </div>
  );
}
