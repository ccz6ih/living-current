import {
  ELEMENTS,
  PULSE_MAP,
  type Element,
  type ElementBalance,
  type PulseReading,
} from "./types";

export const posKey = (side: string, position: string) => `${side}.${position}`;

/**
 * Compare left with right and position with position. Each element gets a
 * score from −2 (clearly deficient) to +2 (clearly excess), built from how
 * far its positions sit from the client's own mean.
 *
 * PLACEHOLDER: Amina's 14-position map and her weighting replace this.
 */
export function readBalance(pulse: PulseReading): ElementBalance {
  const ratings = PULSE_MAP.map((p) => pulse.ratings[posKey(p.side, p.position)] ?? 3);
  const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  const scores = Object.fromEntries(ELEMENTS.map((e) => [e, 0])) as Record<Element, number>;
  const counts = Object.fromEntries(ELEMENTS.map((e) => [e, 0])) as Record<Element, number>;

  PULSE_MAP.forEach((p, i) => {
    const delta = ratings[i] - mean;
    scores[p.element] += delta;
    counts[p.element] += 1;
  });

  for (const e of ELEMENTS) {
    const avg = counts[e] ? scores[e] / counts[e] : 0;
    // Qualities nudge the read: wiry → excess, thin → deficient
    const q = PULSE_MAP.filter((p) => p.element === e).flatMap(
      (p) => pulse.qualities[posKey(p.side, p.position)] ?? [],
    );
    let nudge = 0;
    if (q.includes("wiry") || q.includes("slippery")) nudge += 0.4;
    if (q.includes("thin") || q.includes("deep")) nudge -= 0.4;
    scores[e] = clamp(Math.round((avg + nudge) * 10) / 10, -2, 2);
  }

  const sorted = [...ELEMENTS].sort((a, b) => scores[a] - scores[b]);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  return { scores, weakest, strongest, gap: scores[strongest] - scores[weakest] };
}

export function describeBalance(b: ElementBalance): string {
  const w = cap(b.weakest);
  const s = cap(b.strongest);
  if (b.gap < 0.6) return "Pulses read close to even across the five elements.";
  return `${w} reads low (${fmt(b.scores[b.weakest])}) against ${s} strong (${fmt(b.scores[b.strongest])}).`;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);
