"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";

const defaultForm = {
  name: "New Organization",
  officerName: "Security Officer",
  officerEmail: "security.officer@organization.com",
  officerPassword: "TempPass#2026",
  retentionDays: "30",
  sessionExpiry: "60",
  messageRateLimit: "100",
};

export function OrganizationSetupView({ pathname }) {
  const router = useRouter();
  const { request, signOut } = useSessionState();
  const [form, setForm] = useState(defaultForm);
  const [screenError, setScreenError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setScreenError("");

    try {
      await request("/orgs", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          status: "active",
          policies: {
            retentionDays: Number(form.retentionDays) || 30,
            sessionExpiry: Number(form.sessionExpiry) || 60,
            messageRateLimit: Number(form.messageRateLimit) || 100,
          },
          officer: {
            name: form.officerName,
            email: form.officerEmail,
            password: form.officerPassword,
          },
        }),
      });

      router.replace(ROUTES.adminPlatform);
    } catch (error) {
      setScreenError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppScaffold
      role="admin"
      title="Create Organization"
      subtitle="Provision tenant policies and the default OSO account"
      pathname={pathname}
      onLogout={signOut}
    >
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
            <label className="block md:col-span-2">
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

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-lg font-medium text-[var(--text-main)]">Default Security Officer Account</p>
            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Officer Name</span>
                <input
                  type="text"
                  value={form.officerName}
                  onChange={(event) => updateField("officerName", event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Officer Email</span>
                <input
                  type="email"
                  value={form.officerEmail}
                  onChange={(event) => updateField("officerEmail", event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Temporary Password</span>
                <input
                  type="text"
                  value={form.officerPassword}
                  onChange={(event) => updateField("officerPassword", event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
                />
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-[var(--text-main)]">Provisioning Summary</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
              <p>The organization will be created in an active state.</p>
              <p>A default Organization Security Officer account will be provisioned immediately.</p>
            </div>
            {screenError ? <p className="mt-4 text-sm text-[#bf5460]">{screenError}</p> : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? "Saving..." : "Save Organization"}
              </Button>
              <Button type="button" variant="secondary" className="flex-1" onClick={() => router.replace(ROUTES.adminPlatform)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </AppScaffold>
  );
}
