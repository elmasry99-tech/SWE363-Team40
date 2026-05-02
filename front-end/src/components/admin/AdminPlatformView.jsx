"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, ShieldAlert } from "lucide-react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { OrganizationTable } from "@/components/admin/OrganizationTable";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";

export function AdminPlatformView({ pathname }) {
  const router = useRouter();
  const { request, signOut } = useSessionState();
  const [query, setQuery] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenError, setScreenError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizations() {
      try {
        setLoading(true);
        const data = await request("/orgs");
        if (!cancelled) {
          setOrganizations(data.organizations || []);
        }
      } catch (error) {
        if (!cancelled) {
          setScreenError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrganizations();
    return () => {
      cancelled = true;
    };
  }, [request]);

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return organizations;
    return organizations.filter((row) => row.name.toLowerCase().includes(normalized));
  }, [organizations, query]);

  async function toggleOrganizationStatus(organization) {
    try {
      const nextStatus = organization.status === "suspended" ? "active" : "suspended";
      const data = await request(`/orgs/${organization._id || organization.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      setOrganizations((current) =>
        current.map((entry) =>
          (entry._id || entry.id) === (organization._id || organization.id) ? data.organization : entry,
        ),
      );
      setScreenError("");
    } catch (error) {
      setScreenError(error.message);
    }
  }

  return (
    <AppScaffold
      role="admin"
      title="CypherNet Dashboard"
      subtitle="System Administrator"
      pathname={pathname}
      onLogout={signOut}
      actions={<div className="hidden rounded-[14px] bg-[rgba(60,195,214,0.12)] px-4 py-2 text-sm text-[var(--accent)] md:block">Platform APIs connected</div>}
    >
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xl font-medium text-[var(--text-main)] sm:text-2xl">Organizations</p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            Provision tenants, update their status, and edit their current policy baselines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone="accent">{rows.length} Organizations</StatusPill>
          <Button variant="dark" onClick={() => router.push(ROUTES.adminPlatformNew)} className="w-full sm:w-auto">
            Create Organization
          </Button>
        </div>
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

      {screenError ? <p className="mb-4 text-sm text-[#bf5460]">{screenError}</p> : null}

      {loading ? (
        <Card className="p-5 text-sm text-[var(--text-soft)]">Loading organizations...</Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <Card key={row._id || row.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-[var(--text-main)]">{row.name}</p>
                    <p className="mt-1 truncate text-sm text-[var(--text-soft)]">
                      Retention {row.policies?.retentionDays || 30} days
                    </p>
                  </div>
                  <StatusPill tone={row.status === "active" ? "active" : "danger"}>{row.status}</StatusPill>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button variant="secondary" onClick={() => toggleOrganizationStatus(row)}>
                    {row.status === "suspended" ? "Activate" : "Suspend"}
                  </Button>
                  <Button variant="muted" onClick={() => router.push(`${ROUTES.adminPlatform}/${row._id || row.id}/edit`)}>
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block">
            <OrganizationTable
              rows={rows.map((entry) => ({ ...entry, id: entry._id || entry.id }))}
              onToggle={toggleOrganizationStatus}
            />
          </div>
        </>
      )}

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[rgba(60,195,214,0.12)] text-[var(--accent-strong)]">
            <Shield className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--text-main)]">Policy Snapshot</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
            Active organizations expose their current server-side retention, access, and sharing controls here.
          </p>
          <div className="mt-5 space-y-3">
            {rows.slice(0, 3).map((organization) => (
              <div key={organization._id || organization.id} className="rounded-[16px] border border-[var(--border-light)] bg-white p-4 text-sm text-[var(--text-main)]">
                <p className="font-medium">{organization.name}</p>
                <p className="mt-1 text-[var(--text-soft)]">
                  Rate limit {organization.policies?.messageRateLimit || 100}, retention {organization.policies?.retentionDays || 30} days
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[rgba(60,195,214,0.12)] text-[var(--accent-strong)]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--text-main)]">Platform Notes</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
            This dashboard is now backed by the real organization endpoints. Audit log read endpoints are not exposed yet, so this card summarizes live policy data instead.
          </p>
        </Card>
      </div>
    </AppScaffold>
  );
}
