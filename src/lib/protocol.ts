export const pulsePositions = [
  "Left cun",
  "Left guan",
  "Left chi",
  "Left cun (deep)",
  "Left guan (deep)",
  "Left chi (deep)",
  "Left wrist",
  "Right cun",
  "Right guan",
  "Right chi",
  "Right cun (deep)",
  "Right guan (deep)",
  "Right chi (deep)",
  "Right wrist",
] as const;

export type PulsePosition = (typeof pulsePositions)[number];
export type PulseReadings = Record<PulsePosition, number>;

export type ProtocolPoint = {
  name: string;
  location: string;
  seconds: number;
  tone: "tonify" | "even" | "reduce";
  reason: string;
};

const earthPoints: ProtocolPoint[] = [
  {
    name: "ST 36",
    location: "Below the knee",
    seconds: 90,
    tone: "tonify",
    reason: "Supports Earth and steady energy",
  },
  {
    name: "SP 3",
    location: "Inner foot",
    seconds: 60,
    tone: "tonify",
    reason: "Strengthens the Spleen channel",
  },
  {
    name: "REN 12",
    location: "Upper abdomen",
    seconds: 60,
    tone: "even",
    reason: "Settles the center",
  },
];

export function deriveElementGaps(readings: { earth: number; wood: number }) {
  return {
    earth: Number(Math.max(0, 2 - readings.earth).toFixed(2)),
    wood: Number(Math.max(0, readings.wood - 2).toFixed(2)),
  };
}

export function buildProtocol(gaps: { earth: number; wood: number }) {
  if (gaps.earth > 0.5 && gaps.wood > 0.5) {
    return {
      title: "Support Earth",
      summary:
        "Nourish the center first, then soften the overactive Wood pattern.",
      points: earthPoints,
      settings: { pace: "Gentle", sessionMinutes: 18 },
    };
  }

  if (gaps.earth > 0.5) {
    return {
      title: "Nourish the center",
      summary: "Build steady, grounded energy with a gentle Earth sequence.",
      points: earthPoints,
      settings: { pace: "Gentle", sessionMinutes: 15 },
    };
  }

  return {
    title: "Settle and balance",
    summary: "A light balancing sequence based on today’s readings.",
    points: earthPoints.slice(0, 2),
    settings: { pace: "Even", sessionMinutes: 12 },
  };
}

export function calculateIndex({
  settle,
  pointSettle,
  balance,
}: {
  settle: number;
  pointSettle: number;
  balance: number;
}) {
  const values = [settle, pointSettle, balance];
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Index inputs must be finite numbers.");
  }

  const bounded = values.map((value) => Math.min(100, Math.max(0, value)));
  return Math.round(bounded.reduce((sum, value) => sum + value, 0) / 3);
}
