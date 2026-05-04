"use client";

import { create } from "socketcluster-client";
import { getBackendUrl } from "@/lib/api";

let sharedSocket = null;
let sharedToken = null;

const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cyphernet-backend.onrender.com";

function getSocketOptions(token) {
  const backendUrl = new URL(BACKEND_WS_URL);

  return {
    hostname: backendUrl.hostname,
    port: backendUrl.port ? Number(backendUrl.port) : backendUrl.protocol === "https:" ? 443 : 80,
    secure: backendUrl.protocol === "https:",
    path: "/socketcluster/",
    autoConnect: true,
    query: { token },
  };
}

export function getSocketClient(token) {
  if (!token) return null;
  if (sharedSocket && sharedToken === token) return sharedSocket;

  if (sharedSocket) {
    sharedSocket.disconnect();
  }

  sharedToken = token;
  sharedSocket = create(getSocketOptions(token));
  return sharedSocket;
}

export function closeSocketClient() {
  if (sharedSocket) {
    sharedSocket.disconnect();
  }
  sharedSocket = null;
  sharedToken = null;
}
