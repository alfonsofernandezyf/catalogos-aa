import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured before creating client
const isConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl.startsWith('https://') &&
         !supabaseUrl.includes('your-project') && 
         !supabaseAnonKey.includes('your-anon-key')
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
