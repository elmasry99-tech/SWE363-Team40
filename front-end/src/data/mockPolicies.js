export const mockPolicies = [
  { id: "p1", name: "File Sharing", value: "Enabled for approved rooms", tone: "accent" },
  { id: "p2", name: "Screen Sharing", value: "Disabled by tenant policy", tone: "warning" },
  { id: "p3", name: "External Access", value: "Allowed with moderated entry", tone: "active" },
  { id: "p4", name: "Guest Verification", value: "Required before room access", tone: "accent" },
];

export const mockRetention = [
  {
    id: "r1",
    title: "Message Retention",
    description:
      "Store internal room history for 30 days, then purge automatically while keeping metadata-only logs.",
  },
  {
    id: "r2",
    title: "Session Expiration",
    description:
      "Expire external guest access when the room closes or the invite validity window ends.",
  },
];
