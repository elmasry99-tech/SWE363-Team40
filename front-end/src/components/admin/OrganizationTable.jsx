import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getAdminPlatformEditRoute } from "@/lib/routes";

export function OrganizationTable({ rows, onToggle }) {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto rounded-[18px] border border-[var(--border-light)]">
        <table className="min-w-[760px] w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-[0.08em] text-[var(--text-soft)]">
              <th className="px-6 py-4">Organization</th>
              <th className="px-6 py-4">Policies</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-6 py-5 text-sm font-medium text-[var(--text-main)]">{row.name}</td>
                <td className="px-6 py-5 text-sm text-[var(--text-soft)]">
                  Retention {row.policies?.retentionDays || 30} days
                </td>
                <td className="px-6 py-5">
                  <StatusPill tone={row.status === "active" ? "active" : "danger"}>{row.status}</StatusPill>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => onToggle(row)}>
                      {row.status === "suspended" ? "Activate" : "Suspend"}
                    </Button>
                    <Link
                      href={getAdminPlatformEditRoute(row.id)}
                      className="rounded-[14px] bg-slate-100 px-4 py-2 text-sm font-medium text-[var(--text-main)] transition"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
