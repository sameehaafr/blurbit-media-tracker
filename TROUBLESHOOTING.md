# Troubleshooting Database Issues

## Current Error: "Could not find the 'status' column"

This error occurs because the database schema doesn't match the code. Here's how to fix it:

## Step 1: Check Current Table Structure

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **"SQL Editor"**
4. Run the `check-table-structure.sql` script to see what columns currently exist

## Step 2: Add Missing Columns

If the `status` column doesn't exist, run the `add-status-column.sql` script.

## Step 3: Update Rating Column (if needed)

If you want decimal ratings, also run the `fix-rating-column.sql` script.

## Step 4: Complete Migration

For a full update, run the `complete-migration.sql` script.

## Alternative: Quick Fix

If you want to test the app immediately without the status feature:

1. The MediaService has been temporarily modified to skip the status field
2. You can add entries without the status feature for now
3. Later, run the migration and uncomment the status line in MediaService

## Step-by-Step Instructions

### Option A: Add Status Column Now
1. Run `add-status-column.sql` in Supabase SQL Editor
2. Restart your development server: `npm run dev`
3. Try adding an entry again

### Option B: Test Without Status
1. The code is already modified to work without status
2. Restart your development server: `npm run dev`
3. Try adding an entry (it will work but without status)
4. Later, run the migration and update the code

## Verification

After running migrations, verify with:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_entries' 
ORDER BY column_name;
```

You should see:
- `status` column (TEXT, NOT NULL)
- `rating` column (DECIMAL or INTEGER)
- `date_completed` column (nullable)

## Common Issues

1. **"Column already exists"** - Skip that migration step
2. **"Table doesn't exist"** - Check if you're in the right project
3. **"Permission denied"** - Make sure you're using the SQL Editor, not the Table Editor

## Need Help?

If you're still having issues:
1. Check the Supabase logs in the dashboard
2. Verify your project URL and keys are correct
3. Try running the migrations one by one
4. Contact support if needed 