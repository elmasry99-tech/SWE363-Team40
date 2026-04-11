export const mockRooms = [
  {
    id: "client-intake-jones",
    name: "Client Intake - Jones",
    kind: "Guest room",
    roomCode: "CN-2048",
    unread: 3,
    participants: [
      { name: "Dana Al-Salem", state: "Present" },
      { name: "Mazen Osama", state: "Present" },
      { name: "Guest Candidate", state: "Waiting" },
    ],
  },
  {
    id: "executive-legal-review",
    name: "Executive Legal Review",
    kind: "Internal room",
    roomCode: "EL-8431",
    unread: 0,
    participants: [
      { name: "Layla Haddad", state: "Present" },
      { name: "Omar Riyad", state: "Present" },
    ],
  },
  {
    id: "hr-interview-panel",
    name: "HR Interview Panel",
    kind: "Recruiting room",
    roomCode: "HR-1107",
    unread: 1,
    participants: [
      { name: "Sarah Johnson", state: "Present" },
      { name: "Dana Al-Salem", state: "Present" },
    ],
  },
];

export const officerRooms = [
  { id: "r1", name: "Client Intake - Jones", owner: "Dana", policy: "Guest Access", state: "Live" },
  { id: "r2", name: "M&A Due Diligence", owner: "Layla", policy: "Internal Only", state: "Review" },
  { id: "r3", name: "HR Interview Room", owner: "Omar", policy: "Lobby On", state: "Live" },
];
