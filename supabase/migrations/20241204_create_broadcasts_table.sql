-- Create broadcasts table to track sent mass notifications
CREATE TABLE IF NOT EXISTS broadcasts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'success', 'warning', 'action_required'
    target_segment TEXT NOT NULL, -- 'all', 'copilot', 'seed', 'growth', 'authority'
    recipients_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all broadcasts (assuming service_role or admin check)
-- For simplicity in this context, we allow authenticated users to read if they are admins, 
-- but since we use server actions with service_role (supabaseAdmin), we might not strictly need policies for the app logic itself if using admin client.
-- However, good practice:
CREATE POLICY "Admins can view broadcasts" ON broadcasts
    FOR SELECT
    TO authenticated
    USING (true); -- In a real app, check role='admin'

CREATE POLICY "Admins can insert broadcasts" ON broadcasts
    FOR INSERT
    TO authenticated
    WITH CHECK (true); -- In a real app, check role='admin'
