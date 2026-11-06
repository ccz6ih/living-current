"use client";

import { PULSE_MAP, type PulseReading, type Side } from "@/engine/types";
import { posKey } from "@/engine/pulse";

const POS_LABEL = { cun: "Cun", guan: "Guan", chi: "Chi" } as const;

/**
 * One wrist, palm up, with the three finger positions on the radial artery.
 * Tap a position to select it; the rating control lives beside the map.
 */
export function WristMap({
  side,
  pulse,
  selected,
  onSelect,
}: {
  side: Side;
  pulse: PulseReading;
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  const positions = PULSE_MAP.filter((p) => p.side === side);
  const flip = side === "right";

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl">{side === "left" ? "Left wrist" : "Right wrist"}</h3>
        <span className="text-sm text-ink-soft">palm up</span>
      </div>
      <div className="flex gap-4">
        <svg viewBox="0 0 160 260" className="w-32 shrink-0" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined }}>
          <defs>
            <linearGradient id={`skin-${side}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#efd3bd" />
              <stop offset="1" stopColor="#e3b99a" />
            </linearGradient>
          </defs>
          {/* forearm */}
          <path d="M50 258 C48 200 46 170 52 140 L108 140 C114 170 112 200 110 258 Z" fill={`url(#skin-${side})`} />
          {/* palm */}
          <path d="M44 140 C40 110 44 78 58 60 L104 60 C118 78 122 110 116 140 Z" fill={`url(#skin-${side})`} />
          {/* fingers */}
          {[62, 76, 90, 104].map((x, i) => (
            <rect key={x} x={x - 6} y={i === 0 || i === 3 ? 22 : 8} width="12" height="52" rx="6" fill={`url(#skin-${side})`} />
          ))}
          {/* thumb */}
          <path d="M44 120 C26 110 22 90 34 78 C40 72 48 76 50 86 L54 120 Z" fill={`url(#skin-${side})`} />
          {/* radial artery */}
          <path d="M66 258 L66 150" stroke="var(--fire)" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.8" />
          {/* finger positions */}
          {positions.map((p, i) => {
            const key = posKey(p.side, p.position);
            const y = 160 + i * 30;
            const isSel = selected === key;
            const r = pulse.ratings[key];
            return (
              <g key={key} onClick={() => onSelect(key)} style={{ cursor: "pointer" }}>
                <circle cx="66" cy={y} r={isSel ? 14 : 11} fill={`var(--${p.element})`} stroke={isSel ? "var(--ink)" : "white"} strokeWidth={isSel ? 3 : 2} />
                <text x="66" y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" style={{ transform: flip ? "scaleX(-1)" : undefined, transformOrigin: "66px center" }}>
                  {r ?? i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        <ul className="flex-1 flex flex-col gap-2">
          {positions.map((p, i) => {
            const key = posKey(p.side, p.position);
            const isSel = selected === key;
            const r = pulse.ratings[key];
            return (
              <li key={key}>
                <button
                  onClick={() => onSelect(key)}
                  className={`tap w-full text-left rounded-[var(--radius-s)] px-3 py-2 border transition ${
                    isSel ? "border-ink bg-bone" : "border-line hover:bg-bone"
                  }`}
                  aria-pressed={isSel}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold text-white" style={{ background: `var(--${p.element})` }}>
                      {i + 1}
                    </span>
                    <span className="font-semibold">{POS_LABEL[p.position]}</span>
                    <span className="ml-auto flex gap-1" aria-label={r ? `rated ${r} of 5` : "not rated"}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="w-2.5 h-2.5 rounded-full" style={{ background: r && n <= r ? `var(--${p.element})` : "transparent", border: `1.5px solid var(--${p.element})` }} />
                      ))}
                    </span>
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5 pl-8">{p.organs}</div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
