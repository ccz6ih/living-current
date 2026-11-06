"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

/* ---------- Why software ---------- */
export function WhySoftware() {
  const today = [
    ["Buy the device", "$30–55k"],
    ["Weekend training", "Theory, points, settings, all at once"],
    ["Memorise it", "A different protocol for every condition"],
    ["Apply it alone", "Migraine today, a bad knee tomorrow: back to the notes"],
    ["Device underused", "Practitioners fall back on a few familiar points"],
  ];
  const after = [
    ["Buy the device", "With financing and a launch kit"],
    ["Course and certification", "Dr. Amina teaches the why"],
    ["Software at their side", "Pulse, tongue and intake lead to the right protocol"],
    ["Guided, point by point", "Migraine, memory, knee, back, eyes: no re-studying"],
    ["Results they can show", "Confidence grows; the device earns its keep"],
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <h2 className="text-4xl max-w-2xl">From memorising to being guided</h2>
      <p className="text-ink-soft mt-3 max-w-2xl">About 400 Equiscope owners took a weekend course and went home with notes. Most use a handful of points. The biggest fear for a new buyer is “I'll never remember all of this.” The software removes it.</p>
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <Column title="Today" items={today} muted />
        <Column title="With Living Current" items={after} />
      </div>
    </section>
  );
}

