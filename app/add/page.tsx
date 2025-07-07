"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarRating } from "@/components/star-rating"
import { MediaSearch } from "@/components/media-search"
import { MediaService } from "@/lib/media-service"
import { MediaType, MediaStatus } from "@/lib/supabase"
import { BookSearchResult, MovieSearchResult, PodcastSearchResult } from "@/lib/api-services"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"

export default function AddEntryPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<BookSearchResult | MovieSearchResult | PodcastSearchResult | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    media_type: "" as MediaType,
    status: "on_list" as MediaStatus,
    date_completed: "",
    rating: 0,
    notes: "",
    cover_image_url: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.media_type || formData.rating === 0) {
      alert("Please fill in all required fields")
      return
    }

    // Only require date_completed if status is 'consumed'
    if (formData.status === 'consumed' && !formData.date_completed) {
      alert("Please enter the date completed for consumed media")
      return
    }

    setIsSubmitting(true)

    try {
      if (!user) {
        alert("Please sign in to add media entries")
        return
      }
      
      const result = await MediaService.createEntry(user.id, {
        title: formData.title,
        media_type: formData.media_type,
        status: formData.status,
        date_completed: formData.date_completed || undefined,
        rating: formData.rating,
        notes: formData.notes || undefined,
        cover_image_url: formData.cover_image_url || undefined,
      })

      if (result) {
        alert("Entry saved successfully!")
        router.push("/")
      } else {
        alert("Failed to save entry. Please try again.")
      }
    } catch (error) {
      console.error("Error saving entry:", error)
      alert("An error occurred while saving the entry.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMediaSelect = (item: BookSearchResult | MovieSearchResult | PodcastSearchResult) => {
    setSelectedMedia(item)
    
    // Auto-fill form data based on selected media
    let mediaType: MediaType = 'book'
    if ('year' in item) mediaType = 'movie'
    if ('spotify_id' in item) mediaType = 'podcast'
    
    setFormData(prev => ({
      ...prev,
      title: item.title,
      media_type: mediaType,
      cover_image_url: 'cover_image_url' in item ? item.cover_image_url || '' : 
                       'poster_url' in item ? item.poster_url || '' : ''
    }))
  }

  const handleMediaClear = () => {
    setSelectedMedia(null)
    setFormData(prev => ({
      ...prev,
      title: "",
      cover_image_url: ""
    }))
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-amber-700 mb-6 hover:text-amber-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Media
      </Link>

      <Card className="max-w-2xl mx-auto bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-amber-800">Add New Entry</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Search & Select Media</Label>
              <MediaSearch 
                mediaType={formData.media_type || 'book'}
                onSelect={handleMediaSelect}
                onClear={handleMediaClear}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Media Type *</Label>
              <Select 
                value={formData.media_type} 
                onValueChange={(value) => handleInputChange("media_type", value as MediaType)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange("status", value as MediaStatus)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_list">On the list (haven't consumed yet)</SelectItem>
                  <SelectItem value="consuming">Currently consuming</SelectItem>
                  <SelectItem value="consumed">Finished/consumed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="Enter title" 
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input 
                id="cover" 
                placeholder="Enter image URL" 
                value={formData.cover_image_url}
                onChange={(e) => handleInputChange("cover_image_url", e.target.value)}
              />
            </div>

            {formData.status === 'consumed' && (
              <div className="space-y-2">
                <Label htmlFor="date">Date Completed *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date_completed}
                  onChange={(e) => handleInputChange("date_completed", e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Your Rating *</Label>
              <StarRating 
                value={formData.rating}
                onChange={(rating) => handleInputChange("rating", rating)}
                allowDecimal={true}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Review/Notes</Label>
              <Textarea 
                id="review" 
                placeholder="Share your thoughts..." 
                className="min-h-[100px]"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Entry"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
