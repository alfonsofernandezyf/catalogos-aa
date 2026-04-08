/**
 * Comprueba URL/anon key, existencia de la tabla y políticas RLS (select + upsert).
 * Uso: desde la raíz del proyecto: `node scripts/verify-supabase-catalogos.mjs`
 * No imprime la clave; solo OK / errores de Supabase.
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const envPath = join(root, '.env')

function loadEnvFile(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

function isConfigured(url, key) {
  return (
    Boolean(url && key) &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !key.includes('your-anon-key')
  )
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string' || !token.startsWith('eyJ')) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

const env = loadEnvFile(envPath)
const supabaseUrl = env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || ''

if (!isConfigured(supabaseUrl, supabaseAnonKey)) {
  console.error(
    'Falta o inválido: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en .env (HTTPS, sin placeholders).'
  )
  process.exit(1)
}

if (supabaseAnonKey.trim().startsWith('sb_secret_')) {
  console.error(
    'VITE_SUPABASE_ANON_KEY es una clave sb_secret (solo servidor). Usa sb_publishable_… o la anon JWT (Legacy) en el cliente.'
  )
  process.exit(1)
}

const payload = decodeJwtPayload(supabaseAnonKey)
if (payload?.role === 'service_role') {
  console.error(
    'VITE_SUPABASE_ANON_KEY parece ser la clave service_role (secreta). En .env usa la clave anon (public) del dashboard de Supabase.'
  )
  process.exit(1)
}

const TABLE = 'catalogos_aa_user_state'
const SMOKE_KEY = '__catalogos_aa_smoke__'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const emptySelections = {
  medications: [],
  manifestations: [],
  allergens: [],
}

console.log('1) SELECT (tabla + RLS lectura)...')
const sel = await supabase.from(TABLE).select('user_key').limit(1)
if (sel.error) {
  console.error('Error:', sel.error.message, sel.error.code || '', sel.error.details || '')
  process.exit(1)
}
console.log('   OK (respuesta sin error).')

console.log('2) UPSERT fila de prueba (RLS inserción/actualización)...')
const up = await supabase.from(TABLE).upsert(
  {
    user_key: SMOKE_KEY,
    display_name: '',
    selections: emptySelections,
    favorites: [],
    updated_at: new Date().toISOString(),
  },
  { onConflict: 'user_key' }
)
if (up.error) {
  console.error('Error:', up.error.message, up.error.code || '', up.error.details || '')
  process.exit(1)
}
console.log('   OK.')

console.log('3) SELECT por user_key...')
const one = await supabase.from(TABLE).select('*').eq('user_key', SMOKE_KEY).maybeSingle()
if (one.error) {
  console.error('Error:', one.error.message)
  process.exit(1)
}
if (!one.data) {
  console.error('No se encontró la fila de prueba tras upsert.')
  process.exit(1)
}
console.log('   OK.')

console.log('')
console.log('Todo correcto: tabla accesible con la anon key y políticas coherentes con la app.')
console.log(
  `(Opcional) Borra en SQL Editor: delete from public.catalogos_aa_user_state where user_key = '${SMOKE_KEY}';`
)
