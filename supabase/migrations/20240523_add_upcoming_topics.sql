-- Add upcoming_topics column to profiles table
ALTER TABLE profiles ADD COLUMN upcoming_topics JSONB DEFAULT '[]'::jsonb;
