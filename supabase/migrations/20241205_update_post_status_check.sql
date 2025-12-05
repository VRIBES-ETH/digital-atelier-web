-- Migration to update the check constraint for post status
-- This ensures the new 'review_client' status is accepted by the database

DO $$
BEGIN
    -- 1. Drop existing constraint if it exists (common names)
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_status_check') THEN
        ALTER TABLE public.posts DROP CONSTRAINT posts_status_check;
    END IF;

    -- 2. Add the updated constraint
    -- Valid statuses: draft, review_requested, changes_requested, review_client, scheduled, published, pending_approval
    ALTER TABLE public.posts
    ADD CONSTRAINT posts_status_check
    CHECK (status IN (
        'draft',
        'review_requested',
        'changes_requested',
        'review_client',
        'scheduled',
        'published',
        'pending_approval'
    ));
END $$;
