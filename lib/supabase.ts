import { createClient } from '@supabase/supabase-js'

// Check if we're in the browser and if environment variables are set
const isClient = typeof window !== 'undefined'
const hasValidConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase configuration check:', {
  isClient,
  hasValidConfig,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
})

// Only create Supabase client if we have valid configuration
let supabase: any = null

if (hasValidConfig) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  console.log('Creating Supabase client with URL:', supabaseUrl)
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('Supabase not configured - using mock mode')
}

export { supabase }

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidConfig

// Types for media entries
export type MediaType = 'book' | 'movie' | 'podcast' | 'article'
export type MediaStatus = 'on_list' | 'consuming' | 'consumed'

export interface MediaEntry {
  id?: string
  user_id: string
  title: string
  media_type: MediaType
  status: MediaStatus
  date_completed?: string
  rating: number
  notes?: string
  cover_image_url?: string
  created_at?: string
}

export interface MediaEntryFormData {
  title: string
  media_type: MediaType
  status: MediaStatus
  date_completed?: string
  rating: number
  notes?: string
  cover_image_url?: string
} 