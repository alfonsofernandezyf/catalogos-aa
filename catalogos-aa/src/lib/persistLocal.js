/**
 * Estado en localStorage (offline-first).
 * Paralelo a cmica: la UI usa esto siempre; Supabase es opcional vía `lib/supabase.js`.
 */

export const LS_USER = 'catalogosaa_user_name'
/** Clave estable para fila en Supabase (UUID generado una vez en el navegador) */
export const LS_USER_KEY = 'catalogosaa_collab_user_key'
export const LS_FAVORITES = 'catalogosaa_favorites'
/** @param {'medications'|'manifestations'|'allergens'} catalogId */
export const lsSelectionsKey = (catalogId) => `catalogosaa_selections_${catalogId}`

/** Ítems añadidos por el usuario (JSON por catálogo). */
export const LS_CUSTOM_CATALOG = 'catalogosaa_custom_catalog'

/**
 * @returns {{ medications: object[], manifestations: object[], allergens: object[] }}
 */
export function loadCustomCatalogItems() {
  const raw = safeGetItem(LS_CUSTOM_CATALOG)
  if (!raw) return { medications: [], manifestations: [], allergens: [] }
  try {
    const o = JSON.parse(raw)
    return {
      medications: Array.isArray(o.medications) ? o.medications : [],
      manifestations: Array.isArray(o.manifestations) ? o.manifestations : [],
      allergens: Array.isArray(o.allergens) ? o.allergens : [],
    }
  } catch {
    return { medications: [], manifestations: [], allergens: [] }
  }
}

/**
 * @param {{ medications: object[], manifestations: object[], allergens: object[] }} data
 */
export function saveCustomCatalogItems(data) {
  safeSetItem(LS_CUSTOM_CATALOG, JSON.stringify(data))
}

export function safeGetItem(key) {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

export function safeSetItem(key, val) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, val)
  } catch {
    /* quota / modo privado */
  }
}

export function loadJsonArray(key) {
  const raw = safeGetItem(key)
  if (!raw) return []
  try {
    const a = JSON.parse(raw)
    return Array.isArray(a) ? a : []
  } catch {
    return []
  }
}

const LS_FAVORITES_LEGACY = 'catalogosaa_catalog_favorites'

export function loadFavoritesInitial() {
  let arr = loadJsonArray(LS_FAVORITES)
  if (arr.length === 0) {
    const legacy = loadJsonArray(LS_FAVORITES_LEGACY)
    if (legacy.length) {
      safeSetItem(LS_FAVORITES, JSON.stringify(legacy))
      arr = legacy
    }
  }
  return new Set(arr)
}

/** Lee el snapshot local completo (útil para subir a Supabase). */
export function readLocalStateSnapshot() {
  return {
    displayName: safeGetItem(LS_USER) || '',
    favorites: loadJsonArray(LS_FAVORITES),
    selections: {
      medications: loadJsonArray(lsSelectionsKey('medications')),
      manifestations: loadJsonArray(lsSelectionsKey('manifestations')),
      allergens: loadJsonArray(lsSelectionsKey('allergens')),
    },
  }
}

/** Identificador único por navegador para `user_key` en Supabase. */
export function getOrCreateUserKey() {
  let k = safeGetItem(LS_USER_KEY)
  if (!k) {
    k =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `u_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    safeSetItem(LS_USER_KEY, k)
  }
  return k
}

/**
 * Sobrescribe localStorage y debe ir seguido de actualizar estado React.
 * @param {{ displayName?: string, favorites?: string[], selections?: { medications?: string[], manifestations?: string[], allergens?: string[] } }} snapshot
 */
export function writeSnapshotToLocalStorage(snapshot) {
  safeSetItem(LS_USER, snapshot.displayName ?? '')
  const fav = Array.isArray(snapshot.favorites) ? snapshot.favorites : []
  safeSetItem(LS_FAVORITES, JSON.stringify(fav))
  const sel = snapshot.selections || {}
  for (const id of ['medications', 'manifestations', 'allergens']) {
    const arr = Array.isArray(sel[id]) ? sel[id] : []
    safeSetItem(lsSelectionsKey(id), JSON.stringify(arr))
  }
}
