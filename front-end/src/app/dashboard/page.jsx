"use client";

import { usePathname } from "next/navigation";
import { DashboardView } from "@/components/common/DashboardView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function DashboardPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["oso", "internal", "guest"]);

  if (!hydrated) return null;
  return <DashboardView pathname={pathname} />;
}
