"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BookOpen, Film, Headphones, Loader2 } from "lucide-react"
import { MediaSearchService, BookSearchResult, MovieSearchResult, PodcastSearchResult } from "@/lib/api-services"

interface MediaSearchProps {
  mediaType: 'book' | 'movie' | 'podcast' | 'article'
  onSelect: (item: BookSearchResult | MovieSearchResult | PodcastSearchResult) => void
  onClear: () => void
}

export function MediaSearch({ mediaType, onSelect, onClear }: MediaSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<(BookSearchResult | MovieSearchResult | PodcastSearchResult)[]>([])
  const [selectedItem, setSelectedItem] = useState<BookSearchResult | MovieSearchResult | PodcastSearchResult | null>(null)

  const searchMedia = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      // For articles, we don't have an API, so skip search
      if (mediaType === 'article') {
        setResults([])
        return
      }

      const searchResults = await MediaSearchService.searchMedia(query, mediaType as 'book' | 'movie' | 'podcast')
      
      let items: (BookSearchResult | MovieSearchResult | PodcastSearchResult)[] = []
      if (mediaType === 'book') {
        items = searchResults.books || []
      } else if (mediaType === 'movie') {
        items = searchResults.movies || []
      } else if (mediaType === 'podcast') {
        items = searchResults.podcasts || []
      }
      
      setResults(items)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (item: BookSearchResult | MovieSearchResult | PodcastSearchResult) => {
    setSelectedItem(item)
    onSelect(item)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setSelectedItem(null)
    onClear()
  }

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'book':
        return <BookOpen className="h-4 w-4" />
      case 'movie':
        return <Film className="h-4 w-4" />
      case 'podcast':
        return <Headphones className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getMediaTypeLabel = () => {
    switch (mediaType) {
      case 'book':
        return 'Books'
      case 'movie':
        return 'Movies'
      case 'podcast':
        return 'Podcasts'
      case 'article':
        return 'Articles'
      default:
        return 'Media'
    }
  }

  const getItemDetails = (item: BookSearchResult | MovieSearchResult | PodcastSearchResult) => {
    switch (mediaType) {
      case 'book':
        const book = item as BookSearchResult
        return {
          title: book.title,
          subtitle: book.author,
          image: book.cover_image_url,
          description: book.description
        }
      case 'movie':
        const movie = item as MovieSearchResult
        return {
          title: movie.title,
          subtitle: movie.year,
          image: movie.poster_url,
          description: movie.description
        }
      case 'podcast':
        const podcast = item as PodcastSearchResult
        return {
          title: podcast.title,
          subtitle: podcast.author,
          image: podcast.cover_image_url,
          description: podcast.description
        }
      default:
        return { title: '', subtitle: '', image: '', description: '' }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Search ${getMediaTypeLabel()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchMedia()}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={searchMedia} 
          disabled={isSearching || !query.trim()}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            getMediaIcon()
          )}
        </Button>
        {selectedItem && (
          <Button 
            onClick={handleClear} 
            variant="outline"
            className="text-gray-600"
          >
            Clear
          </Button>
        )}
      </div>

      {selectedItem && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getItemDetails(selectedItem).image && (
                <img 
                  src={getItemDetails(selectedItem).image} 
                  alt={getItemDetails(selectedItem).title}
                  className="w-16 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">
                  {getItemDetails(selectedItem).title}
                </h3>
                {getItemDetails(selectedItem).subtitle && (
                  <p className="text-sm text-amber-700">
                    {getItemDetails(selectedItem).subtitle}
                  </p>
                )}
                {getItemDetails(selectedItem).description && (
                  <p className="text-xs text-amber-600 mt-1 line-clamp-2">
                    {getItemDetails(selectedItem).description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && !selectedItem && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {results.map((item) => {
            const details = getItemDetails(item)
            return (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:bg-amber-50 transition-colors"
                onClick={() => handleSelect(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {details.image && (
                      <img 
                        src={details.image} 
                        alt={details.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-amber-900 truncate">
                        {details.title}
                      </h4>
                      {details.subtitle && (
                        <p className="text-xs text-amber-700 truncate">
                          {details.subtitle}
                        </p>
                      )}
                      {details.description && (
                        <p className="text-xs text-amber-600 mt-1 line-clamp-2">
                          {details.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {results.length === 0 && query && !isSearching && (
        <p className="text-center text-gray-500 text-sm py-4">
          No {getMediaTypeLabel().toLowerCase()} found. Try a different search term.
        </p>
      )}
    </div>
  )
} 