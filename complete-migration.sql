-- Complete migration for Blurbit app updates
-- Run this in your Supabase SQL editor

-- Step 1: Add status column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'media_entries' AND column_name = 'status') THEN
        ALTER TABLE media_entries 
        ADD COLUMN status TEXT DEFAULT 'consumed' CHECK (status IN ('on_list', 'consuming', 'consumed'));
        
        -- Update existing entries to have 'consumed' status since they have date_completed
        UPDATE media_entries 
        SET status = 'consumed' 
        WHERE date_completed IS NOT NULL AND date_completed != '';
        
        -- Update entries without date_completed to have 'on_list' status
        UPDATE media_entries 
        SET status = 'on_list' 
        WHERE date_completed IS NULL OR date_completed = '';
        
        -- Make status column NOT NULL after setting default values
        ALTER TABLE media_entries 
        ALTER COLUMN status SET NOT NULL;
    END IF;
END $$;

-- Step 2: Update rating column to support decimals
-- First, check if rating column is already decimal
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'media_entries' 
               AND column_name = 'rating' 
               AND data_type = 'integer') THEN
        
        -- Change rating column from INTEGER to DECIMAL(3,1)
        ALTER TABLE media_entries 
        ALTER COLUMN rating TYPE DECIMAL(3,1);
        
        -- Add constraint to ensure rating is between 0 and 5
        ALTER TABLE media_entries 
        ADD CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5);
        
        -- Update existing integer ratings to decimal format
        UPDATE media_entries 
        SET rating = rating::DECIMAL(3,1) 
        WHERE rating IS NOT NULL;
    END IF;
END $$;

-- Step 3: Make date_completed optional
ALTER TABLE media_entries 
ALTER COLUMN date_completed DROP NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_entries' 
AND column_name IN ('rating', 'status', 'date_completed')
ORDER BY column_name; 