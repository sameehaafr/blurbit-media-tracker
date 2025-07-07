-- Create media_entries table
CREATE TABLE media_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed from UUID to TEXT for testing
  title TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('book', 'movie', 'podcast', 'article')),
  date_completed DATE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for better query performance
CREATE INDEX idx_media_entries_user_id ON media_entries(user_id);

-- Create index on media_type for filtering
CREATE INDEX idx_media_entries_media_type ON media_entries(media_type);

-- Create index on date_completed for sorting
CREATE INDEX idx_media_entries_date_completed ON media_entries(date_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE media_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for testing (temporary)
CREATE POLICY "Allow all operations for testing" ON media_entries
  FOR ALL USING (true) WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_media_entries_updated_at
  BEFORE UPDATE ON media_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 