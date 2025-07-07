'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaCard } from "@/components/media-card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/user-context"
import { supabase, MediaEntry } from "@/lib/supabase"
import { FriendRequest } from "@/components/friend-request"
import { FriendService, type Friend } from "@/lib/friend-service"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([])
  const [stats, setStats] = useState({
    total: 0,
    books: 0,
    movies: 0,
    podcasts: 0,
    articles: 0,
    avgRating: 0
  })
  const [friends, setFriends] = useState<Friend[]>([])
  const [activeTab, setActiveTab] = useState("top-rated")

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      fetchUserMedia()
      fetchFriends()
    }
  }, [user, loading, router])

  const fetchUserMedia = async () => {
    if (!user || !supabase) return

    try {
      const { data, error } = await supabase
        .from('media_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching media:', error)
        return
      }

      setMediaEntries(data || [])

      // Calculate stats
      const total = data?.length || 0
      const books = data?.filter((entry: MediaEntry) => entry.media_type === 'book').length || 0
      const movies = data?.filter((entry: MediaEntry) => entry.media_type === 'movie').length || 0
      const podcasts = data?.filter((entry: MediaEntry) => entry.media_type === 'podcast').length || 0
      const articles = data?.filter((entry: MediaEntry) => entry.media_type === 'article').length || 0
      
      const totalRating = data?.reduce((sum: number, entry: MediaEntry) => sum + entry.rating, 0) || 0
      const avgRating = total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0

      setStats({ total, books, movies, podcasts, articles, avgRating })
    } catch (error) {
      console.error('Error fetching user media:', error)
    }
  }

  const fetchFriends = async () => {
    if (!user) return

    try {
      const friendsList = await FriendService.getFriends()
      setFriends(friendsList)
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
      return
    }

    try {
      await FriendService.removeFriend(friendId)
      await fetchFriends()
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  const handleRequestsUpdate = () => {
    fetchFriends()
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  }

  const getUserUsername = () => {
    return user?.user_metadata?.username || `@${user?.email?.split('@')[0]}` || '@user'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  const topRated = mediaEntries
    .filter(entry => entry.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

  const recent = mediaEntries.slice(0, 6)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-amber-200">
              <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
              <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-amber-800">{getUserDisplayName()}</h1>
              <p className="text-amber-600 mb-2">{getUserUsername()}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  {stats.total} Entries
                </Badge>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  {stats.avgRating} Avg Rating
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-800">{stats.books}</div>
                <div className="text-xs text-amber-600">Books</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-800">{stats.movies}</div>
                <div className="text-xs text-amber-600">Movies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-800">{stats.podcasts}</div>
                <div className="text-xs text-amber-600">Podcasts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-800">{stats.articles}</div>
                <div className="text-xs text-amber-600">Articles</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-amber-50 text-amber-800 mb-6">
          <TabsTrigger value="top-rated" className="flex-1">
            Top Rated
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">
            Recent
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex-1">
            Friends ({friends.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-rated">
          {topRated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topRated.map((entry) => (
                <MediaCard
                  key={entry.id}
                  id={entry.id || ''}
                  title={entry.title}
                  type={entry.media_type}
                  coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                  dateCompleted={entry.date_completed || ""}
                  rating={entry.rating}
                  review={entry.notes || ""}
                  status={entry.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-amber-600">
              No rated media yet. Start adding and rating your media!
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {recent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map((entry) => (
                <MediaCard
                  key={entry.id}
                  id={entry.id || ''}
                  title={entry.title}
                  type={entry.media_type}
                  coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                  dateCompleted={entry.date_completed || ""}
                  rating={entry.rating}
                  review={entry.notes || ""}
                  status={entry.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-amber-600">
              No media entries yet. Start adding your media!
            </div>
          )}
        </TabsContent>

        <TabsContent value="friends">
          <div className="space-y-6">
            <FriendRequest onRequestsUpdate={handleRequestsUpdate} />
            
            <div className="border-t border-amber-200 pt-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Your Friends</h3>
              {friends.length === 0 ? (
                <div className="text-center py-8 text-amber-600">
                  <p>No friends yet.</p>
                  <p className="text-sm mt-1">Send friend requests to connect with others!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <Card key={friend.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>
                            {friend.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-amber-800">{friend.name}</p>
                          <p className="text-sm text-amber-600">{friend.email}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
