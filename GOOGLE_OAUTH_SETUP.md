# Google OAuth Setup for Blurbit

This guide will help you set up Google OAuth authentication for your Blurbit app.

## Step 1: Create a Google OAuth Application

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add your authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
8. Note down your **Client ID** and **Client Secret**

## Step 2: Configure Supabase Authentication

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" → "Providers"
4. Find "Google" in the list and click "Edit"
5. Enable Google authentication by toggling the switch
6. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
7. Save the configuration

## Step 3: Update Environment Variables

Add the following to your `.env.local` file:

```env
# Google OAuth (optional - for additional Google services)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/auth/callback`
   - Check for trailing slashes or typos

2. **"OAuth provider not configured" error**
   - Verify that Google OAuth is enabled in your Supabase project
   - Check that the Client ID and Client Secret are correct

3. **"Redirect URI mismatch" error**
   - Ensure the redirect URI in Supabase matches your Google OAuth configuration
   - For production, update both Google and Supabase with your production domain

### Production Deployment:

When deploying to production:

1. Update the redirect URI in Google Cloud Console to your production domain
2. Update the redirect URI in Supabase Authentication settings
3. Update your environment variables with production values
4. Ensure your domain is verified in Google Cloud Console

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## Additional Features

With Google OAuth, users will automatically get:
- Profile picture from their Google account
- Email address
- Full name (if they grant permission)
- No need to remember another password

The app will automatically populate user information from their Google profile when they sign in for the first time. 