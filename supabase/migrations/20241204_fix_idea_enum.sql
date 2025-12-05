-- Fix: Add 'idea' to the ENUM type first
ALTER TYPE post_status ADD VALUE IF NOT EXISTS 'idea';

-- Then update the check constraint to ensure it allows 'idea'
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;

ALTER TABLE posts ADD CONSTRAINT posts_status_check 
CHECK (status IN ('idea', 'draft', 'review_requested', 'pending_approval', 'changes_requested', 'scheduled', 'published', 'archived'));
