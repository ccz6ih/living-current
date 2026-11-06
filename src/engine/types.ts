/**
 * Living Current protocol engine — shared types.
 *
 * Everything here is Dr. Amina's logic expressed as data. Placeholder rules
 * are marked PLACEHOLDER and get replaced once she maps her 14-position pulse
 * and writes her decision trees.
 */

export type Element = "wood" | "fire" | "earth" | "metal" | "water";

export const ELEMENTS: Element[] = ["wood", "fire", "earth", "metal", "water"];

/** Sheng (generating) cycle: mother → son */
export const MOTHER: Record<Element, Element> = {
  wood: "water",
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
};

/** Ke (controlling) cycle: controller → controlled */
export const CONTROLS: Record<Element, Element> = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

export const ELEMENT_LABEL: Record<Element, string> = {
  wood: "Wood",
  fire: "Fire",
  earth: "Earth",
  metal: "Metal",
  water: "Water",
};

export const ELEMENT_THEME: Record<Element, string> = {
  wood: "Tension, irritability, stiffness, eyes",
  fire: "Sleep, anxiety, circulation, joy",
  earth: "Digestion, appetite, worry, fatigue",
  metal: "Breathing, skin, grief, letting go",
  water: "Energy reserves, cold, fear, lower back",
};

export type Side = "left" | "right";
export type Position = "cun" | "guan" | "chi";

export interface PulsePositionDef {
  side: Side;
  position: Position;
  organs: string;
  element: Element;
}

/** The classic 3 × 2 map. Amina's 14-per-side map replaces this. */
export const PULSE_MAP: PulsePositionDef[] = [
  { side: "left", position: "cun", organs: "Heart · Small intestine", element: "fire" },
  { side: "left", position: "guan", organs: "Liver · Gallbladder", element: "wood" },
  { side: "left", position: "chi", organs: "Kidney · Bladder", element: "water" },
  { side: "right", position: "cun", organs: "Lung · Large intestine", element: "metal" },
  { side: "right", position: "guan", organs: "Spleen · Stomach", element: "earth" },
  { side: "right", position: "chi", organs: "Kidney yang", element: "water" },
];

export type PulseQuality = "thin" | "wiry" | "slippery" | "rapid" | "slow" | "floating" | "deep";

export interface PulseReading {
  /** 1–5 strength per position, keyed "left.guan" etc. */
  ratings: Record<string, number>;
  qualities: Partial<Record<string, PulseQuality[]>>;
}

export type TongueColour = "pale" | "pink" | "red" | "purple";
export type TongueCoating = "none" | "thin-white" | "thick-white" | "yellow";
export type TongueShape = "swollen" | "thin" | "teeth-marks" | "cracks";
export type TongueMoisture = "dry" | "normal" | "wet";
export type TongueZone = "tip" | "sides" | "centre" | "root";

export interface TongueReading {
  colour?: TongueColour;
  coating?: TongueCoating;
  shape?: TongueShape;
  moisture?: TongueMoisture;
  zone?: TongueZone;
  photoUrl?: string;
}

export interface Intake {
  priorities: string[]; // up to 3 goal ids, ranked
  age: number;
  sex: "female" | "male" | "other";
  species: "human" | "horse" | "dog" | "cat";
  mainConcern: string;
  duration: string;
  tried: string;
  /** Element questionnaire, 0–10 per element */
  elementScores: Record<Element, number>;
  wellbeing: Wellbeing;
  consentSignedAt?: string;
}

export interface Wellbeing {
  pain: number;
  stress: number;
  sleep: number;
  energy: number;
}

export type DeviceMode = "probe" | "ear-clips" | "plates" | "headband" | "myopulse";

export interface ProtocolPoint {
  code: string; // "SP 6"
  name: string; // "Sanyinjiao"
  location: string; // plain-language landmark
  seconds: number;
  element: Element;
  mode: DeviceMode;
  intensity: 1 | 2 | 3 | 4 | 5;
  why: string;
}

export interface Protocol {
  id: string;
  goal: string; // what the client sees
  internalTag: string; // licensed users only
  focus: Element;
  action: "tonify" | "sedate";
  points: ProtocolPoint[];
  deviceSettings: { frequency: string; waveform: string; mode: DeviceMode }[];
  homeAdvice: string[];
  nextVisitDays: number;
  tcmView: string;
}

export type Tone = "weak" | "rising" | "steady" | "falling" | "strong";

export interface PointLog {
  code: string;
  startedAt: string;
  secondsToSettle: number | null;
  tones: { at: number; tone: Tone }[];
  skipped?: boolean;
}

export interface ElementBalance {
  scores: Record<Element, number>; // −2 … +2, 0 is balanced
  weakest: Element;
  strongest: Element;
  gap: number;
}

export interface EngineInput {
  intake: Intake;
  pulse: PulseReading;
  tongue: TongueReading;
  openingReading: number;
  when: Date;
  history: SessionSummary[];
}

export interface EngineOutput {
  protocol: Protocol;
  balance: ElementBalance;
  reasoning: string[];
  chrono: ChronoResult;
  adjustedPoints: ProtocolPoint[];
}

export interface ChronoResult {
  hour: number;
  peakOrgan: string;
  peakElement: Element;
  dipOrgan: string;
  dipElement: Element;
  stem: string;
  branch: string;
  note: string;
}

export interface SessionSummary {
  id: string;
  date: string;
  goal: string;
  focus: Element;
  points: number;
  openingReading: number;
  closingReading: number;
  wellbeingBefore: Wellbeing;
  wellbeingAfter: Wellbeing;
  checkin24?: Wellbeing;
  checkin48?: Wellbeing;
  pointLogs?: PointLog[];
  balance?: ElementBalance;
}
