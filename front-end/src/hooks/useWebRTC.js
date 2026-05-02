"use client";

import { useEffect, useRef, useState } from "react";
import { getSocketClient } from "@/lib/socket";

function stopStream(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function useWebRTC({ token, roomId, currentUserId, participants }) {
  const socketRef = useRef(null);
  const peersRef = useRef(new Map());
  const localStreamRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const remoteStreamsRef = useRef(new Map());
  const [iceServers, setIceServers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [muted, setMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadIceServers() {
      if (!token) return;

      try {
        const response = await fetch("/ice-servers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!cancelled) {
          setIceServers(data.iceServers || []);
        }
      } catch {
        if (!cancelled) {
          setIceServers([{ urls: "stun:stun.l.google.com:19302" }]);
        }
      }
    }

    loadIceServers();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !roomId || !currentUserId) return undefined;

    const socket = getSocketClient(token);
    socketRef.current = socket;
    let cancelled = false;

    async function watchReceiver(event, handler) {
      for await (const payload of socket.receiver(event)) {
        if (cancelled) break;
        await handler(payload);
      }
    }

    function upsertRemoteStream(userId, stream) {
      const remoteParticipant = participants.find((entry) => entry.userId === userId);
      remoteStreamsRef.current.set(userId, {
        userId,
        name: remoteParticipant?.name || "Participant",
        stream,
      });
      setRemoteStreams(Array.from(remoteStreamsRef.current.values()));
    }

    function removeRemoteStream(userId) {
      remoteStreamsRef.current.delete(userId);
      setRemoteStreams(Array.from(remoteStreamsRef.current.values()));
    }

    function getPeerConnection(targetUserId) {
      if (peersRef.current.has(targetUserId)) {
        return peersRef.current.get(targetUserId);
      }

      const peer = new RTCPeerConnection({ iceServers });
      peersRef.current.set(targetUserId, peer);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peer.addTrack(track, localStreamRef.current);
        });
      }

      peer.onicecandidate = (event) => {
        if (!event.candidate) return;
        socket.transmit("call:ice-candidate", {
          roomId,
          targetUserId,
          candidate: event.candidate,
        });
      };

      peer.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) {
          upsertRemoteStream(targetUserId, stream);
        }
      };

      peer.onconnectionstatechange = () => {
        if (["closed", "disconnected", "failed"].includes(peer.connectionState)) {
          removeRemoteStream(targetUserId);
        }
      };

      return peer;
    }

    async function makeOffer(targetUserId) {
      const peer = getPeerConnection(targetUserId);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.transmit("call:offer", {
        roomId,
        targetUserId,
        offer,
      });
    }

    watchReceiver("call:offer", async (payload) => {
      if (payload?.roomId !== roomId || payload?.targetUserId !== currentUserId) return;
      const peer = getPeerConnection(payload.fromUserId);
      await peer.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.transmit("call:answer", {
        roomId,
        targetUserId: payload.fromUserId,
        answer,
      });
    });

    watchReceiver("call:answer", async (payload) => {
      if (payload?.roomId !== roomId || payload?.targetUserId !== currentUserId) return;
      const peer = getPeerConnection(payload.fromUserId);
      await peer.setRemoteDescription(new RTCSessionDescription(payload.answer));
    });

    watchReceiver("call:ice-candidate", async (payload) => {
      if (payload?.roomId !== roomId || payload?.targetUserId !== currentUserId) return;
      const peer = getPeerConnection(payload.fromUserId);
      if (payload.candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    watchReceiver("call:end", async (payload) => {
      if (payload?.roomId !== roomId) return;
      const peer = peersRef.current.get(payload.fromUserId);
      peer?.close();
      peersRef.current.delete(payload.fromUserId);
      removeRemoteStream(payload.fromUserId);
    });

    watchReceiver("presence", async (payload) => {
      if (payload?.roomId !== roomId || payload?.userId === currentUserId || payload?.state !== "online") return;
      if (!localStreamRef.current) return;
      if (currentUserId < payload.userId) {
        await makeOffer(payload.userId);
      }
    });

    socket.transmit("presence", { roomId, state: "online" });

    return () => {
      cancelled = true;
      socket.transmit("presence", { roomId, state: "offline" });
    };
  }, [currentUserId, iceServers, participants, roomId, token]);

  useEffect(() => () => {
    stopStream(localStreamRef.current);
    stopStream(cameraStreamRef.current);
    stopStream(screenStreamRef.current);
    peersRef.current.forEach((peer) => peer.close());
    peersRef.current.clear();
  }, []);

  async function ensureAudio() {
    if (!localStreamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      cameraStreamRef.current = stream;
      setLocalStream(stream);
      setMuted(false);
      return stream;
    }

    const hasAudio = localStreamRef.current.getAudioTracks().length > 0;
    if (!hasAudio) {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const [audioTrack] = audioStream.getAudioTracks();
      if (audioTrack) {
        localStreamRef.current.addTrack(audioTrack);
        peersRef.current.forEach((peer) => peer.addTrack(audioTrack, localStreamRef.current));
      }
    }

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
    setLocalStream(localStreamRef.current);
    setMuted(false);
    return localStreamRef.current;
  }

  async function toggleMic() {
    try {
      if (!localStreamRef.current || muted) {
        await ensureAudio();
        setMediaError("");
        return;
      }

      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMuted(localStreamRef.current.getAudioTracks().every((track) => !track.enabled));
    } catch {
      setMediaError("Microphone access was blocked by the browser.");
    }
  }

  async function toggleCamera() {
    try {
      if (!localStreamRef.current || !cameraOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !localStreamRef.current });
        const videoTrack = stream.getVideoTracks()[0];

        if (!localStreamRef.current) {
          localStreamRef.current = stream;
        } else if (videoTrack) {
          localStreamRef.current.addTrack(videoTrack);
        }

        if (videoTrack) {
          peersRef.current.forEach((peer) => {
            const sender = peer.getSenders().find((entry) => entry.track?.kind === "video");
            if (sender) {
              sender.replaceTrack(videoTrack);
            } else {
              peer.addTrack(videoTrack, localStreamRef.current);
            }
          });
        }

        cameraStreamRef.current = stream;
        setLocalStream(localStreamRef.current);
        setCameraOn(true);
        setMuted(localStreamRef.current.getAudioTracks().every((track) => !track.enabled));
        setMediaError("");
        setIsReady(true);
        socketRef.current?.transmit("presence", { roomId, state: "online" });
        return;
      }

      const [videoTrack] = localStreamRef.current.getVideoTracks();
      if (videoTrack) {
        videoTrack.stop();
        localStreamRef.current.removeTrack(videoTrack);
      }

      peersRef.current.forEach((peer) => {
        const sender = peer.getSenders().find((entry) => entry.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(null);
        }
      });

      setLocalStream(localStreamRef.current);
      setCameraOn(false);
    } catch {
      setMediaError("Camera access was blocked by the browser.");
    }
  }

  async function toggleScreenShare() {
    try {
      if (sharing) {
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0] || null;
        peersRef.current.forEach((peer) => {
          const sender = peer.getSenders().find((entry) => entry.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(cameraTrack);
          }
        });
        stopStream(screenStreamRef.current);
        screenStreamRef.current = null;
        setSharing(false);
        setLocalStream(localStreamRef.current);
        return;
      }

      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      screenStreamRef.current = displayStream;

      peersRef.current.forEach((peer) => {
        const sender = peer.getSenders().find((entry) => entry.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack);
        } else if (localStreamRef.current) {
          peer.addTrack(screenTrack, localStreamRef.current);
        }
      });

      if (screenTrack) {
        screenTrack.addEventListener("ended", () => {
          toggleScreenShare().catch(() => {});
        }, { once: true });
      }

      setSharing(true);
      setLocalStream(displayStream);
      setMediaError("");
    } catch {
      setMediaError("Screen sharing was cancelled or blocked.");
    }
  }

  function leaveCall() {
    socketRef.current?.transmit("call:end", { roomId });
    stopStream(localStreamRef.current);
    stopStream(cameraStreamRef.current);
    stopStream(screenStreamRef.current);
    peersRef.current.forEach((peer) => peer.close());
    peersRef.current.clear();
    remoteStreamsRef.current.clear();
    localStreamRef.current = null;
    cameraStreamRef.current = null;
    screenStreamRef.current = null;
    setLocalStream(null);
    setRemoteStreams([]);
    setMuted(true);
    setCameraOn(false);
    setSharing(false);
    setIsReady(false);
  }

  return {
    localStream,
    remoteStreams,
    muted,
    cameraOn,
    sharing,
    mediaError,
    isReady,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    leaveCall,
  };
}
