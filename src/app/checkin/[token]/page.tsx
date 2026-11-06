"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { Wellbeing } from "@/engine/types";
import { Camera, Check } from "lucide-react";

const SLIDERS: { k: keyof Wellbeing; l: string; lo: string; hi: string }[] = [
  { k: "pain", l: "Pain", lo: "none", hi: "worst" },
  { k: "stress", l: "Stress", lo: "none", hi: "worst" },
  { k: "sleep", l: "Sleep quality", lo: "terrible", hi: "great" },
  { k: "energy", l: "Energy", lo: "empty", hi: "full" },
];

/**
 * The 24 h / 48 h check-in the client gets by text. Four taps, no app to install.
 * Answers land in the client file and feed the Living Current Index.
 */
export default function CheckinPage() {
  const { token } = useParams<{ token: string }>();
  const hours = token.endsWith("-48") ? 48 : 24;
  const [w, setW] = useState<Wellbeing>({ pain: 3, stress: 4, sleep: 6, energy: 6 });
  const [photo, setPhoto] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-dvh flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        {sent ? (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: "var(--wood-soft)", color: "var(--wood)" }}>
              <Check className="w-7 h-7" />
            </div>
            <h1 className="text-3xl mt-4">Thank you</h1>
            <p className="text-ink-soft mt-2">Your {hours}-hour check-in is in your file. {hours === 24 ? "One more tomorrow." : "See you at your next visit."}</p>
          </div>
        ) : (
          <div className="card p-6">
            <div className="text-sm text-ink-soft">{hours} hours after your session</div>
            <h1 className="text-3xl mt-1">How are you feeling?</h1>
            <p className="text-ink-soft text-sm mt-1 mb-6">Four quick sliders. Takes less than a minute.</p>
            <div className="flex flex-col gap-5">
              {SLIDERS.map((s) => (
                <label key={s.k} className="block">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{s.l}</span>
                    <span className="display text-2xl tabular-nums leading-none">{w[s.k]}</span>
                  </div>
                  <input type="range" min={0} max={10} value={w[s.k]} onChange={(e) => setW({ ...w, [s.k]: Number(e.target.value) })} />
                  <div className="flex justify-between text-xs text-ink-soft mt-1">
                    <span>{s.lo}</span>
                    <span>{s.hi}</span>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={() => setPhoto(true)} className="btn btn-ghost tap w-full mt-6">
              <Camera className="w-4 h-4" /> {photo ? "Photo added" : "Add a photo (optional)"}
            </button>
            <button onClick={() => setSent(true)} className="btn btn-primary tap w-full mt-3">Send</button>
            <p className="text-xs text-ink-soft mt-4 text-center">Only your practitioner sees this. Reply STOP to the text to opt out.</p>
          </div>
        )}
      </div>
    </div>
  );
}
