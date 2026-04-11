"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";
import { slugify } from "@/lib/utils";

export function OrganizationEditView({ pathname, orgSlug }) {
  const router = useRouter();
  const { state, updateOrganizationBySlug, signOut } = useSessionState();
  const organization = useMemo(
    () => state.organizations.find((entry) => entry.slug === orgSlug),
    [orgSlug, state.organizations],
  );
  const [form, setForm] = useState(() =>
    organization || {
      name: "",
      domain: "",
      users: 0,
      tier: "Standard",
      status: "active",
    },
  );

  if (!organization) {
    return (
      <AppScaffold
        role="admin"
        title="Organization Not Found"
        subtitle="System Administrator"
        pathname={pathname}
        onLogout={signOut}
      >
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

  function handleSave(event) {
    event.preventDefault();
    updateOrganizationBySlug(orgSlug, {
      ...form,
      users: Number(form.users) || 0,
      slug: slugify(form.name),
    });
    router.replace(ROUTES.adminPlatform);
  }

  return (
    <AppScaffold
      role="admin"
      title={`Edit ${organization.name}`}
      subtitle="Update organization details"
      pathname={pathname}
      onLogout={signOut}
    >
      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Active Users</span>
              <input
                type="number"
                min="1"
                value={form.users}
                onChange={(event) => updateField("users", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--text-main)]">Actions</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p>Save keeps the organization in the table with its updated details.</p>
            <p>Cancel returns to the dashboard without changing this organization.</p>
          </div>
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
