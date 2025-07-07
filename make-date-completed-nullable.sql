-- Make date_completed column nullable
-- Run this in your Supabase SQL editor

-- Change date_completed column to allow NULL values
ALTER TABLE media_entries 
ALTER COLUMN date_completed DROP NOT NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_entries' 
AND column_name = 'date_completed'; 