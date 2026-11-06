import type { ElementBalance, PointLog, SessionSummary, Wellbeing } from "./types";

export * from "./types";
export * from "./pulse";
export * from "./tongue";
export * from "./chrono";
export * from "./protocol";

/**
 * The Living Current Index, 0–100. 50 means "at your starting point".
 * Always measured against the client's own first sessions, never a norm.
 *
 *   Settle score       how far the reading settled this session
 *   Point settle time  seconds each point took to steady
 *   Five-element       spread of the pulse ratings
 *   Wellbeing          client's 0–10 ratings before / after / 24 h / 48 h
 *
 * Weights start as Amina's judgment and get tuned on pilot data.
 * Formula is a trade secret; the server computes the real one.
 */
export interface IndexBreakdown {
  total: number;
  band: "flowing" | "settling" | "needs care";
  settle: number;
  pointSettle: number;
  balance: number;
  wellbeing: number;
  deltaSinceFirst: number;
}

const W = { settle: 0.35, pointSettle: 0.15, balance: 0.2, wellbeing: 0.3 };

export function livingCurrentIndex(
  session: {
    openingReading: number;
    closingReading: number;
    pointLogs?: PointLog[];
    balance?: ElementBalance;
    wellbeingBefore: Wellbeing;
    wellbeingAfter: Wellbeing;
    checkin24?: Wellbeing;
    checkin48?: Wellbeing;
  },
  baseline: SessionSummary | null,
): IndexBreakdown {
  // Settle: percent drop in reading, 0 → 50, 40%+ drop → 100
  const drop = (session.openingReading - session.closingReading) / Math.max(session.openingReading, 1);
  const settle = clamp(50 + drop * 125, 0, 100);

  // Point settle: faster is better; 10 s → 100, 40 s → 40
  const logs = session.pointLogs?.filter((l) => l.secondsToSettle != null) ?? [];
  const avgSettle = logs.length ? logs.reduce((a, l) => a + (l.secondsToSettle ?? 0), 0) / logs.length : 25;
  const pointSettle = clamp(120 - avgSettle * 2, 0, 100);

  // Balance: smaller gap between strongest and weakest element is better
  const gap = session.balance?.gap ?? 1.5;
  const balance = clamp(100 - gap * 25, 0, 100);

  // Wellbeing: average of improvements across the four sliders, latest check-in wins
  const latest = session.checkin48 ?? session.checkin24 ?? session.wellbeingAfter;
  const wb = wellbeingScore(session.wellbeingBefore, latest);

  const total = Math.round(W.settle * settle + W.pointSettle * pointSettle + W.balance * balance + W.wellbeing * wb);

  const baselineTotal = baseline
    ? Math.round(
        W.settle * clamp(50 + ((baseline.openingReading - baseline.closingReading) / Math.max(baseline.openingReading, 1)) * 125, 0, 100) +
          W.pointSettle * 60 +
          W.balance * clamp(100 - (baseline.balance?.gap ?? 1.5) * 25, 0, 100) +
          W.wellbeing * wellbeingScore(baseline.wellbeingBefore, baseline.checkin48 ?? baseline.wellbeingAfter),
      )
    : total;

  return {
    total,
    band: total >= 70 ? "flowing" : total >= 50 ? "settling" : "needs care",
    settle: Math.round(settle),
    pointSettle: Math.round(pointSettle),
    balance: Math.round(balance),
    wellbeing: Math.round(wb),
    deltaSinceFirst: total - baselineTotal,
  };
}

function wellbeingScore(before: Wellbeing, after: Wellbeing): number {
  // pain and stress: lower is better; sleep and energy: higher is better
  const d =
    (before.pain - after.pain) + (before.stress - after.stress) + (after.sleep - before.sleep) + (after.energy - before.energy);
  // d ranges roughly −40…+40; map +12 → 100, 0 → 50
  return clamp(50 + (d / 12) * 50, 0, 100);
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
