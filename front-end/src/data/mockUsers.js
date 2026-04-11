export const mockUsers = {
  admin: {
    name: "Platform Administrator",
    email: "platform.admin@cyphernet.sa",
    role: "admin",
  },
  oso: {
    name: "Dana Al-Salem",
    email: "dana@northstar.sa",
    role: "oso",
    organization: "Northstar Legal",
  },
  internal: {
    name: "Mazen Osama",
    email: "mazen@northstar.sa",
    role: "internal",
    organization: "Northstar Legal",
  },
  guest: {
    name: "John Doe",
    email: "guest@external.com",
    role: "guest",
    inviteCode: "CN-INTAKE-2048",
  },
};

export const officerUsers = [
  { id: "u1", name: "Dana Al-Salem", email: "dana@northstar.sa", role: "Org Admin", state: "Verified", accountStatus: "active" },
  { id: "u2", name: "Omar Riyad", email: "omar@northstar.sa", role: "HR Manager", state: "Reset Required", accountStatus: "active" },
  { id: "u3", name: "Layla Haddad", email: "layla@northstar.sa", role: "Counsel", state: "Active", accountStatus: "active" },
  { id: "u4", name: "Sarah Johnson", email: "sarah@northstar.sa", role: "Recruiter", state: "Active", accountStatus: "active" },
];

export const pendingEmployeeRequests = [
  {
    id: "req1",
    name: "Noura Aziz",
    email: "noura@northstar.sa",
    requestedRole: "Internal Employee",
    requestedTitle: "Legal Assistant",
    requestedAt: "09:12",
  },
  {
    id: "req2",
    name: "Fahad Kareem",
    email: "fahad@northstar.sa",
    requestedRole: "Organization Security Officer",
    requestedTitle: "Security Supervisor",
    requestedAt: "10:48",
  },
];
