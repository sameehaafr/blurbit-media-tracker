-- Make rating column nullable
-- Run this in your Supabase SQL editor

-- Change rating column to allow NULL values
ALTER TABLE media_entries 
ALTER COLUMN rating DROP NOT NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_entries' 
AND column_name = 'rating'; 