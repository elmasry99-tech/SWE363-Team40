"use client";

import { usePathname } from "next/navigation";
import { OrganizationAdminView } from "@/components/admin/OrganizationAdminView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function AdminOrganizationPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["oso"]);
  if (!hydrated) return null;
  return <OrganizationAdminView pathname={pathname} />;
}
