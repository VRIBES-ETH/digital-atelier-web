-- Fix for the enum error: Adding missing values to the post_status enum
-- We use IF NOT EXISTS to avoid errors if they were partially added

ALTER TYPE public.post_status ADD VALUE IF NOT EXISTS 'review_requested';
ALTER TYPE public.post_status ADD VALUE IF NOT EXISTS 'review_client';
ALTER TYPE public.post_status ADD VALUE IF NOT EXISTS 'changes_requested';

-- Note: 'draft', 'scheduled', 'published', 'pending_approval' likely already exist.
