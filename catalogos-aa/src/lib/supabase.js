import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Decodifica el payload de un JWT (sin verificar firma). Solo para comprobar `role`.
 * @param {string} token
 * @returns {{ role?: string } | null}
 */
function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string' || !token.startsWith('eyJ')) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** JWT legacy: rol elevado (equivalente a secret en servidor). */
function isServiceRoleKey(key) {
  const p = decodeJwtPayload(key)
  return Boolean(p && p.role === 'service_role')
}

/**
 * Claves nuevas de plataforma (no JWT): `sb_secret_` está prohibida en el navegador (docs API keys).
 * `sb_publishable_` y JWT `anon` sí son válidas en cliente.
 */
function isPlatformSecretKey(key) {
  return typeof key === 'string' && key.trim().startsWith('sb_secret_')
}

function hasPlaceholderEnv(u, k) {
  return u.includes('your-project') || k.includes('your-anon-key')
}

/**
 * Si no es null, la configuración de Supabase es incorrecta o incompleta (mensaje para la UI).
 * Si no usas nube (ambas variables vacías), devuelve null.
 * @returns {string | null}
 */
export function getSupabaseConfigurationIssue() {
  const u = supabaseUrl.trim()
  const k = supabaseAnonKey.trim()
  if (!u && !k) return null
  if (!u || !k) {
    return 'Define ambas variables: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env (reinicia el servidor de desarrollo tras guardar).'
  }
  if (!u.startsWith('https://')) {
    return 'VITE_SUPABASE_URL debe ser HTTPS (p. ej. https://xxxx.supabase.co).'
  }
  if (hasPlaceholderEnv(u, k)) {
    return 'Sustituye los placeholders de ejemplo en .env por la URL y la clave reales de tu proyecto.'
  }
  if (isPlatformSecretKey(k)) {
    return (
      'VITE_SUPABASE_ANON_KEY apunta a una clave secreta (sb_secret_…). No puede usarse en el navegador. ' +
      'En Supabase → Project Settings → API Keys, usa la clave publicable (sb_publishable_…) o, en pestaña Legacy, la clave anon (JWT).'
    )
  }
  if (isServiceRoleKey(k)) {
    return (
      'VITE_SUPABASE_ANON_KEY es la JWT service_role (privilegios elevados). En el navegador usa la publicable o la anon (Legacy).'
    )
  }
  return null
}

/** Cliente listo solo con URL + clave anon válidas (nunca service_role). */
const isConfigured = () => {
  const u = supabaseUrl.trim()
  const k = supabaseAnonKey.trim()
  if (!u || !k) return false
  return getSupabaseConfigurationIssue() === null
}

export const supabase = isConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null
export const isSupabaseConfigured = isConfigured

/**
 * Esquema listo para ejecutar: `supabase/catalogos_aa_user_state.sql`
 *
 * Tabla sugerida en Supabase (SQL de referencia — créala en el dashboard o con migración):
 *
 * create table public.catalogos_aa_user_state (
 *   user_key text primary key,
 *   display_name text not null default '',
 *   selections jsonb not null default '{"medications":[],"manifestations":[],"allergens":[]}'::jsonb,
 *   favorites jsonb not null default '[]'::jsonb,
 *   updated_at timestamptz not null default now()
 * );
 * alter table public.catalogos_aa_user_state enable row level security;
 * -- Políticas según tu modelo de auth (anon read/write de prueba o solo usuarios logueados)
 *
 * `user_key`: identificador estable para colaboración (p. ej. slug del nombre o UUID guardado en localStorage).
 */

export const CATALOGOS_USER_STATE_TABLE = 'catalogos_aa_user_state'

/**
 * @typedef {Object} CatalogosUserStateRow
 * @property {string} user_key
 * @property {string} [display_name]
 * @property {{ medications: string[], manifestations: string[], allergens: string[] }} [selections]
 * @property {string[]} [favorites]
 */

/**
 * Obtiene el estado remoto de un usuario/colaborador.
 * @param {string} userKey
 * @returns {Promise<import('@supabase/supabase-js').PostgrestSingleResponse<CatalogosUserStateRow>['data']|null>}
 */
export async function fetchCatalogosUserState(userKey) {
  if (!isConfigured() || !supabase || !userKey) return null

  const { data, error } = await supabase
    .from(CATALOGOS_USER_STATE_TABLE)
    .select('*')
    .eq('user_key', userKey.trim())
    .maybeSingle()

  if (error) {
    console.error('[catalogos-aa] fetchCatalogosUserState:', error)
    return null
  }
  return data
}

