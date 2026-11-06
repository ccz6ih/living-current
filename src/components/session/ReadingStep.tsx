"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { clientOf, useSessions, type LiveSession } from "@/lib/store";
import { StepShell } from "./StepShell";

/**
 * The Equiscope is analog: a needle and a tone, not a digital number.
 * The practitioner drags the needle to where the device shows it, then taps once.
 */
export function ReadingStep({ session, kind }: { session: LiveSession; kind: "opening" | "closing" }) {
  const { update } = useSessions();
  const client = clientOf(session);
  const stored = kind === "opening" ? session.openingReading : session.closingReading;
  const last = client.sessions[0];
  const defaultValue = kind === "opening" ? (last?.openingReading ?? 68) : Math.round((session.openingReading ?? 68) * 0.62);
  const [value, setValue] = useState<number>(stored ?? defaultValue);
  const [logged, setLogged] = useState(stored != null);
  const needleRef = useRef<SVGGElement>(null);
  const after = session.wellbeingAfter ?? { ...session.intake.wellbeing };

  useEffect(() => {
    if (!needleRef.current) return;
    gsap.to(needleRef.current, { rotation: -80 + (value / 100) * 160, transformOrigin: "100px 150px", duration: 0.5, ease: "elastic.out(1, 0.6)" });
  }, [value]);

  const log = () => {
    update(session.id, kind === "opening" ? { openingReading: value } : { closingReading: value });
    setLogged(true);
  };

  const drop = kind === "closing" && session.openingReading ? Math.round(((session.openingReading - value) / session.openingReading) * 100) : null;

  return (
    <StepShell
      session={session}
      step={kind === "opening" ? "reading" : "closing"}
      title={kind === "opening" ? "Opening reading" : "Closing reading"}
      lede={
        kind === "opening"
          ? "Probe on the first point, let the needle settle, drag the dial to match, tap once. Unit and window to confirm with Amina."
          : "Same point as the opening. Drag the dial to match the needle, tap once. Then the four sliders before the client gets up."
      }
      canNext={logged && (kind === "opening" || !!session.wellbeingAfter)}
      nextLabel={kind === "opening" ? "Build the protocol" : "Make the report"}
    >
      <div className="grid md:grid-cols-[1fr_300px] gap-5 items-start">
        <div className="card p-6">
          <svg viewBox="0 0 200 165" className="w-full max-w-md mx-auto">
            <path d="M20 150 A80 80 0 0 1 180 150" stroke="var(--bone-2)" strokeWidth="18" fill="none" />
            <path d="M20 150 A80 80 0 0 1 100 70" stroke="#2d7a5f" strokeWidth="18" fill="none" opacity="0.35" />
            <path d="M100 70 A80 80 0 0 1 180 150" stroke="var(--fire)" strokeWidth="18" fill="none" opacity="0.35" />
            {Array.from({ length: 11 }).map((_, i) => {
              const a = ((-180 + i * 18) * Math.PI) / 180;
              const x1 = 100 + 66 * Math.cos(a), y1 = 150 + 66 * Math.sin(a);
              const x2 = 100 + 58 * Math.cos(a), y2 = 150 + 58 * Math.sin(a);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={i % 5 === 0 ? 2 : 1} />;
            })}
            <text x="24" y="165" fontSize="9" fill="var(--ink-soft)">0</text>
            <text x="94" y="56" fontSize="9" fill="var(--ink-soft)">50</text>
            <text x="166" y="165" fontSize="9" fill="var(--ink-soft)">100</text>
            <g ref={needleRef}>
              <line x1="100" y1="150" x2="100" y2="78" stroke="var(--fire)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="150" r="7" fill="var(--ink)" />
            </g>
          </svg>
          <div className="flex items-end justify-center gap-2 -mt-2">
            <span className="display text-7xl tabular-nums leading-none">{value}</span>
          </div>
          <input type="range" min={0} max={100} value={value} onChange={(e) => { setValue(Number(e.target.value)); setLogged(false); }} className="mt-5" aria-label="Needle position" />
          <button onClick={log} className={`btn tap w-full mt-5 ${logged ? "btn-ghost" : "btn-primary"}`}>
            {logged ? `Logged ${value}` : "Log this reading"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {kind === "opening" && last && (
            <div className="card p-4 text-sm">
              <div className="font-semibold mb-1">Last visit</div>
              <div>Opened at <strong>{last.openingReading}</strong>, closed at <strong>{last.closingReading}</strong>.</div>
              <div className="text-ink-soft mt-1">The engine uses this to adjust today's point timers.</div>
            </div>
          )}
          {kind === "closing" && (
            <>
              <div className="card p-4">
                <div className="text-sm text-ink-soft">This session</div>
                <div className="display text-3xl mt-1">{session.openingReading} → {logged ? value : "…"}</div>
                {drop != null && logged && <div className="font-semibold mt-1" style={{ color: "#2d7a5f" }}>Down {drop}%</div>}
              </div>
              <div className="card p-4">
                <div className="font-semibold mb-3">How do you feel now?</div>
                {(["pain", "stress", "sleep", "energy"] as const).map((k) => (
                  <label key={k} className="block mb-3">
                    <div className="flex justify-between text-sm capitalize">
                      <span>{k === "sleep" ? "Sleep quality" : k}</span>
                      <span className="tabular-nums text-ink-soft">{session.intake.wellbeing[k]} → {after[k]}</span>
                    </div>
                    <input type="range" min={0} max={10} value={after[k]} onChange={(e) => update(session.id, { wellbeingAfter: { ...after, [k]: Number(e.target.value) } })} />
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </StepShell>
  );
}
