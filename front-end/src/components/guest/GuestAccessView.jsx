"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { useSessionState } from "@/hooks/useSessionState";

export function GuestAccessView({ pathname }) {
  const { state, setGuestStep, signOut } = useSessionState();

  return (
    <AppScaffold
      role="guest"
      title="Guest Session"
      subtitle="Credentialed guest access"
      pathname={pathname}
      onLogout={signOut}
    >
      {state.guestStep === "verify" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="rounded-[22px] bg-[linear-gradient(180deg,#0d1b31,#132741)] p-8 text-white">
            <div className="max-w-xl">
              <p className="text-[32px] font-medium">Guest Access</p>
              <p className="mt-3 text-base leading-8 text-slate-300">
                Guest collaboration now relies on real credentialed access. Sign in through the main auth gateway to enter assigned rooms.
              </p>
            </div>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-[var(--text-main)]">
              <Lock className="h-5 w-5 text-[var(--accent-strong)]" />
              <h1 className="text-[24px] font-medium">Guest Verification</h1>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-[16px] bg-slate-50 p-4 text-sm leading-6 text-[var(--text-soft)]">
                The live backend supports guest accounts through the same JWT login flow used by the rest of the app.
              </div>
              <Button className="h-12 w-full" onClick={() => setGuestStep("waiting")}>
                Continue
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {state.guestStep === "waiting" ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <Card className="w-full max-w-[460px] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-6 text-[28px] font-medium text-[var(--text-main)]">Guest Access Updated</p>
            <p className="mt-3 text-base leading-6 text-[var(--text-soft)]">
              Use the main authentication screen to sign in with your issued guest account, then join the room using the room code you received.
            </p>
            <div className="mt-6">
              <StatusPill tone="accent">JWT-backed guest login required</StatusPill>
            </div>
          </Card>
        </div>
      ) : null}
    </AppScaffold>
  );
}
