-- Living Current — initial schema
-- Built to HIPAA and GDPR standards for everyone from day one.
-- Protocols stay on the server; the app fetches one step at a time for one session.

create extension if not exists "pgcrypto";

-- Who may use it: one login per certified practitioner, seat tied to the credential.
create table practitioners (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  clinic text,
  country text not null,                 -- ISO 3166-1
  region text,                           -- US state, etc.
  licence_type text not null,            -- MD, DO, DC, PT, LAc, ND, DVM, LMT, RN, esthetician, technician
  licence_number text,
  supervising_practitioner text,         -- required when licence_type needs an order
  credential_level smallint not null default 1,  -- 1 foundations, 2 practitioner, 3 advanced
  credential_valid_until date,
  device text,                           -- equiscope | acuscope
  device_serial text,
  languages text[] default '{en}',
  hipaa_covered boolean default false,   -- bills insurance electronically → BAA + HIPAA hosting
  created_at timestamptz default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references practitioners(id) on delete cascade,
  display_name text not null,            -- "Sarah M."
  species text not null default 'human', -- human | horse | dog | cat
  sex text,
  birth_year int,
  main_concern text,
  email text,
  phone text,
  owner_name text,                       -- animals
  created_at timestamptz default now()
);

create table consents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  version text not null,                 -- consent text version
  signed_name text not null,
  signed_at timestamptz not null default now(),
  research_opt_in boolean not null default false,
  ip inet,
  user_agent text
);

create table intakes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  priorities text[] not null,            -- goal ids, ranked
  element_scores jsonb not null,         -- {wood:..,fire:..,earth:..,metal:..,water:..}
  wellbeing jsonb not null,              -- {pain,stress,sleep,energy}
  answers jsonb,                         -- Amina's questions, raw
  submitted_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  practitioner_id uuid not null references practitioners(id),
  intake_id uuid references intakes(id),
  started_at timestamptz default now(),
  ended_at timestamptz,
  opening_reading numeric,
  closing_reading numeric,
  reading_unit text,                     -- to confirm with Amina
  protocol_id text,
  focus_element text,
  action text,                           -- tonify | sedate
  engine_version text,
  reasoning text[],                      -- the explained steps
  balance jsonb,                         -- {scores, weakest, strongest, gap}
  chrono jsonb,
  wellbeing_before jsonb,
  wellbeing_after jsonb,
  notes text
);

create table pulse_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  side text not null,                    -- left | right
  position text not null,                -- cun | guan | chi (Amina: 14 per side)
  rating smallint not null check (rating between 1 and 5),
  qualities text[] default '{}'
);

create table tongue_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  colour text, coating text, shape text, moisture text, zone text,
  photo_path text                        -- storage, with consent
);

create table points_log (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  ordinal smallint not null,
  point_code text not null,
  planned_seconds int not null,
  seconds_to_settle int,
  tones jsonb default '[]',              -- [{at, tone}]
  skipped boolean default false
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  token text unique not null,
  hours_after smallint not null,         -- 24 | 48
  wellbeing jsonb,
  photo_path text,
  sent_at timestamptz,
  answered_at timestamptz
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  public_token text unique not null,
  pdf_path text,
  emailed_to text,
  emailed_at timestamptz
);

-- The library. Internal tags never leave this table to clients.
create table protocols (
  id text primary key,
  goal text not null,                    -- what the client sees
  internal_tag text not null,            -- licensed users only
  focus_element text not null,
  action text not null,
  points jsonb not null,                 -- [{code,name,location,seconds,element,mode,intensity,why}]
  device_settings jsonb not null,
  home_advice text[] not null,
  next_visit_days int not null,
  tcm_view text not null,
  approved_by text,                      -- Dr. Amina
  approved_at timestamptz,
  version int not null default 1
);

create table protocol_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tree jsonb not null,                   -- Amina's decision tree
  active boolean default false,
  created_at timestamptz default now()
);

create table index_scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  total smallint not null,
  settle smallint, point_settle smallint, balance smallint, wellbeing smallint,
  computed_at timestamptz default now()
);

-- Row level security: a practitioner sees only their own clients and sessions.
alter table practitioners enable row level security;
alter table clients enable row level security;
alter table consents enable row level security;
alter table intakes enable row level security;
alter table sessions enable row level security;
alter table pulse_readings enable row level security;
alter table tongue_readings enable row level security;
alter table points_log enable row level security;
alter table checkins enable row level security;
alter table reports enable row level security;
alter table protocols enable row level security;
alter table protocol_rules enable row level security;
alter table index_scores enable row level security;

create or replace function current_practitioner_id() returns uuid language sql stable as $$
  select id from practitioners where auth_user_id = auth.uid()
$$;

create policy "own practitioner row" on practitioners for all using (auth_user_id = auth.uid());
create policy "own clients" on clients for all using (practitioner_id = current_practitioner_id());
create policy "own consents" on consents for all using (client_id in (select id from clients where practitioner_id = current_practitioner_id()));
create policy "own intakes" on intakes for all using (client_id in (select id from clients where practitioner_id = current_practitioner_id()));
create policy "own sessions" on sessions for all using (practitioner_id = current_practitioner_id());
create policy "own pulse" on pulse_readings for all using (session_id in (select id from sessions where practitioner_id = current_practitioner_id()));
create policy "own tongue" on tongue_readings for all using (session_id in (select id from sessions where practitioner_id = current_practitioner_id()));
create policy "own points" on points_log for all using (session_id in (select id from sessions where practitioner_id = current_practitioner_id()));
create policy "own checkins" on checkins for all using (session_id in (select id from sessions where practitioner_id = current_practitioner_id()));
create policy "own reports" on reports for all using (session_id in (select id from sessions where practitioner_id = current_practitioner_id()));
create policy "own index" on index_scores for all using (session_id in (select id from sessions where practitioner_id = current_practitioner_id()));

-- Protocols: readable row by row by certified practitioners, never listable in bulk from the client.
-- The engine runs server-side (service role) and returns one session's steps.
create policy "no direct protocol reads" on protocols for select using (false);
create policy "no direct rule reads" on protocol_rules for select using (false);

-- Public check-in and report pages use a token through a server route with the service role.
