"use client";

import { useRouter } from "next/navigation";
import { STEPS, useSessions, type LiveSession, type Step } from "@/lib/store";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Common frame for a session step: title, body, and the next/back controls. */
export function StepShell({
  session,
  step,
  title,
  lede,
  children,
  nextLabel = "Next",
  canNext = true,
  onNext,
  wide = false,
}: {
  session: LiveSession;
  step: Step;
  title: string;
  lede?: string;
  children: React.ReactNode;
  nextLabel?: string;
  canNext?: boolean;
  onNext?: () => void;
  wide?: boolean;
}) {
  const router = useRouter();
  const { update } = useSessions();
  const i = STEPS.findIndex((s) => s.id === step);
  const prev = STEPS[i - 1];
  const next = STEPS[i + 1];

  const goNext = () => {
    onNext?.();
    if (next) {
      const reached = STEPS.findIndex((s) => s.id === session.step);
      if (i + 1 > reached) update(session.id, { step: next.id });
      router.push(`/app/session/${session.id}/${next.id}`);
    }
  };

  return (
    <div className={`${wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-5 py-7 pb-28`}>
      <div className="mb-6">
        <div className="text-sm text-ink-soft">Step {i + 1} of {STEPS.length}</div>
        <h1 className="text-4xl mt-1">{title}</h1>
        {lede && <p className="text-ink-soft mt-2 max-w-2xl">{lede}</p>}
      </div>
      {children}
      <div className="fixed bottom-0 inset-x-0 lg:left-[240px] bg-paper/90 backdrop-blur border-t border-line px-5 py-3 flex items-center gap-3 z-10">
        {prev ? (
          <button className="btn btn-ghost tap" onClick={() => router.push(`/app/session/${session.id}/${prev.id}`)}>
            <ArrowLeft className="w-4 h-4" /> {prev.label}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button className="btn btn-primary tap ml-auto disabled:opacity-40" disabled={!canNext} onClick={goNext}>
            {nextLabel} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
