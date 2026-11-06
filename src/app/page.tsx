"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SettleRing } from "@/components/SettleRing";
import { ArrowRight } from "lucide-react";

const STEPS = [
  ["Intake", "Priorities, questions and consent, on the client's phone before the visit"],
  ["Pulse and tongue", "Rate six positions; tap what the tongue shows"],
  ["Opening reading", "Needle position, one tap"],
  ["Protocol", "Pulse + symptoms + age + history + the hour, through Amina's rules"],
  ["Guided points", "Timed screens, hands stay on the client"],
  ["Closing reading", "Needle position, one tap"],
  ["Report", "Emailed with a booking QR code"],
  ["Check-ins", "Client rates how they feel at 24 h and 48 h"],
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [key, setKey] = useState("a");

  useEffect(() => {
    const t = setTimeout(() => setRunning(true), 900);
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll("[data-reveal]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out" });
    }
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <header className="max-w-6xl mx-auto px-5 h-16 flex items-center">
        <span className="font-semibold">Living Current</span>
        <nav className="ml-auto flex gap-5 text-sm">
          <Link href="/app" className="hover:underline">Open the app</Link>
          <Link href="/intake/demo" className="hover:underline">Client intake</Link>
        </nav>
      </header>

      <section ref={heroRef} className="max-w-6xl mx-auto px-5 pt-10 pb-16 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl" data-reveal>Dr. Amina's method, carried, not diluted.</h1>
          <p className="text-xl text-ink-soft mt-5 max-w-xl" data-reveal>
            Read the pulse. Apply the current. Show the client what changed. Living Current turns a pulse reading into her exact protocol and guides the probe point by point, so a practitioner in Ohio treats a migraine the way she would.
          </p>
          <div className="flex flex-wrap gap-3 mt-7" data-reveal>
            <Link href="/app" className="btn btn-primary tap">Run a session <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/app/clients/sarah-m" className="btn btn-ghost tap">See a client file</Link>
          </div>
          <p className="text-sm text-ink-soft mt-5" data-reveal>Demo mode: seeded clients, nothing leaves your browser.</p>
        </div>

        <div className="rounded-[var(--radius-l)] p-2" style={{ background: "var(--ink)" }} data-reveal>
          <div className="rounded-[calc(var(--radius-l)-8px)] bg-paper p-6">
            <div className="text-xs text-ink-soft">Step 2 of 4</div>
            <h2 className="text-3xl mt-1">Grab the probe. Find Spleen 6.</h2>
            <p className="text-sm text-ink-soft mt-1">Inner lower leg, four finger-widths above the ankle bone, behind the shin bone</p>
            <div className="flex items-center justify-center my-5">
              <SettleRing seconds={30} running={running} resetKey={key} onDone={() => { setRunning(false); setTimeout(() => { setKey((k) => k + "x"); setRunning(true); }, 1200); }} />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[["Weak", "var(--metal)"], ["Rising", "var(--fire)"], ["Steady", "#2d7a5f"], ["Falling", "var(--water)"], ["Strong", "var(--earth)"]].map(([l, c]) => (
                <div key={l} className="rounded-[var(--radius-s)] text-white text-sm font-bold text-center py-3" style={{ background: c }}>{l}</div>
              ))}
            </div>
            <p className="text-xs text-ink-soft mt-3 text-center">Tone falling → keep going. Rising → lower intensity one step.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <h2 className="text-3xl mb-8">A session, start to finish</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-ink text-bone text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="block text-sm text-ink-soft">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="text-sm text-ink-soft mt-8 max-w-3xl">
            Built for non-acupuncturists: every judgment that needs Chinese medicine training is made by the software from Amina's rules. The practitioner rates, places and taps; the app explains why. It suggests; the practitioner decides.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-6">
        {[
          ["She writes every protocol", "Nothing enters the library without Dr. Amina's approval. Her name is on every protocol and in every report."],
          ["Results they can show", "Start and end readings, the four wellbeing sliders at 24 h and 48 h, and a Living Current Index measured against the client's own first sessions."],
          ["The secret sauce stays secret", "Protocols live on the server and show one step at a time. One login per certified practitioner. Anonymised results refine the method, which a leaked PDF never could."],
        ].map(([t, d]) => (
          <div key={t}>
            <h3 className="text-xl">{t}</h3>
            <p className="text-ink-soft mt-2">{d}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 py-6 text-xs text-ink-soft flex flex-wrap gap-4">
          <span>Living Current · The Dr. Amina Method™ · working demo</span>
          <span>Educational software for licensed and supervised practitioners. Does not diagnose or treat any condition.</span>
        </div>
      </footer>
    </div>
  );
}
