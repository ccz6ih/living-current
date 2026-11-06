create extension if not exists pgcrypto;

create table public.practitioners (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  pronouns text,
  focus_areas text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.protocols (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  name text not null,
  goal text not null,
  tags text[] not null default '{}',
  points jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.protocol_rules (
  id uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.protocols (id) on delete cascade,
  name text not null,
  rules jsonb not null default '{}'::jsonb,
  priority integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  protocol_id uuid references public.protocols (id) on delete set null,
  focus text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'cancelled')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  consent_version text not null,
  consented boolean not null,
  signed_at timestamptz not null default now()
);

create table public.pulse_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  position text not null,
  rating numeric(2, 1) not null check (rating between 0 and 4),
  created_at timestamptz not null default now(),
  unique (session_id, position)
);

create table public.tongue_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  signs jsonb not null default '[]'::jsonb,
  note text,
  created_at timestamptz not null default now()
);

create table public.points_log (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  point text not null,
  seconds integer not null default 0 check (seconds >= 0),
  tone text not null check (tone in ('tonify', 'even', 'reduce')),
  tone_taps integer not null default 0 check (tone_taps >= 0),
  created_at timestamptz not null default now()
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  token_hash text not null unique,
  energy smallint check (energy between 1 and 5),
  mood smallint check (mood between 1 and 5),
  sleep smallint check (sleep between 1 and 5),
  tension smallint check (tension between 1 and 5),
  note text,
  submitted_at timestamptz
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  session_id uuid not null unique references public.sessions (id) on delete cascade,
  share_token_hash text not null unique,
  index_score smallint check (index_score between 0 and 100),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.index_scores (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references public.practitioners (id) on delete cascade,
  session_id uuid not null unique references public.sessions (id) on delete cascade,
  settle smallint not null check (settle between 0 and 100),
  point_settle smallint not null check (point_settle between 0 and 100),
  balance smallint not null check (balance between 0 and 100),
  wellbeing smallint not null check (wellbeing between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.practitioners enable row level security;
alter table public.clients enable row level security;
alter table public.protocols enable row level security;
alter table public.protocol_rules enable row level security;
alter table public.sessions enable row level security;
alter table public.consents enable row level security;
alter table public.pulse_readings enable row level security;
alter table public.tongue_readings enable row level security;
alter table public.points_log enable row level security;
alter table public.checkins enable row level security;
alter table public.reports enable row level security;
alter table public.index_scores enable row level security;

create policy "Practitioners manage their profile"
  on public.practitioners for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Practitioners manage their clients"
  on public.clients for all to authenticated
  using (practitioner_id = (select auth.uid()))
  with check (practitioner_id = (select auth.uid()));

create policy "Practitioners manage their sessions"
  on public.sessions for all to authenticated
  using (practitioner_id = (select auth.uid()))
  with check (
    practitioner_id = (select auth.uid())
    and exists (
      select 1 from public.clients c
      where c.id = client_id and c.practitioner_id = (select auth.uid())
    )
  );

create policy "Practitioners manage their consents"
  on public.consents for all to authenticated
  using (practitioner_id = (select auth.uid()))
  with check (
    practitioner_id = (select auth.uid())
    and exists (
      select 1 from public.clients c
      where c.id = client_id and c.practitioner_id = (select auth.uid())
    )
  );

create policy "Practitioners read their pulse readings"
  on public.pulse_readings for all to authenticated
  using (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.practitioner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.practitioner_id = (select auth.uid())
  ));

create policy "Practitioners read their tongue readings"
  on public.tongue_readings for all to authenticated
  using (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.practitioner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.practitioner_id = (select auth.uid())
  ));

create policy "Practitioners read their point logs"
  on public.points_log for all to authenticated
  using (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.practitioner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.practitioner_id = (select auth.uid())
  ));

create policy "Practitioners read their check-ins"
  on public.checkins for select to authenticated
  using (practitioner_id = (select auth.uid()));

create policy "Practitioners manage their reports"
  on public.reports for all to authenticated
  using (practitioner_id = (select auth.uid()))
  with check (
    practitioner_id = (select auth.uid())
    and exists (
      select 1 from public.sessions s
      where s.id = session_id and s.practitioner_id = (select auth.uid())
    )
  );

create policy "Practitioners manage their index scores"
  on public.index_scores for all to authenticated
  using (practitioner_id = (select auth.uid()))
  with check (
    practitioner_id = (select auth.uid())
    and exists (
      select 1 from public.sessions s
      where s.id = session_id and s.practitioner_id = (select auth.uid())
    )
  );

-- Protocols are intentionally available only through the session-scoped RPC below.
revoke all on public.protocols, public.protocol_rules from anon, authenticated;

create or replace function public.get_protocol_for_session(p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
  select jsonb_build_object(
    'protocol', to_jsonb(p),
    'rules', coalesce((
      select jsonb_agg(to_jsonb(r) order by r.priority)
      from public.protocol_rules r
      where r.protocol_id = p.id
    ), '[]'::jsonb)
  )
  from public.sessions s
  join public.protocols p
    on p.id = s.protocol_id
   and p.practitioner_id = s.practitioner_id
  where s.id = p_session_id
    and s.practitioner_id = auth.uid()
  limit 1;
$$;

revoke all on function public.get_protocol_for_session(uuid) from public, anon;
grant execute on function public.get_protocol_for_session(uuid) to authenticated;
