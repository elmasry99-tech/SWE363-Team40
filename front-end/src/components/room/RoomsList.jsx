"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockRooms } from "@/data/mockRooms";
import { getRoomRoute } from "@/lib/routes";
import { useSessionState } from "@/hooks/useSessionState";

export function RoomsList({ pathname }) {
  const router = useRouter();
  const { state, signOut, createRoomWithDetails, joinRoomByCode } = useSessionState();
  const rooms = [...state.customRooms, ...mockRooms];
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [joinError, setJoinError] = useState("");
  const [createForm, setCreateForm] = useState({
    name: "",
    kind: "Internal room",
    allowGuest: false,
  });
  const [joinCode, setJoinCode] = useState("");

  function updateCreateForm(key, value) {
    setCreateForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <AppScaffold
      role="internal"
      title="Secure Rooms"
      subtitle="Internal Secure End-User"
      pathname={pathname}
      onLogout={signOut}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
            Join a Room
          </Button>
          <Button variant="dark" onClick={() => setShowCreateModal(true)}>
            Create Room
          </Button>
        </div>
      }
    >
      {showCreateModal ? (
        <div className="mb-6 rounded-[24px] border border-[var(--border-light)] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-[var(--text-main)]">Create a New Secure Room</p>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                Set up the room details and generate a room code that participants can use to join.
              </p>
            </div>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Close
            </Button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Room Name</span>
              <input
                type="text"
                value={createForm.name}
                onChange={(event) => updateCreateForm("name", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
                placeholder="Example: Finance Review Session"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Room Type</span>
              <input
                type="text"
                value={createForm.kind}
                onChange={(event) => updateCreateForm("kind", event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm text-[var(--text-main)] outline-none"
              />
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-[var(--text-main)]">
            <input
              type="checkbox"
              checked={createForm.allowGuest}
              onChange={(event) => updateCreateForm("allowGuest", event.target.checked)}
              className="h-4 w-4 rounded border-[var(--border-light)]"
            />
            Allow a guest to wait in the room lobby
          </label>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                if (!createForm.name.trim()) return;
                const room = createRoomWithDetails(createForm);
                setCreatedRoom(room);
                setCreateForm({ name: "", kind: "Internal room", allowGuest: false });
              }}
            >
              Create and Generate Code
            </Button>
            {createdRoom ? (
              <Button variant="secondary" onClick={() => router.push(getRoomRoute(createdRoom.id))}>
                Open Room
              </Button>
            ) : null}
          </div>
          {createdRoom ? (
            <div className="mt-5 rounded-[16px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-[var(--text-main)]">{createdRoom.name} created successfully.</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">
                Room Code: <span className="font-medium text-[var(--accent-strong)]">{createdRoom.roomCode}</span>
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {showJoinModal ? (
        <div className="mb-6 rounded-[24px] border border-[var(--border-light)] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-[var(--text-main)]">Join a Room</p>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                Enter the room code shared with you to join an existing secure room.
              </p>
            </div>
            <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
              Close
            </Button>
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Room Code</span>
            <input
              type="text"
              value={joinCode}
              onChange={(event) => {
                setJoinCode(event.target.value.toUpperCase());
                setJoinError("");
              }}
              className="h-12 w-full rounded-[14px] border border-[var(--border-light)] px-4 text-sm uppercase text-[var(--text-main)] outline-none"
              placeholder="Example: CN-2048"
            />
          </label>
          {joinError ? <p className="mt-3 text-sm text-[#bf5460]">{joinError}</p> : null}
          <div className="mt-5">
            <Button
              onClick={() => {
                const room = joinRoomByCode(joinCode);
                if (!room) {
                  setJoinError("No room was found for that code.");
                  return;
                }
                setShowJoinModal(false);
                setJoinCode("");
                router.push(getRoomRoute(room.id));
              }}
            >
              Join Room
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-medium text-[var(--text-main)]">{room.name}</p>
                <p className="mt-1 text-sm text-[var(--text-soft)]">{room.kind}</p>
              </div>
              {room.unread ? <StatusPill tone="accent">{room.unread}</StatusPill> : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--text-soft)]">
              {room.participants.length} participants in this room.
            </p>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Room Code: <span className="font-medium text-[var(--accent-strong)]">{room.roomCode}</span>
            </p>
            <Link
              href={getRoomRoute(room.id)}
              className="mt-5 inline-flex rounded-[14px] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-4 py-2 text-sm font-medium text-slate-950"
            >
              Open Room
            </Link>
          </Card>
        ))}
      </div>
    </AppScaffold>
  );
}