/**
 * Crea o actualiza el estado (upsert por `user_key`).
 * @param {CatalogosUserStateRow} row
 */
export async function upsertCatalogosUserState(row) {
  if (!isConfigured() || !supabase) {
    return { error: { message: 'Supabase not configured' } }
  }

  const payload = {
    user_key: row.user_key,
    display_name: row.display_name ?? '',
    selections: row.selections ?? {
      medications: [],
      manifestations: [],
      allergens: [],
    },
    favorites: row.favorites ?? [],
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from(CATALOGOS_USER_STATE_TABLE).upsert(payload, {
    onConflict: 'user_key',
  })

  if (error) {
    console.error('[catalogos-aa] upsertCatalogosUserState:', error)
    return { error }
  }
  return { success: true }
}

/**
 * Lista filas para paneles de administración / merge (opcional).
 * Requiere política RLS que permita select.
 */
export async function fetchAllCatalogosUserStates() {
  if (!isConfigured() || !supabase) return []

  const { data, error } = await supabase
    .from(CATALOGOS_USER_STATE_TABLE)
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[catalogos-aa] fetchAllCatalogosUserStates:', error)
    return []
  }
  return data ?? []
}

/**
 * Normaliza el JSON `selections` de la fila Supabase al shape de la app.
 * @param {unknown} rawSel
 */
export function normalizeSelectionsFromRow(rawSel) {
  if (!rawSel || typeof rawSel !== 'object') {
    return { medications: [], manifestations: [], allergens: [] }
  }
  const o = /** @type {Record<string, unknown>} */ (rawSel)
  return {
    medications: Array.isArray(o.medications) ? o.medications.map(String) : [],
    manifestations: Array.isArray(o.manifestations) ? o.manifestations.map(String) : [],
    allergens: Array.isArray(o.allergens) ? o.allergens.map(String) : [],
  }
}

/** @see `supabase/catalogos_aa_contributions.sql` */
export const CATALOGOS_CONTRIBUTIONS_TABLE = 'catalogos_aa_contributions'

/**
 * @typedef {Object} ContributionRow
 * @property {string} catalog
 * @property {string} item_id
 * @property {string} user_key
 * @property {string} display_name
 * @property {boolean} selected
 * @property {string | null} [note]
 */

/**
 * Todas las aportaciones de un catálogo (lista colaborativa).
 * @param {'medications'|'manifestations'|'allergens'} catalog
 * @returns {Promise<ContributionRow[]>}
 */
export async function fetchContributionsForCatalog(catalog) {
  if (!isConfigured() || !supabase) return []

  const { data, error } = await supabase
    .from(CATALOGOS_CONTRIBUTIONS_TABLE)
    .select('catalog,item_id,user_key,display_name,selected,note,updated_at')
    .eq('catalog', catalog)

  if (error) {
    console.error('[catalogos-aa] fetchContributionsForCatalog:', error)
    return []
  }
  return /** @type {ContributionRow[]} */ (data ?? [])
}

/**
 * @param {ContributionRow[]} rows
 * @returns {Map<string, ContributionRow[]>}
 */
export function indexContributionsByItemId(rows) {
  const map = new Map()
  for (const r of rows) {
    const id = r.item_id
    const list = map.get(id) ?? []
    list.push(r)
    map.set(id, list)
  }
  return map
}

/**
 * @param {ContributionRow} row
 */
export async function upsertContribution(row) {
  if (!isConfigured() || !supabase) {
    return { error: { message: 'Supabase not configured' } }
  }

  const payload = {
    catalog: row.catalog,
    item_id: row.item_id,
    user_key: row.user_key,
    display_name: row.display_name,
    selected: row.selected,
    note: row.note ?? null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from(CATALOGOS_CONTRIBUTIONS_TABLE).upsert(payload, {
    onConflict: 'catalog,item_id,user_key',
  })

  if (error) {
    console.error('[catalogos-aa] upsertContribution:', error)
    return { error }
  }
  return { success: true }
}

/**
 * @param {'medications'|'manifestations'|'allergens'} catalog
 * @param {string} itemId
 * @param {string} userKey
 */
export async function deleteContribution(catalog, itemId, userKey) {
  if (!isConfigured() || !supabase) {
    return { error: { message: 'Supabase not configured' } }
  }

  const { error } = await supabase
    .from(CATALOGOS_CONTRIBUTIONS_TABLE)
    .delete()
    .eq('catalog', catalog)
    .eq('item_id', itemId)
    .eq('user_key', userKey)

  if (error) {
    console.error('[catalogos-aa] deleteContribution:', error)
    return { error }
  }
  return { success: true }
}
