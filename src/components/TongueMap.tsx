"use client";

import type { TongueReading } from "@/engine/types";

const ROWS: { key: keyof TongueReading; label: string; options: { v: string; l: string }[] }[] = [
  { key: "colour", label: "Body colour", options: [{ v: "pale", l: "Pale" }, { v: "pink", l: "Pink" }, { v: "red", l: "Red" }, { v: "purple", l: "Purple" }] },
  { key: "coating", label: "Coating", options: [{ v: "none", l: "None" }, { v: "thin-white", l: "Thin white" }, { v: "thick-white", l: "Thick white" }, { v: "yellow", l: "Yellow" }] },
  { key: "shape", label: "Shape", options: [{ v: "swollen", l: "Swollen" }, { v: "thin", l: "Thin" }, { v: "teeth-marks", l: "Teeth marks" }, { v: "cracks", l: "Cracks" }] },
  { key: "moisture", label: "Moisture", options: [{ v: "dry", l: "Dry" }, { v: "normal", l: "Normal" }, { v: "wet", l: "Wet" }] },
  { key: "zone", label: "Where", options: [{ v: "tip", l: "Tip" }, { v: "sides", l: "Sides" }, { v: "centre", l: "Centre" }, { v: "root", l: "Root" }] },
];

const COLOUR: Record<string, string> = { pale: "#f2c9c2", pink: "#e8a39a", red: "#d4635a", purple: "#9b5b7a" };

export function TongueMap({ tongue, onChange }: { tongue: TongueReading; onChange: (t: TongueReading) => void }) {
  const body = COLOUR[tongue.colour ?? "pink"];
  const coat =
    tongue.coating === "thick-white" ? "rgba(255,255,255,0.75)" : tongue.coating === "thin-white" ? "rgba(255,255,255,0.4)" : tongue.coating === "yellow" ? "rgba(235,200,90,0.55)" : "transparent";
  const zoneY: Record<string, number> = { tip: 215, sides: 130, centre: 120, root: 50 };

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      <div className="card p-4 flex flex-col items-center">
        <svg viewBox="0 0 220 260" className="w-full max-w-[220px]" aria-hidden>
          <path d="M30 40 C30 10 190 10 190 40 L190 140 C190 200 150 250 110 252 C70 250 30 200 30 140 Z" fill={body} stroke="#b5574f" strokeWidth="2" />
          <path d="M30 40 C30 10 190 10 190 40 L190 140 C190 200 150 250 110 252 C70 250 30 200 30 140 Z" fill={coat} />
          {tongue.shape === "teeth-marks" && (
            <path d="M34 70 q6 6 0 12 q6 6 0 12 q6 6 0 12 q6 6 0 12 q6 6 0 12 M186 70 q-6 6 0 12 q-6 6 0 12 q-6 6 0 12 q-6 6 0 12 q-6 6 0 12" stroke="#b5574f" strokeWidth="2" fill="none" />
          )}
          {tongue.shape === "cracks" && <path d="M110 60 L108 110 L114 150 L110 200 M80 120 l-10 20 M140 120 l10 20" stroke="#8a3d37" strokeWidth="1.5" fill="none" />}
          <line x1="110" y1="30" x2="110" y2="248" stroke="#b5574f" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
          <g fontSize="11" fill="#5a2d2a" textAnchor="middle" fontWeight="600">
            <text x="110" y="52">Kidney</text>
            <text x="110" y="125">Spleen · Stomach</text>
            <text x="110" y="185">Lung</text>
            <text x="110" y="232">Heart</text>
            <text x="48" y="140" transform="rotate(-90 48 140)">Liver</text>
            <text x="172" y="140" transform="rotate(90 172 140)">Gallbladder</text>
          </g>
          {tongue.zone && (
            <ellipse cx={110} cy={zoneY[tongue.zone]} rx={tongue.zone === "sides" ? 85 : 40} ry={tongue.zone === "sides" ? 60 : 22} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeDasharray="6 4" />
          )}
        </svg>
        <p className="text-xs text-ink-soft text-center mt-2">Zones by organ, as commonly taught. Dr. Amina's map replaces this one.</p>
      </div>

      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.key} className="grid grid-cols-[110px_1fr] items-center gap-3">
            <span className="font-semibold">{row.label}</span>
            <div className="flex flex-wrap gap-2">
              {row.options.map((o) => {
                const on = tongue[row.key] === o.v;
                return (
                  <button
                    key={o.v}
                    onClick={() => onChange({ ...tongue, [row.key]: on ? undefined : o.v })}
                    aria-pressed={on}
                    className={`tap px-4 rounded-full border text-sm font-medium transition ${on ? "bg-ink text-bone border-ink" : "bg-paper border-line hover:bg-bone"}`}
                  >
                    {o.l}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
