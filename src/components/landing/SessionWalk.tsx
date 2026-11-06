"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ElementBars } from "@/components/ElementBars";
import { IndexDial } from "@/components/IndexDial";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { t: "Intake", d: "Before the visit, on the client's phone: what they want to work on today, ranked, plus the four wellbeing sliders and a signed consent. Element headings stay hidden; Amina writes the questions." },
  { t: "Pulse and tongue", d: "Three fingers on each wrist. Tap a position, rate 1 to 5, add a quality if you hear one. The app compares left with right and position with position; the tongue confirms or questions it." },
  { t: "Opening reading", d: "Probe on the first point, let the needle settle, drag the dial to match, tap once. The Equiscope is analog: a needle and a tone, so the app records taps, never typing." },
  { t: "Protocol", d: "Pulse, tongue, today's priorities, age, history and the hour, run through Amina's rules. Every protocol shows its reasoning line by line. It suggests; the practitioner decides." },
  { t: "Guided points", d: "One point per screen with a timer set to Amina's duration. Voice reads each step; say next or use a $40 foot pedal. Hands stay on the client, ears on the device." },
  { t: "Closing reading", d: "Same point as the opening. One tap. Then the four sliders before the client gets up." },
  { t: "Report", d: "A branded web page plus a PDF, emailed in one tap: plain-language summary first, then a short Chinese medicine view, next visit, and a QR code to book." },
  { t: "Check-ins", d: "At 24 h and 48 h the client gets a text link: four taps, no app to install. Answers land in the file and feed the Living Current Index." },
];

const BALANCE = { scores: { wood: 1.1, fire: 0.2, earth: -1.3, metal: 0.1, water: -0.1 }, weakest: "earth" as const, strongest: "wood" as const, gap: 2.4 };
const INDEX = { total: 72, band: "flowing" as const, settle: 100, pointSettle: 88, balance: 40, wellbeing: 92, deltaSinceFirst: 9 };

