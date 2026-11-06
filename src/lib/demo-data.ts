export type SessionRecord = {
  date: string;
  score: number;
  focus: string;
  duration: string;
};

export type ClientRecord = {
  id: string;
  name: string;
  initials: string;
  age: number;
  pronouns: string;
  focus: string;
  nextVisit: string;
  lastVisit: string;
  status: "Follow-up" | "New client" | "Check-in due";
  color: string;
  sessions: SessionRecord[];
};

export const clients: ClientRecord[] = [
  {
    id: "sarah-m",
    name: "Sarah M.",
    initials: "SM",
    age: 38,
    pronouns: "she / her",
    focus: "Energy · digestion · sleep",
    nextVisit: "Today, 10:00 AM",
    lastVisit: "Oct 28",
    status: "Follow-up",
    color: "lavender",
    sessions: [
      { date: "Oct 07", score: 61, focus: "Settle", duration: "42 min" },
      { date: "Oct 14", score: 66, focus: "Earth", duration: "45 min" },
      { date: "Oct 28", score: 72, focus: "Balance", duration: "46 min" },
    ],
  },
  {
    id: "maya-r",
    name: "Maya R.",
    initials: "MR",
    age: 42,
    pronouns: "she / her",
    focus: "Stress · jaw tension",
    nextVisit: "Today, 11:30 AM",
    lastVisit: "Nov 01",
    status: "Check-in due",
    color: "peach",
    sessions: [
      { date: "Oct 18", score: 58, focus: "Settle", duration: "40 min" },
      { date: "Nov 01", score: 64, focus: "Wood", duration: "43 min" },
    ],
  },
  {
    id: "leo-k",
    name: "Leo K.",
    initials: "LK",
    age: 31,
    pronouns: "he / him",
    focus: "Recovery · focus",
    nextVisit: "Today, 2:00 PM",
    lastVisit: "First visit",
    status: "New client",
    color: "blue",
    sessions: [],
  },
];

export const protocolLibrary = [
  {
    id: "earth-support",
    name: "Support Earth",
    goal: "Restore grounded energy",
    tags: ["Earth low", "Wood over-acting"],
    points: ["ST 36", "SP 3", "REN 12"],
    active: true,
  },
  {
    id: "gentle-settle",
    name: "Gentle settle",
    goal: "Invite a calm, even rhythm",
    tags: ["High tension", "Sleep support"],
    points: ["HT 7", "PC 6", "Yintang"],
    active: true,
  },
];

export function getClient(id: string) {
  return clients.find((client) => client.id === id);
}
