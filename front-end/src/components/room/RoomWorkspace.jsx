"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Video } from "lucide-react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CallPanel } from "@/components/call/CallPanel";
import { FileDropCard } from "@/components/files/FileDropCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockRooms } from "@/data/mockRooms";
import { useSessionState } from "@/hooks/useSessionState";
import { ROUTES } from "@/lib/routes";

export function RoomWorkspace({ pathname, roomId }) {
  const router = useRouter();
  const {
    state,
    sendMessage,
    addUpload,
    sendUploadAsMessage,
    toggleRoomLock,
    setCallView,
    admitGuest,
    signOut,
  } = useSessionState();

  const rooms = [...state.customRooms, ...mockRooms];
  const room = rooms.find((entry) => entry.id === roomId) ?? rooms[0];
  const messages = state.messagesByRoom[room.id] || [];
  const uploadedFile = state.uploads[room.id];
  const guestAdmitted = state.admittedGuestRooms.includes(room.id);
  const participants = room.participants.map((person) =>
    person.state === "Waiting" && guestAdmitted ? { ...person, state: "Present" } : person,
  );
  const [draft, setDraft] = useState("");

  return (
    <AppScaffold
      role="internal"
      title={room.name}
      subtitle={room.kind}
      pathname={pathname}
      onLogout={signOut}
      actions={
        <Button
          variant="secondary"
          onClick={() => router.push(ROUTES.rooms)}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-medium text-[var(--text-main)]">{room.name}</p>
              <p className="mt-1 text-sm text-[var(--text-soft)]">{room.kind}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill tone="accent">Room Code {room.roomCode}</StatusPill>
              <Button variant="muted" onClick={toggleRoomLock}>
                {state.roomLocked ? "Unlock Room" : "Lock Room"}
              </Button>
            </div>
          </div>

          {state.callView === "video" ? (
            <CallPanel onLeave={() => setCallView("chat")} />
          ) : (
            <ChatPanel
              messages={messages}
              draft={draft}
              onDraftChange={setDraft}
              onSend={() => {
                sendMessage(room.id, draft);
                setDraft("");
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          <FileDropCard
            title="Share protected files with room participants"
            subtitle="PDF, DOCX, PNG up to 10MB"
            uploadedFile={uploadedFile}
            onUpload={(file) => file && addUpload(room.id, file)}
            onSend={() => sendUploadAsMessage(room.id)}
          />

          <Card className="p-5">
            <p className="text-sm font-medium text-[var(--text-main)]">Participants</p>
            <div className="mt-4 space-y-3">
              {participants.map((person) => (
                <div key={person.name} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[var(--text-main)]">{person.name}</p>
                    <p className="text-xs text-[var(--text-soft)]">{person.state}</p>
                  </div>
                  <StatusPill tone={person.state === "Waiting" ? "warning" : "active"}>
                    {person.state}
                  </StatusPill>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-medium text-[var(--text-main)]">Room Controls</p>
            <div className="mt-4 grid gap-3">
              <Button
                variant="secondary"
                className="inline-flex items-center justify-center gap-2"
                onClick={() => admitGuest(room.id)}
                disabled={guestAdmitted}
              >
                <Users className="h-4 w-4" />
                {guestAdmitted ? "Guest Admitted" : "Admit Waiting Guest"}
              </Button>
              <Button
                variant="secondary"
                className="inline-flex items-center justify-center gap-2"
                onClick={() => setCallView(state.callView === "video" ? "chat" : "video")}
              >
                <Video className="h-4 w-4" />
                {state.callView === "video" ? "Return to Chat" : "Join Live Call"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppScaffold>
  );
}
