"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveGuardRedirect } from "@/lib/guards";
import { useSessionState } from "./useSessionState";

export function useRoleRedirect(allowedRoles = []) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, state } = useSessionState();

  useEffect(() => {
    if (!hydrated) return;
    const redirectTo = resolveGuardRedirect(state.role, allowedRoles);
    if (redirectTo && pathname !== redirectTo) {
      router.replace(redirectTo);
    }
  }, [allowedRoles, hydrated, pathname, router, state.role]);

  return { hydrated, role: state.role };
}
