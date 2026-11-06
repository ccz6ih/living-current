"use client";

import { DEVICES, SUPPLIES, type DeviceId } from "@/data/devices";
import { useSessions } from "@/lib/store";
import { AlertTriangle, Check, ShoppingCart } from "lucide-react";

export default function DevicePage() {
  const { settings, setSettings, hydrated } = useSessions();
  if (!hydrated) return null;
  const clinic = DEVICES.filter((d) => d.role === "clinic");

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-4xl">Your device</h1>
      <p className="text-ink-soft mt-1 max-w-2xl">Amina's protocols are written on the Equiscope. Pick what's on your table and every protocol shows dial settings for it. Acuscope and Myopulse translations are being tested with Jan, step by step, and are marked until confirmed.</p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {clinic.map((d) => {
          const on = settings.device === d.id || settings.secondUnit === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                if (d.id.startsWith("myopulse")) setSettings({ secondUnit: settings.secondUnit === d.id ? null : d.id });
                else setSettings({ device: d.id as DeviceId, secondUnit: d.id === "equiscope" ? null : settings.secondUnit });
              }}
              aria-pressed={on}
              className={`tap text-left card p-5 transition ${on ? "border-ink" : "hover:bg-bone"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-ink-soft">{d.maker} · {d.priceGuide}</div>
                  <h2 className="text-2xl mt-0.5">{d.name}</h2>
                  <p className="text-sm text-ink-soft mt-1">{d.bestFor}</p>
                </div>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${on ? "bg-ink text-bone" : "border border-line"}`}>{on && <Check className="w-4 h-4" />}</span>
              </div>
              <div className="mt-3 text-xs inline-flex items-center gap-1" style={{ color: d.translation === "native" ? "#2d7a5f" : "var(--earth)" }}>
                {d.translation === "native" ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {d.translation === "native" ? "Native: Amina's settings as written" : "Translation pending confirmation with Jan"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <section className="card p-5">
          <h2 className="text-xl">Licence</h2>
          <p className="text-sm text-ink-soft mt-1">Licensed users can export insurance-ready session notes and superbills. Supervised users name their supervising practitioner at sign-up.</p>
          <label className="flex items-center gap-3 mt-4 text-sm">
            <input type="checkbox" className="w-5 h-5" checked={settings.licensed} onChange={(e) => setSettings({ licensed: e.target.checked })} />
            I hold a licence that lets me bill for this service
          </label>
        </section>

        <section className="card p-5">
          <h2 className="text-xl">Supplies</h2>
          <p className="text-sm text-ink-soft mt-1">Gels and electrodes are consumables. Low stock nudges a reorder.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {SUPPLIES.map((s) => {
              const n = settings.supplies[s.id] ?? 0;
              const low = n < s.par;
              return (
                <li key={s.id} className="flex items-center gap-3 text-sm">
                  <span className="flex-1">{s.name}</span>
                  <button className="w-8 h-8 rounded-full border border-line" onClick={() => setSettings({ supplies: { ...settings.supplies, [s.id]: Math.max(0, n - 1) } })} aria-label={`one fewer ${s.name}`}>−</button>
                  <span className={`w-6 text-center tabular-nums font-semibold ${low ? "text-fire" : ""}`}>{n}</span>
                  <button className="w-8 h-8 rounded-full border border-line" onClick={() => setSettings({ supplies: { ...settings.supplies, [s.id]: n + 1 } })} aria-label={`one more ${s.name}`}>+</button>
                  {low && <a href="#" onClick={(e) => e.preventDefault()} className="text-xs underline underline-offset-4 inline-flex items-center gap-1"><ShoppingCart className="w-3.5 h-3.5" /> Reorder</a>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
