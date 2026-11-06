"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { PointFigure } from "@/components/PointFigure";
import { SettleRing } from "@/components/SettleRing";
import { ToneButtons } from "@/components/ToneButtons";
import { ELEMENT_LABEL, type Tone } from "@/engine/types";
import { useSessions, type LiveSession } from "@/lib/store";
import { Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";

const TONE_ADVICE: Record<Tone, string> = {
  weak: "Weak tone: move the probe a few millimetres, press a little firmer.",
  rising: "Rising: lower the intensity one step and hold.",
  steady: "Steady: keep going until the chime.",
  falling: "Falling: good. Keep going, the point is settling.",
  strong: "Strong: hold here. If it climbs, back off one step.",
};

/**
 * Hands on the client, ears on the device. One point per screen, a timer
 * set to Amina's duration, five buttons for what the tone is doing.
 * Voice reads each step; the chime moves on.
 */
export function PointsStep({ session }: { session: LiveSession }) {
  const { update, logTone } = useSessions();
  const router = useRouter();
  const out = session.engine;
  const points = out?.adjustedPoints ?? [];
  const i = session.pointIndex;
  const point = points[i];
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [lastTone, setLastTone] = useState<Tone | undefined>();
  const [voice, setVoice] = useState(true);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!voice || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    },
    [voice],
  );

  const chime = useCallback(() => {
    try {
      audioCtx.current ??= new AudioContext();
      const ctx = audioCtx.current;
      [660, 880].forEach((f, k) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = f;
        o.type = "sine";
        g.gain.setValueAtTime(0.0001, ctx.currentTime + k * 0.18);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + k * 0.18 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + k * 0.18 + 0.5);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + k * 0.18);
        o.stop(ctx.currentTime + k * 0.18 + 0.55);
      });
    } catch {}
  }, []);

  // Announce the point on arrival
  useEffect(() => {
    if (!point) return;
    setRunning(false);
    setDone(false);
    setLastTone(undefined);
    setElapsed(0);
    if (cardRef.current) gsap.fromTo(cardRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    speak(`Step ${i + 1} of ${points.length}. Grab the probe. Find ${point.name}, ${point.code}. ${point.location}. ${point.seconds} seconds.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  // Say "next" to move on; space/enter toggles the timer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key === "n" || e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, points.length]);

  const next = useCallback(() => {
    if (i + 1 < points.length) {
      update(session.id, { pointIndex: i + 1 });
    } else {
      update(session.id, { step: "closing" });
      router.push(`/app/session/${session.id}/closing`);
    }
  }, [i, points.length, session.id, update, router]);

  const onDone = () => {
    setRunning(false);
    setDone(true);
    chime();
    speak(i + 1 < points.length ? "Done. Say next." : "Done. Closing reading.");
  };

  const onTone = (t: Tone) => {
    setLastTone(t);
    logTone(session.id, point.code, Math.round(elapsed), t);
    if (!running && !done) setRunning(true);
    speak(TONE_ADVICE[t]);
  };

  if (!out || !point) return <div className="p-8 text-ink-soft">No protocol yet. Go back to the protocol step.</div>;

  const color = `var(--${point.element})`;

  return (
    <div className="max-w-6xl mx-auto px-5 py-6 pb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm text-ink-soft">Step {i + 1} of {points.length}</div>
        <div className="flex gap-1 flex-1 max-w-sm">
          {points.map((p, k) => (
            <span key={k} className="h-1.5 flex-1 rounded-full" style={{ background: k < i ? "var(--ink)" : k === i ? color : "var(--bone-2)" }} />
          ))}
        </div>
        <button className="ml-auto btn btn-ghost tap !min-h-11" onClick={() => setVoice((v) => !v)} aria-pressed={voice}>
          {voice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} Voice {voice ? "on" : "off"}
        </button>
      </div>

      <div ref={cardRef} className="rounded-[var(--radius-l)] p-2" style={{ background: "var(--ink)" }}>
        <div className="rounded-[calc(var(--radius-l)-8px)] bg-paper p-6 md:p-8">
          <div className="grid md:grid-cols-[1fr_260px] gap-6 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl">Grab the probe. Find {point.name}.</h1>
              <p className="text-lg mt-2">
                <strong>{point.code}</strong> · {point.location}
              </p>
              <p className="text-sm text-ink-soft mt-2">
                {point.why}. {ELEMENT_LABEL[point.element]} point · {point.mode.replace("-", " ")} · intensity level {point.intensity}.
              </p>

              <div className="grid sm:grid-cols-[200px_1fr] gap-6 mt-6 items-center">
                <div className="h-[240px]">
                  <PointFigure code={point.code} color={color} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <SettleRing seconds={point.seconds} running={running} resetKey={`${session.id}-${i}`} onTick={setElapsed} onDone={onDone} color={color} />
                  <div className="flex gap-2">
                    {!done ? (
                      <button className="btn btn-primary tap" onClick={() => setRunning((r) => !r)}>
                        {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {running ? "Pause" : elapsed > 0 ? "Resume" : "Start timer"}
                      </button>
                    ) : (
                      <button className="btn btn-earth tap" onClick={next}>
                        {i + 1 < points.length ? "Next point" : "Closing reading"} <SkipForward className="w-4 h-4" />
                      </button>
                    )}
                    {!done && (
                      <button className="btn btn-ghost tap" onClick={next}>
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-[var(--radius-m)] p-4" style={{ background: `var(--${point.element}-soft)` }}>
              <div className="font-semibold mb-1">What you're listening for</div>
              <p className="text-sm">
                {lastTone ? TONE_ADVICE[lastTone] : "Tone falling → keep going. Rising → lower intensity one step. Tap what you hear; the app logs the time it took to settle."}
              </p>
              <div className="text-xs text-ink-soft mt-3">
                Say “next”, press N, or tap the foot pedal to move on. Space starts and pauses the timer.
              </div>
              {session.pointLogs.find((l) => l.code === point.code)?.secondsToSettle != null && (
                <div className="mt-3 text-sm">
                  Settled at <strong>{session.pointLogs.find((l) => l.code === point.code)?.secondsToSettle} s</strong>
                </div>
              )}
            </aside>
          </div>

          <div className="mt-6">
            <ToneButtons onTone={onTone} last={lastTone} />
          </div>
        </div>
      </div>
    </div>
  );
}
