"use client";

import { TongueMap } from "@/components/TongueMap";
import { readBalance } from "@/engine/pulse";
import { readTongue } from "@/engine/tongue";
import { ELEMENT_LABEL } from "@/engine/types";
import { useSessions, type LiveSession } from "@/lib/store";
import { StepShell } from "./StepShell";
import { Camera } from "lucide-react";

export function TongueStep({ session }: { session: LiveSession }) {
  const { update } = useSessions();
  const verdict = readTongue(session.tongue);
  const balance = readBalance(session.pulse);
  const agrees = verdict.agreesWith(balance.weakest);
  const tapped = Object.values(session.tongue).filter(Boolean).length;

  return (
    <StepShell
      session={session}
      step="tongue"
      title="A second reading: the tongue"
      lede="With the client in the room, tap what you see. The tongue confirms or questions the pulse; it never overrides it."
      nextLabel="Take the opening reading"
      wide
    >
      <TongueMap tongue={session.tongue} onChange={(t) => update(session.id, { tongue: t })} />

      <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6">
        <div
          className="rounded-[var(--radius-m)] p-5"
          style={{ background: agrees === "confirms" ? "var(--wood-soft)" : agrees === "questions" ? "var(--earth-soft)" : "var(--bone-2)" }}
        >
          <div className="font-semibold mb-1">
            {tapped === 0
              ? "Tap what the tongue shows"
              : agrees === "confirms"
                ? `Tongue agrees with the pulse: ${ELEMENT_LABEL[balance.weakest]} is the one to support`
                : agrees === "questions"
                  ? `Tongue points to ${verdict.suggests ? ELEMENT_LABEL[verdict.suggests] : "something else"}; the pulse reads ${ELEMENT_LABEL[balance.weakest]} low`
                  : "No strong pattern on the tongue"}
          </div>
          <div className="text-sm">{verdict.pattern}.</div>
        </div>
        <button className="btn btn-ghost tap self-start" onClick={() => update(session.id, { tongue: { ...session.tongue, photoUrl: "demo" } })}>
          <Camera className="w-4 h-4" /> {session.tongue.photoUrl ? "Photo saved to file" : "Add a photo"}
        </button>
      </div>
    </StepShell>
  );
}
