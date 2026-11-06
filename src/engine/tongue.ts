import type { Element, TongueReading } from "./types";

export interface TongueVerdict {
  suggests: Element | null;
  pattern: string;
  agreesWith: (pulseWeakest: Element) => "confirms" | "questions" | "neutral";
}

/**
 * The tongue confirms or questions the pulse.
 * PLACEHOLDER: Amina's tongue map and weighting replace this.
 */
export function readTongue(t: TongueReading): TongueVerdict {
  let suggests: Element | null = null;
  const parts: string[] = [];

  if (t.coating === "thick-white" || t.shape === "teeth-marks" || t.moisture === "wet") {
    suggests = "earth";
    parts.push("Spleen dampness");
  }
  if (t.colour === "red" && (t.zone === "tip" || t.coating === "yellow")) {
    suggests = suggests ?? "fire";
    parts.push("Heart heat");
  }
  if (t.colour === "purple" || (t.zone === "sides" && t.colour === "red")) {
    suggests = suggests ?? "wood";
    parts.push("Liver stagnation");
  }
  if (t.colour === "pale" && t.moisture === "wet" && t.zone === "root") {
    suggests = suggests ?? "water";
    parts.push("Kidney yang low");
  }
  if (t.coating === "none" && t.moisture === "dry") {
    suggests = suggests ?? "metal";
    parts.push("Lung dryness");
  }

  const pattern = parts.length ? parts.join(", ") : "No strong pattern on the tongue";

  return {
    suggests,
    pattern,
    agreesWith: (pulseWeakest) => {
      if (!suggests) return "neutral";
      return suggests === pulseWeakest ? "confirms" : "questions";
    },
  };
}
