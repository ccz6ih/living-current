"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * The settle ring: a circular timer that fills over the point's duration.
 * Driven by GSAP so it can be paused, resumed and restarted without drift.
 */
export function SettleRing({
  seconds,
  running,
  onTick,
  onDone,
  resetKey,
  color = "var(--earth)",
}: {
  seconds: number;
  running: boolean;
  onTick?: (elapsed: number) => void;
  onDone?: () => void;
  resetKey: string;
  color?: string;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const R = 88;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    tweenRef.current?.kill();
    const state = { t: 0 };
    gsap.set(el, { strokeDasharray: C, strokeDashoffset: C });
    setElapsed(0);
    const tween = gsap.to(state, {
      t: seconds,
      duration: seconds,
      ease: "none",
      paused: true,
      onUpdate: () => {
        const e = state.t;
        setElapsed(e);
        onTick?.(e);
        gsap.set(el, { strokeDashoffset: C - (e / seconds) * C });
      },
      onComplete: () => onDone?.(),
    });
    tweenRef.current = tween;
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, seconds]);

  useEffect(() => {
    const t = tweenRef.current;
    if (!t) return;
    if (running) t.play();
    else t.pause();
  }, [running, resetKey]);

  const remaining = Math.max(0, Math.ceil(seconds - elapsed));

  return (
    <div className="relative w-[220px] h-[220px]">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={R} stroke="var(--bone-2)" strokeWidth="14" fill="none" />
        <circle ref={circleRef} cx="100" cy="100" r={R} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="display text-6xl tabular-nums leading-none">{remaining}<span className="text-2xl ml-1">s</span></div>
        <div className="text-sm text-ink-soft mt-2">of {seconds} s</div>
      </div>
    </div>
  );
}
