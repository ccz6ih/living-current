"use client";

import { useState } from "react";
import { WristMap } from "@/components/WristMap";
import { ElementBars } from "@/components/ElementBars";
import { describeBalance, posKey, readBalance } from "@/engine/pulse";
import { PULSE_MAP, type PulseQuality } from "@/engine/types";
import { useSessions, type LiveSession } from "@/lib/store";
import { StepShell } from "./StepShell";
import { Sparkles } from "lucide-react";

const QUALITIES: PulseQuality[] = ["thin", "wiry", "slippery", "rapid", "slow", "floating", "deep"];
const LEVELS = ["Very weak", "Weak", "Even", "Strong", "Very strong"];

export function PulseStep({ session }: { session: LiveSession }) {
  const { update } = useSessions();
  const [selected, setSelected] = useState<string | null>(posKey("left", "cun"));
  const pulse = session.pulse;
  const rated = PULSE_MAP.filter((p) => pulse.ratings[posKey(p.side, p.position)]).length;
  const balance = rated === 6 ? readBalance(pulse) : null;
  const def = PULSE_MAP.find((p) => posKey(p.side, p.position) === selected);

  const setRating = (n: number) => {
    if (!selected) return;
    update(session.id, { pulse: { ...pulse, ratings: { ...pulse.ratings, [selected]: n } } });
    // advance to the next unrated position
    const order = PULSE_MAP.map((p) => posKey(p.side, p.position));
    const i = order.indexOf(selected);
    const nextKey = order.slice(i + 1).concat(order.slice(0, i)).find((k) => !pulse.ratings[k] && k !== selected);
    if (nextKey) setSelected(nextKey);
  };

  const toggleQuality = (q: PulseQuality) => {
    if (!selected) return;
    const cur = pulse.qualities[selected] ?? [];
    const next = cur.includes(q) ? cur.filter((x) => x !== q) : [...cur, q];
    update(session.id, { pulse: { ...pulse, qualities: { ...pulse.qualities, [selected]: next } } });
  };

  const fillExample = () => {
    // The deck's placeholder example: right guan weak (1) against left guan strong (4)
    update(session.id, {
      pulse: {
        ratings: { "left.cun": 3, "left.guan": 4, "left.chi": 3, "right.cun": 3, "right.guan": 1, "right.chi": 2 },
        qualities: { "left.guan": ["wiry"], "right.guan": ["thin"] },
      },
    });
  };

  return (
    <StepShell
      session={session}
      step="pulse"
      title="Read the pulse"
      lede="Three fingers on each wrist. Tap a position, rate 1 to 5, add a quality if you hear one. The app compares left with right and position with position."
      canNext={rated === 6}
      nextLabel="Look at the tongue"
      wide
    >
      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <WristMap side="left" pulse={pulse} selected={selected} onSelect={setSelected} />
        <WristMap side="right" pulse={pulse} selected={selected} onSelect={setSelected} />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="card p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-xl">
              {def ? `${def.side === "left" ? "Left" : "Right"} ${def.position}` : "Select a position"}
              {def && <span className="text-ink-soft text-base font-normal ml-2">{def.organs}</span>}
            </h2>
            <span className="text-sm text-ink-soft">{rated}/6 rated</span>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {LEVELS.map((l, i) => {
              const n = i + 1;
              const on = selected ? pulse.ratings[selected] === n : false;
              return (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  aria-pressed={on}
                  className={`tap rounded-[var(--radius-m)] py-4 flex flex-col items-center gap-1 border transition ${on ? "bg-ink text-bone border-ink" : "bg-paper border-line hover:bg-bone"}`}
                  style={on && def ? { background: `var(--${def.element})`, borderColor: `var(--${def.element})` } : undefined}
                >
                  <span className="display text-3xl leading-none">{n}</span>
                  <span className="text-xs">{l}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {QUALITIES.map((q) => {
              const on = selected ? (pulse.qualities[selected] ?? []).includes(q) : false;
              return (
                <button key={q} onClick={() => toggleQuality(q)} aria-pressed={on} className={`tap px-4 rounded-full border text-sm capitalize ${on ? "bg-ink text-bone border-ink" : "border-line bg-paper hover:bg-bone"}`}>
                  {q}
                </button>
              );
            })}
          </div>
          <button onClick={fillExample} className="mt-4 text-sm text-ink-soft underline underline-offset-4 inline-flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Fill the example from the deck (right guan weak, left guan strong)
          </button>
        </div>

        <div className="card p-5">
          <h2 className="text-xl mb-1">What the pulse says</h2>
          {balance ? (
            <>
              <p className="text-sm mb-4">{describeBalance(balance)}</p>
              <ElementBars balance={balance} />
            </>
          ) : (
            <p className="text-sm text-ink-soft">Rate all six positions and the five-element read appears here.</p>
          )}
          <p className="text-xs text-ink-soft mt-4">Shown: the classic 3 positions per wrist. Amina works with 14 per side, so her map replaces this one.</p>
        </div>
      </div>
    </StepShell>
  );
}
