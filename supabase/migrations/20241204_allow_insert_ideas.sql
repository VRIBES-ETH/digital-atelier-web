-- Fix RLS policies to allow clients to create ideas and view their posts correctly

-- 1. Allow Clients to INSERT their own posts (for Ideation Bucket)
CREATE POLICY "Clients create own posts" ON posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Fix SELECT policy to use 'user_id' instead of 'client_id' (if it wasn't automatically updated)
DROP POLICY IF EXISTS "Clients see own posts" ON posts;

CREATE POLICY "Clients see own posts" ON posts
FOR SELECT
USING (auth.uid() = user_id);
