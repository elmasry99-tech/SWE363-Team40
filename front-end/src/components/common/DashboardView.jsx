"use client";

import Link from "next/link";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/routes";
import { useSessionState } from "@/hooks/useSessionState";

const summaries = {
  admin: [
    ["Platform Health", "All core services operational"],
    ["Organizations", "4 tracked organizations in current snapshot"],
    ["Security Events", "2 flagged items need review"],
  ],
  oso: [
    ["Tenant Policies", "4 active controls enforced"],
    ["Active Rooms", "3 monitored rooms"],
    ["Compliance", "Latest export ready"],
  ],
  internal: [
    ["Open Rooms", "3 active rooms available"],
    ["Pending Guest", "1 room waiting for admission approval"],
    ["Uploads", "Latest secure file delivered successfully"],
  ],
  guest: [
    ["Session State", "Invite access available"],
    ["Verification", "Guest details required before admission"],
    ["Room Scope", "Access remains limited to a single room"],
  ],
};

const quickLinks = {
  admin: [{ label: "View Reports", href: ROUTES.reports }],
  oso: [{ label: "View Reports", href: ROUTES.reports }],
  internal: [
    { label: "Open Rooms", href: ROUTES.rooms },
    { label: "View Reports", href: ROUTES.reports },
  ],
  guest: [],
};

export function DashboardView({ pathname }) {
  const { state, signOut } = useSessionState();
  const role = state.role || "internal";
  const links = quickLinks[role] || [];

  return (
    <AppScaffold
      role={role}
      title="Dashboard"
      subtitle="Role-based overview"
      pathname={pathname}
      onLogout={signOut}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {(summaries[role] || summaries.internal).map(([title, body]) => (
          <Card key={title} className="p-5">
            <p className="text-base font-medium text-[var(--text-main)]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-base font-medium text-[var(--text-main)]">Quick Access</p>
          <div className="mt-4 grid gap-3">
            {links.length ? (
              links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[14px] border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-main)]"
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <div className="rounded-[14px] border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-soft)]">
                No shortcuts available for this role.
              </div>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-base font-medium text-[var(--text-main)]">Session State</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p>Current role: {role}</p>
            <p>Selected room: {state.roomId}</p>
            <p>Call view: {state.callView}</p>
          </div>
        </Card>
      </div>
    </AppScaffold>
  );
}
