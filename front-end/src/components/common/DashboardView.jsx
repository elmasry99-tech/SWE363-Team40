"use client";

import Link from "next/link";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/routes";
import { useSessionState } from "@/hooks/useSessionState";

const summaries = {
  admin: [
    ["Platform Health", "Organization and auth APIs are available"],
    ["Organizations", "Manage tenant lifecycle and policy baselines"],
    ["Security Events", "Realtime messaging and signaling are live"],
  ],
  oso: [
    ["Tenant Policies", "Update retention and access settings"],
    ["Active Rooms", "Monitor room status and participants"],
    ["User Reviews", "Approve or disable organization users"],
  ],
  internal: [
    ["Open Rooms", "Create or join secure rooms"],
    ["Live Chat", "Socket-backed room messaging is enabled"],
    ["Calls", "WebRTC signaling is connected"],
  ],
  guest: [
    ["Session State", "Guest flow depends on issued credentials"],
    ["Verification", "Waiting room moderation remains enforced"],
    ["Room Scope", "Access stays limited to admitted rooms"],
  ],
  general: [
    ["Rooms", "Join and collaborate in secure rooms"],
    ["Messaging", "Realtime room chat is available"],
    ["Calls", "Video calls use live signaling"],
  ],
};

const quickLinks = {
  admin: [{ label: "View Organizations", href: ROUTES.adminPlatform }],
  oso: [{ label: "Open Organization Controls", href: ROUTES.adminOrganization }],
  internal: [{ label: "Open Rooms", href: ROUTES.rooms }],
  guest: [],
  general: [{ label: "Open Rooms", href: ROUTES.rooms }],
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
            <p>Selected room: {state.roomId || "None selected"}</p>
            <p>Call view: {state.callView}</p>
          </div>
        </Card>
      </div>
    </AppScaffold>
  );
}
