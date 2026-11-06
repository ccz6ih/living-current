import type { ChronoResult, Element } from "./types";

/** The 24-hour organ clock, starting at 3 am with the Lung. */
const CLOCK: { organ: string; element: Element }[] = [
  { organ: "Lung", element: "metal" }, // 3–5
  { organ: "Large intestine", element: "metal" }, // 5–7
  { organ: "Stomach", element: "earth" }, // 7–9
  { organ: "Spleen", element: "earth" }, // 9–11
  { organ: "Heart", element: "fire" }, // 11–13
  { organ: "Small intestine", element: "fire" }, // 13–15
  { organ: "Bladder", element: "water" }, // 15–17
  { organ: "Kidney", element: "water" }, // 17–19
  { organ: "Pericardium", element: "fire" }, // 19–21
  { organ: "San Jiao", element: "fire" }, // 21–23
  { organ: "Gallbladder", element: "wood" }, // 23–1
  { organ: "Liver", element: "wood" }, // 1–3
];

const STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
const BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];

/**
 * What the app works out on its own: which organ peaks and dips now, and the
 * day's stem and branch. Whether Amina also wants Zi Wu Liu Zhu / Ling Gui Ba Fa
 * is an open question; the hooks are here.
 */
export function chrono(when: Date): ChronoResult {
  const hour = when.getHours();
  const slot = Math.floor(((hour - 3 + 24) % 24) / 2);
  const peak = CLOCK[slot];
  const dip = CLOCK[(slot + 6) % 12];

  // Day stem/branch from a fixed epoch (sexagenary cycle). 1984-02-02 was a Jia-Zi day.
  const epoch = Date.UTC(1984, 1, 2);
  const days = Math.floor((Date.UTC(when.getFullYear(), when.getMonth(), when.getDate()) - epoch) / 86400000);
  const idx = ((days % 60) + 60) % 60;

  return {
    hour,
    peakOrgan: peak.organ,
    peakElement: peak.element,
    dipOrgan: dip.organ,
    dipElement: dip.element,
    stem: STEMS[idx % 10],
    branch: BRANCHES[idx % 12],
    note: `${peak.organ} is at its peak this hour; ${dip.organ} is at its lowest.`,
  };
}
