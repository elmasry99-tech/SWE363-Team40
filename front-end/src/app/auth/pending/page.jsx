"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";

export default function PendingApprovalPage() {
  const { state } = useSessionState();

  return (
    <div className="mx-auto flex min-h-[100vh] max-w-[760px] items-center px-6 py-16">
      <Card className="w-full p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <p className="mt-6 text-[28px] font-medium text-[var(--text-main)]">Approval Pending</p>
        <p className="mt-3 text-base leading-7 text-[var(--text-soft)]">
          Your account will be notified when your account has been accepted.
        </p>
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Requested access:{" "}
          {state.signupPendingRole === "oso"
            ? "Organization Security Officer"
            : state.signupPendingRole === "internal"
              ? "Internal Secure End-User"
              : "Account"}
        </p>
        <div className="mt-8">
          <Link href={ROUTES.home}>
            <Button>Return to Access Portal</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
