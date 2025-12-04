-- Add internal_notes column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS internal_notes TEXT;
