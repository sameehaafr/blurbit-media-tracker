# API Setup Guide for Media Search

This guide will help you set up the API integrations for automatic media information fetching.

## 🎯 What's Available

### ✅ **Books - Google Books API (FREE)**
- **No API key required** for basic usage
- Searches millions of books
- Provides cover images, authors, descriptions
- **Ready to use immediately!**

### 🎬 **Movies - OMDB API (FREE tier available)**
- Requires API key (free tier: 1,000 requests/day)
- Searches movies and TV shows
- Provides posters, directors, plot summaries
- **Easy to set up**

### 🎧 **Podcasts - Spotify API (FREE)**
- Requires Spotify Developer account
- Searches podcasts and shows
- Provides cover images, descriptions
- **More complex setup**

## 🚀 Quick Start (Books Only)

If you just want to test with books, **no setup required!** Books will work immediately.

## 📽️ Setting Up Movie Search (OMDB API)

1. **Get a free API key:**
   - Go to [OMDB API](http://www.omdbapi.com/apikey.aspx)
   - Enter your email address
   - Check your email for the API key

2. **Add to your `.env.local`:**
   ```
   NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
   ```

3. **Test it:**
   - Restart your dev server
   - Try searching for a movie in the add form

## 🎧 Setting Up Podcast Search (Spotify API)

1. **Create a Spotify Developer account:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account
   - Create a new app

2. **Get your credentials:**
   - Copy the Client ID
   - Click "Show Client Secret" and copy it

3. **Add to your `.env.local`:**
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Test it:**
   - Restart your dev server
   - Try searching for a podcast

## 🔧 How It Works

### Search Flow:
1. User selects media type (book/movie/podcast)
2. User searches for title
3. App fetches results from appropriate API
4. User selects from results
5. Form auto-fills with media information

### APIs Used:
- **Books:** Google Books API (no key needed)
- **Movies:** OMDB API (IMDB data)
- **Podcasts:** Spotify Web API

## 🎯 Features

### ✅ **Automatic Form Filling**
- Title, cover image, and description auto-populate
- Media type automatically set based on selection
- User can still edit any field

### ✅ **Rich Media Information**
- Cover images and posters
- Author/director information
- Descriptions and plot summaries
- Publication/release dates

### ✅ **Fallback Support**
- If APIs are unavailable, manual entry still works
- Graceful error handling
- Clear user feedback

## 🧪 Testing

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test each media type:**
   - **Books:** Search for "Harry Potter" or "1984"
   - **Movies:** Search for "Inception" or "The Matrix"
   - **Podcasts:** Search for "Serial" or "This American Life"

3. **Check the debug info** (bottom-right corner) to see API status

## 🔒 Security Notes

- API keys are stored in environment variables
- Client-side keys are prefixed with `NEXT_PUBLIC_`
- Server-side keys (like Spotify secret) are kept private
- All API calls include proper error handling

## 🆘 Troubleshooting

### Books not working:
- Check internet connection
- Google Books API is usually very reliable

### Movies not working:
- Verify OMDB API key is correct
- Check if you've exceeded the free tier limit
- Try the demo key: `demo`

### Podcasts not working:
- Verify Spotify credentials
- Check if the app is properly configured
- Ensure client secret is not exposed in client-side code

## 🎉 Ready to Use!

Once you've set up the APIs you want to use, the media search will work seamlessly with your existing Supabase setup. Users can now search and select media instead of manually typing everything! 