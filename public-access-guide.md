# Making Blurbit Publicly Accessible

## Option 1: Deploy to Vercel (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add friend functionality"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add your environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
   - Deploy!

3. **Share the URL:**
   - Your app will be available at `https://your-app-name.vercel.app`
   - Share this URL with friends
   - They can sign up and accept your friend requests

## Option 2: Local Network Access (Development)

If you want to test locally with friends on the same network:

1. **Find your local IP:**
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows
   ipconfig
   ```

2. **Start the dev server with host:**
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

3. **Share your local IP:**
   - Friends on the same network can access: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

## Option 3: Temporary Public Access with ngrok

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your dev server:**
   ```bash
   npm run dev
   ```

3. **Create tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Share the ngrok URL:**
   - ngrok will give you a public URL like `https://abc123.ngrok.io`
   - Share this with friends
   - They can access your app from anywhere

## Environment Variables for Public Access

Make sure your Supabase project allows public sign-ups:

1. **Go to Supabase Dashboard → Authentication → Settings**
2. **Enable "Enable email confirmations" (optional)**
3. **Enable "Enable sign ups"**
4. **Add your domain to "Site URL"**

## Security Considerations

- **Rate limiting:** Consider adding rate limiting for sign-ups
- **Email verification:** Enable email verification for new accounts
- **Moderation:** Monitor for spam accounts
- **Backup:** Regular database backups

## Next Steps

1. Choose one of the deployment options above
2. Share the URL with friends
3. They can sign up and accept your friend requests
4. Test the full friend functionality! 