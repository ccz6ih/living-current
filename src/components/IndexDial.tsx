"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { IndexBreakdown } from "@/engine";

/**
 * The Living Current Index, drawn as an arc from 0 to 100.
 * 50 is the client's own starting point; the bands are flowing / settling / needs care.
 */
export function IndexDial({ index, size = 260, animate = true }: { index: IndexBreakdown; size?: number; animate?: boolean }) {
  const arcRef = useRef<SVGPathElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const R = 90;
  const start = -210;
  const sweep = 240;
  const len = (sweep / 360) * 2 * Math.PI * R;

  useEffect(() => {
    const arc = arcRef.current;
    const num = numRef.current;
    if (!arc || !num) return;
    const target = len - (index.total / 100) * len;
    if (!animate) {
      gsap.set(arc, { strokeDashoffset: target });
      num.textContent = String(index.total);
      return;
    }
    gsap.set(arc, { strokeDashoffset: len });
    const o = { v: 0 };
    gsap.to(arc, { strokeDashoffset: target, duration: 1.4, ease: "power3.out", delay: 0.2 });
    gsap.to(o, { v: index.total, duration: 1.4, ease: "power3.out", delay: 0.2, onUpdate: () => (num.textContent = String(Math.round(o.v))) });
  }, [index.total, len, animate]);

  const color = index.band === "flowing" ? "#2d7a5f" : index.band === "settling" ? "var(--earth)" : "var(--fire)";
  const d = describeArc(100, 110, R, start, start + sweep);

  return (
    <div className="relative" style={{ width: size, height: size * 0.85 }}>
      <svg viewBox="0 0 200 180" className="w-full h-full">
        <path d={d} stroke="var(--bone-2)" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path ref={arcRef} d={d} stroke={color} strokeWidth="16" fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len} />
        {/* band ticks at 50 and 70 */}
        {[50, 70].map((v) => {
          const a = ((start + (v / 100) * sweep) * Math.PI) / 180;
          const x1 = 100 + (R - 14) * Math.cos(a), y1 = 110 + (R - 14) * Math.sin(a);
          const x2 = 100 + (R + 14) * Math.cos(a), y2 = 110 + (R + 14) * Math.sin(a);
          return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--paper)" strokeWidth="3" />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span ref={numRef} className="display text-7xl leading-none tabular-nums">0</span>
        <span className="font-semibold mt-1" style={{ color }}>{index.band}</span>
        <span className="text-sm text-ink-soft mt-1">
          {index.deltaSinceFirst >= 0 ? "up" : "down"} {Math.abs(index.deltaSinceFirst)} since first visit
        </span>
      </div>
    </div>
  );
}

function describeArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function IndexBars({ index }: { index: IndexBreakdown }) {
  const rows = [
    { l: "Settle score", v: index.settle, d: "How far the reading settled this session" },
    { l: "Point settle time", v: index.pointSettle, d: "Seconds each point took to steady" },
    { l: "Five-element balance", v: index.balance, d: "Pulse ratings, left vs right, across elements" },
    { l: "Wellbeing", v: index.wellbeing, d: "Client's 0–10 ratings before, after, 24 h, 48 h" },
  ];
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <li key={r.l}>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">{r.l}</span>
            <span className="tabular-nums">{r.v}</span>
          </div>
          <div className="h-2 rounded-full bg-bone-2 mt-1 overflow-hidden">
            <div className="h-full rounded-full bg-ink" style={{ width: `${r.v}%` }} />
          </div>
          <div className="text-xs text-ink-soft mt-1">{r.d}</div>
        </li>
      ))}
    </ul>
  );
}
