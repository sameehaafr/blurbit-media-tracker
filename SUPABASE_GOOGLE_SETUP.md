# Quick Setup: Enable Google OAuth in Supabase

## Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your Blurbit project

## Step 2: Navigate to Authentication Settings
1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** in the submenu

## Step 3: Enable Google OAuth
1. Find **"Google"** in the list of providers
2. Click the **"Edit"** button next to Google
3. **Toggle the switch** to enable Google authentication
4. You'll see fields for Client ID and Client Secret

## Step 4: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
5. Choose **"Web application"**
6. Add these Authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

## Step 5: Configure in Supabase
1. Back in Supabase, paste your Google **Client ID**
2. Paste your Google **Client Secret**
3. Click **"Save"**

## Step 6: Test
1. Go to your app: `http://localhost:3000/auth`
2. Click **"Continue with Google"**
3. You should now be redirected to Google's login page

## Common Issues & Solutions

### "Unsupported provider: provider is not enabled"
- **Solution**: Make sure you've toggled the Google switch to ON in Supabase

### "Invalid redirect URI"
- **Solution**: Add `https://your-project-ref.supabase.co/auth/v1/callback` to Google Cloud Console

### "Client ID not found"
- **Solution**: Double-check that you copied the Client ID correctly

## Your Supabase Project URL
Your project URL should look like: `https://fvodwndzajrfsjbpgckk.supabase.co`

So your redirect URI would be: `https://fvodwndzajrfsjbpgckk.supabase.co/auth/v1/callback`

## Need Help?
If you're still having issues:
1. Check that Google OAuth is enabled in Supabase
2. Verify your Client ID and Secret are correct
3. Make sure both redirect URIs are added in Google Cloud Console
4. Try refreshing your browser and testing again 