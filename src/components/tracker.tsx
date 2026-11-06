"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SessionRecord } from "@/lib/demo-data";

export function Tracker({ sessions }: { sessions: SessionRecord[] }) {
  const data = sessions.map((session) => ({
    date: session.date,
    wellbeing: session.score,
    balance: Math.max(0, session.score - 7),
  }));
  if (data.length === 0) {
    data.push({ date: "New", wellbeing: 0, balance: 0 });
  }

  return (
    <>
      <div className="chart-wrap" role="img" aria-label="Client wellbeing and balance trend chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, bottom: 3, left: -20 }}>
            <CartesianGrid stroke="#edf0eb" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#98a39a", fontSize: 10 }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#a2aaa3", fontSize: 9 }} />
            <Tooltip
              contentStyle={{ border: "1px solid #e8ece6", borderRadius: 8, fontSize: 10 }}
              labelStyle={{ color: "#627268", marginBottom: 4 }}
            />
            <Line type="monotone" dataKey="wellbeing" name="Wellbeing" stroke="#71947a" strokeWidth={2.5} dot={{ r: 4, fill: "#71947a", strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="balance" name="Balance" stroke="#d0b77e" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: "#d0b77e", strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="metric-row"><span><i className="metric-dot" />Wellbeing</span><span><i className="metric-dot gold" />Balance</span></div>
    </>
  );
}
