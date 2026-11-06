"use client";

import type { Tone } from "@/engine/types";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

/**
 * The five buttons mirror what Amina hears from the device:
 * weak, rising, steady, falling, strong. One tap, never typing.
 */
const TONES: { id: Tone; label: string; bg: string; Icon: typeof ArrowUp }[] = [
  { id: "weak", label: "Weak", bg: "var(--metal)", Icon: Minus },
  { id: "rising", label: "Rising", bg: "var(--fire)", Icon: ArrowUp },
  { id: "steady", label: "Steady", bg: "#2d7a5f", Icon: Minus },
  { id: "falling", label: "Falling", bg: "var(--water)", Icon: ArrowDown },
  { id: "strong", label: "Strong", bg: "var(--earth)", Icon: ArrowUp },
];

export function ToneButtons({ onTone, last }: { onTone: (t: Tone) => void; last?: Tone }) {
  return (
    <div className="grid grid-cols-5 gap-3" role="group" aria-label="What the device tone is doing">
      {TONES.map(({ id, label, bg, Icon }) => (
        <button
          key={id}
          onClick={() => onTone(id)}
          className="tap rounded-[var(--radius-m)] text-white font-bold text-lg flex flex-col items-center justify-center gap-1 py-5 transition-transform active:scale-95"
          style={{ background: bg, outline: last === id ? "4px solid var(--ink)" : undefined, outlineOffset: 2 }}
          aria-pressed={last === id}
        >
          <Icon className="w-7 h-7" strokeWidth={3} />
          {label}
        </button>
      ))}
    </div>
  );
}
