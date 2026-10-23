import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. See .env.example',
      )
    }
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return client
}

export const supabase = getSupabaseClient()
