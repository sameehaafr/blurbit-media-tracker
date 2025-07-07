-- Check current table structure
-- Run this in your Supabase SQL editor to see the current state

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'media_entries'
ORDER BY ordinal_position;

-- Also check if there are any constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'media_entries';

-- Also check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'media_entries'
) as table_exists; 