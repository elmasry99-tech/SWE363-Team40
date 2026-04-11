"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";
import { slugify } from "@/lib/utils";

const defaultForm = {
  name: "New Organization",
  domain: "new-organization.cyphernet.app",
  tier: "Standard",
  users: "25",
  industry: "Professional Services",
  officerName: "Security Officer",
  officerEmail: "security.officer@new-organization.cyphernet.app",
  officerPassword: "TempPass#2026",
};

export function OrganizationSetupView({ pathname }) {
  const router = useRouter();
  const { createOrganization, signOut } = useSessionState();
  const [form, setForm] = useState(defaultForm);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    createOrganization(
      {
        slug: slugify(form.name),
        name: form.name,
        domain: form.domain,
        users: Number(form.users) || 0,
        tier: form.tier,
        status: "active",
      },
      {
        id: `oso-${Date.now()}`,
        name: form.officerName,
        email: form.officerEmail,
        role: "Organization Security Officer",
        organization: form.name,
        password: form.officerPassword,
      },
    );

    router.replace(ROUTES.adminPlatform);
  }

  return (
    <AppScaffold
      role="admin"
      title="Create Organization"
      subtitle="Set up tenant details and provision the default security officer account"
      pathname={pathname}
      onLogout={signOut}
    >
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <p className="text-lg font-medium text-[var(--text-main)]">Organization Details</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Organization Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Primary Domain</span>
              <input
                type="text"
                value={form.domain}
                onChange={(event) => updateField("domain", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Subscription Tier</span>
              <select
                value={form.tier}
                onChange={(event) => updateField("tier", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] bg-white px-4 text-sm text-[var(--text-main)] outline-none"
              >
                <option>Standard</option>
                <option>Professional</option>
                <option>Enterprise</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Expected Users</span>
              <input
                type="number"
                min="1"
                value={form.users}
                onChange={(event) => updateField("users", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Industry</span>
              <input
                type="text"
                value={form.industry}
                onChange={(event) => updateField("industry", event.target.value)}
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
              <p>You can hand over tenant-level policy management after setup is complete.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="flex-1">
                Save Organization
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
