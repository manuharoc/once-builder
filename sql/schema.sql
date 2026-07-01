-- Esquema Supabase para Once Builder

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  country text,
  logo_url text,
  source text default 'manual', -- 'api' | 'manual'
  api_team_id int, -- id en API-Football, si aplica
  created_at timestamptz default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text not null,
  position text, -- GK, DF, MF, FW
  number int,
  nationality text,
  photo_url text,
  source text default 'manual',
  api_player_id int,
  created_at timestamptz default now()
);

create table if not exists jerseys (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  primary_color text default '#ffffff',
  secondary_color text default '#000000',
  sleeve_style text default 'solid', -- solid | stripes | sleeves-diff
  pattern text default 'none', -- none | stripes-v | stripes-h
  created_at timestamptz default now()
);

create table if not exists lineups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team_id uuid references teams(id),
  formation text not null, -- ej '4-3-3'
  slots jsonb not null, -- [{slotId, playerId, x, y}, ...]
  jersey_id uuid references jerseys(id),
  created_by text,
  created_at timestamptz default now()
);

-- RLS básico (ajustar según necesidad)
alter table teams enable row level security;
alter table players enable row level security;
alter table jerseys enable row level security;
alter table lineups enable row level security;

create policy "public read teams" on teams for select using (true);
create policy "public read players" on players for select using (true);
create policy "public read jerseys" on jerseys for select using (true);
create policy "public read lineups" on lineups for select using (true);

create policy "public insert teams" on teams for insert with check (true);
create policy "public insert players" on players for insert with check (true);
create policy "public insert jerseys" on jerseys for insert with check (true);
create policy "public insert lineups" on lineups for insert with check (true);
