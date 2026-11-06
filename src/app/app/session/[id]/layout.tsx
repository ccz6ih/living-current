"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { STEPS, clientOf, useSessions, type Step } from "@/lib/store";
import { Check } from "lucide-react";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const path = usePathname();
  const { getSession, hydrated } = useSessions();
  const session = getSession(id);
  const current = (path.split("/").pop() ?? "intake") as Step;
  const curIdx = STEPS.findIndex((s) => s.id === current);
  const reachedIdx = session ? STEPS.findIndex((s) => s.id === session.step) : 0;

  if (!hydrated) return <div className="p-8 text-ink-soft">Loading…</div>;
  if (!session)
    return (
      <div className="p-8">
        <p>This session isn't on this device.</p>
        <Link className="underline" href="/app">Back to today</Link>
      </div>
    );
  const client = clientOf(session);

  return (
    <div className="grid lg:grid-cols-[240px_1fr] min-h-[calc(100dvh-4rem)]">
      <aside className="border-r border-line bg-paper/60 px-4 py-5 hidden lg:block">
        <div className="mb-5">
          <div className="text-xs text-ink-soft">Session with</div>
          <div className="text-lg font-semibold">{client.name}</div>
          <div className="text-xs text-ink-soft">{client.mainConcern}</div>
        </div>
        <ol className="flex flex-col gap-1">
          {STEPS.map((s, i) => {
            const done = i < reachedIdx;
            const active = i === curIdx;
            const reachable = i <= reachedIdx;
            return (
              <li key={s.id}>
                <Link
                  href={reachable ? `/app/session/${id}/${s.id}` : "#"}
                  aria-current={active ? "step" : undefined}
                  className={`flex items-center gap-3 rounded-[var(--radius-s)] px-2 py-2 ${active ? "bg-ink text-bone" : reachable ? "hover:bg-bone" : "opacity-40 pointer-events-none"}`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-bone text-ink" : done ? "bg-ink text-bone" : "border border-line"}`}>
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold leading-tight">{s.label}</span>
                    <span className={`block text-xs ${active ? "text-bone/70" : "text-ink-soft"}`}>{s.short}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </aside>
      <div className="min-w-0">
        <div className="lg:hidden flex gap-1 px-4 pt-4">
          {STEPS.map((s, i) => (
            <span key={s.id} className={`h-1.5 flex-1 rounded-full ${i <= curIdx ? "bg-ink" : "bg-bone-2"}`} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
