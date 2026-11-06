"use client";

import { GOALS } from "@/data/protocols";
import { ELEMENTS, ELEMENT_LABEL, ELEMENT_THEME, type Element } from "@/engine/types";
import { clientOf, useSessions, type LiveSession } from "@/lib/store";
import { StepShell } from "./StepShell";
import { CheckCircle2 } from "lucide-react";

const SLIDERS: { k: "pain" | "stress" | "sleep" | "energy"; l: string; hint: string }[] = [
  { k: "pain", l: "Pain", hint: "0 none · 10 worst" },
  { k: "stress", l: "Stress", hint: "0 none · 10 worst" },
  { k: "sleep", l: "Sleep quality", hint: "0 terrible · 10 great" },
  { k: "energy", l: "Energy", hint: "0 empty · 10 full" },
];

export function IntakeStep({ session }: { session: LiveSession }) {
  const { update } = useSessions();
  const client = clientOf(session);
  const intake = session.intake;

  const toggleGoal = (id: string) => {
    const cur = intake.priorities;
    const next = cur.includes(id) ? cur.filter((g) => g !== id) : cur.length < 3 ? [...cur, id] : cur;
    update(session.id, { intake: { ...intake, priorities: next } });
  };

  return (
    <StepShell
      session={session}
      step="intake"
      title="Today's priorities"
      lede="Filled in on the client's phone before the visit. Review it with them in the room and adjust if anything changed."
      canNext={intake.priorities.length > 0}
      nextLabel="Read the pulse"
    >
      <div className="card p-4 mb-5 flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6" style={{ color: "#2d7a5f" }} />
        <div className="text-sm">
          <strong>Consent signed</strong> · {client.consentOn} · {client.species === "human" ? "plain-language description, e-signature, right to export or delete" : "owner consent on file"}
        </div>
      </div>

      <section className="mb-7">
        <h2 className="text-xl mb-1">What would you like to work on today?</h2>
        <p className="text-sm text-ink-soft mb-3">Pick and rank up to three. The first one leads.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {GOALS.map((g) => {
            const rank = intake.priorities.indexOf(g.id);
            const on = rank >= 0;
            return (
              <button
                key={g.id}
                onClick={() => toggleGoal(g.id)}
                aria-pressed={on}
                className={`tap text-left px-4 py-3 rounded-[var(--radius-m)] border flex items-center gap-3 transition ${on ? "border-ink bg-paper" : "border-line bg-paper/60 hover:bg-paper"}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${on ? "bg-ink text-bone" : "border border-line text-ink-soft"}`}>
                  {on ? rank + 1 : ""}
                </span>
                <span>
                  <span className="block font-semibold">{g.label}</span>
                  <span className="block text-xs text-ink-soft">{ELEMENT_LABEL[g.element]} territory</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-7">
        <h2 className="text-xl mb-1">How are you feeling right now?</h2>
        <p className="text-sm text-ink-soft mb-3">Four sliders. The same four come back at 24 h and 48 h by text link.</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 card p-5">
          {SLIDERS.map((s) => (
            <label key={s.k} className="block">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{s.l}</span>
                <span className="tabular-nums text-ink-soft">{intake.wellbeing[s.k]} <span className="text-xs">· {s.hint}</span></span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={intake.wellbeing[s.k]}
                onChange={(e) => update(session.id, { intake: { ...intake, wellbeing: { ...intake.wellbeing, [s.k]: Number(e.target.value) } } })}
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-1">Element questions</h2>
        <p className="text-sm text-ink-soft mb-3">Element headings stay hidden from the client; Dr. Amina writes the questions. Shown here for the practitioner.</p>
        <div className="grid sm:grid-cols-5 gap-2">
          {ELEMENTS.map((e: Element) => (
            <div key={e} className={`card p-3 element-${e}`} style={{ borderTop: `4px solid var(--${e})` }}>
              <div className="font-semibold">{ELEMENT_LABEL[e]}</div>
              <div className="text-xs text-ink-soft mb-2 leading-snug">{ELEMENT_THEME[e]}</div>
              <div className="display text-3xl">{intake.elementScores[e]}<span className="text-sm text-ink-soft">/10</span></div>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-soft mt-3">
          Also on file: age {intake.age}, {intake.sex}, {intake.species}. Main concern: {intake.mainConcern} ({intake.duration}). Tried: {intake.tried}.
        </p>
      </section>
    </StepShell>
  );
}
