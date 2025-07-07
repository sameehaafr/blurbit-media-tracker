/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'books.google.com',
      'm.media-amazon.com',
      'ia.media-imdb.com',
      'image.tmdb.org',
      'i.scdn.co',
      'wrapped-images.spotifycdn.com'
    ],
  },
};

module.exports = nextConfig; 