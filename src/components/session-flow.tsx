"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { ClientRecord } from "@/lib/demo-data";
import { buildProtocol, deriveElementGaps, pulsePositions } from "@/lib/protocol";
import type { PulsePosition, PulseReadings } from "@/lib/protocol";
import { flowSteps } from "@/lib/session-steps";

const tongueOptions = ["Pale", "Red tip", "Scalloped", "Thin coat", "Central crack", "Moist"];

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function SessionFlow({
  client,
  step,
}: {
  client: ClientRecord;
  step: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = flowSteps.findIndex(({ id }) => id === step);
  const current = flowSteps[currentIndex];
  const [ratings, setRatings] = useState<PulseReadings>(() =>
    Object.fromEntries(
      pulsePositions.map((position) => [
        position,
        position.startsWith("Left guan") ? 3 : position.startsWith("Right guan") ? 1 : 2,
      ]),
    ) as PulseReadings,
  );
  const [tongueSigns, setTongueSigns] = useState<string[]>(["Scalloped", "Thin coat"]);
  const [tone, setTone] = useState<"tonify" | "even" | "reduce">("tonify");
  const [consent, setConsent] = useState(false);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(90);
  const [reflection, setReflection] = useState("");

  const elementGaps = useMemo(
    () =>
      deriveElementGaps({
        earth: average([ratings["Right guan"], ratings["Right guan (deep)"]]),
        wood: average([ratings["Left guan"], ratings["Left guan (deep)"]]),
      }),
    [ratings],
  );
  const protocol = buildProtocol(elementGaps);
  const next = flowSteps[currentIndex + 1];
  const previous = flowSteps[currentIndex - 1];

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const context = gsap.context(() => {
      gsap.fromTo(".flow-animate", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    }, node);
    return () => context.revert();
  }, [step]);

  useEffect(() => {
    if (!started || seconds <= 0) return;
    const timerId = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timerId);
  }, [started, seconds]);

  function goNext() {
    if (next) router.push(`/session/${client.id}/${next.id}`);
    else router.push(`/r/${client.id}`);
  }

  function toggleTongue(sign: string) {
    setTongueSigns((selected) => selected.includes(sign) ? selected.filter((item) => item !== sign) : [...selected, sign]);
  }

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <main className="flow-page" ref={containerRef}>
      <div className="flow-top">
        <Link className="flow-back" href={`/clients/${client.id}`}><ArrowLeft size={15} /> Leave session</Link>
        <div className="flow-client"><span className={`avatar avatar-${client.color}`}>{client.initials}</span>{client.name}</div>
      </div>
      <div className="flow-progress" aria-label={`Step ${currentIndex + 1} of ${flowSteps.length}`}>
        {flowSteps.map((item, index) => <span className={`progress-segment ${index <= currentIndex ? "complete" : ""}`} key={item.id} />)}
      </div>
      <div className="flow-heading flow-animate">
        <div className="eyebrow">SESSION FLOW <span className="divider-dot">·</span> STEP {currentIndex + 1} OF {flowSteps.length}</div>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
      </div>

      <section className="flow-card flow-animate" aria-live="polite">
        {step === "intake" && (
          <>
            <div className="prompt-box">Take a breath together. What feels most important for you to leave with today?</div>
            <label className="field-label" htmlFor="client-focus">Client’s intention</label>
            <textarea className="text-field" id="client-focus" rows={3} placeholder="A few words in their own language…" defaultValue={client.id === "sarah-m" ? "More steady energy through the afternoon." : ""} />
            <label className="field-label" htmlFor="session-checkin">How have things been since your last visit?</label>
            <select className="select-field" id="session-checkin" defaultValue="some-change"><option value="some-change">Some shifts, still finding my rhythm</option><option value="better">Feeling a little more settled</option><option value="same">About the same</option><option value="new">This is my first visit</option></select>
            <label className="signoff"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> I confirm consent to today’s care and session notes is documented.</label>
          </>
        )}

        {step === "pulse" && (
          <>
            <div className="prompt-box">Rate each position from 0 (very low) to 4 (very strong). Ratings are a reflective aid, not a diagnosis.</div>
            <label className="field-label">Fourteen-position pulse map</label>
            <div className="rating-list">
              {pulsePositions.map((position: PulsePosition) => (
                <label className="rating-control" key={position}>
                  <span>{position}</span>
                  <input aria-label={`${position} pulse rating`} type="range" min="0" max="4" step="0.5" value={ratings[position]} onChange={(event) => setRatings((currentRatings) => ({ ...currentRatings, [position]: Number(event.target.value) }))} />
                  <strong>{ratings[position]}</strong>
                </label>
              ))}
            </div>
            <div className="protocol-tags"><span className="element-badge">Earth {elementGaps.earth > 0.5 ? "low" : "steady"}</span><span className="element-badge">Wood {elementGaps.wood > 0.5 ? "over-acting" : "steady"}</span></div>
          </>
        )}

        {step === "tongue" && (
          <>
            <div className="prompt-box">Notice without judgement. Select the signs you observe and add any context that feels useful.</div>
            <div className="tongue-map" role="img" aria-label="Illustration of a tongue"><div className="tongue-coat" /><div className="tongue-center" /></div>
            <div className="tongue-markers">
              {tongueOptions.map((sign) => <button className={`marker-chip ${tongueSigns.includes(sign) ? "selected" : ""}`} key={sign} onClick={() => toggleTongue(sign)}>{tongueSigns.includes(sign) && <Check size={11} />} {sign}</button>)}
            </div>
            <label className="field-label" htmlFor="tongue-note">Observation note</label>
            <input id="tongue-note" className="text-field" placeholder="Optional detail for your clinical notes" />
          </>
        )}

        {step === "reading" && (
          <>
            <div className="readout-box"><h3>A pattern is beginning to emerge</h3><p>Your pulse ratings suggest Earth may need support, while Wood is showing more activity. The tongue observations add context rather than a conclusion.</p></div>
            <div className="client-facts">
              <div className="client-fact"><span>Today’s intention</span><strong>Steadier afternoon energy</strong></div>
              <div className="client-fact"><span>Pulse signal</span><strong>Earth low · Wood active</strong></div>
              <div className="client-fact"><span>Tongue notes</span><strong>{tongueSigns.length} observations</strong></div>
            </div>
            <label className="field-label" htmlFor="practitioner-note">Practitioner reflection</label>
            <textarea className="text-field" rows={3} id="practitioner-note" placeholder="What are you curious about?" />
          </>
        )}

        {step === "protocol" && (
          <>
            <div className="readout-box"><div className="eyebrow">SUGGESTED FROM YOUR RULES</div><h3>{protocol.title}</h3><p>{protocol.summary}</p></div>
            <div className="panel-title" style={{ margin: "20px 0 11px" }}><div><h2 style={{ fontSize: 16 }}>Suggested point sequence</h2><p>{protocol.settings.pace} pace · about {protocol.settings.sessionMinutes} minutes</p></div><Sparkles size={18} color="#8ba58d" /></div>
            <div className="point-list">
              {protocol.points.map((point) => <div className="point-row" key={point.name}><div className="point-code">{point.name}</div><div><strong>{point.location}</strong><p>{point.reason}</p></div><span className="point-tone">{point.tone}</span></div>)}
            </div>
            <p className="field-label">You can adjust any suggestion to match your clinical judgement.</p>
          </>
        )}

        {step === "points" && (
          <>
            <div className="point-row"><div className="point-code">{protocol.points[0]?.name ?? "ST 36"}</div><div><strong>{protocol.points[0]?.location ?? "Below the knee"}</strong><p>{protocol.points[0]?.reason ?? "Supports a steady center"}</p></div><span className="point-tone">POINT 1 / {protocol.points.length}</span></div>
            <div className="tone-buttons" role="group" aria-label="Choose treatment tone">
              {(["tonify", "even", "reduce"] as const).map((option) => <button className={`tone-button ${tone === option ? "selected" : ""}`} key={option} onClick={() => setTone(option)}>{option === "tonify" ? "Tonify" : option === "even" ? "Even" : "Reduce"}</button>)}
            </div>
            <div className="timer-card" style={{ marginTop: 22 }}>
              <div className="timer-label"><Clock3 size={13} /> &nbsp;POINT SETTLE TIMER</div>
              <div className="timer-value">{formattedTime}</div>
              <div className="timer-actions">
                <button className="button button-primary" onClick={() => setStarted((value) => !value)}>{started ? <Pause size={15} /> : <Play size={15} />}{started ? "Pause" : "Begin"}</button>
                <button className="button button-outline" onClick={() => { setStarted(false); setSeconds(90); }}><RotateCcw size={14} /> Reset</button>
              </div>
              {seconds === 0 && <p className="field-label">Timer complete. Take a moment before moving on.</p>}
            </div>
          </>
        )}

        {step === "closing" && (
          <>
            <div className="success-mark"><CheckCircle2 size={26} /></div>
            <div className="prompt-box">Invite your client to notice what feels different. Nothing needs to be forced or measured in this moment.</div>
            <label className="field-label" htmlFor="closing-note">What would you like to remember from today?</label>
            <textarea className="text-field" id="closing-note" rows={4} placeholder="A brief reflection for your private notes…" value={reflection} onChange={(event) => setReflection(event.target.value)} />
            <label className="field-label" htmlFor="home-care">A gentle practice to take home</label>
            <input className="text-field" id="home-care" placeholder="One small thing they can return to" defaultValue="Pause for three slow breaths before the afternoon rush." />
          </>
        )}

        {step === "report" && (
          <>
            <div className="success-mark"><CheckCircle2 size={26} /></div>
            <div className="readout-box"><div className="eyebrow">SESSION SUMMARY · DEMO MODE</div><h3>Care, carried forward.</h3><p>This fictional session summary is ready to preview. Demo information is not saved or sent.</p></div>
            <div className="client-facts">
              <div className="client-fact"><span>Session focus</span><strong>Support Earth</strong></div>
              <div className="client-fact"><span>Points completed</span><strong>{protocol.points.length} points · {tone} tone</strong></div>
              <div className="client-fact"><span>Practice note</span><strong>{reflection || "Steadier afternoon energy"}</strong></div>
            </div>
          </>
        )}
      </section>

      <div className="flow-nav">
        {previous ? <button className="button button-outline" onClick={() => router.push(`/session/${client.id}/${previous.id}`)}><ArrowLeft size={15} /> Previous</button> : <span />}
        <span className="flow-counter">{currentIndex + 1} / {flowSteps.length}</span>
        {step === "intake" && !consent ? (
          <button className="button button-primary" disabled style={{ opacity: .48 }}>Confirm consent</button>
        ) : step === "intake" ? (
          <button className="button button-primary" onClick={goNext}>Begin session <ArrowRight size={15} /></button>
        ) : step === "report" ? (
          <Link className="button button-primary" href={`/r/${client.id}`}>Open client report <ArrowRight size={15} /></Link>
        ) : (
          <button className="button button-primary" onClick={goNext}>Continue <ArrowRight size={15} /></button>
        )}
      </div>
    </main>
  );
}
