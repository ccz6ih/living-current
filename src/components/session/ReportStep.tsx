"use client";

import { useState } from "react";
import Link from "next/link";
import { ReportCard, type ReportData } from "@/components/ReportCard";
import { IndexBars, IndexDial } from "@/components/IndexDial";
import { livingCurrentIndex } from "@/engine";
import { PROTOCOL_BY_ID } from "@/data/protocols";
import { HOME_PLANS } from "@/data/devices";
import { clientOf, useSessions, type LiveSession } from "@/lib/store";
import { StepShell } from "./StepShell";
import { Check, Mail, MessageSquare } from "lucide-react";

export function ReportStep({ session }: { session: LiveSession }) {
  const { update, settings } = useSessions();
  const client = clientOf(session);
  const out = session.engine;
  const [sending, setSending] = useState(false);
  if (!out) return <div className="p-8">No protocol on this session.</div>;

  const opening = session.openingReading ?? 68;
  const closing = session.closingReading ?? 41;
  const first = client.sessions[client.sessions.length - 1] ?? null;
  const index = livingCurrentIndex(
    {
      openingReading: opening,
      closingReading: closing,
      pointLogs: session.pointLogs,
      balance: out.balance,
      wellbeingBefore: session.intake.wellbeing,
      wellbeingAfter: session.wellbeingAfter ?? session.intake.wellbeing,
    },
    first,
  );

  const report: ReportData = {
    id: session.id,
    clientFirstName: client.name.split(" ")[0],
    date: session.startedAt,
    openingReading: opening,
    closingReading: closing,
    firstOpening: first?.openingReading ?? opening,
    goal: out.protocol.goal,
    focus: out.protocol.focus,
    pointsWorked: session.pointLogs.length || out.adjustedPoints.length,
    priorities: session.intake.priorities.map((p) => PROTOCOL_BY_ID[p]?.goal ?? p),
    tcmView: out.protocol.tcmView,
    nextVisitDays: out.protocol.nextVisitDays,
    homeAdvice: out.protocol.homeAdvice,
    bookingUrl: typeof window !== "undefined" ? `${window.location.origin}/book/${client.id}` : "/book",
    homePlan: client.homeDevice ? HOME_PLANS[out.protocol.focus] : undefined,
  };

  const send = () => {
    setSending(true);
    setTimeout(() => {
      update(session.id, { reportSentAt: new Date().toISOString() });
      setSending(false);
    }, 900);
  };

  return (
    <StepShell session={session} step="report" title="A report people want to keep" lede="Emailed in one tap as a branded web page plus a PDF, with the booking QR. Check-in links go out automatically at 24 h and 48 h." wide>
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div>
          <ReportCard r={report} />
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={send} disabled={!!session.reportSentAt || sending} className={`btn tap ${session.reportSentAt ? "btn-ghost" : "btn-primary"}`}>
              {session.reportSentAt ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              {session.reportSentAt ? `Sent to ${client.email}` : sending ? "Sending…" : "Email the report"}
            </button>
            <Link href={`/r/${session.id}`} className="btn btn-ghost tap">Open the client's view</Link>
            <Link href={`/checkin/${session.id}-24`} className="btn btn-ghost tap"><MessageSquare className="w-4 h-4" /> Preview the 24 h check-in</Link>
            {settings.licensed && <Link href={`/app/session/${session.id}/note`} className="btn btn-ghost tap">Session note and superbill</Link>}
          </div>
          {session.reportSentAt && (
            <p className="text-sm text-ink-soft mt-3">
              Report sent. Text check-ins scheduled for {client.phone} at 24 h and 48 h. <Link href="/app" className="underline">Back to today</Link>.
            </p>
          )}
        </div>
        <aside className="card p-5 flex flex-col items-center">
          <h2 className="text-lg self-start">Living Current Index, this session</h2>
          <IndexDial index={index} size={240} />
          <div className="w-full mt-2">
            <IndexBars index={index} />
          </div>
          <p className="text-xs text-ink-soft mt-4">Against {client.name.split(" ")[0]}'s own first sessions, never a population norm. Wellbeing updates when the 24 h and 48 h check-ins come back.</p>
        </aside>
      </div>
    </StepShell>
  );
}
