"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { clientOf, useSessions } from "@/lib/store";
import { ELEMENT_LABEL } from "@/engine/types";
import { DEVICE_BY_ID } from "@/data/devices";
import { PRACTITIONER } from "@/data/seed";
import { Printer } from "lucide-react";

/**
 * Insurance-ready session note for licensed users: what was done, in the
 * format a biller expects. Service categories are placeholders from Jan's
 * training; CPT selection is the practitioner's call, never the app's.
 */
export default function SessionNotePage() {
  const { id } = useParams<{ id: string }>();
  const { getSession, settings, hydrated } = useSessions();
  const s = getSession(id);
  if (!hydrated) return null;
  if (!s || !s.engine) return <div className="p-8">No completed session here. <Link className="underline" href="/app">Back</Link></div>;
  const client = clientOf(s);
  const out = s.engine;
  const device = DEVICE_BY_ID[settings.device];
  const date = new Date(s.startedAt);
  const minutes = Math.max(15, Math.round(s.pointLogs.reduce((a, l) => a + (l.secondsToSettle ?? 25), 0) / 60) + 15);

  if (!settings.licensed)
    return (
      <div className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl">Session note</h1>
        <p className="text-ink-soft mt-2">Notes and superbills export for licensed users only. Mark your licence under <Link href="/app/device" className="underline">Your device</Link> if you bill for this service.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-3xl">Session note</h1>
        <button className="btn btn-ghost tap" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print or save PDF</button>
      </div>

      <article className="card p-8 text-sm leading-relaxed">
        <header className="grid grid-cols-2 gap-4 border-b border-line pb-4 mb-4">
          <div>
            <div className="font-semibold">{PRACTITIONER.clinic}</div>
            <div>{PRACTITIONER.name}, {PRACTITIONER.licence}</div>
          </div>
          <div className="text-right">
            <div>Date of service: {date.toLocaleDateString()}</div>
            <div>Client: {client.name} · {client.age} · {client.sex}</div>
            <div>Device: {device.name} {PRACTITIONER.device.split("·")[1]}</div>
          </div>
        </header>

        <h2 className="text-base font-semibold">Subjective</h2>
        <p>Client reports {client.mainConcern.toLowerCase()} ({s.intake.duration.toLowerCase()}). Today's priorities: {s.intake.priorities.join(", ")}. Self-rated before session: pain {s.intake.wellbeing.pain}/10, stress {s.intake.wellbeing.stress}/10, sleep {s.intake.wellbeing.sleep}/10, energy {s.intake.wellbeing.energy}/10. Previously tried: {s.intake.tried.toLowerCase()}.</p>

        <h2 className="text-base font-semibold mt-4">Objective</h2>
        <p>Radial pulse assessed at six positions: {Object.entries(s.pulse.ratings).map(([k, v]) => `${k.replace(".", " ")} ${v}/5`).join(", ")}. Five-element read: {ELEMENT_LABEL[out.balance.weakest]} deficient, {ELEMENT_LABEL[out.balance.strongest]} excess (gap {out.balance.gap}). Tongue: {Object.values(s.tongue).filter((v) => v && v !== "demo").join(", ") || "not recorded"}. Opening device reading {s.openingReading ?? "—"}; closing reading {s.closingReading ?? "—"}.</p>

        <h2 className="text-base font-semibold mt-4">Assessment</h2>
        <p>{out.protocol.internalTag}. {out.reasoning.slice(0, 3).join(" ")}</p>

        <h2 className="text-base font-semibold mt-4">Plan / procedure</h2>
        <p>Microcurrent stimulation ({device.name}) applied per {out.protocol.goal.toLowerCase()} protocol, {out.protocol.action === "tonify" ? "tonifying" : "sedating"} {ELEMENT_LABEL[out.protocol.focus]}. Settings: {out.protocol.deviceSettings.map((d) => `${d.frequency} ${d.waveform} (${d.mode})`).join("; ")}.</p>
        <table className="w-full mt-2 text-xs">
          <thead><tr className="text-left text-ink-soft"><th className="py-1">Point</th><th>Location</th><th>Planned</th><th>Settled</th></tr></thead>
          <tbody>
            {out.adjustedPoints.map((p) => {
              const log = s.pointLogs.find((l) => l.code === p.code);
              return (
                <tr key={p.code} className="border-t border-line"><td className="py-1 font-semibold">{p.code}</td><td>{p.location}</td><td>{p.seconds} s</td><td>{log?.secondsToSettle != null ? `${log.secondsToSettle} s` : log ? "logged" : "skipped"}</td></tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3">Self-rated after session: {s.wellbeingAfter ? `pain ${s.wellbeingAfter.pain}/10, stress ${s.wellbeingAfter.stress}/10, sleep ${s.wellbeingAfter.sleep}/10, energy ${s.wellbeingAfter.energy}/10` : "pending"}. Home advice: {out.protocol.homeAdvice.join("; ").toLowerCase()}. Follow-up within {out.protocol.nextVisitDays} days.</p>

        <h2 className="text-base font-semibold mt-4">Superbill (practitioner to confirm codes)</h2>
        <table className="w-full mt-1 text-xs">
          <thead><tr className="text-left text-ink-soft"><th className="py-1">Service category</th><th>Units</th><th>Time</th></tr></thead>
          <tbody>
            <tr className="border-t border-line"><td className="py-1">Electrical stimulation, attended (manual)</td><td>{Math.ceil(minutes / 15)}</td><td>{minutes} min</td></tr>
            <tr className="border-t border-line"><td className="py-1">Evaluation / re-evaluation</td><td>1</td><td>—</td></tr>
          </tbody>
        </table>
        <p className="text-xs text-ink-soft mt-3">Service categories listed as in Jan's training; the billing practitioner selects the actual CPT codes. Living Current does not choose codes or submit claims.</p>
      </article>
    </div>
  );
}
