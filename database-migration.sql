-- Migration to add status column to media_entries table
-- Run this in your Supabase SQL editor

-- Add status column with default value
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

-- Make date_completed optional (it already is, but making it explicit)
ALTER TABLE media_entries 
ALTER COLUMN date_completed DROP NOT NULL; 