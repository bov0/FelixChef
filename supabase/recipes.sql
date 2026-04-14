create extension if not exists "pgcrypto";

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  thumbnail_url text not null,
  ingredients text[] not null default '{}',
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "recipes are visible to everyone"
on public.recipes
for select
to anon, authenticated
using (true);

create policy "authenticated users can create recipes"
on public.recipes
for insert
to authenticated
with check (true);
