"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";

export function OrganizationEditView({ pathname, orgSlug }) {
  const router = useRouter();
  const { request, signOut } = useSessionState();
  const [organization, setOrganization] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenError, setScreenError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrganization() {
      try {
        const data = await request("/orgs");
        const match = (data.organizations || []).find((entry) => (entry._id || entry.id) === orgSlug);
        if (!cancelled) {
          setOrganization(match || null);
          setForm(match ? {
            name: match.name,
            status: match.status,
            retentionDays: String(match.policies?.retentionDays || 30),
            sessionExpiry: String(match.policies?.sessionExpiry || 60),
            messageRateLimit: String(match.policies?.messageRateLimit || 100),
          } : null);
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

    loadOrganization();
    return () => {
      cancelled = true;
    };
  }, [orgSlug, request]);

  if (loading) {
    return (
      <AppScaffold role="admin" title="Loading Organization" subtitle="Fetching tenant details" pathname={pathname} onLogout={signOut}>
        <Card className="p-6 text-sm text-[var(--text-soft)]">Loading organization...</Card>
      </AppScaffold>
    );
  }

  if (!organization || !form) {
    return (
      <AppScaffold role="admin" title="Organization Not Found" subtitle="System Administrator" pathname={pathname} onLogout={signOut}>
        <Card className="p-6">
          <p className="text-base font-medium text-[var(--text-main)]">This organization could not be found.</p>
          <Button className="mt-4" onClick={() => router.replace(ROUTES.adminPlatform)}>
            Back to Dashboard
          </Button>
        </Card>
      </AppScaffold>
    );
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();

    try {
      await request(`/orgs/${organization._id || organization.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          status: form.status,
          policies: {
            ...organization.policies,
            retentionDays: Number(form.retentionDays) || 30,
            sessionExpiry: Number(form.sessionExpiry) || 60,
            messageRateLimit: Number(form.messageRateLimit) || 100,
          },
        }),
      });
      router.replace(ROUTES.adminPlatform);
    } catch (error) {
      setScreenError(error.message);
    }
  }

  return (
    <AppScaffold
      role="admin"
      title={`Edit ${organization.name}`}
      subtitle="Update organization policy details"
      pathname={pathname}
      onLogout={signOut}
    >
      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <p className="text-lg font-medium text-[var(--text-main)]">Organization Details</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Organization Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Status</span>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] bg-white px-4 text-sm text-[var(--text-main)] outline-none"
              >
                <option value="active">active</option>
                <option value="suspended">suspended</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Retention Days</span>
              <input
                type="number"
                value={form.retentionDays}
                onChange={(event) => updateField("retentionDays", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Session Expiry</span>
              <input
                type="number"
                value={form.sessionExpiry}
                onChange={(event) => updateField("sessionExpiry", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Message Rate Limit</span>
              <input
                type="number"
                value={form.messageRateLimit}
                onChange={(event) => updateField("messageRateLimit", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--text-main)]">Actions</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p>Save writes directly to the real organization endpoint.</p>
            <p>Cancel returns to the dashboard without changing this organization.</p>
          </div>
          {screenError ? <p className="mt-4 text-sm text-[#bf5460]">{screenError}</p> : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={() => router.replace(ROUTES.adminPlatform)}>
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </AppScaffold>
  );
}