export function SessionWalk() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onEnter: () => setActive(i), onEnterBack: () => setActive(i) });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="session" ref={root} className="border-t border-line bg-paper">
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-8">
        <h2 className="text-4xl">A session, start to finish</h2>
        <p className="text-ink-soft mt-2 max-w-2xl">Built for non-acupuncturists. Every judgment that needs Chinese medicine training is made by the software from Amina's rules. The practitioner rates, places and taps; the app explains why.</p>
      </div>
      <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[1fr_1.1fr] gap-10 pb-16">
        <ol className="flex flex-col">
          {STEPS.map((s, i) => (
            <li key={s.t} data-step className="min-h-[440px] flex flex-col justify-center py-10 border-b border-line last:border-0">
              <div className={`transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-35"}`}>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-ink text-bone font-bold flex items-center justify-center">{i + 1}</span>
                  <h3 className="text-2xl">{s.t}</h3>
                </div>
                <p className="text-ink-soft mt-3 max-w-md leading-relaxed">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-[var(--radius-l)] p-2" style={{ background: "var(--ink)" }}>
            <div className="rounded-[calc(var(--radius-l)-8px)] bg-bone p-5 min-h-[460px]">
              <Screen i={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Screen({ i }: { i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) gsap.fromTo(ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
  }, [i]);
  return (
    <div ref={ref} key={i}>
      {i === 0 && (
        <>
          <div className="text-xs text-ink-soft">Sarah · on her phone, Tuesday evening</div>
          <h4 className="text-xl mt-1 mb-3">What would you like to work on today?</h4>
          {[["Digestion and steady energy", 1], ["Calm and emotional balance", 2], ["Restful sleep", 0], ["Head comfort", 0]].map(([l, r]) => (
            <div key={l as string} className={`card px-4 py-3 mb-2 flex items-center gap-3 ${r ? "border-ink" : ""}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${r ? "bg-ink text-bone" : "border border-line"}`}>{r || ""}</span>
              <span className="font-semibold">{l}</span>
            </div>
          ))}
          <div className="card px-4 py-3 mt-4 flex items-center gap-2 text-sm"><Check className="w-4 h-4" style={{ color: "#2d7a5f" }} /> Consent signed · right to see, export or delete data</div>
        </>
      )}
      {i === 1 && (
        <>
          <div className="text-xs text-ink-soft">Right wrist · palm up</div>
          <h4 className="text-xl mt-1 mb-3">Rate the guan: Spleen · Stomach</h4>
          <div className="grid grid-cols-5 gap-2 mb-5">
            {["Very weak", "Weak", "Even", "Strong", "Very strong"].map((l, n) => (
              <div key={l} className={`rounded-[var(--radius-m)] py-3 text-center border ${n === 0 ? "text-white border-transparent" : "bg-paper border-line"}`} style={n === 0 ? { background: "var(--earth)" } : undefined}>
                <div className="display text-2xl leading-none">{n + 1}</div>
                <div className="text-[10px] mt-1">{l}</div>
              </div>
            ))}
          </div>
          <div className="card p-4">
            <div className="text-sm mb-3">Earth reads low (−1.3) against Wood strong (+1.1). Tongue: pink, thick white, teeth marks, wet → Spleen dampness. <strong>Confirms.</strong></div>
            <ElementBars balance={BALANCE} compact />
          </div>
        </>
      )}
      {(i === 2 || i === 5) && (
        <>
          <div className="text-xs text-ink-soft">{i === 2 ? "Opening reading" : "Closing reading"}</div>
          <h4 className="text-xl mt-1">Let the needle settle. Tap once.</h4>
          <svg viewBox="0 0 200 130" className="w-full max-w-sm mx-auto mt-2">
            <path d="M20 120 A80 80 0 0 1 180 120" stroke="var(--bone-2)" strokeWidth="18" fill="none" />
            <path d="M20 120 A80 80 0 0 1 100 40" stroke="#2d7a5f" strokeWidth="18" fill="none" opacity="0.35" />
            <path d="M100 40 A80 80 0 0 1 180 120" stroke="var(--fire)" strokeWidth="18" fill="none" opacity="0.35" />
            <g style={{ transformOrigin: "100px 120px", transform: `rotate(${-80 + ((i === 2 ? 68 : 41) / 100) * 160}deg)`, transition: "transform 0.8s cubic-bezier(.2,.9,.3,1.2)" }}>
              <line x1="100" y1="120" x2="100" y2="48" stroke="var(--fire)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="120" r="7" fill="var(--ink)" />
            </g>
          </svg>
          <div className="text-center -mt-2">
            <span className="display text-6xl tabular-nums">{i === 2 ? 68 : 41}</span>
            {i === 5 && <div className="font-semibold mt-1" style={{ color: "#2d7a5f" }}>68 → 41 · down 40%</div>}
          </div>
        </>
      )}
      {i === 3 && (
        <>
          <div className="text-xs text-ink-soft">Protocol</div>
          <h4 className="text-xl mt-1">Digestion and steady energy</h4>
          <div className="text-sm text-ink-soft">Support Earth · 4 points · about 2 min on the probe</div>
          <ol className="mt-4 text-sm flex flex-col gap-2">
            {["Pulse: Earth reads low (−1.3) against Wood strong (+1.1).", "Wood is over-acting on Earth (control cycle). Support Earth, ease Wood.", "Tongue confirms: Spleen dampness.", "Client asked for digestion and steady energy, which matches the pulse.", "Last session settled well (68 → 41); timers shortened by 5 s.", "CV 12 took longest to settle last time; given 10 s more today.", "Spleen peaks this hour: Earth points need less time."].map((r, k) => (
              <li key={k} className="flex gap-2"><span className="text-ink-soft w-4 shrink-0">{k + 1}.</span><span>{r}</span></li>
            ))}
          </ol>
        </>
      )}
      {i === 4 && (
        <>
          <div className="text-xs text-ink-soft">Step 2 of 4</div>
          <h4 className="text-2xl mt-1">Grab the probe. Find Spleen 6.</h4>
          <div className="flex items-center justify-center my-6">
            <div className="relative w-[200px] h-[200px]">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="88" stroke="var(--bone-2)" strokeWidth="14" fill="none" />
                <circle cx="100" cy="100" r="88" stroke="var(--earth)" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * 0.4} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="display text-5xl">18<span className="text-xl">s</span></span><span className="text-xs text-ink-soft">of 30 s</span></div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[["Weak", "var(--metal)"], ["Rising", "var(--fire)"], ["Steady", "#2d7a5f"], ["Falling", "var(--water)"], ["Strong", "var(--earth)"]].map(([l, c]) => (
              <div key={l} className="rounded-[var(--radius-s)] text-white text-xs font-bold text-center py-3" style={{ background: c }}>{l}</div>
            ))}
          </div>
        </>
      )}
      {i === 6 && (
        <>
          <div className="text-xs text-ink-soft">Emailed to Sarah · 2:58 pm</div>
          <h4 className="text-xl mt-1">Your session · Sarah · October 10</h4>
          <div className="flex gap-3 mt-3">
            {[["68", "Start"], ["41", "End"]].map(([n, l], k) => (
              <div key={l} className="card px-5 py-3 text-center"><div className="display text-4xl" style={{ color: k ? "#2d7a5f" : undefined }}>{n}</div><div className="text-xs text-ink-soft">{l}</div></div>
            ))}
            <div className="self-center font-semibold text-sm" style={{ color: "#2d7a5f" }}>Down 40% this session; down 45% since your first visit.</div>
          </div>
          <div className="rounded-[var(--radius-m)] p-4 mt-4 text-sm italic" style={{ background: "var(--earth-soft)" }}>
            Your centre, the Earth that feeds every other part of you, was running quiet while the Wood around it pushed hard. Today we gave the centre back its warmth.
          </div>
          <div className="text-sm mt-3"><strong>Next visit:</strong> within 7 days. <strong>This week:</strong> warm cooked meals, an early night, a short walk after lunch.</div>
        </>
      )}
      {i === 7 && (
        <>
          <div className="text-xs text-ink-soft">48 hours later</div>
          <h4 className="text-xl mt-1 mb-2">Living Current Index</h4>
          <div className="flex justify-center"><IndexDial index={INDEX} size={240} animate={false} /></div>
          <p className="text-sm text-ink-soft text-center">Always against Sarah's own first sessions, never a population norm.</p>
        </>
      )}
    </div>
  );
}
