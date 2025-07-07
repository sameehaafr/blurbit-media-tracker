-- Updated Friends functionality schema
-- Run this in your Supabase SQL editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS friends CASCADE;
DROP TABLE IF EXISTS friend_requests CASCADE;

-- Friend requests table (simplified)
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_email TEXT NOT NULL,
  sender_email TEXT,
  sender_name TEXT,
  sender_avatar TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  FOR SELECT USING (auth.uid() = sender_id OR receiver_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create friend requests" ON friend_requests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update friend requests they received" ON friend_requests
  FOR UPDATE USING (receiver_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own friend requests" ON friend_requests
  FOR DELETE USING (auth.uid() = sender_id OR receiver_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for friends
CREATE POLICY "Users can view their friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend relationships" ON friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their friend relationships" ON friends
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id); 