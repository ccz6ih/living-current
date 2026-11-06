"use client";

import { useState } from "react";
import { Activity, CheckCircle2, Sparkles } from "lucide-react";

export function ClientPortalForm({
  mode,
  token,
}: {
  mode: "intake" | "checkin";
  token: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const title = mode === "intake" ? "A little space to arrive." : "How are you feeling today?";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="report-wrap">
      <div className="report-brand"><span className="brand-mark"><Activity size={19} /></span> living current</div>
      <section className="report-card portal-card">
        <div className="eyebrow">{mode === "intake" ? "BEFORE YOUR SESSION" : "A GENTLE CHECK-IN"}</div>
        <h1>{submitted ? "Thank you for sharing." : title}</h1>
        {submitted ? (
          <div className="portal-success"><CheckCircle2 size={26} /><p>Thank you for sharing. This demo does not save or send your response.</p></div>
        ) : (
          <>
            <p>{mode === "intake" ? "Your words help shape a session that meets you where you are. Share only what feels comfortable." : "A few quick reflections help us stay connected between visits. There are no right or wrong answers."}</p>
            <form onSubmit={submit}>
              {mode === "intake" ? (
                <>
                  <label className="field-label" htmlFor="intention">What would you like support with today?</label>
                  <textarea className="text-field" id="intention" rows={4} placeholder="Share in your own words…" required />
                  <label className="field-label" htmlFor="history">Anything you’d like Amina to know?</label>
                  <textarea className="text-field" id="history" rows={3} placeholder="Optional" />
                  <label className="signoff"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /> I consent to receive care from Amina Shah and understand that these notes are shared with my practitioner.</label>
                </>
              ) : (
                <>
                  {[
                    ["energy", "Energy", "How steady does your energy feel?"],
                    ["mood", "Mood", "How settled do you feel today?"],
                    ["sleep", "Sleep", "How rested do you feel?"],
                    ["tension", "Tension", "How much tension are you noticing?"],
                  ].map(([name, label, question]) => (
                    <label className="slider-question" key={name}>
                      <span><strong>{label}</strong><small>{question}</small></span>
                      <input type="range" min="1" max="5" defaultValue="3" aria-label={label} />
                    </label>
                  ))}
                  <label className="field-label" htmlFor="checkin-note">Anything else you’d like to share?</label>
                  <textarea className="text-field" id="checkin-note" rows={3} placeholder="Optional" />
                </>
              )}
              <button className="button button-primary full-button" type="submit" disabled={mode === "intake" && !consent} style={{ opacity: mode === "intake" && !consent ? .5 : 1 }}>
                {mode === "intake" ? "Share with Amina" : "Send check-in"} <Sparkles size={14} />
              </button>
            </form>
          </>
        )}
        <div className="portal-demo">Demo link · {token}</div>
      </section>
      <p className="public-note">Your care, your pace. Your responses are for your practitioner.</p>
    </main>
  );
}
