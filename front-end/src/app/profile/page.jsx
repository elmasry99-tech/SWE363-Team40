"use client";

import { usePathname } from "next/navigation";
import { ProfileView } from "@/components/common/ProfileView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function ProfilePage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["admin", "oso", "internal", "guest"]);
  if (!hydrated) return null;
  return <ProfileView pathname={pathname} />;
}
