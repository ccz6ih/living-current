"use client";

import { useState } from "react";
import { GOALS } from "@/data/protocols";
import { PRACTITIONER } from "@/data/seed";
import { Check } from "lucide-react";

/**
 * Sent by email or text link; filled in on the client's phone before the visit.
 * Element headings stay hidden. Consent is signed here and stored in the file.
 */
const QUESTIONS = [
  { q: "Do you feel tense, irritable, or stiff lately?" },
  { q: "How is your sleep, and how settled is your mind?" },
  { q: "How are your digestion, appetite and energy after meals?" },
  { q: "Any trouble with breathing, skin, or letting things go?" },
  { q: "Do you run cold, tire easily, or feel it in the lower back?" },
];

export default function IntakePage() {
  const [page, setPage] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [answers, setAnswers] = useState<number[]>(QUESTIONS.map(() => 5));
  const [signed, setSigned] = useState(false);
  const [name, setName] = useState("");

  const toggle = (id: string) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : g.length < 3 ? [...g, id] : g));

  return (
    <div className="min-h-dvh px-5 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-sm text-ink-soft mb-1">{PRACTITIONER.clinic}</div>
        <div className="flex gap-1 mb-6">
          {[0, 1, 2].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= page ? "bg-ink" : "bg-bone-2"}`} />)}
        </div>

        {page === 0 && (
          <div>
            <h1 className="text-3xl">What would you like to work on?</h1>
            <p className="text-ink-soft text-sm mt-1 mb-5">Pick up to three. Tap in the order that matters most.</p>
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => {
                const rank = goals.indexOf(g.id);
                return (
                  <button key={g.id} onClick={() => toggle(g.id)} aria-pressed={rank >= 0} className={`tap text-left px-4 py-3 rounded-[var(--radius-m)] border flex items-center gap-3 ${rank >= 0 ? "border-ink bg-paper" : "border-line bg-paper/70"}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank >= 0 ? "bg-ink text-bone" : "border border-line text-ink-soft"}`}>{rank >= 0 ? rank + 1 : ""}</span>
                    <span className="font-semibold">{g.label}</span>
                  </button>
                );
              })}
            </div>
            <button disabled={!goals.length} onClick={() => setPage(1)} className="btn btn-primary tap w-full mt-6 disabled:opacity-40">Next</button>
          </div>
        )}

        {page === 1 && (
          <div>
            <h1 className="text-3xl">A few quick questions</h1>
            <p className="text-ink-soft text-sm mt-1 mb-5">0 is not at all, 10 is very much.</p>
            <div className="flex flex-col gap-5">
              {QUESTIONS.map((q, i) => (
                <label key={i} className="block card p-4">
                  <div className="flex justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold">{q.q}</span>
                    <span className="display text-2xl tabular-nums leading-none">{answers[i]}</span>
                  </div>
                  <input type="range" min={0} max={10} value={answers[i]} onChange={(e) => setAnswers(answers.map((a, k) => (k === i ? Number(e.target.value) : a)))} />
                </label>
              ))}
            </div>
            <button onClick={() => setPage(2)} className="btn btn-primary tap w-full mt-6">Next</button>
          </div>
        )}

        {page === 2 && !signed && (
          <div>
            <h1 className="text-3xl">Before your visit</h1>
            <div className="card p-5 mt-4 text-sm flex flex-col gap-3">
              <p>Your session uses a gentle microcurrent device on points on the skin, guided by a trained practitioner. Most people feel little or nothing during the session.</p>
              <p>It is a wellness service. It does not diagnose, treat or cure any condition, and it does not replace medical care.</p>
              <p>Your answers, readings and any photos are kept in your private file. You can see, export or delete them at any time. Session results may be used in anonymised form to refine the method; you can say no to that below.</p>
            </div>
            <label className="block mt-5">
              <span className="text-sm font-semibold">Sign with your full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border border-line rounded-[var(--radius-s)] px-4 py-3 bg-paper text-lg" placeholder="Your name" />
            </label>
            <label className="flex items-center gap-3 mt-4 text-sm">
              <input type="checkbox" defaultChecked className="w-5 h-5" /> Anonymised results may help refine the method
            </label>
            <button disabled={name.trim().length < 3} onClick={() => setSigned(true)} className="btn btn-primary tap w-full mt-6 disabled:opacity-40">I agree and sign</button>
          </div>
        )}

        {signed && (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: "var(--wood-soft)", color: "var(--wood)" }}><Check className="w-7 h-7" /></div>
            <h1 className="text-3xl mt-4">All set</h1>
            <p className="text-ink-soft mt-2">Signed {new Date().toLocaleDateString()}. Your practitioner has what they need. See you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
