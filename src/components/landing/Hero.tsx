"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SettleRing } from "@/components/SettleRing";
import { PointFigure } from "@/components/PointFigure";
import { ArrowRight } from "lucide-react";

const TONES: [string, string][] = [["Weak", "var(--metal)"], ["Rising", "var(--fire)"], ["Steady", "#2d7a5f"], ["Falling", "var(--water)"], ["Strong", "var(--earth)"]];

/**
 * The hero is the thing itself: a guided point screen, running.
 * Everything else on the page explains what you just saw.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [key, setKey] = useState("a");
  const [tone, setTone] = useState(2);

  useEffect(() => {
    const t = setTimeout(() => setRunning(true), 1100);
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo("[data-reveal]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" });
    }, ref);
    const cycle = setInterval(() => setTone((n) => [3, 2, 3, 2, 1, 3][Math.floor(Math.random() * 6)] ?? n), 2600);
    return () => { clearTimeout(t); clearInterval(cycle); ctx.revert(); };
  }, []);

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-5 pt-12 pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
      <div>
        <p className="text-sm text-ink-soft" data-reveal>For Equiscope and Acuscope practitioners</p>
        <h1 className="text-5xl md:text-[4.2rem] mt-3" data-reveal>Dr. Amina at every practitioner's shoulder.</h1>
        <p className="text-xl text-ink-soft mt-6 max-w-xl leading-relaxed" data-reveal>
          Read the pulse. Apply the current. Show the client what changed. Living Current turns a pulse reading into her exact protocol and guides the probe point by point, so the device you paid $55,000 for earns its keep every day.
        </p>
        <div className="flex flex-wrap gap-3 mt-8" data-reveal>
          <Link href="/app" className="btn btn-primary tap">Try a session <ArrowRight className="w-4 h-4" /></Link>
          <a href="#session" className="btn btn-ghost tap">See how it works</a>
        </div>
        <dl className="grid grid-cols-3 gap-4 mt-10 max-w-md" data-reveal>
          {[["8", "steps, start to finish"], ["1", "point per screen"], ["24 h", "and 48 h check-ins"]].map(([n, l]) => (
            <div key={l}>
              <dt className="display text-3xl">{n}</dt>
              <dd className="text-sm text-ink-soft">{l}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-[var(--radius-l)] p-2 shadow-[0_30px_80px_-30px_rgba(21,48,43,0.45)]" style={{ background: "var(--ink)" }} data-reveal>
        <div className="rounded-[calc(var(--radius-l)-8px)] bg-paper p-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-soft">Step 2 of 4</span>
            <div className="flex gap-1 flex-1 max-w-[140px]">
              {[0, 1, 2, 3].map((k) => <span key={k} className="h-1 flex-1 rounded-full" style={{ background: k < 1 ? "var(--ink)" : k === 1 ? "var(--earth)" : "var(--bone-2)" }} />)}
            </div>
            <span className="ml-auto text-xs text-ink-soft">Sarah · digestion and energy</span>
          </div>
          <h2 className="text-3xl mt-3">Grab the probe. Find Spleen 6.</h2>
          <p className="text-sm text-ink-soft mt-1">Inner lower leg, four finger-widths above the ankle bone, behind the shin bone</p>
          <div className="grid grid-cols-[120px_1fr] gap-4 items-center my-4">
            <div className="h-[200px]"><PointFigure code="SP 6" color="var(--earth)" /></div>
            <div className="flex justify-center">
              <SettleRing seconds={30} running={running} resetKey={key} onDone={() => { setRunning(false); setTimeout(() => { setKey((k) => k + "x"); setRunning(true); }, 1400); }} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {TONES.map(([l, c], i) => (
              <div key={l} className="rounded-[var(--radius-s)] text-white text-sm font-bold text-center py-3 transition-all" style={{ background: c, outline: tone === i ? "3px solid var(--ink)" : "3px solid transparent", outlineOffset: 2 }}>{l}</div>
            ))}
          </div>
          <p className="text-xs text-ink-soft mt-3 text-center">Tone falling → keep going. Rising → lower intensity one step. Tap what you hear; the app logs when it settled.</p>
        </div>
      </div>
    </section>
  );
}
