import type { Intake, SessionSummary, Wellbeing } from "@/engine/types";

export interface Client {
  id: string;
  name: string;
  initials: string;
  age: number;
  sex: Intake["sex"];
  species: Intake["species"];
  since: string;
  mainConcern: string;
  nextVisit: string;
  consentOn: string;
  phone: string;
  email: string;
  sessions: SessionSummary[];
  intake: Intake;
  homeDevice?: "neuroscope-ne230f";
}

const wb = (pain: number, stress: number, sleep: number, energy: number): Wellbeing => ({ pain, stress, sleep, energy });

const SARAH_INTAKE: Intake = {
  priorities: ["support-earth", "emotional-balance"],
  age: 54,
  sex: "female",
  species: "human",
  mainConcern: "Digestion and low energy",
  duration: "About two years",
  tried: "Probiotics, cutting gluten, more sleep",
  elementScores: { wood: 6, fire: 4, earth: 8, metal: 3, water: 5 },
  wellbeing: wb(3, 6, 4, 3),
  consentSignedAt: "2026-06-12T09:14:00Z",
};

export const CLIENTS: Client[] = [
  {
    id: "sarah-m",
    name: "Sarah M.",
    initials: "SM",
    age: 54,
    sex: "female",
    species: "human",
    since: "June 2026",
    mainConcern: "Digestion and low energy",
    nextVisit: "Today, 2:30 pm",
    consentOn: "12 Jun 2026",
    phone: "+1 303 555 0142",
    email: "sarah@example.com",
    intake: SARAH_INTAKE,
    homeDevice: "neuroscope-ne230f",
    sessions: [
      {
        id: "s6", date: "2026-10-10", goal: "Digestion and steady energy", focus: "earth", points: 4,
        openingReading: 68, closingReading: 41,
        wellbeingBefore: wb(3, 6, 4, 3), wellbeingAfter: wb(2, 3, 5, 5), checkin24: wb(2, 3, 6, 6), checkin48: wb(2, 4, 7, 7),
        balance: { scores: { wood: 1.1, fire: 0.2, earth: -1.3, metal: 0.1, water: -0.1 }, weakest: "earth", strongest: "wood", gap: 2.4 },
        pointLogs: [
          { code: "SP 6", startedAt: "", secondsToSettle: 18, tones: [] },
          { code: "ST 36", startedAt: "", secondsToSettle: 14, tones: [] },
          { code: "CV 12", startedAt: "", secondsToSettle: 22, tones: [] },
          { code: "LV 3", startedAt: "", secondsToSettle: 11, tones: [] },
        ],
      },
      { id: "s5", date: "2026-10-03", goal: "Digestion and steady energy", focus: "earth", points: 5, openingReading: 62, closingReading: 44, wellbeingBefore: wb(4, 6, 4, 3), wellbeingAfter: wb(3, 4, 5, 4), checkin24: wb(3, 4, 5, 5), checkin48: wb(3, 4, 6, 5), balance: { scores: { wood: 1.3, fire: 0.3, earth: -1.5, metal: 0, water: -0.1 }, weakest: "earth", strongest: "wood", gap: 2.8 } },
      { id: "s4", date: "2026-09-26", goal: "Head comfort", focus: "wood", points: 4, openingReading: 66, closingReading: 46, wellbeingBefore: wb(5, 7, 3, 3), wellbeingAfter: wb(3, 5, 4, 4), checkin24: wb(3, 5, 5, 4), checkin48: wb(4, 5, 5, 4), balance: { scores: { wood: 1.6, fire: 0.4, earth: -1.6, metal: -0.2, water: -0.2 }, weakest: "earth", strongest: "wood", gap: 3.2 } },
      { id: "s3", date: "2026-09-12", goal: "Digestion and steady energy", focus: "earth", points: 4, openingReading: 70, closingReading: 49, wellbeingBefore: wb(5, 7, 3, 2), wellbeingAfter: wb(4, 5, 4, 3), checkin24: wb(4, 6, 4, 3), checkin48: wb(4, 6, 4, 3) },
      { id: "s2", date: "2026-08-29", goal: "Digestion and steady energy", focus: "earth", points: 4, openingReading: 72, closingReading: 51, wellbeingBefore: wb(6, 7, 3, 2), wellbeingAfter: wb(5, 6, 3, 3), checkin24: wb(5, 6, 4, 3), checkin48: wb(5, 6, 4, 3) },
      { id: "s1", date: "2026-08-15", goal: "Digestion and steady energy", focus: "earth", points: 4, openingReading: 74, closingReading: 52, wellbeingBefore: wb(6, 8, 3, 2), wellbeingAfter: wb(5, 6, 3, 2), checkin24: wb(6, 7, 3, 2), checkin48: wb(6, 7, 3, 2), balance: { scores: { wood: 1.8, fire: 0.5, earth: -1.9, metal: -0.1, water: -0.3 }, weakest: "earth", strongest: "wood", gap: 3.7 } },
    ],
  },
  {
    id: "david-r",
    name: "David R.",
    initials: "DR",
    age: 41,
    sex: "male",
    species: "human",
    since: "September 2026",
    mainConcern: "Migraines, two a week",
    nextVisit: "Today, 4:00 pm",
    consentOn: "4 Sep 2026",
    phone: "+1 303 555 0177",
    email: "david@example.com",
    intake: {
      priorities: ["head-comfort", "restful-sleep"],
      age: 41, sex: "male", species: "human",
      mainConcern: "Migraines, two a week", duration: "Six years", tried: "Triptans, caffeine cut, blue-light glasses",
      elementScores: { wood: 8, fire: 6, earth: 3, metal: 2, water: 4 },
      wellbeing: wb(7, 7, 4, 4),
      consentSignedAt: "2026-09-04T15:02:00Z",
    },
    sessions: [
      { id: "d3", date: "2026-10-24", goal: "Head comfort", focus: "wood", points: 4, openingReading: 81, closingReading: 55, wellbeingBefore: wb(7, 7, 4, 4), wellbeingAfter: wb(3, 4, 5, 5), checkin24: wb(2, 4, 6, 6), checkin48: wb(3, 4, 6, 6) },
      { id: "d2", date: "2026-10-10", goal: "Head comfort", focus: "wood", points: 4, openingReading: 84, closingReading: 60, wellbeingBefore: wb(8, 7, 3, 3), wellbeingAfter: wb(4, 5, 4, 4), checkin24: wb(4, 5, 5, 4), checkin48: wb(5, 5, 5, 4) },
      { id: "d1", date: "2026-09-26", goal: "Head comfort", focus: "wood", points: 4, openingReading: 88, closingReading: 66, wellbeingBefore: wb(8, 8, 3, 3), wellbeingAfter: wb(5, 6, 3, 3), checkin24: wb(6, 6, 4, 3), checkin48: wb(6, 6, 4, 3) },
    ],
  },
  {
    id: "june-k",
    name: "June K.",
    initials: "JK",
    age: 73,
    sex: "female",
    species: "human",
    since: "October 2026",
    mainConcern: "Unsteady on her feet",
    nextVisit: "Tomorrow, 10:00 am",
    consentOn: "20 Oct 2026",
    phone: "+1 303 555 0199",
    email: "june@example.com",
    intake: {
      priorities: ["steadiness", "back-comfort"],
      age: 73, sex: "female", species: "human",
      mainConcern: "Unsteady on her feet, dizzy standing up", duration: "Eight months", tried: "Physio, a cane",
      elementScores: { wood: 4, fire: 3, earth: 5, metal: 3, water: 8 },
      wellbeing: wb(4, 5, 5, 3),
      consentSignedAt: "2026-10-20T10:40:00Z",
    },
    sessions: [
      { id: "j1", date: "2026-10-28", goal: "Steadiness and balance", focus: "water", points: 6, openingReading: 77, closingReading: 58, wellbeingBefore: wb(4, 5, 5, 3), wellbeingAfter: wb(3, 4, 5, 4), checkin24: wb(3, 4, 6, 5) },
    ],
  },
  {
    id: "bramble",
    name: "Bramble (horse)",
    initials: "B",
    age: 12,
    sex: "male",
    species: "horse",
    since: "October 2026",
    mainConcern: "Stiff behind after jumping",
    nextVisit: "Saturday",
    consentOn: "Owner, 25 Oct 2026",
    phone: "+1 303 555 0160",
    email: "owner@example.com",
    intake: {
      priorities: ["back-comfort", "knee-recovery"],
      age: 12, sex: "male", species: "horse",
      mainConcern: "Stiff behind after jumping", duration: "Three weeks", tried: "Rest, liniment",
      elementScores: { wood: 7, fire: 4, earth: 4, metal: 3, water: 6 },
      wellbeing: wb(5, 4, 5, 5),
      consentSignedAt: "2026-10-25T08:00:00Z",
    },
    sessions: [],
  },
];

export const CLIENT_BY_ID = Object.fromEntries(CLIENTS.map((c) => [c.id, c]));

export const PRACTITIONER = {
  name: "Elena Marsh",
  credential: "Certified Living Current Practitioner",
  clinic: "Marsh Wellness, Boulder",
  licence: "LMT · supervised by Dr. R. Patel, DC",
  device: "Equiscope · S/N 1182",
};
