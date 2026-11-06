"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ReportCard, type ReportData } from "@/components/ReportCard";
import { CLIENT_BY_ID } from "@/data/seed";
import { PROTOCOLS, PROTOCOL_BY_ID } from "@/data/protocols";
import { useSessions } from "@/lib/store";
import { ReadingsTracker } from "@/components/Tracker";
import { BookOpen } from "lucide-react";

const READING = [
  { t: "The Body Electric", a: "Robert O. Becker & Gary Selden", d: "Classic on bioelectricity and healing" },
  { t: "Between Heaven and Earth", a: "Harriet Beinfield & Efrem Korngold", d: "Five elements for a general reader" },
  { t: "The Web That Has No Weaver", a: "Ted Kaptchuk", d: "A clear, critical intro to Chinese medicine" },
  { t: "Bioelectric research", a: "Michael Levin, Tufts University", d: "Current science on voltage and healing" },
];

/**
 * The client's view of a report: a branded web page they can keep and share.
 * Resolves either a live session on this device or a seeded past session.
 */
export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const { getSession, hydrated } = useSessions();

  let r: ReportData | null = null;
  let clientId: string | null = null;

  const live = getSession(id);
  if (live && live.engine) {
    const c = CLIENT_BY_ID[live.clientId];
    const first = c.sessions[c.sessions.length - 1];
    clientId = c.id;
    r = {
      id,
      clientFirstName: c.name.split(" ")[0],
      date: live.startedAt,
      openingReading: live.openingReading ?? 68,
      closingReading: live.closingReading ?? 41,
      firstOpening: first?.openingReading ?? live.openingReading ?? 68,
      goal: live.engine.protocol.goal,
      focus: live.engine.protocol.focus,
      pointsWorked: live.pointLogs.length || live.engine.adjustedPoints.length,
      priorities: live.intake.priorities.map((p) => PROTOCOL_BY_ID[p]?.goal ?? p),
      tcmView: live.engine.protocol.tcmView,
      nextVisitDays: live.engine.protocol.nextVisitDays,
      homeAdvice: live.engine.protocol.homeAdvice,
      bookingUrl: `/book/${c.id}`,
    };
  } else {
    // seeded: "<clientId>-<sessionId>"
    const dash = id.lastIndexOf("-");
    const cId = id.slice(0, dash);
    const sId = id.slice(dash + 1);
    const c = CLIENT_BY_ID[cId];
    const s = c?.sessions.find((x) => x.id === sId);
    if (c && s) {
      const proto = PROTOCOLS.find((p) => p.goal === s.goal) ?? PROTOCOLS[0];
      const first = c.sessions[c.sessions.length - 1];
      clientId = c.id;
      r = {
        id,
        clientFirstName: c.name.split(" ")[0],
        date: s.date + "T14:30:00",
        openingReading: s.openingReading,
        closingReading: s.closingReading,
        firstOpening: first.openingReading,
        goal: s.goal,
        focus: s.focus,
        pointsWorked: s.points,
        priorities: [s.goal],
        tcmView: proto.tcmView,
        nextVisitDays: proto.nextVisitDays,
        homeAdvice: proto.homeAdvice,
        bookingUrl: `/book/${c.id}`,
      };
    }
  }

  if (!hydrated) return null;
  if (!r || !clientId) return <div className="p-8">Report not found. <Link href="/app" className="underline">Back</Link></div>;
  const client = CLIENT_BY_ID[clientId];

  return (
    <div className="min-h-dvh" style={{ background: "var(--ink)" }}>
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="text-bone/80 text-sm mb-4">Living Current · a session report</div>
        <ReportCard r={r} />

        {client.sessions.length > 1 && (
          <section className="card p-5 mt-5">
            <h3 className="text-lg">Your progress</h3>
            <p className="text-sm text-ink-soft mb-2">Start and end readings across your sessions. Lower is more settled.</p>
            <ReadingsTracker sessions={client.sessions} height={180} />
          </section>
        )}

        <section className="card p-5 mt-5">
          <h3 className="text-lg mb-1">Science corner</h3>
          <p className="text-sm">
            Your cells carry a small electrical charge, and bioelectric signals help guide how tissue heals. The reading on your report is a skin-surface measure that is reliable for tracking change in one person over time, which is why we always compare you with your own first sessions and never with a population norm. There is no accepted "healthy" number for this kind of reading, so we show the trend, not a target.
          </p>
          <h4 className="font-semibold mt-4 mb-2 inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Further reading</h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {READING.map((b) => (
              <li key={b.t} className="rounded-[var(--radius-s)] bg-bone p-3">
                <div className="font-semibold">{b.t}</div>
                <div className="text-ink-soft text-xs">{b.a}</div>
                <div className="text-xs mt-1">{b.d}</div>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-bone/60 text-xs mt-6">
          Shared by your practitioner. You can see, export or delete the data in your file at any time; ask at your next visit or reply to the report email.
        </p>
      </div>
    </div>
  );
}
