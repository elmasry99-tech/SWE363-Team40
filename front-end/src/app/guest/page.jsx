"use client";

import { usePathname } from "next/navigation";
import { GuestAccessView } from "@/components/guest/GuestAccessView";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function GuestPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["guest"]);
  if (!hydrated) return null;
  return <GuestAccessView pathname={pathname} />;
}
