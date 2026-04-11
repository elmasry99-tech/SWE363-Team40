"use client";

import { usePathname } from "next/navigation";
import { RoomsList } from "@/components/room/RoomsList";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function RoomsPage() {
  const pathname = usePathname();
  const { hydrated } = useRoleRedirect(["internal"]);
  if (!hydrated) return null;
  return <RoomsList pathname={pathname} />;
}
