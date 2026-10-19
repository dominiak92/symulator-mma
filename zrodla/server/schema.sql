-- Symulator MMA: tryb rankingowy (sezony, kariery na serwerze)
-- Klient nie ma bezpośredniego dostępu do tabel: wszystko idzie przez funkcję serwera „game”.

create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null check (char_length(nick) between 2 and 20),
  created_at timestamptz not null default now()
);

create table if not exists public.seasons (
  id serial primary key,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  seed bigint not null,
  years_per_day int not null default 3,
  bank_cap int not null default 9,
  max_careers int not null default 2
);

create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  season_id int not null references public.seasons(id),
  attempt int not null,
  state jsonb not null,
  version int not null default 0,
  bank int not null,
  refill_day int not null,
  legacy int not null default 0,
  finished boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, season_id, attempt)
);
create index if not exists careers_season_legacy on public.careers (season_id, legacy desc);

create table if not exists public.career_log (
  id bigserial primary key,
  career_id uuid not null references public.careers(id) on delete cascade,
  at timestamptz not null default now(),
  ops jsonb not null,
  season_before int,
  season_after int
);

alter table public.players enable row level security;
alter table public.seasons enable row level security;
alter table public.careers enable row level security;
alter table public.career_log enable row level security;
-- brak polityk = brak dostępu z przeglądarki; funkcja serwera używa klucza serwisowego

-- pierwszy sezon: od dziś na 14 dni
insert into public.seasons (name, starts_at, ends_at, seed)
select 'Sezon 1', date_trunc('day', now()), date_trunc('day', now()) + interval '14 days', (random() * 2147483647)::bigint
where not exists (select 1 from public.seasons);
