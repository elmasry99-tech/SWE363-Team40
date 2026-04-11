"use client";

import { usePathname } from "next/navigation";
import { AdminPlatformView } from "@/components/admin/AdminPlatformView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function AdminPlatformPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["admin"]);
  if (!hydrated) return null;
  return <AdminPlatformView pathname={pathname} />;
}
