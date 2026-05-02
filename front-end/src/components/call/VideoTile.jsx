"use client";

import { useEffect, useRef } from "react";

export function VideoTile({ label, stream, muted = false, priority = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  return (
    <div className={`rounded-[22px] bg-[rgba(255,255,255,0.08)] p-3 ${priority ? "min-h-[320px]" : "min-h-[160px]"}`}>
      <div className="flex h-full min-h-[140px] items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#6a87ab,#516a8c)]">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(7,17,31,0.36)] text-2xl">
              {label.slice(0, 2).toUpperCase()}
            </div>
            <p className="mt-3 text-sm font-medium">{label}</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-white/85">{label}</p>
    </div>
  );
}
