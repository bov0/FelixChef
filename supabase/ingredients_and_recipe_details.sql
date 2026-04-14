create table if not exists public.ingredients (
  id text primary key,
  name text not null,
  icon text not null
);

insert into public.ingredients (id, name, icon) values
  ('pollo', 'Pollo', '🍗'),
  ('huevo', 'Huevo', '🥚'),
  ('patata', 'Patata', '🥔'),
  ('arroz', 'Arroz', '🍚'),
  ('pasta', 'Pasta', '🍝'),
  ('queso', 'Queso', '🧀'),
  ('tomate', 'Tomate', '🍅'),
  ('pescado', 'Pescado', '🐟')
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon;

alter table public.ingredients enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ingredients'
      and policyname = 'ingredients are visible to everyone'
  ) then
    create policy "ingredients are visible to everyone"
    on public.ingredients
    for select
    to anon, authenticated
    using (true);
  end if;
end $$;

alter table public.recipes
  add column if not exists recipe_ingredients jsonb not null default '[]'::jsonb;
