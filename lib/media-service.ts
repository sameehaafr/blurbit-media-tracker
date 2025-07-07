import { supabase, MediaEntry, MediaEntryFormData, isSupabaseConfigured } from './supabase'

export class MediaService {


  // Create a new media entry
  static async createEntry(userId: string, entryData: MediaEntryFormData): Promise<MediaEntry | null> {
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase environment variables not configured. Using mock data.')
        // Return mock data for development
        return {
          id: 'mock-id-' + Date.now(),
          user_id: userId,
          title: entryData.title,
          media_type: entryData.media_type,
          status: entryData.status,
          date_completed: entryData.date_completed,
          rating: entryData.rating,
          notes: entryData.notes || undefined,
          cover_image_url: entryData.cover_image_url || undefined,
          created_at: new Date().toISOString(),
        }
      }

      const insertData: any = {
        user_id: userId,
        title: entryData.title,
        media_type: entryData.media_type,
        date_completed: entryData.date_completed,
        rating: entryData.rating,
        notes: entryData.notes || null,
        cover_image_url: entryData.cover_image_url || null,
      }

      // Only include status if the column exists (will be added by migration)
      // For now, we'll skip it to avoid the error
      // insertData.status = entryData.status

      const { data, error } = await supabase
        .from('media_entries')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating media entry:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Supabase error: ${error.message || 'Unknown error'}`)
      }

      return data
    } catch (error) {
      console.error('Error creating media entry:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        errorType: typeof error,
        errorKeys: error && typeof error === 'object' ? Object.keys(error) : 'not an object'
      })
      return null
    }
  }

  // Get all media entries for a user
  static async getUserEntries(userId: string): Promise<MediaEntry[]> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase not configured. Returning empty array.')
        return []
      }

      const { data, error } = await supabase
        .from('media_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date_completed', { ascending: false })

      if (error) {
        console.error('Error fetching media entries:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching media entries:', error)
      return []
    }
  }

  // Get a single media entry by ID
  static async getEntry(entryId: string): Promise<MediaEntry | null> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase not configured. Returning null.')
        return null
      }

      const { data, error } = await supabase
        .from('media_entries')
        .select('*')
        .eq('id', entryId)
        .single()

      if (error) {
        console.error('Error fetching media entry:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching media entry:', error)
      return null
    }
  }

  // Get a single media entry by ID (alias for getEntry)
  static async getEntryById(entryId: string): Promise<MediaEntry | null> {
    return this.getEntry(entryId)
  }

  // Update a media entry
  static async updateEntry(entryId: string, entryData: Partial<MediaEntryFormData>): Promise<MediaEntry | null> {
    try {
      const { data, error } = await supabase
        .from('media_entries')
        .update(entryData)
        .eq('id', entryId)
        .select()
        .single()

      if (error) {
        console.error('Error updating media entry:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating media entry:', error)
      return null
    }
  }

  // Delete a media entry
  static async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('media_entries')
        .delete()
        .eq('id', entryId)

      if (error) {
        console.error('Error deleting media entry:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting media entry:', error)
      return false
    }
  }

  // Get entries by media type
  static async getEntriesByType(userId: string, mediaType: string): Promise<MediaEntry[]> {
    try {
      const { data, error } = await supabase
        .from('media_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('media_type', mediaType)
        .order('date_completed', { ascending: false })

      if (error) {
        console.error('Error fetching media entries by type:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching media entries by type:', error)
      return []
    }
  }
} 