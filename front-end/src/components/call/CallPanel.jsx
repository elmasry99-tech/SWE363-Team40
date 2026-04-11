"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Monitor, PhoneOff, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";

export function CallPanel({ onLeave }) {
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const micStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewStream, setPreviewStream] = useState(null);
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  function stopTracks(stream) {
    stream?.getTracks().forEach((track) => track.stop());
  }

  function stopAllMedia() {
    stopTracks(cameraStreamRef.current);
    stopTracks(micStreamRef.current);
    stopTracks(screenStreamRef.current);
    cameraStreamRef.current = null;
    micStreamRef.current = null;
    screenStreamRef.current = null;
    setPreviewStream(null);
    setMuted(true);
    setCameraOn(false);
    setSharing(false);
  }

  useEffect(() => {
    return () => {
      stopTracks(cameraStreamRef.current);
      stopTracks(micStreamRef.current);
      stopTracks(screenStreamRef.current);
    };
  }, []);

  async function handleToggleMic() {
    if (!muted) {
      stopTracks(micStreamRef.current);
      micStreamRef.current = null;
      setMuted(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMuted(false);
      setMediaError("");
    } catch {
      setMediaError("Microphone access was blocked by the browser.");
    }
  }

  async function handleToggleCamera() {
    if (cameraOn) {
      stopTracks(cameraStreamRef.current);
      cameraStreamRef.current = null;
      setCameraOn(false);
      if (!screenStreamRef.current) {
        setPreviewStream(null);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      setCameraOn(true);
      if (!screenStreamRef.current) {
        setPreviewStream(stream);
      }
      setMediaError("");
    } catch {
      setMediaError("Camera access was blocked by the browser.");
    }
  }

  async function handleToggleScreenShare() {
    if (sharing) {
      stopTracks(screenStreamRef.current);
      screenStreamRef.current = null;
      setSharing(false);
      setPreviewStream(cameraStreamRef.current);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      setSharing(true);
      setPreviewStream(stream);
      setMediaError("");

      const [track] = stream.getVideoTracks();
      if (track) {
        track.addEventListener("ended", () => {
          stopTracks(screenStreamRef.current);
          screenStreamRef.current = null;
          setSharing(false);
          setPreviewStream(cameraStreamRef.current);
        });
      }
    } catch {
      setMediaError("Screen sharing was cancelled or blocked.");
    }
  }

  return (
    <div className="bg-[linear-gradient(180deg,#1a2c43,#13243b)] p-4 text-white">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span>Live Secure Call</span>
        </div>
        <StatusPill tone="accent">3 Participants</StatusPill>
      </div>

      <div className="rounded-[22px] bg-[linear-gradient(180deg,#6a87ab,#516a8c)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="flex min-h-[320px] items-center justify-center">
          {previewStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-[320px] w-full rounded-[18px] object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(7,17,31,0.36)] text-[30px]">
                JD
              </div>
              <p className="mt-4 text-[18px] font-medium">John Doe (Host)</p>
              <p className="text-sm text-white/75">Camera and screen share are currently off.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] bg-[rgba(255,255,255,0.08)] px-4 py-4 backdrop-blur sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${
                muted ? "bg-[rgba(217,101,112,0.24)] text-[#f5a3ae]" : "bg-[rgba(60,195,214,0.2)] text-[var(--accent)]"
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleCamera}
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${
                cameraOn ? "bg-[rgba(60,195,214,0.2)] text-[var(--accent)]" : "bg-[rgba(217,101,112,0.24)] text-[#f5a3ae]"
              }`}
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleScreenShare}
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${
                sharing ? "bg-[rgba(60,195,214,0.2)] text-[var(--accent)]" : "bg-[rgba(217,101,112,0.24)] text-[#f5a3ae]"
              }`}
            >
              <Monitor className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-[rgba(7,17,31,0.26)] px-4 py-3 text-sm text-slate-200">
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
              stopAllMedia();
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
