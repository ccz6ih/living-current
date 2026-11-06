"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CLIENT_BY_ID } from "@/data/seed";
import { livingCurrentIndex } from "@/engine";
import { ELEMENT_LABEL } from "@/engine/types";
import { IndexBars, IndexDial } from "@/components/IndexDial";
import { ReadingsTracker, WellbeingTracker, fmtDate } from "@/components/Tracker";
import { ElementBars } from "@/components/ElementBars";
import { useSessions } from "@/lib/store";
import { Play } from "lucide-react";

export default function ClientFilePage() {
  const { id } = useParams<{ id: string }>();
  const client = CLIENT_BY_ID[id];
  const { startSession } = useSessions();
  const router = useRouter();

  if (!client) return <div className="p-8">No client with that id.</div>;

  const latest = client.sessions[0];
  const first = client.sessions[client.sessions.length - 1] ?? null;
  const index = latest ? livingCurrentIndex(latest, first) : null;

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl">{client.name}</h1>
          <p className="text-ink-soft mt-1">
            {client.age} · client since {client.since} · consent on file ({client.consentOn}) · next visit {client.nextVisit}
          </p>
          <p className="mt-1">Main concern: <strong>{client.mainConcern}</strong></p>
        </div>
        <button
          className="btn btn-primary tap"
          onClick={() => {
            const s = startSession(client);
            router.push(`/app/session/${s.id}/intake`);
          }}
        >
          <Play className="w-4 h-4" /> Start session
        </button>
      </div>

      {index && latest ? (
        <div className="grid lg:grid-cols-[320px_1fr] gap-5 mb-6">
          <section className="card p-5 flex flex-col items-center">
            <h2 className="text-lg self-start">Living Current Index</h2>
            <IndexDial index={index} />
            <div className="w-full mt-2">
              <IndexBars index={index} />
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-lg">Readings across {client.sessions.length} sessions</h2>
            <p className="text-sm text-ink-soft mb-2">Opening and closing readings. Lower is more settled.</p>
            <ReadingsTracker sessions={client.sessions} />
            <div className="grid md:grid-cols-2 gap-5 mt-4">
              <div>
                <h3 className="text-base mb-1">Last session, how she felt</h3>
                <p className="text-xs text-ink-soft mb-1">Lower is better for pain and stress; higher for sleep and energy.</p>
                <WellbeingTracker session={latest} height={170} />
              </div>
              {latest.balance && (
                <div>
                  <h3 className="text-base mb-1">Five-element balance, last pulse</h3>
                  <p className="text-xs text-ink-soft mb-3">
                    {ELEMENT_LABEL[latest.balance.weakest]} low, {ELEMENT_LABEL[latest.balance.strongest]} strong.
                  </p>
                  <ElementBars balance={latest.balance} />
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="card p-6 mb-6">
          <h2 className="text-lg">No sessions yet</h2>
          <p className="text-ink-soft">Start the first session to begin this file. The index appears after the first closing reading.</p>
        </div>
      )}

      <section className="card p-5">
        <h2 className="text-lg mb-3">Sessions</h2>
        <ul className="divide-y divide-line">
          {client.sessions.map((s) => (
            <li key={s.id} className="py-3 grid grid-cols-[80px_1fr_120px_80px] items-center gap-4 text-sm">
              <span className="font-semibold">{fmtDate(s.date)}</span>
              <span>
                {s.goal} · {ELEMENT_LABEL[s.focus]} focus · {s.points} points
              </span>
              <span className="tabular-nums" style={{ color: "#2d7a5f" }}>
                <strong>{s.openingReading} → {s.closingReading}</strong>
              </span>
              <Link href={`/r/${client.id}-${s.id}`} className="text-ink underline underline-offset-4">Report</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
