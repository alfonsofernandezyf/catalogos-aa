import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

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

function isServiceRoleKey(key) {
  const p = decodeJwtPayload(key)
  return Boolean(p && p.role === 'service_role')
}

function isPlatformSecretKey(key) {
  return typeof key === 'string' && key.trim().startsWith('sb_secret_')
}

/** En el navegador: publicable (sb_publishable_), anon JWT, o legacy anon — nunca sb_secret_ ni service_role JWT. */
const isConfigured = () => {
  const u = supabaseUrl.trim()
  const k = supabaseAnonKey.trim()
  if (!u || !k) return false
  if (!u.startsWith('https://')) return false
  if (u.includes('your-project') || k.includes('your-anon-key')) return false
  if (isPlatformSecretKey(k)) return false
  if (isServiceRoleKey(k)) return false
  return true
}

// Only create client if configured
export const supabase = isConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null

// Re-export the check function
export const isSupabaseConfigured = isConfigured

// Database operations
export const fetchMedications = async () => {
  if (!isConfigured()) return null
  
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .order('atc_code', { ascending: true })
  
  if (error) {
    console.error('Error fetching medications:', error)
    return null
  }
  return data
}

export const saveMedications = async (medications) => {
  if (!isConfigured()) return { error: 'Supabase not configured' }
  
  const { error } = await supabase
    .from('medications')
    .upsert(medications, { onConflict: 'atc_code' })
  
  if (error) {
    console.error('Error saving medications:', error)
    return { error }
  }
  return { success: true }
}

export const fetchSelections = async (userId) => {
  if (!isConfigured()) return []
  
  const { data, error } = await supabase
    .from('selections')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching selections:', error)
    return []
  }
  return data
}

export const saveSelection = async (selection) => {
  if (!isConfigured()) return { error: 'Supabase not configured' }
  
  const { error } = await supabase
    .from('selections')
    .upsert(selection, { onConflict: 'id' })
  
  if (error) {
    console.error('Error saving selection:', error)
    return { error }
  }
  return { success: true }
}

export const fetchAllSelections = async () => {
  if (!isConfigured()) return []
  
  const { data, error } = await supabase
    .from('selections')
    .select('*')
  
  if (error) {
    console.error('Error fetching all selections:', error)
    return []
  }
  return data
}
