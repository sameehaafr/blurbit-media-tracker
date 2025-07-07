import { supabase, isSupabaseConfigured } from './supabase'

export interface Friend {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface FriendRequest {
  id: string
  sender_id: string
  sender_email: string
  sender_name: string
  sender_avatar?: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export interface FriendActivity {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  action: 'rated' | 'reviewed' | 'saved' | 'completed'
  media_title: string
  media_type: string
  rating?: number
  review?: string
  created_at: string
}

export class FriendService {
  // Send a friend request
  static async sendFriendRequest(receiverEmail: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase not configured')
        return false
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // For now, we'll create a simple friend request without user validation
      // In a real app, you'd want to validate the email exists
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_email: receiverEmail, // Store email directly for now
          status: 'pending'
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('Friend request already sent')
        }
        throw error
      }

      return true
    } catch (error) {
      console.error('Error sending friend request:', error)
      throw error
    }
  }

  // Get pending friend requests for current user
  static async getFriendRequests(): Promise<FriendRequest[]> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return []
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return []
      }

      const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_email', user.email)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching friend requests:', error)
        return []
      }

      return (data || []).map((request: any) => ({
        id: request.id,
        sender_id: request.sender_id,
        sender_email: request.sender_email || 'Unknown',
        sender_name: request.sender_name || 'Unknown User',
        sender_avatar: request.sender_avatar,
        status: request.status,
        created_at: request.created_at
      }))
    } catch (error) {
      console.error('Error fetching friend requests:', error)
      return []
    }
  }

  // Accept a friend request
  static async acceptFriendRequest(requestId: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return false
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return false
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .eq('receiver_email', user.email)

      if (updateError) {
        console.error('Error accepting friend request:', updateError)
        return false
      }

      // Get the request details to create friendship
      const { data: requestData } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (requestData) {
        // Create friend relationship
        const { error: friendError } = await supabase
          .from('friends')
          .insert({
            user_id: user.id,
            friend_id: requestData.sender_id
          })

        if (friendError) {
          console.error('Error creating friendship:', friendError)
        }
      }

      return true
    } catch (error) {
      console.error('Error accepting friend request:', error)
      return false
    }
  }

  // Reject a friend request
  static async rejectFriendRequest(requestId: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return false
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return false
      }

      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)
        .eq('receiver_email', user.email)

      if (error) {
        console.error('Error rejecting friend request:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error rejecting friend request:', error)
      return false
    }
  }

  // Get user's friends
  static async getFriends(): Promise<Friend[]> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return []
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return []
      }

      const { data, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching friends:', error)
        return []
      }

      // For now, return mock friend data since we can't query auth.users
      // In a real app, you'd want to store friend details in a separate table
      return (data || []).map((friend: any) => ({
        id: friend.friend_id,
        email: 'friend@example.com', // Mock data
        name: 'Friend User', // Mock data
        avatar: undefined
      }))
    } catch (error) {
      console.error('Error fetching friends:', error)
      return []
    }
  }

  // Remove a friend
  static async removeFriend(friendId: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return false
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return false
      }

      // Remove both directions of the friendship
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)

      if (error) {
        console.error('Error removing friend:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error removing friend:', error)
      return false
    }
  }

  // Get friend activity (recent media entries from friends)
  static async getFriendActivity(): Promise<FriendActivity[]> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return []
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return []
      }

      // Get friends' IDs first
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id)

      if (friendsError || !friendsData || friendsData.length === 0) {
        return []
      }

      const friendIds = friendsData.map((f: any) => f.friend_id)

      // Get friends' recent media entries
      const { data, error } = await supabase
        .from('media_entries')
        .select('*')
        .in('user_id', friendIds)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching friend activity:', error)
        return []
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        user_id: entry.user_id,
        user_name: 'Friend User', // Mock data for now
        user_avatar: undefined,
        action: entry.status === 'consumed' ? 'completed' : 
                entry.rating > 0 ? 'rated' : 
                entry.notes ? 'reviewed' : 'saved',
        media_title: entry.title,
        media_type: entry.media_type,
        rating: entry.rating,
        review: entry.notes,
        created_at: entry.created_at
      }))
    } catch (error) {
      console.error('Error fetching friend activity:', error)
      return []
    }
  }

  // Search for users by email (simplified version)
  static async searchUsers(email: string): Promise<Friend[]> {
    // For now, return empty array since we can't query auth.users from client
    // In a real app, you'd need a backend API endpoint for this
    return []
  }
} 