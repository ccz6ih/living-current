"use client";

import { QRCodeSVG } from "qrcode.react";
import { PRACTITIONER } from "@/data/seed";
import { chrono } from "@/engine/chrono";
import { ELEMENT_LABEL, type Element } from "@/engine/types";

export interface ReportData {
  id: string;
  clientFirstName: string;
  date: string;
  openingReading: number;
  closingReading: number;
  firstOpening: number;
  goal: string;
  focus: Element;
  pointsWorked: number;
  priorities: string[];
  tcmView: string;
  nextVisitDays: number;
  homeAdvice: string[];
  bookingUrl: string;
  homePlan?: { title: string; days: string; steps: string[] };
}

/**
 * A report people want to keep and share. Plain-language summary first,
 * then a short Chinese medicine view, next visit, and the booking QR.
 * Wellness language only; nothing here diagnoses.
 */
export function ReportCard({ r, compact = false }: { r: ReportData; compact?: boolean }) {
  const drop = Math.round(((r.openingReading - r.closingReading) / r.openingReading) * 100);
  const sinceFirst = Math.round(((r.firstOpening - r.closingReading) / r.firstOpening) * 100);
  const time = chrono(new Date(r.date));
  const season = seasonOf(new Date(r.date));

  return (
    <article className="card overflow-hidden">
      <header className="px-6 pt-6 pb-4 flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="text-2xl">Your session · {r.clientFirstName} · {fmtLong(r.date)}</h2>
        <div className="text-xs text-ink-soft text-right">
          <div className="font-semibold text-ink">{PRACTITIONER.clinic}</div>
          <div>{PRACTITIONER.name} · {PRACTITIONER.credential}</div>
        </div>
      </header>

      <div className="px-6 grid sm:grid-cols-[auto_auto_1fr] gap-4 items-center">
        <Reading n={r.openingReading} label="Start reading" />
        <Reading n={r.closingReading} label="End reading" accent />
        <p className="font-semibold" style={{ color: "#2d7a5f" }}>
          Down {drop}% this session{sinceFirst > 0 ? `; down ${sinceFirst}% since your first visit.` : "."}
        </p>
      </div>

      <div className="px-6 pt-5">
        <p>
          <strong>Today:</strong> you asked to focus on {r.priorities.map((p) => p.toLowerCase()).join(" and ")}, so we worked {r.pointsWorked} points. Expect {expectation(r.focus)} over the next few days.
        </p>
      </div>

      <div className="mx-6 my-5 rounded-[var(--radius-m)] p-5" style={{ background: `var(--${r.focus}-soft)` }}>
        <div className="font-semibold mb-1" style={{ color: `var(--${r.focus})` }}>The Chinese medicine view</div>
        <p className="italic">{r.tcmView}</p>
      </div>

      {r.homePlan && (
        <div className="mx-6 mb-4 rounded-[var(--radius-m)] border border-line p-4 text-sm">
          <div className="font-semibold">At home with your Neuroscope: {r.homePlan.title}</div>
          <div className="text-ink-soft text-xs mb-2">{r.homePlan.days}</div>
          <ol className="list-decimal pl-5 flex flex-col gap-0.5">{r.homePlan.steps.map((st) => <li key={st}>{st}</li>)}</ol>
        </div>
      )}

      {!compact && (
        <div className="px-6 pb-2 text-sm text-ink-soft">
          Your rhythm: this was {r.focus === "earth" ? "an" : "a"} {ELEMENT_LABEL[r.focus]} session in {season}, during the {time.peakOrgan.toLowerCase()} hour of the day.
        </div>
      )}

      <div className="px-6 pb-6 pt-3 grid sm:grid-cols-[1fr_auto] gap-5 items-end">
        <div className="text-sm flex flex-col gap-2">
          <p><strong>Next visit:</strong> within {r.nextVisitDays} days. Repeating soon after a session helps the change hold.</p>
          <p><strong>This week:</strong> {r.homeAdvice.map((h) => h.toLowerCase()).join(", ")}.</p>
          {!compact && (
            <p className="text-ink-soft">
              You'll get a text at 24 h and 48 h with four quick sliders. Science corner and further reading: one tap, at the bottom.
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 bg-white rounded-md border border-line">
            <QRCodeSVG value={r.bookingUrl} size={96} fgColor="#15302b" />
          </div>
          <span className="text-xs text-ink-soft">Scan to book</span>
        </div>
      </div>

      <footer className="px-6 py-3 border-t border-line text-xs text-ink-soft">
        This report is educational and describes a wellness session. It does not diagnose or treat any condition.
      </footer>
    </article>
  );
}

function Reading({ n, label, accent = false }: { n: number; label: string; accent?: boolean }) {
  return (
    <div className="rounded-[var(--radius-m)] border border-line px-6 py-4 text-center min-w-[120px]">
      <div className="display text-5xl tabular-nums" style={{ color: accent ? "#2d7a5f" : "var(--ink)" }}>{n}</div>
      <div className="text-xs text-ink-soft mt-1">{label}</div>
    </div>
  );
}

function expectation(e: Element) {
  return {
    earth: "a calmer stomach and more even energy",
    wood: "a looser neck and a clearer head",
    fire: "steadier moods and easier sleep",
    metal: "easier breathing and softer skin",
    water: "warmer feet and a stronger lower back",
  }[e];
}

function seasonOf(d: Date) {
  const m = d.getMonth();
  return m < 2 || m === 11 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";
}

export function fmtLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
