"use client";

import { usePathname } from "next/navigation";
import { RoomWorkspace } from "@/components/room/RoomWorkspace";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function RoomPage({ params }) {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["internal"]);
  if (!hydrated) return null;
  return <RoomWorkspace pathname={pathname} roomId={params.roomId} />;
}
