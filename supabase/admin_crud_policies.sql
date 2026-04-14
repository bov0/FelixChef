create policy "authenticated users can update recipes"
on public.recipes
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete recipes"
on public.recipes
for delete
to authenticated
using (true);

create policy "authenticated users can create ingredients"
on public.ingredients
for insert
to authenticated
with check (true);

create policy "authenticated users can delete ingredients"
on public.ingredients
for delete
to authenticated
using (true);
