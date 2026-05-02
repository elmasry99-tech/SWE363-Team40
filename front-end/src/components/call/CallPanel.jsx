"use client";

import { Mic, Monitor, PhoneOff, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { VideoTile } from "@/components/call/VideoTile";
import { useSessionState } from "@/hooks/useSessionState";
import { useWebRTC } from "@/hooks/useWebRTC";

export function CallPanel({ roomId, participants, onLeave }) {
  const { state } = useSessionState();
  const {
    localStream,
    remoteStreams,
    muted,
    cameraOn,
    sharing,
    mediaError,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    leaveCall,
  } = useWebRTC({
    token: state.token,
    roomId,
    currentUserId: state.user?.id,
    participants,
  });

  return (
    <div className="bg-[linear-gradient(180deg,#1a2c43,#13243b)] p-3 text-white sm:p-4">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span>Live Secure Call</span>
        </div>
        <StatusPill tone="accent">{participants.length} Participants</StatusPill>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <VideoTile
          label={`${state.user?.name || "You"} (You)`}
          stream={localStream}
          muted
          priority
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {remoteStreams.length ? (
            remoteStreams.map((entry) => (
              <VideoTile key={entry.userId} label={entry.name} stream={entry.stream} />
            ))
          ) : (
            <VideoTile label="Waiting for participants" stream={null} />
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] bg-[rgba(255,255,255,0.08)] px-4 py-4 backdrop-blur sm:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toggleMic()}
            className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-[52px] sm:w-[52px] ${
              muted ? "bg-[rgba(217,101,112,0.24)] text-[#f5a3ae]" : "bg-[rgba(60,195,214,0.2)] text-[var(--accent)]"
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => toggleCamera()}
            className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-[52px] sm:w-[52px] ${
              cameraOn ? "bg-[rgba(60,195,214,0.2)] text-[var(--accent)]" : "bg-[rgba(217,101,112,0.24)] text-[#f5a3ae]"
            }`}
          >
            <Video className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => toggleScreenShare()}
            className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-[52px] sm:w-[52px] ${
              sharing ? "bg-[rgba(60,195,214,0.2)] text-[var(--accent)]" : "bg-[rgba(217,101,112,0.24)] text-[#f5a3ae]"
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-[16px] bg-[rgba(7,17,31,0.26)] px-4 py-3 text-sm text-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <span>{muted ? "Microphone off" : "Microphone live"}</span>
            <span>{cameraOn ? "Camera on" : "Camera off"}</span>
            <span>{sharing ? "Screen sharing live" : "Screen share off"}</span>
            {mediaError ? <span className="text-[#f5a3ae]">{mediaError}</span> : null}
          </div>
          <Button
            variant="danger"
            className="flex h-12 items-center gap-2 px-6"
            onClick={() => {
              leaveCall();
              onLeave?.();
            }}
          >
            <PhoneOff className="h-5 w-5" />
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
}
