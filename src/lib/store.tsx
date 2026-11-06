"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CLIENT_BY_ID, type Client } from "@/data/seed";
import type { DeviceId } from "@/data/devices";
import type {
  EngineOutput,
  Intake,
  PointLog,
  PulseReading,
  Tone,
  TongueReading,
  Wellbeing,
} from "@/engine/types";

/**
 * Session state for the practitioner tablet. Demo mode persists to
 * localStorage; the Supabase adapter swaps in behind the same interface.
 */
export type Step =
  | "intake"
  | "pulse"
  | "tongue"
  | "reading"
  | "protocol"
  | "points"
  | "closing"
  | "report";

export const STEPS: { id: Step; label: string; short: string }[] = [
  { id: "intake", label: "Intake", short: "Today's priorities and consent" },
  { id: "pulse", label: "Pulse", short: "Rate the six positions" },
  { id: "tongue", label: "Tongue", short: "Tap what you see" },
  { id: "reading", label: "Opening reading", short: "Needle position" },
  { id: "protocol", label: "Protocol", short: "Amina's logic, explained" },
  { id: "points", label: "Guided points", short: "One point per screen" },
  { id: "closing", label: "Closing reading", short: "Needle position" },
  { id: "report", label: "Report", short: "Send and book" },
];

export interface LiveSession {
  id: string;
  clientId: string;
  startedAt: string;
  step: Step;
  intake: Intake;
  pulse: PulseReading;
  tongue: TongueReading;
  openingReading: number | null;
  closingReading: number | null;
  engine: EngineOutput | null;
  pointIndex: number;
  pointLogs: PointLog[];
  wellbeingAfter: Wellbeing | null;
  reportSentAt: string | null;
}

export interface Settings {
  device: DeviceId;
  secondUnit: DeviceId | null;
  supplies: Record<string, number>;
  licensed: boolean;
}

const DEFAULT_SETTINGS: Settings = { device: "equiscope", secondUnit: null, supplies: { gel: 1, "ear-clips": 3, plates: 2, "probe-tips": 1 }, licensed: false };

interface Store {
  sessions: Record<string, LiveSession>;
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
  startSession: (client: Client) => LiveSession;
  getSession: (id: string) => LiveSession | undefined;
  update: (id: string, patch: Partial<LiveSession> | ((s: LiveSession) => Partial<LiveSession>)) => void;
  logTone: (id: string, code: string, at: number, tone: Tone) => void;
  reset: () => void;
  hydrated: boolean;
}

const Ctx = createContext<Store | null>(null);
const KEY = "living-current:sessions:v1";
const SKEY = "living-current:settings:v1";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Record<string, LiveSession>>({});
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSessions(JSON.parse(raw));
      const sraw = localStorage.getItem(SKEY);
      if (sraw) setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(sraw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SKEY, JSON.stringify(settings));
    } catch {}
  }, [settings, hydrated]);

  const setSettings = useCallback((patch: Partial<Settings>) => setSettingsState((s) => ({ ...s, ...patch })), []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(sessions));
    } catch {}
  }, [sessions, hydrated]);

  const startSession = useCallback((client: Client) => {
    const id = `${client.id}-${Date.now().toString(36)}`;
    const s: LiveSession = {
      id,
      clientId: client.id,
      startedAt: new Date().toISOString(),
      step: "intake",
      intake: { ...client.intake },
      pulse: { ratings: {}, qualities: {} },
      tongue: {},
      openingReading: null,
      closingReading: null,
      engine: null,
      pointIndex: 0,
      pointLogs: [],
      wellbeingAfter: null,
      reportSentAt: null,
    };
    setSessions((prev) => ({ ...prev, [id]: s }));
    return s;
  }, []);

  const update = useCallback<Store["update"]>((id, patch) => {
    setSessions((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const p = typeof patch === "function" ? patch(cur) : patch;
      return { ...prev, [id]: { ...cur, ...p } };
    });
  }, []);

  const logTone = useCallback<Store["logTone"]>((id, code, at, tone) => {
    setSessions((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const logs = [...cur.pointLogs];
      let log = logs.find((l) => l.code === code);
      if (!log) {
        log = { code, startedAt: new Date().toISOString(), secondsToSettle: null, tones: [] };
        logs.push(log);
      }
      log.tones = [...log.tones, { at, tone }];
      if ((tone === "steady" || tone === "falling") && log.secondsToSettle == null) log.secondsToSettle = at;
      return { ...prev, [id]: { ...cur, pointLogs: logs } };
    });
  }, []);

  const reset = useCallback(() => {
    setSessions({});
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  const value = useMemo<Store>(
    () => ({
      sessions,
      settings,
      setSettings,
      startSession,
      getSession: (id) => sessions[id],
      update,
      logTone,
      reset,
      hydrated,
    }),
    [sessions, settings, setSettings, startSession, update, logTone, reset, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSessions() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSessions must be used within SessionProvider");
  return ctx;
}

export function clientOf(session: LiveSession) {
  return CLIENT_BY_ID[session.clientId];
}
