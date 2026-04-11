"use client";

import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockPolicies, mockRetention } from "@/data/mockPolicies";
import { officerRooms } from "@/data/mockRooms";
import { useSessionState } from "@/hooks/useSessionState";

export function OrganizationAdminView({ pathname }) {
  const {
    state,
    setOfficerSection,
    toggleRoomClosed,
    toggleOfficerUserStatus,
    approveEmployeeRequest,
    denyEmployeeRequest,
    togglePolicySetting,
    updateRetentionSetting,
    signOut,
  } = useSessionState();
  const section = state.officerSection;

  return (
    <AppScaffold
      role="oso"
      title="Northstar Legal"
      subtitle="Organization Security Officer"
      pathname={pathname}
      onLogout={signOut}
      actions={<StatusPill tone="accent">Tenant controls active</StatusPill>}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {["Policies", "Retention", "Users", "Rooms", "Reports"].map((label) => (
          <Button
            key={label}
            variant={section === label ? "primary" : "secondary"}
            onClick={() => setOfficerSection(label)}
          >
            {label}
          </Button>
        ))}
      </div>

      {section === "Policies" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {mockPolicies.map((policy) => (
            <Card key={policy.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-medium text-[var(--text-main)]">{policy.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{policy.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePolicySetting(policy.name)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    state.policySettings[policy.name] ? "bg-[var(--accent-strong)]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      state.policySettings[policy.name] ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4">
                <StatusPill tone={state.policySettings[policy.name] ? "active" : "warning"}>
                  {state.policySettings[policy.name] ? "Enabled" : "Disabled"}
                </StatusPill>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {section === "Retention" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {mockRetention.map((item) => (
            <Card key={item.id} className="p-5">
              <p className="text-base font-medium text-[var(--text-main)]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                {item.title === "Message Retention"
                  ? "Retention controls how long room messages and shared content remain accessible before automatic cleanup."
                  : "Session expiration controls how many days a session or invite remains valid before access expires automatically."}
              </p>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Days</span>
                <input
                  type="number"
                  min="1"
                  value={state.retentionSettings[item.title]}
                  onChange={(event) => updateRetentionSetting(item.title, event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[var(--border-light)] bg-white px-4 text-sm text-[var(--text-main)] outline-none"
                />
              </label>
              <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{item.description}</p>
            </Card>
          ))}
        </div>
      ) : null}

      {section === "Users" ? (
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium text-[var(--text-main)]">Pending Account Requests</p>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Review internal employee and organization security officer sign-up requests for this organization.
                </p>
              </div>
              <StatusPill tone="warning">{state.employeeJoinRequests.length} Pending</StatusPill>
            </div>
            <div className="mt-4 space-y-3">
              {state.employeeJoinRequests.length ? (
                state.employeeJoinRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 rounded-[16px] border border-[var(--border-light)] bg-white p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text-main)]">{request.name}</p>
                      <p className="text-sm text-[var(--text-soft)]">{request.email}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Requested access: {request.requestedRole} • Title: {request.requestedTitle}
                        {request.organization ? ` • Organization: ${request.organization}` : ""}
                        {" • "}Submitted at {request.requestedAt}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => denyEmployeeRequest(request.id)}>
                        Deny
                      </Button>
                      <Button onClick={() => approveEmployeeRequest(request.id)}>Accept</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[16px] border border-[var(--border-light)] bg-white p-4 text-sm text-[var(--text-soft)]">
                  No pending employee account requests.
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-3">
            {state.officerManagedUsers.map((user) => (
              <Card key={user.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-base font-medium text-[var(--text-main)]">{user.name}</p>
                    <p className="text-sm text-[var(--text-soft)]">{user.role}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone={user.accountStatus === "disabled" ? "danger" : "active"}>
                      {user.accountStatus}
                    </StatusPill>
                    <Button variant="secondary" onClick={() => toggleOfficerUserStatus(user.id)}>
                      {user.accountStatus === "disabled" ? "Activate" : "Disable"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {section === "Rooms" ? (
        <div className="space-y-3">
          {officerRooms.map((room) => {
            const isClosed = state.closedRoomIds.includes(room.id);
            const roomState = isClosed ? "Closed" : room.state;

            return (
            <Card key={room.id} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-medium text-[var(--text-main)]">{room.name}</p>
                  <p className="text-sm text-[var(--text-soft)]">
                    Owner: {room.owner} • {room.policy}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill tone={roomState === "Live" ? "active" : "warning"}>{roomState}</StatusPill>
                  <Button variant="secondary" onClick={() => toggleRoomClosed(room.id)}>
                    {isClosed ? "Reopen Room" : "Force Close"}
                  </Button>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      ) : null}

      {section === "Reports" ? (
        <div className="space-y-3">
          {[
            "Forced room close recorded for M&A Due Diligence.",
            "Metadata-only export generated for weekly compliance report.",
            "Guest verification completed for Client Intake - Jones.",
          ].map((entry) => (
            <Card key={entry} className="p-5">
              <p className="text-sm leading-6 text-[var(--text-main)]">{entry}</p>
            </Card>
          ))}
        </div>
      ) : null}
    </AppScaffold>
  );
}
