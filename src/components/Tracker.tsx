"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SessionSummary } from "@/engine/types";

/** Opening and closing readings across sessions, oldest first. */
export function ReadingsTracker({ sessions, height = 220 }: { sessions: SessionSummary[]; height?: number }) {
  const data = [...sessions].reverse().map((s, i) => ({
    n: i + 1,
    date: fmtDate(s.date),
    start: s.openingReading,
    end: s.closingReading,
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="var(--bone-2)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--line)", fontSize: 13 }} />
        <Line type="monotone" dataKey="start" name="Start" stroke="var(--metal)" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
        <Line type="monotone" dataKey="end" name="End" stroke="#2d7a5f" strokeWidth={3} dot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** One client's four wellbeing sliders across before / after / 24 h / 48 h. */
export function WellbeingTracker({ session, height = 200 }: { session: SessionSummary; height?: number }) {
  const pts = [
    { t: "Before", ...session.wellbeingBefore },
    { t: "After", ...session.wellbeingAfter },
    session.checkin24 && { t: "24 h", ...session.checkin24 },
    session.checkin48 && { t: "48 h", ...session.checkin48 },
  ].filter(Boolean) as { t: string; pain: number; stress: number; sleep: number; energy: number }[];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={pts} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="var(--bone-2)" vertical={false} />
        <XAxis dataKey="t" tick={{ fontSize: 12, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--line)", fontSize: 13 }} />
        <Line type="monotone" dataKey="pain" name="Pain" stroke="var(--fire)" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
        <Line type="monotone" dataKey="stress" name="Stress" stroke="var(--wood)" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
        <Line type="monotone" dataKey="sleep" name="Sleep" stroke="var(--water)" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
        <Line type="monotone" dataKey="energy" name="Energy" stroke="var(--earth)" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function fmtDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
