-- Aportaciones por ítem: quién seleccionó o dejó nota (colaboración en lista).
-- Ejecutar en Supabase SQL Editor tras `catalogos_aa_user_state.sql` si ya lo usas.

create table if not exists public.catalogos_aa_contributions (
  catalog text not null
    check (catalog in ('medications', 'manifestations', 'allergens')),
  item_id text not null,
  user_key text not null,
  display_name text not null,
  selected boolean not null default true,
  note text,
  updated_at timestamptz not null default now(),
  primary key (catalog, item_id, user_key),
  constraint catalogos_aa_contributions_note_or_selected_chk check (
    selected = true
    or (note is not null and length(trim(note)) > 0)
  )
);

create index if not exists catalogos_aa_contributions_catalog_idx
  on public.catalogos_aa_contributions (catalog);

comment on table public.catalogos_aa_contributions is
  'Una fila por (catálogo, ítem, colaborador). selected=false solo si hay nota sin marcar ítem.';

alter table public.catalogos_aa_contributions enable row level security;

drop policy if exists "catalogos_aa_contributions_select_anon" on public.catalogos_aa_contributions;
drop policy if exists "catalogos_aa_contributions_insert_anon" on public.catalogos_aa_contributions;
drop policy if exists "catalogos_aa_contributions_update_anon" on public.catalogos_aa_contributions;
drop policy if exists "catalogos_aa_contributions_delete_anon" on public.catalogos_aa_contributions;

create policy "catalogos_aa_contributions_select_anon"
  on public.catalogos_aa_contributions for select to anon, authenticated using (true);

create policy "catalogos_aa_contributions_insert_anon"
  on public.catalogos_aa_contributions for insert to anon, authenticated with check (true);

create policy "catalogos_aa_contributions_update_anon"
  on public.catalogos_aa_contributions for update to anon, authenticated using (true) with check (true);

create policy "catalogos_aa_contributions_delete_anon"
  on public.catalogos_aa_contributions for delete to anon, authenticated using (true);
