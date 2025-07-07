"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Loader2, BookOpen, Film, Headphones, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaCard } from "@/components/media-card"
import { FriendFeed } from "@/components/friend-feed"
import { MediaService } from "@/lib/media-service"
import { MediaEntry } from "@/lib/supabase"
import { useUser } from "@/lib/user-context"

export default function Home() {
  const { user, loading: authLoading } = useUser()
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user) {
      loadEntries()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const loadEntries = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const userEntries = await MediaService.getUserEntries(user.id)
      setEntries(userEntries)
    } catch (error) {
      console.error("Error loading entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredEntries = (type: string) => {
    if (type === "all") return entries
    return entries.filter(entry => entry.media_type === type)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2 text-amber-700">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Welcome to Blurbit</h1>
            <p className="text-xl text-amber-600 mb-8">
              Track and discover your favorite books, movies, podcasts, and articles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
              <BookOpen className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-800 mb-2">Books</h3>
              <p className="text-sm text-amber-600">Track your reading journey</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
              <Film className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-800 mb-2">Movies</h3>
              <p className="text-sm text-amber-600">Rate and review films</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
              <Headphones className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-800 mb-2">Podcasts</h3>
              <p className="text-sm text-amber-600">Discover great episodes</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
              <FileText className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-800 mb-2">Articles</h3>
              <p className="text-sm text-amber-600">Save interesting reads</p>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/auth">
              <Button className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <p className="text-amber-600">
              Sign up to start tracking your media and discover new favorites
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-800">My Media</h1>
        <Link href="/add">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-amber-50 text-amber-800">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="book" className="flex-1">
                Books
              </TabsTrigger>
              <TabsTrigger value="movie" className="flex-1">
                Movies
              </TabsTrigger>
              <TabsTrigger value="podcast" className="flex-1">
                Podcasts
              </TabsTrigger>
              <TabsTrigger value="article" className="flex-1">
                Articles
              </TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="mt-6 flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <span className="ml-2 text-amber-700">Loading your media...</span>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredEntries("all").length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-amber-600">
                        <p>No media entries yet. Add your first entry!</p>
                      </div>
                    ) : (
                      getFilteredEntries("all").map((entry) => (
                        <MediaCard
                          key={entry.id}
                          id={entry.id || ''}
                          title={entry.title}
                          type={entry.media_type.charAt(0).toUpperCase() + entry.media_type.slice(1)}
                          coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                          dateCompleted={formatDate(entry.date_completed)}
                          rating={entry.rating}
                          review={entry.notes || ""}
                          status={entry.status}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="book" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredEntries("book").length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-amber-600">
                        <p>No books yet. Add your first book!</p>
                      </div>
                    ) : (
                      getFilteredEntries("book").map((entry) => (
                        <MediaCard
                          key={entry.id}
                          id={entry.id || ''}
                          title={entry.title}
                          type="Book"
                          coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                          dateCompleted={formatDate(entry.date_completed)}
                          rating={entry.rating}
                          review={entry.notes || ""}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="movie" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredEntries("movie").length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-amber-600">
                        <p>No movies yet. Add your first movie!</p>
                      </div>
                    ) : (
                      getFilteredEntries("movie").map((entry) => (
                        <MediaCard
                          key={entry.id}
                          id={entry.id || ''}
                          title={entry.title}
                          type="Movie"
                          coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                          dateCompleted={formatDate(entry.date_completed)}
                          rating={entry.rating}
                          review={entry.notes || ""}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="podcast" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredEntries("podcast").length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-amber-600">
                        <p>No podcasts yet. Add your first podcast!</p>
                      </div>
                    ) : (
                      getFilteredEntries("podcast").map((entry) => (
                        <MediaCard
                          key={entry.id}
                          id={entry.id || ''}
                          title={entry.title}
                          type="Podcast"
                          coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                          dateCompleted={formatDate(entry.date_completed)}
                          rating={entry.rating}
                          review={entry.notes || ""}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="article" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredEntries("article").length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-amber-600">
                        <p>No articles yet. Add your first article!</p>
                      </div>
                    ) : (
                      getFilteredEntries("article").map((entry) => (
                        <MediaCard
                          key={entry.id}
                          id={entry.id || ''}
                          title={entry.title}
                          type="Article"
                          coverImage={entry.cover_image_url || "/placeholder.svg?height=200&width=150"}
                          dateCompleted={formatDate(entry.date_completed)}
                          rating={entry.rating}
                          review={entry.notes || ""}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-amber-800 mb-4">Friend Activity</h2>
          <FriendFeed />
        </div>
      </div>
    </div>
  )
}
