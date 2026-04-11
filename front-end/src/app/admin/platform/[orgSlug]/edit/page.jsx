"use client";

import { useParams, usePathname } from "next/navigation";
import { OrganizationEditView } from "@/components/admin/OrganizationEditView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function AdminPlatformEditPage() {
  const params = useParams();
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["admin"]);
  const orgSlug = Array.isArray(params?.orgSlug) ? params.orgSlug[0] : params?.orgSlug;

  if (!hydrated || !orgSlug) return null;
  return <OrganizationEditView pathname={pathname} orgSlug={orgSlug} />;
}