function Column({ title, items, muted = false }: { title: string; items: string[][]; muted?: boolean }) {
  return (
    <div className={`rounded-[var(--radius-l)] p-6 ${muted ? "bg-bone-2" : "bg-paper border border-line"}`}>
      <h3 className="text-2xl mb-4">{title}</h3>
      <ol className="flex flex-col gap-3">
        {items.map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${muted ? "bg-bone text-ink-soft" : "bg-ink text-bone"}`}>{i + 1}</span>
            <span><span className="block font-semibold">{t}</span><span className={`block text-sm ${muted ? "text-ink-soft" : ""}`}>{d}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- The method ---------- */
export function Method() {
  const items = [
    ["She writes every protocol", "Nothing enters the library without Dr. Amina's approval. Her name is on every protocol and in every report."],
    ["It suggests; the practitioner decides", "Certification is still required. The software is a guide at the treatment table, not a replacement for training."],
    ["Masters don't need it", "An expert mode shows a single screen or nothing at all. Dr. Amina treats as she always has; the software is for her students."],
    ["Her knowledge reaches more people", "A practitioner in Ohio treats a migraine the way she would. Anonymised session results help her refine the protocols over time."],
  ];
  return (
    <section id="method" className="bg-ink text-bone">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-4xl max-w-2xl">Dr. Amina's method, carried, not diluted</h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 mt-10">
          {items.map(([t, d]) => (
            <div key={t}>
              <h3 className="text-xl">{t}</h3>
              <p className="text-bone/75 mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <blockquote className="mt-14 display text-2xl md:text-3xl max-w-3xl leading-snug text-bone/90">
          Think of it as Dr. Amina at every practitioner's shoulder: her method, applied the way she would, by people she will never meet.
        </blockquote>
      </div>
    </section>
  );
}

/* ---------- Results ---------- */
export function Results() {
  const items = [
    ["Start and end readings", "Every session logs the needle before and after, charted across visits. Lower is more settled."],
    ["Four sliders, four times", "Pain, stress, sleep, energy at 0–10: before, right after, 24 h and 48 h. The only validated kind of input there is: patient-rated outcomes."],
    ["The Living Current Index", "One score, 0–100, from settle, point settle time, five-element balance and wellbeing. Always against the client's own first sessions, never a population norm."],
    ["A report people share", "Branded web page plus PDF, with a booking QR code. Every report markets the practitioner."],
  ];
  return (
    <section id="results" className="max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
      <div>
        <h2 className="text-4xl">Results they can show</h2>
        <p className="text-ink-soft mt-3">Clients see progress, which drives rebooking. Practitioners see what settled and what didn't. Anonymised, it is how Amina refines her protocols and the research record her paper asks for.</p>
        <ul className="mt-8 flex flex-col gap-5">
          {items.map(([t, d]) => (
            <li key={t}><h3 className="text-lg">{t}</h3><p className="text-ink-soft text-sm mt-1 leading-relaxed">{d}</p></li>
          ))}
        </ul>
        <Link href="/app/clients/sarah-m" className="btn btn-ghost tap mt-8">Open Sarah's file</Link>
      </div>
      <div className="card p-6">
        <div className="text-sm text-ink-soft">Sarah M. · 54 · client since June</div>
        <div className="text-sm mt-1">Main concern: digestion and low energy</div>
        <svg viewBox="0 0 400 180" className="w-full mt-4">
          <g stroke="var(--bone-2)">{[0, 1, 2, 3].map((k) => <line key={k} x1="30" x2="390" y1={20 + k * 40} y2={20 + k * 40} />)}</g>
          <polyline fill="none" stroke="var(--metal)" strokeWidth="2.5" points="40,32 110,36 180,42 250,50 320,54 390,62" />
          <polyline fill="none" stroke="#2d7a5f" strokeWidth="3" points="40,78 110,80 180,84 250,90 320,94 390,100" />
          {[40, 110, 180, 250, 320, 390].map((x, k) => (<g key={x}><circle cx={x} cy={[32, 36, 42, 50, 54, 62][k]} r="4" fill="var(--metal)" /><circle cx={x} cy={[78, 80, 84, 90, 94, 100][k]} r="4" fill="#2d7a5f" /></g>))}
          <g fontSize="11" fill="var(--ink-soft)">{["Aug 15", "Aug 29", "Sep 12", "Sep 26", "Oct 3", "Oct 10"].map((d, k) => <text key={d} x={40 + k * 70} y="128" textAnchor="middle">{d}</text>)}</g>
          <text x="40" y="160" fontSize="11" fill="var(--metal)">— Start</text>
          <text x="100" y="160" fontSize="11" fill="#2d7a5f">— End</text>
        </svg>
        <ul className="divide-y divide-line text-sm mt-2">
          {[["Oct 10", "Earth focus · 4 points", "68 → 41"], ["Oct 3", "Earth + Wood · 5 points", "62 → 44"], ["Sep 26", "Wood focus · 4 points", "66 → 46"]].map(([d, w, r]) => (
            <li key={d} className="py-2 grid grid-cols-[60px_1fr_auto]"><span className="font-semibold">{d}</span><span className="text-ink-soft">{w}</span><span className="font-semibold" style={{ color: "#2d7a5f" }}>{r}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Teaching path ---------- */
export function TeachingPath() {
  const levels = [
    ["Level 1", "Foundations", "Pre-recorded course and certification exam. Unlocks the software and core protocols.", "$4,950"],
    ["Level 2", "Practitioner", "Live online cohort with Dr. Amina: pulse and tongue mastery, case reviews. Unlocks advanced protocols.", "~$2,500"],
    ["Level 3", "Advanced", "In-person intensive with Dr. Amina, hands-on. Unlocks her complex-case protocols.", "~$4,500"],
    ["Masterclasses", "Specialties", "Migraine, memory, pain, eyes, facials, animals. Adds a protocol pack per specialty.", "~$750 each"],
  ];
  return (
    <section id="learn" className="border-y border-line bg-paper">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-4xl">A teaching path built around Dr. Amina</h2>
        <p className="text-ink-soft mt-3 max-w-2xl">Recorded once, Level 1 brings new practitioners in without using her time. Everything above it is Dr. Amina teaching live, which is what she wants to do. Passing Level 1 certifies you, unlocks the software and lists you in the directory.</p>
        <ol className="grid md:grid-cols-4 gap-4 mt-10">
          {levels.map(([n, t, d, p], i) => (
            <li key={n} className="card p-5 flex flex-col" style={{ borderTop: `5px solid ${["var(--wood)", "var(--earth)", "var(--water)", "var(--fire)"][i]}` }}>
              <div className="text-xs text-ink-soft">{n}</div>
              <h3 className="text-2xl mt-1">{t}</h3>
              <p className="text-sm text-ink-soft mt-2 flex-1 leading-relaxed">{d}</p>
              <div className="display text-2xl mt-4">{p}</div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-ink-soft mt-6">Monthly case rounds with Amina, continuing-education credits once accredited, and a mentor track by invitation. Prices to be set together.</p>
      </div>
    </section>
  );
}

/* ---------- Who it's for ---------- */
export function WhoFor() {
  const cols = [
    ["Licensed to use it directly", ["Physicians (MD, DO), NPs, PAs", "Chiropractors", "Physical therapists", "Acupuncturists", "Naturopathic doctors, in licensing states", "Veterinarians, for animals"]],
    ["Under a licensed practitioner's order", ["Massage therapists (state-dependent)", "Nurses, athletic trainers", "Trained technicians in a clinic", "Estheticians, for facials, within state limits"]],
    ["Outside the US", ["UK and Netherlands: trained practitioners", "Germany: Heilpraktiker or doctors", "Animals: trained technicians"]],
  ] as const;
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <h2 className="text-4xl">Who it's for</h2>
      <p className="text-ink-soft mt-3 max-w-2xl">Not “anyone”, but a wide base. The Equiscope and Acuscope are Class II devices sold for use by or on the order of a licensed practitioner. At sign-up you give your licence type and state or country; supervised users name their supervising practitioner.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {cols.map(([t, items]) => (
          <div key={t}>
            <h3 className="text-xl mb-3">{t}</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {items.map((it) => <li key={it} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#2d7a5f" }} />{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
export function Pricing() {
  const tiers = [
    ["Certification", "$4,950", "once", ["Level 1 course and exam", "Live practicum with Amina", "First 12 months of software included", "Directory listing"], true],
    ["Practitioner", "$99", "per month after year one", ["Amina's full protocol library", "Client files, reports, check-ins", "Booking and reminders", "Case calls with Amina"], false],
    ["Clinic", "$249", "per month", ["3 seats, all modes", "Insurance-ready notes", "Marketing kit", "Priority support"], false],
  ] as const;
  return (
    <section id="pricing" className="bg-bone-2">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-4xl">Pricing</h2>
        <p className="text-ink-soft mt-3 max-w-2xl">Plain booking software costs $59–99 a month and carries no protocols. Ours carries Amina's. One extra session a month pays for it.</p>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {tiers.map(([t, p, per, items, hi]) => (
            <div key={t} className={`rounded-[var(--radius-l)] p-6 flex flex-col ${hi ? "bg-ink text-bone" : "bg-paper border border-line"}`}>
              <h3 className="text-2xl">{t}</h3>
              <div className="mt-3"><span className="display text-5xl">{p}</span> <span className={`text-sm ${hi ? "text-bone/70" : "text-ink-soft"}`}>{per}</span></div>
              <ul className="mt-5 flex flex-col gap-2 text-sm flex-1">
                {items.map((it) => <li key={it} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: hi ? "var(--earth)" : "#2d7a5f" }} />{it}</li>)}
              </ul>
              <a href="#pilot" className={`btn tap mt-6 ${hi ? "btn-earth" : "btn-ghost"}`}>{hi ? "Reserve a seat" : "Ask about this"}</a>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-soft mt-6">Facials-only track: $1,495 course and $49 a month. Prices are a working draft; final numbers set with Dr. Amina.</p>
      </div>
    </section>
  );
}

/* ---------- Trust ---------- */
export function Trust() {
  const items = [
    ["Wellness language only", "Every screen, report and ad talks about balance, recovery and energy, never disease names or cures. The software is educational and does not diagnose. Intended-use statement reviewed by a regulatory lawyer before launch."],
    ["Built to HIPAA and GDPR standards for everyone", "Explicit consent at intake, e-signature on file, the right to see, export or delete data. EU data stays in EU hosting; a Business Associate Agreement for covered practitioners."],
    ["The secret sauce stays secret", "Protocols live on our servers and the app shows one step at a time. One login per certified practitioner. The full library is never downloadable."],
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-3 gap-8">
      {items.map(([t, d]) => (
        <div key={t}><h3 className="text-xl">{t}</h3><p className="text-ink-soft text-sm mt-2 leading-relaxed">{d}</p></div>
      ))}
    </section>
  );
}

/* ---------- Pilot CTA ---------- */
export function Pilot() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", device: "Equiscope", licence: "", region: "" });
  return (
    <section id="pilot" className="border-t border-line bg-paper">
      <div className="max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
        <div>
          <h2 className="text-4xl">Join the pilot</h2>
          <p className="text-ink-soft mt-3 leading-relaxed">We're taking ten practitioners who already own an Equiscope or Acuscope for a 60-day pilot: Level 1 at a founding price, the software from day one, and monthly case calls with Dr. Amina. Your session results, anonymised, shape the protocols everyone else gets.</p>
          <ul className="mt-6 flex flex-col gap-2 text-sm">
            {["Founding-practitioner pricing, locked for life", "Direct line to Amina during the pilot", "Your name in the first directory"].map((i) => <li key={i} className="flex gap-2"><Check className="w-4 h-4 mt-0.5" style={{ color: "#2d7a5f" }} />{i}</li>)}
          </ul>
        </div>
        {sent ? (
          <div className="card p-8"><div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--wood-soft)", color: "var(--wood)" }}><Check className="w-6 h-6" /></div><h3 className="text-2xl mt-4">You're on the list</h3><p className="text-ink-soft mt-2">We'll reply within two working days with the pilot details and a time to talk.</p></div>
        ) : (
          <form className="card p-6 grid gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <label className="block text-sm"><span className="font-semibold">Device</span>
              <select value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value })} className="mt-1 w-full border border-line rounded-[var(--radius-s)] px-4 py-3 bg-paper">
                {["Equiscope", "Acuscope", "Both", "Not yet"].map((d) => <option key={d}>{d}</option>)}
              </select></label>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Licence or role" value={form.licence} onChange={(v) => setForm({ ...form, licence: v })} placeholder="LAc, DC, LMT…" />
              <Field label="State or country" value={form.region} onChange={(v) => setForm({ ...form, region: v })} placeholder="Colorado" />
            </div>
            <button className="btn btn-primary tap">Request a place</button>
            <p className="text-xs text-ink-soft">No spam. We'll only use this to talk about the pilot.</p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block text-sm"><span className="font-semibold">{label}</span>
      <input type={type} required={required} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-line rounded-[var(--radius-s)] px-4 py-3 bg-paper" />
    </label>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-5 py-8 text-xs text-ink-soft flex flex-wrap gap-x-8 gap-y-2">
        <span>Living Current · The Dr. Amina Method™</span>
        <span>Educational software for licensed and supervised practitioners. It does not diagnose or treat any condition.</span>
        <span className="ml-auto"><Link href="/app" className="underline underline-offset-4">Practitioner login</Link></span>
      </div>
    </footer>
  );
}
