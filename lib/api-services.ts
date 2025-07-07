import axios from 'axios'

// Types for API responses
export interface BookSearchResult {
  id: string
  title: string
  author: string
  cover_image_url?: string
  published_date?: string
  description?: string
  isbn?: string
}

export interface MovieSearchResult {
  id: string
  title: string
  year?: string
  poster_url?: string
  director?: string
  description?: string
  imdb_id?: string
}

export interface PodcastSearchResult {
  id: string
  title: string
  author?: string
  cover_image_url?: string
  description?: string
  spotify_id?: string
}

export interface SearchResult {
  books?: BookSearchResult[]
  movies?: MovieSearchResult[]
  podcasts?: PodcastSearchResult[]
}

// Google Books API (Free, no API key required for basic usage)
export class BookService {
  private static baseUrl = 'https://www.googleapis.com/books/v1'

  static async searchBooks(query: string): Promise<BookSearchResult[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/volumes`, {
        params: {
          q: query,
          maxResults: 10,
          printType: 'books'
        }
      })

      return response.data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
        cover_image_url: item.volumeInfo.imageLinks?.thumbnail,
        published_date: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier
      })) || []
    } catch (error) {
      console.error('Error searching books:', error)
      return []
    }
  }

  static async getBookById(id: string): Promise<BookSearchResult | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/volumes/${id}`)
      const item = response.data

      return {
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
        cover_image_url: item.volumeInfo.imageLinks?.thumbnail,
        published_date: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier
      }
    } catch (error) {
      console.error('Error fetching book:', error)
      return null
    }
  }
}

// OMDB API for movies (requires API key, but has free tier)
export class MovieService {
  private static baseUrl = 'http://www.omdbapi.com'
  private static apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'demo' // demo key for testing

  static async searchMovies(query: string): Promise<MovieSearchResult[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/`, {
        params: {
          s: query,
          apikey: this.apiKey,
          type: 'movie'
        }
      })

      if (response.data.Response === 'False') {
        return []
      }

      return response.data.Search?.map((item: any) => ({
        id: item.imdbID,
        title: item.Title,
        year: item.Year,
        poster_url: item.Poster !== 'N/A' ? item.Poster : undefined,
        imdb_id: item.imdbID
      })) || []
    } catch (error) {
      console.error('Error searching movies:', error)
      return []
    }
  }

  static async getMovieById(id: string): Promise<MovieSearchResult | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/`, {
        params: {
          i: id,
          apikey: this.apiKey
        }
      })

      if (response.data.Response === 'False') {
        return null
      }

      return {
        id: response.data.imdbID,
        title: response.data.Title,
        year: response.data.Year,
        poster_url: response.data.Poster !== 'N/A' ? response.data.Poster : undefined,
        director: response.data.Director,
        description: response.data.Plot,
        imdb_id: response.data.imdbID
      }
    } catch (error) {
      console.error('Error fetching movie:', error)
      return null
    }
  }
}

// Spotify API for podcasts (requires API key)
export class PodcastService {
  private static baseUrl = 'https://api.spotify.com/v1'
  private static clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  private static clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  private static async getAccessToken(): Promise<string | null> {
    if (!this.clientId || !this.clientSecret) {
      console.warn('Spotify credentials not configured')
      return null
    }

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
          }
        }
      )
      return response.data.access_token
    } catch (error) {
      console.error('Error getting Spotify access token:', error)
      return null
    }
  }

  static async searchPodcasts(query: string): Promise<PodcastSearchResult[]> {
    try {
      const token = await this.getAccessToken()
      if (!token) {
        return []
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: query,
          type: 'show',
          limit: 10
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return response.data.shows?.items?.map((item: any) => ({
        id: item.id,
        title: item.name,
        author: item.publisher,
        cover_image_url: item.images?.[0]?.url,
        description: item.description,
        spotify_id: item.id
      })) || []
    } catch (error) {
      console.error('Error searching podcasts:', error)
      return []
    }
  }

  static async getPodcastById(id: string): Promise<PodcastSearchResult | null> {
    try {
      const token = await this.getAccessToken()
      if (!token) {
        return null
      }

      const response = await axios.get(`${this.baseUrl}/shows/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const item = response.data
      return {
        id: item.id,
        title: item.name,
        author: item.publisher,
        cover_image_url: item.images?.[0]?.url,
        description: item.description,
        spotify_id: item.id
      }
    } catch (error) {
      console.error('Error fetching podcast:', error)
      return null
    }
  }
}

// Main search service that routes to appropriate API
export class MediaSearchService {
  static async searchMedia(query: string, mediaType: 'book' | 'movie' | 'podcast'): Promise<SearchResult> {
    try {
      switch (mediaType) {
        case 'book':
          const books = await BookService.searchBooks(query)
          return { books }
        
        case 'movie':
          const movies = await MovieService.searchMovies(query)
          return { movies }
        
        case 'podcast':
          const podcasts = await PodcastService.searchPodcasts(query)
          return { podcasts }
        
        default:
          return {}
      }
    } catch (error) {
      console.error('Error searching media:', error)
      return {}
    }
  }

  static async getMediaById(id: string, mediaType: 'book' | 'movie' | 'podcast') {
    try {
      switch (mediaType) {
        case 'book':
          return await BookService.getBookById(id)
        
        case 'movie':
          return await MovieService.getMovieById(id)
        
        case 'podcast':
          return await PodcastService.getPodcastById(id)
        
        default:
          return null
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      return null
    }
  }
} 