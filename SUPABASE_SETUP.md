# Supabase Setup Guide

This guide will help you set up Supabase for the Media Tracker application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be ready

## 2. Set Up Environment Variables

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key

3. Update `.env.local` with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 3. Set Up the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script

This will create:
- `media_entries` table with all required fields
- Proper indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

## 4. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/add` to test the form
3. Fill out the form and submit
4. Check your Supabase dashboard to see the entry in the `media_entries` table

## 5. Authentication Setup (Optional)

The current implementation uses a placeholder user ID. To implement proper authentication:

1. Set up Supabase Auth in your project
2. Replace the placeholder user ID in `app/add/page.tsx` with the actual authenticated user ID
3. Implement login/logout functionality

## Database Schema

The `media_entries` table includes:

- `id`: UUID primary key
- `user_id`: UUID foreign key to auth.users
- `title`: Text (required)
- `media_type`: Enum ('book', 'movie', 'podcast', 'article')
- `date_completed`: Date (required)
- `rating`: Integer 1-5 (required)
- `notes`: Text (optional)
- `cover_image_url`: Text (optional)
- `created_at`: Timestamp (auto-generated)
- `updated_at`: Timestamp (auto-updated)

## Security Features

- Row Level Security (RLS) enabled
- Users can only access their own entries
- Proper validation constraints
- Automatic timestamp management 