"use client";

import { usePathname } from "next/navigation";
import { OrganizationSetupView } from "@/components/admin/OrganizationSetupView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function AdminPlatformNewPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["admin"]);

  if (!hydrated) return null;
  return <OrganizationSetupView pathname={pathname} />;
}
