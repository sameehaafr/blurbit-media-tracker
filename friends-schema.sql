-- Friends functionality schema
-- Run this in your Supabase SQL editor

-- Friend requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- Friends table (for accepted friendships)
CREATE TABLE IF NOT EXISTS friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Enable RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friend_requests
CREATE POLICY "Users can view friend requests they sent or received" ON friend_requests
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create friend requests" ON friend_requests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update friend requests they received" ON friend_requests
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their own friend requests" ON friend_requests
  FOR DELETE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- RLS Policies for friends
CREATE POLICY "Users can view their friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend relationships" ON friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their friend relationships" ON friends
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Function to handle friend request acceptance
CREATE OR REPLACE FUNCTION accept_friend_request(request_id UUID)
RETURNS void AS $$
BEGIN
  -- Update the friend request status
  UPDATE friend_requests 
  SET status = 'accepted', updated_at = NOW()
  WHERE id = request_id AND receiver_id = auth.uid() AND status = 'pending';
  
  -- If the request was updated, create the friend relationship
  IF FOUND THEN
    INSERT INTO friends (user_id, friend_id)
    SELECT sender_id, receiver_id FROM friend_requests WHERE id = request_id
    ON CONFLICT (user_id, friend_id) DO NOTHING;
    
    -- Also create the reverse relationship
    INSERT INTO friends (user_id, friend_id)
    SELECT receiver_id, sender_id FROM friend_requests WHERE id = request_id
    ON CONFLICT (user_id, friend_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's friends
CREATE OR REPLACE FUNCTION get_user_friends(user_uuid UUID)
RETURNS TABLE (
  friend_id UUID,
  friend_email TEXT,
  friend_name TEXT,
  friend_avatar TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.friend_id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as name,
    u.raw_user_meta_data->>'avatar_url' as avatar
  FROM friends f
  JOIN auth.users u ON f.friend_id = u.id
  WHERE f.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get friend requests for a user
CREATE OR REPLACE FUNCTION get_friend_requests(user_uuid UUID)
RETURNS TABLE (
  request_id UUID,
  sender_id UUID,
  sender_email TEXT,
  sender_name TEXT,
  sender_avatar TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fr.id,
    fr.sender_id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as name,
    u.raw_user_meta_data->>'avatar_url' as avatar,
    fr.status,
    fr.created_at
  FROM friend_requests fr
  JOIN auth.users u ON fr.sender_id = u.id
  WHERE fr.receiver_id = user_uuid AND fr.status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 