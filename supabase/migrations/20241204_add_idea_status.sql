-- Add 'idea' to the allowed status values for posts
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;

ALTER TABLE posts ADD CONSTRAINT posts_status_check 
CHECK (status IN ('idea', 'draft', 'review_requested', 'pending_approval', 'changes_requested', 'scheduled', 'published', 'archived'));
