-- Estado colaborativo por clave de usuario (catalogos-aa).
-- Ejecutar en Supabase: SQL Editor → New query → pegar → Run.
-- Requisito de la app: tabla `public.catalogos_aa_user_state` (ver `src/lib/supabase.js`).

create table if not exists public.catalogos_aa_user_state (
  user_key text primary key,
  display_name text not null default '',
  selections jsonb not null default '{"medications":[],"manifestations":[],"allergens":[]}'::jsonb,
  favorites jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.catalogos_aa_user_state is
  'Favoritos y selecciones por catálogo; user_key suele ser UUID en localStorage.';

alter table public.catalogos_aa_user_state enable row level security;

-- Políticas permisivas para cliente anon (clave en .env): solo adecuado en entornos de prueba
-- o si aceptas que cualquiera con la anon key lea/escriba todas las filas.
-- En producción: sustituir por auth.uid(), service role, o políticas por user_key tras login.

drop policy if exists "catalogos_aa_user_state_select_anon" on public.catalogos_aa_user_state;
drop policy if exists "catalogos_aa_user_state_insert_anon" on public.catalogos_aa_user_state;
drop policy if exists "catalogos_aa_user_state_update_anon" on public.catalogos_aa_user_state;

create policy "catalogos_aa_user_state_select_anon"
  on public.catalogos_aa_user_state
  for select
  to anon, authenticated
  using (true);

create policy "catalogos_aa_user_state_insert_anon"
  on public.catalogos_aa_user_state
  for insert
  to anon, authenticated
  with check (true);

create policy "catalogos_aa_user_state_update_anon"
  on public.catalogos_aa_user_state
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Opcional: mantener updated_at si solo actualizas por columnas parciales desde otros clientes.
-- La app ya envía updated_at en upsert; no es obligatorio.
