"use client";

import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { useSessionState } from "@/hooks/useSessionState";

export function ProfileView({ pathname }) {
  const { state, signOut } = useSessionState();
  const role = state.role || "internal";
  const user = state.user || {};

  return (
    <AppScaffold
      role={role}
      title="Profile"
      subtitle="Account overview and role identity"
      pathname={pathname}
      onLogout={signOut}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-base font-medium text-[var(--text-main)]">Account Details</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p><span className="font-medium text-[var(--text-main)]">Name:</span> {user.name || "Unknown"}</p>
            <p><span className="font-medium text-[var(--text-main)]">Email:</span> {user.email || "Unknown"}</p>
            <p><span className="font-medium text-[var(--text-main)]">Role:</span> {role}</p>
            <p><span className="font-medium text-[var(--text-main)]">Organization ID:</span> {user.orgId || "None"}</p>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-base font-medium text-[var(--text-main)]">Security Summary</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p>JWT-backed session active</p>
            <p>Role-based workspace controls applied</p>
            <p>Steganography key pair is generated on first authenticated use</p>
          </div>
        </Card>
      </div>
    </AppScaffold>
  );
}
