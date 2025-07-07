-- Add status column to media_entries table
-- Run this in your Supabase SQL editor

-- Add status column
ALTER TABLE media_entries 
ADD COLUMN status TEXT DEFAULT 'consumed';

-- Add constraint for valid status values
ALTER TABLE media_entries 
ADD CONSTRAINT status_check CHECK (status IN ('on_list', 'consuming', 'consumed'));

-- Update existing entries
-- Set status to 'consumed' for entries that have a date_completed
UPDATE media_entries 
SET status = 'consumed' 
WHERE date_completed IS NOT NULL;

-- Set status to 'on_list' for entries without a date_completed
UPDATE media_entries 
SET status = 'on_list' 
WHERE date_completed IS NULL;

-- Make status column NOT NULL
ALTER TABLE media_entries 
ALTER COLUMN status SET NOT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_entries' 
AND column_name = 'status'; 