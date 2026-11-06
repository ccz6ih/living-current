import type { DeviceMode } from "@/engine/types";

/**
 * The devices Living Current runs alongside. Amina's protocols are written on
 * the Equiscope; the Acuscope / Myopulse translation is a placeholder until
 * each step is tested with Jan. The Neuroscope is the client's home unit.
 */
export type DeviceId = "equiscope" | "acuscope-80t" | "myopulse-75t" | "myopulse-75tn" | "neuroscope-ne230f";

export interface Device {
  id: DeviceId;
  name: string;
  maker: string;
  role: "clinic" | "home";
  priceGuide: string;
  bestFor: string;
  modes: DeviceMode[];
  translation: "native" | "pending" | "home";
}

export const DEVICES: Device[] = [
  { id: "equiscope", name: "Electro-Equiscope", maker: "Intelligent Bioenergetics", role: "clinic", priceGuide: "~$55k with training", bestFor: "Nerves, muscle and face in one unit; the device Amina's protocols are written on", modes: ["probe", "ear-clips", "plates", "headband", "myopulse"], translation: "native" },
  { id: "acuscope-80t", name: "Electro-Acuscope 80T", maker: "Acuscope Technology & Training", role: "clinic", priceGuide: "~$30k", bestFor: "Nerve-side protocols; the cheaper entry for new practitioners", modes: ["probe", "ear-clips", "plates", "headband"], translation: "pending" },
  { id: "myopulse-75t", name: "Myopulse 75T", maker: "Acuscope Technology & Training", role: "clinic", priceGuide: "paired with the 80T", bestFor: "Large muscles of the body", modes: ["myopulse", "plates"], translation: "pending" },
  { id: "myopulse-75tn", name: "Myopulse 75TN", maker: "Acuscope Technology & Training", role: "clinic", priceGuide: "paired with the 80T", bestFor: "Small muscles, head, neck, face and skin; the facials unit", modes: ["myopulse"], translation: "pending" },
  { id: "neuroscope-ne230f", name: "Neuroscope NE230F", maker: "Intelligent Bioenergetics", role: "home", priceGuide: "client purchase", bestFor: "Between-visit self-care at home, on a plan the practitioner sets", modes: ["probe", "plates"], translation: "home" },
];

export const DEVICE_BY_ID = Object.fromEntries(DEVICES.map((d) => [d.id, d])) as Record<DeviceId, Device>;

/**
 * Settings translation. Equiscope values are Amina's; the others are
 * PLACEHOLDER mappings to be confirmed with Jan on real units.
 * Returns the dial values a practitioner on `device` should set for an
 * Equiscope setting, plus which unit in a two-box setup carries it.
 */
export function translateSetting(device: DeviceId, eq: { frequency: string; waveform: string; mode: DeviceMode }) {
  if (device === "equiscope") return { ...eq, unit: "Equiscope", confidence: "native" as const };
  if (device === "neuroscope-ne230f") return { frequency: "preset", waveform: eq.waveform, mode: eq.mode, unit: "Neuroscope", confidence: "home" as const };
  const muscle = eq.mode === "myopulse";
  const unit = muscle ? (device === "myopulse-75tn" ? "Myopulse 75TN" : "Myopulse 75T") : "Acuscope 80T";
  return { ...eq, unit, confidence: "pending" as const };
}

/** Consumables tracked per practitioner. Low-stock nudges reorder through Jan or Intellbio. */
export const SUPPLIES = [
  { id: "gel", name: "Conductive gel", unit: "bottles", par: 2 },
  { id: "ear-clips", name: "Ear clip electrodes", unit: "pairs", par: 2 },
  { id: "plates", name: "Plate electrodes", unit: "pairs", par: 1 },
  { id: "probe-tips", name: "Probe tips", unit: "sets", par: 1 },
];

/** Between-visit plan for a client who owns a Neuroscope. PLACEHOLDER content. */
export const HOME_PLANS: Record<string, { title: string; days: string; steps: string[] }> = {
  earth: { title: "Warm the centre", days: "Every other day, 10 minutes", steps: ["Plates on the lower legs, preset 2, 5 minutes", "Probe at ST 36 both sides, 30 seconds each", "Sit quietly for 2 minutes after"] },
  wood: { title: "Let the Wood ease", days: "Days 2, 4 and 6 after your visit", steps: ["Probe at LV 3 both feet, 30 seconds each", "Probe at LI 4 both hands, 20 seconds each", "Slow breathing, 4 counts in, 6 out, for 2 minutes"] },
  fire: { title: "Steady the lamp", days: "Each evening this week", steps: ["Ear clips, preset 1, 8 minutes before bed", "Probe at HT 7, 20 seconds each wrist", "Lights low afterwards"] },
  metal: { title: "Open the breath", days: "Mornings, 3 times this week", steps: ["Plates on the upper back, preset 2, 5 minutes", "Probe at LU 7, 20 seconds each wrist"] },
  water: { title: "Refill the reservoir", days: "Every other day, 12 minutes", steps: ["Plates on the lower back, preset 3, 8 minutes", "Probe at KI 3 both ankles, 30 seconds each", "Warm socks on afterwards"] },
};
