import { PROTOCOLS } from "@/data/protocols";
import { ELEMENT_LABEL } from "@/engine/types";
import { Lock } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-4xl">Protocol library</h1>
      <p className="text-ink-soft mt-1 max-w-2xl">
        Organised by goal. Clients and marketing see goals; condition tags stay inside the library, visible only to licensed users. Nothing enters without Dr. Amina's approval, and the full library is never downloadable: the app shows one step at a time for one session.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {PROTOCOLS.map((p) => (
          <article key={p.id} className="card p-5" style={{ borderTop: `5px solid var(--${p.focus})` }}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-2xl">{p.goal}</h2>
              <span className="text-xs text-ink-soft">{p.action === "tonify" ? "Support" : "Ease"} {ELEMENT_LABEL[p.focus]}</span>
            </div>
            <div className="text-xs text-ink-soft inline-flex items-center gap-1 mt-1"><Lock className="w-3 h-3" /> {p.internalTag}</div>
            <ul className="mt-3 text-sm flex flex-col gap-1">
              {p.points.map((pt) => (
                <li key={pt.code} className="flex gap-2">
                  <span className="font-semibold w-16 shrink-0">{pt.code}</span>
                  <span className="text-ink-soft">{pt.name} · {pt.seconds} s · {pt.mode.replace("-", " ")}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-ink-soft">
              {p.deviceSettings.map((d) => `${d.frequency} ${d.waveform} (${d.mode.replace("-", " ")})`).join(" · ")} · next visit in {p.nextVisitDays} days
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs text-ink-soft mt-6">Point prescriptions are classical placeholders to confirm with Dr. Amina. Editing lives in the admin area for her alone.</p>
    </div>
  );
}
