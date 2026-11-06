# Living Current

Dr. Amina's method, in software. Read the pulse, apply the current, show the client what changed.

A practitioner tablet app for the Equiscope / Acuscope that turns a pulse reading into one of Amina's protocols and guides the probe point by point, plus the client-facing intake, check-ins and session report.

## Running the demo

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Demo mode is on by default: everything runs from seeded clients and nothing leaves the browser (session state lives in `localStorage`).

| Where | What |
| --- | --- |
| `/` | Landing page with the live settle ring |
| `/app` | Today: clients, start a session |
| `/app/clients/sarah-m` | Client file: Living Current Index, readings tracker, sessions |
| `/app/session/…` | The 8-step session: intake → pulse → tongue → opening reading → protocol → guided points → closing reading → report |
| `/app/library` | Protocol library by goal |
| `/r/sarah-m-s6` | A client's report page (branded, QR to book) |
| `/intake/demo` | Phone intake and consent |
| `/checkin/demo-24` | The 24 h check-in by text link |

On the guided-points screen: Space starts and pauses the timer, N moves on, the voice reads each step (toggle top right), and the tone buttons log what the device is doing.

## Deploying to Vercel

1. Import this repo. Framework: Next.js, build `pnpm build`.
2. Environment variables (see `.env.example`). For a demo deployment only `NEXT_PUBLIC_DEMO_MODE=true` is needed.
3. Production = `main`. Use a `demo` branch for preview deployments to share with Amina.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind v4
- GSAP for the settle ring, needle and reveals; Recharts for the trackers
- Supabase (Postgres + Auth + RLS) — schema in `supabase/migrations/0001_init.sql`
- Resend for the emailed report, Twilio for check-in texts (phase 5)

## Where things live

```
src/engine/      the protocol engine: pulse → balance, tongue, chrono clock,
                 decision tree, Living Current Index. Pure TypeScript, testable.
src/data/        protocol library and seeded clients (placeholders for Amina)
src/lib/store    session state (demo adapter; Supabase adapter swaps in)
src/components/  wrist map, tongue map, settle ring, tone buttons, index dial,
                 report card, session steps
src/app/         routes: (tablet) /app, (client) /r /intake /checkin /book
supabase/        migration with RLS; protocols never readable in bulk
```

## What's placeholder, for Amina

- The pulse map is the classic 3 positions per wrist; hers has 14 per side.
- Point prescriptions, timings and device settings are classical placeholders.
- Decision rules in `src/engine/protocol.ts` are a first tree; hers replace it.
- The index weights are a starting judgment, to tune on pilot data.
- Reading unit (voltage, impedance, other) is to confirm.

## Build order

1. ✅ Demo shell, seeded data, the 8-step flow, engine, report, index
2. Supabase wiring behind `src/lib/store` (same interface)
3. Resend report email, Twilio check-ins, booking
4. Admin editor for the library and decision trees (Amina only)
5. Acuscope translation, facials pack, animal maps
