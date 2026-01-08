-- Force RLS Fix V2 for Anon Access
-- This script explicitly drops existing policies and recreates them to allow TRUE public/anon access.
-- Warning: This makes the billing data publicly readable/writable for anyone with the anon key (which is public).
-- This is acceptable for a local/personal admin tool but should be locked down in production with proper Auth.

-- 1. Billing Clients
ALTER TABLE public.billing_clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.billing_clients;
DROP POLICY IF EXISTS "Enable all access for anon" ON public.billing_clients;
DROP POLICY IF EXISTS "Public Access Clients" ON public.billing_clients;

CREATE POLICY "Public Access Clients"
ON public.billing_clients
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Billing Settings
ALTER TABLE public.billing_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.billing_settings;
DROP POLICY IF EXISTS "Enable all access for anon" ON public.billing_settings;
DROP POLICY IF EXISTS "Public Access Settings" ON public.billing_settings;

CREATE POLICY "Public Access Settings"
ON public.billing_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. Storage Bucket 'billing-assets'
-- Ensure bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'billing-assets';

-- Storage Policies (Drop all previous attempts)
DROP POLICY IF EXISTS "Billing Assets Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Auth Delete" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Public Write" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Public Delete" ON storage.objects;

-- Create singular OPEN policy for this bucket
CREATE POLICY "Billing Assets FULL OPEN"
ON storage.objects
FOR ALL
USING ( bucket_id = 'billing-assets' )
WITH CHECK ( bucket_id = 'billing-assets' );
