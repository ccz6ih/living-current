"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ElementBars } from "@/components/ElementBars";
import { runEngine } from "@/engine/protocol";
import { ELEMENT_LABEL } from "@/engine/types";
import { clientOf, useSessions, type LiveSession } from "@/lib/store";
import { StepShell } from "./StepShell";
import { Clock3, RotateCcw, AlertTriangle } from "lucide-react";
import { DEVICE_BY_ID, translateSetting } from "@/data/devices";

export function ProtocolStep({ session }: { session: LiveSession }) {
  const { update, settings } = useSessions();
  const client = clientOf(session);
  const device = DEVICE_BY_ID[settings.device];
  const listRef = useRef<HTMLOListElement>(null);

  // Run the engine once per arrival (or when inputs changed)
  useEffect(() => {
    if (session.engine) return;
    const out = runEngine({
      intake: session.intake,
      pulse: session.pulse,
      tongue: session.tongue,
      openingReading: session.openingReading ?? 60,
      when: new Date(),
      history: client.sessions,
    });
    update(session.id, { engine: out, pointIndex: 0, pointLogs: [] });
  }, [session.engine, session.id, session.intake, session.pulse, session.tongue, session.openingReading, client.sessions, update]);

  useEffect(() => {
    if (!session.engine || !listRef.current) return;
    gsap.fromTo(listRef.current.children, { opacity: 0, x: -12 }, { opacity: 1, x: 0, stagger: 0.08, duration: 0.45, ease: "power2.out" });
  }, [session.engine]);

  const out = session.engine;
  if (!out) return <div className="p-8 text-ink-soft">Working out the protocol…</div>;
  const total = out.adjustedPoints.reduce((a, p) => a + p.seconds, 0);

  return (
    <StepShell
      session={session}
      step="protocol"
      title={out.protocol.goal}
      lede="Pulse, tongue, today's priorities, age, history and the hour, run through Dr. Amina's rules. Every line below says why."
      nextLabel="Start the points"
      wide
    >
      <div className="grid lg:grid-cols-[1fr_380px] gap-5">
        <div>
          <div className="card p-5 mb-4" style={{ borderLeft: `6px solid var(--${out.protocol.focus})` }}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-semibold text-lg">
                {out.protocol.action === "tonify" ? "Support" : "Ease"} {ELEMENT_LABEL[out.protocol.focus]}
              </span>
              <span className="text-sm text-ink-soft">{out.adjustedPoints.length} points · about {Math.round(total / 60)} min {total % 60} s on the probe</span>
              <span className="text-sm text-ink-soft inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {out.chrono.peakOrgan} hour</span>
            </div>
            <p className="text-xs text-ink-soft mt-2">Internal tag (licensed users): {out.protocol.internalTag}</p>
          </div>

          <h2 className="text-xl mb-2">Points, in order</h2>
          <ol ref={listRef} className="flex flex-col gap-2 mb-5">
            {out.adjustedPoints.map((p, i) => (
              <li key={p.code + i} className="card p-4 grid grid-cols-[36px_1fr_auto] gap-3 items-center">
                <span className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center" style={{ background: `var(--${p.element})` }}>{i + 1}</span>
                <div>
                  <div className="font-semibold">{p.code} <span className="text-ink-soft font-normal">{p.name}</span></div>
                  <div className="text-sm text-ink-soft">{p.location}</div>
                  <div className="text-xs mt-1">{p.why}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="display text-2xl tabular-nums">{p.seconds}<span className="text-sm">s</span></div>
                  <div className="text-ink-soft capitalize">{p.mode.replace("-", " ")} · level {p.intensity}</div>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="text-xl mb-2">Dial settings for your {device.name}</h2>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            {out.protocol.deviceSettings.map((d, i) => {
              const t = translateSetting(settings.device, d);
              return (
                <div key={i} className="card p-4">
                  <div className="text-xs text-ink-soft capitalize">{t.unit} · {d.mode.replace("-", " ")}</div>
                  <div className="display text-2xl">{t.frequency}</div>
                  <div className="text-sm">{t.waveform} wave</div>
                  {t.confidence === "pending" && (
                    <div className="text-xs mt-2 inline-flex items-center gap-1" style={{ color: "var(--earth)" }}><AlertTriangle className="w-3.5 h-3.5" /> Translation to confirm with Jan</div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-ink-soft">Written on the Equiscope by Dr. Amina. Change your device under Your device.</p>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="card p-5">
            <h2 className="text-lg mb-3">Why this protocol</h2>
            <ol className="flex flex-col gap-2 text-sm">
              {out.reasoning.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-soft tabular-nums w-5 shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="card p-5">
            <h2 className="text-lg mb-3">Five-element balance</h2>
            <ElementBars balance={out.balance} />
          </div>
          <button className="btn btn-ghost tap" onClick={() => update(session.id, { engine: null })}>
            <RotateCcw className="w-4 h-4" /> Recompute
          </button>
          <p className="text-xs text-ink-soft">It suggests; the practitioner decides. You can skip any point on the next screen.</p>
        </aside>
      </div>
    </StepShell>
  );
}
