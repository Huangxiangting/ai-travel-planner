import { createClient } from '@supabase/supabase-js'
import { getSetting } from '../lib/storage'

let client: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (client) return client
  const url = getSetting('supabaseUrl')
  const key = getSetting('supabaseAnonKey')
  if (!url || !key) return null
  client = createClient(url, key)
  return client
}
