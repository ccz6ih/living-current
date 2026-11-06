# Living Current

A demo-first practitioner studio for integrative wellness sessions. This repository currently contains a fictional, in-memory demo experience; it is not configured for real client records or clinical use.

## Run locally

Use Node.js 22.6 or newer and npm:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `DEMO_MODE=true` is the default. Demo forms do not send messages or persist submitted information. The Sarah M., Maya R., and Leo K. profiles and session histories in `src/lib/demo-data.ts` are fictional.

## Demo routes

- `/` — today’s schedule and session launcher
- `/clients/sarah-m` — client file, history, and wellbeing tracker
- `/session/sarah-m/intake` — eight-step intake, pulse, tongue, reading, protocol, points, closing, and report workflow
- `/r/sarah-m` — branded session reflection with a QR code and print action
- `/client/intake/demo` and `/client/checkin/demo` — mobile-friendly consent/intake and four-slider check-in
- `/admin/protocols` and `/admin/rules` — draft protocol library and decision-tree examples
- `POST /api/engine` — validate Earth/Wood ratings and return a suggested demo protocol

The starter rules and session content are illustrative and are not medical guidance. Suggestions are always subject to practitioner judgement.

## Checks

```bash
npm test
npm run lint
npm run build
```

## Supabase foundation

`supabase/migrations/0001_init.sql` defines practitioner, client, consent, session, pulse, tongue, point, check-in, report, protocol, rule, and index-score tables with row-level security. Sensitive protocol tables have no direct `anon` or `authenticated` table grants. They can only be read through `get_protocol_for_session(session_id)`, which requires the signed-in practitioner to own that session. Apply the migration with the Supabase CLI before connecting a deployment.

`src/lib/supabase/browser.ts` and `src/lib/supabase/server.ts` create cookie-aware Supabase clients from the public URL and anon key. Supabase is not yet connected to the demo UI; configure auth and replace the in-memory data layer before handling real client information.

## Deployment configuration

Copy `.env.example` and configure secrets only in local ignored environment files or the deployment provider:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE` (server only; never expose to the browser)
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER`
- `NEXT_PUBLIC_APP_URL`
- `DEMO_MODE=true` for preview deployments

Use the `demo` branch for a demo preview and `main` for production. The Resend and Twilio credentials are placeholders only; no email or SMS is sent by this demo. Add authenticated, session-scoped provider routes before enabling either integration.

## Build sequence

The first slice is the demo shell and eight-step session flow, followed by the protocol engine, report/index/tracker, intake/check-in, Supabase persistence and messaging, then the practitioner editors. Current pages and API response are demo-only; database and external-service wiring remain a deployment task.
