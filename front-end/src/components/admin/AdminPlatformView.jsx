"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, ShieldAlert } from "lucide-react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OrganizationTable } from "@/components/admin/OrganizationTable";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";

export function AdminPlatformView({ pathname }) {
  const router = useRouter();
  const { state, toggleOrganizationStatus, setMessageRateLimit, signOut } = useSessionState();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const merged = state.organizations;
    if (!normalized) return merged;
    return merged.filter(
      (row) =>
        row.name.toLowerCase().includes(normalized) ||
        row.domain.toLowerCase().includes(normalized),
    );
  }, [query, state.organizations]);

  return (
    <AppScaffold
      role="admin"
      title="CypherNet Dashboard"
      subtitle="System Administrator"
      pathname={pathname}
      onLogout={signOut}
      actions={<div className="hidden rounded-[14px] bg-[rgba(60,195,214,0.12)] px-4 py-2 text-sm text-[var(--accent)] sm:block">Platform status stable</div>}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-2xl font-medium text-[var(--text-main)]">Organizations</p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            Provision new tenants, enforce suspension, and review usage and subscription posture.
          </p>
        </div>
        <Button variant="dark" onClick={() => router.push(ROUTES.adminPlatformNew)}>
          Create Organization
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-[52px] w-full rounded-[16px] border border-[var(--border-light)] bg-white pl-11 pr-4 text-sm text-[var(--text-main)] outline-none"
        />
      </div>

      <OrganizationTable rows={rows} onToggle={toggleOrganizationStatus} />

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[rgba(60,195,214,0.12)] text-[var(--accent-strong)]">
            <Shield className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--text-main)]">Global Policies</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
            Define monthly messaging thresholds that apply across organizations on the platform.
          </p>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Message Rate Limit Per Month</span>
            <input
              type="number"
              min="1"
              value={state.messageRateLimit}
              onChange={(event) => setMessageRateLimit(event.target.value)}
              className="h-[52px] w-full rounded-[16px] border border-[var(--border-light)] bg-white px-4 text-sm text-[var(--text-main)] outline-none"
            />
          </label>
        </Card>

        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[rgba(60,195,214,0.12)] text-[var(--accent-strong)]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--text-main)]">System Audit</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
            Timestamped platform changes are listed here for quick operational review.
          </p>
          <div className="mt-5 space-y-3">
            {state.adminAuditLogs.map((entry) => (
              <div key={entry.id} className="rounded-[16px] border border-[var(--border-light)] bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">{entry.time}</p>
                <p className="mt-2 text-sm text-[var(--text-main)]">{entry.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppScaffold>
  );
}
