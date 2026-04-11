"use client";

import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { FileDropCard } from "@/components/files/FileDropCard";
import { CallPanel } from "@/components/call/CallPanel";
import { baseMessages } from "@/data/mockMessages";
import { useSessionState } from "@/hooks/useSessionState";

export function GuestAccessView({ pathname }) {
  const { state, setGuestStep, setCallView, signOut, sendMessage, addUpload, sendUploadAsMessage } = useSessionState();
  const guestMessages = state.messagesByRoom.guest || baseMessages.guest;
  const uploadedFile = state.uploads.guest;
  const [draft, setDraft] = useState("");

  return (
    <AppScaffold
      role="guest"
      title="Client Intake - Jones"
      subtitle="Guest Session"
      pathname={pathname}
      onLogout={signOut}
    >
      {state.guestStep === "verify" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="rounded-[22px] bg-[linear-gradient(180deg,#0d1b31,#132741)] p-8 text-white">
            <div className="max-w-xl">
              <p className="text-[32px] font-medium">Guest Access</p>
              <p className="mt-3 text-base leading-8 text-slate-300">
                Complete invite verification and submit your request for moderated room access.
              </p>
            </div>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-[var(--text-main)]">
              <Lock className="h-5 w-5 text-[var(--accent-strong)]" />
              <h1 className="text-[24px] font-medium">Verify Your Access</h1>
            </div>
            <div className="mt-6 space-y-4">
              {["Invite Code", "Full Name", "Email Address"].map((label, index) => (
                <label key={label} className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">{label}</span>
                  <input
                    type={index === 2 ? "email" : "text"}
                    defaultValue={index === 0 ? "CN-INTAKE-2048" : ""}
                    className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
                  />
                </label>
              ))}
              <div className="rounded-[16px] bg-slate-50 p-4 text-sm leading-6 text-[var(--text-soft)]">
                Your session is limited to this room and expires when the host closes the conversation.
              </div>
              <Button className="h-12 w-full" onClick={() => setGuestStep("waiting")}>
                Verify &amp; Request Access
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {state.guestStep === "waiting" ? (
        <div className="flex min-h-[520px] items-center justify-center">
          <Card className="w-full max-w-[460px] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-6 text-[28px] font-medium text-[var(--text-main)]">Waiting for Admission</p>
            <p className="mt-3 text-base leading-6 text-[var(--text-soft)]">
              The host has received your request. Your room access will open after approval.
            </p>
            <div className="mt-6 rounded-[16px] bg-slate-50 p-4 text-sm text-[var(--text-soft)]">
              Room: Client Intake - Jones
              <br />
              Status: Pending Host Approval
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => setGuestStep("admitted")}>Enter When Approved</Button>
              <Button variant="secondary" onClick={() => setGuestStep("verify")}>
                Edit Details
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {state.guestStep === "admitted" ? (
        state.callView === "video" ? (
          <CallPanel onLeave={() => setCallView("chat")} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <StatusPill tone="accent">You have been admitted to the room</StatusPill>
                <Button variant="secondary" onClick={() => setCallView("video")}>
                  Join Call
                </Button>
              </div>
              <ChatPanel
                messages={guestMessages}
                draft={draft}
                onDraftChange={setDraft}
                onSend={() => {
                  sendMessage("guest", draft);
                  setDraft("");
                }}
              />
            </div>
            <div className="space-y-4">
              <FileDropCard
                title="Share requested documents"
                subtitle="PDF, JPG, PNG up to 10MB"
                uploadedFile={uploadedFile}
                onUpload={(file) => file && addUpload("guest", file)}
                onSend={() => sendUploadAsMessage("guest")}
              />
              <Card className="p-5">
                <p className="text-sm font-medium text-[var(--text-main)]">Session Scope</p>
                <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
                  <p>Room-scoped messaging only</p>
                  <p>Files visible only inside this room</p>
                  <p>Access ends when the host closes the session</p>
                </div>
              </Card>
            </div>
          </div>
        )
      ) : null}
    </AppScaffold>
  );
}
