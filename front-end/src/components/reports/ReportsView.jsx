"use client";

import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockReports } from "@/data/mockReports";
import { useSessionState } from "@/hooks/useSessionState";

export function ReportsView({ pathname }) {
  const { state, signOut } = useSessionState();
  const role = state.role || "internal";

  return (
    <AppScaffold
      role={role}
      title="Reports"
      subtitle="Exported summaries and compliance activity"
      pathname={pathname}
      onLogout={signOut}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {mockReports.map((report) => (
          <Card key={report.id} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium text-[var(--text-main)]">{report.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{report.description}</p>
              </div>
              <StatusPill tone={report.status === "Ready" ? "active" : "warning"}>
                {report.status}
              </StatusPill>
            </div>
          </Card>
        ))}
      </div>
    </AppScaffold>
  );
}
