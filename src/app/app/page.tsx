"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLIENTS } from "@/data/seed";
import { chrono } from "@/engine/chrono";
import { ELEMENT_LABEL } from "@/engine/types";
import { livingCurrentIndex } from "@/engine";
import { useSessions } from "@/lib/store";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

export default function TodayPage() {
  const { startSession, sessions, hydrated } = useSessions();
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const time = now ? chrono(now) : null;

  const inProgress = Object.values(sessions).filter((s) => s.step !== "report" || !s.reportSentAt);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl">Today</h1>
          <p className="text-ink-soft mt-1">
            {now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {time && (
              <>
                {" · "}
                {time.peakOrgan} peaks this hour ({ELEMENT_LABEL[time.peakElement]}) · {time.stem}-{time.branch} day
              </>
            )}
          </p>
        </div>
        {hydrated && inProgress.length > 0 && (
          <Link href={`/app/session/${inProgress[inProgress.length - 1].id}/${inProgress[inProgress.length - 1].step}`} className="btn btn-earth">
            Resume session <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <ul className="grid md:grid-cols-2 gap-4">
        {CLIENTS.map((c) => {
          const last = c.sessions[0];
          const idx = last ? livingCurrentIndex(last, c.sessions[c.sessions.length - 1]) : null;
          return (
            <li key={c.id} className="card p-5 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-bone-2 flex items-center justify-center display text-xl shrink-0">{c.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <Link href={`/app/clients/${c.id}`} className="text-xl font-semibold hover:underline">{c.name}</Link>
                  <span className="text-sm text-ink-soft">{c.age}{c.species !== "human" ? ` · ${c.species}` : ""}</span>
                </div>
                <div className="text-sm text-ink-soft">{c.mainConcern}</div>
                <div className="text-sm mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>{c.nextVisit}</strong></span>
                  {last && (
                    <span className="text-ink-soft">
                      Last: {last.openingReading} → {last.closingReading}, {last.goal.toLowerCase()}
                    </span>
                  )}
                  {idx && (
                    <span className="text-ink-soft">
                      Index <strong className="text-ink">{idx.total}</strong> {idx.band}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="btn btn-primary tap"
                    onClick={() => {
                      const s = startSession(c);
                      router.push(`/app/session/${s.id}/intake`);
                    }}
                  >
                    <Play className="w-4 h-4" /> Start session
                  </button>
                  <Link href={`/app/clients/${c.id}`} className="btn btn-ghost tap">Open file</Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
