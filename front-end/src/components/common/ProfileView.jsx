"use client";

import { useEffect, useState } from "react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { mockUsers } from "@/data/mockUsers";
import { useSessionState } from "@/hooks/useSessionState";
import { Button } from "@/components/ui/Button";

export function ProfileView({ pathname }) {
  const { state, signOut, updateProfile } = useSessionState();
  const role = state.role || "internal";
  const user = state.profiles[role] || mockUsers[role] || mockUsers.internal;
  const [form, setForm] = useState(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

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
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Full Name</span>
              <input
                type="text"
                value={form.name || ""}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Email</span>
              <input
                type="email"
                value={form.email || ""}
                onChange={(event) => updateField("email", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Role</span>
              <input
                type="text"
                value={form.role || ""}
                onChange={(event) => updateField("role", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            {form.organization !== undefined ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Organization</span>
                <input
                  type="text"
                  value={form.organization || ""}
                  onChange={(event) => updateField("organization", event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
                />
              </label>
            ) : null}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={() => updateProfile(role, form)}>
              Save
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setForm(user)}>
              Cancel
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-base font-medium text-[var(--text-main)]">Security Summary</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p>Verified sign-in enabled</p>
            <p>Session protection active</p>
            <p>Role-based workspace controls applied</p>
          </div>
        </Card>
      </div>
    </AppScaffold>
  );
}
