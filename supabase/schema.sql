-- Categories
create table if not exists public.categories (
  name text primary key,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Governorates
create table if not exists public.governorates (
  name text primary key,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Logos
create table if not exists public.logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null references public.categories(name) on update cascade,
  governorate text not null default 'القاهرة' references public.governorates(name) on update cascade,
  url text not null,
  logo_url text not null,
  description text not null default '',
  featured boolean not null default false,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create index if not exists logos_category_idx on public.logos (category);
create index if not exists logos_governorate_idx on public.logos (governorate);
create index if not exists logos_featured_idx on public.logos (featured);

-- RLS
alter table public.categories enable row level security;
alter table public.governorates enable row level security;
alter table public.logos enable row level security;

-- Public read
drop policy if exists "categories are public" on public.categories;
create policy "categories are public" on public.categories for select using (true);

drop policy if exists "governorates are public" on public.governorates;
create policy "governorates are public" on public.governorates for select using (true);

drop policy if exists "logos are public" on public.logos;
create policy "logos are public" on public.logos for select using (true);

-- Authenticated write
drop policy if exists "auth can write categories" on public.categories;
create policy "auth can write categories" on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth can write governorates" on public.governorates;
create policy "auth can write governorates" on public.governorates
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth can write logos" on public.logos;
create policy "auth can write logos" on public.logos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
