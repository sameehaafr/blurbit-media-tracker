-- Fix rating column to support decimal values
-- Run this in your Supabase SQL editor

-- Change rating column from INTEGER to DECIMAL(3,1) to support values like 4.7, 3.6, etc.
ALTER TABLE media_entries 
ALTER COLUMN rating TYPE DECIMAL(3,1);

-- Add constraint to ensure rating is between 0 and 5
ALTER TABLE media_entries 
ADD CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5);

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_entries' 
AND column_name = 'rating'; 