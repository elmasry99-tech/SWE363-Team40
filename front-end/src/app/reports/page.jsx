"use client";

import { usePathname } from "next/navigation";
import { ReportsView } from "@/components/reports/ReportsView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function ReportsPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["admin", "oso", "internal"]);
  if (!hydrated) return null;
  return <ReportsView pathname={pathname} />;
}
