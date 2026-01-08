-- 1. Add logo_url to billing_settings
ALTER TABLE public.billing_settings 
ADD COLUMN IF NOT EXISTS logo_url text;

-- 2. Create Storage Bucket 'billing-assets'
INSERT INTO storage.buckets (id, name, public)
VALUES ('billing-assets', 'billing-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies (Renamed to avoid collisions)

-- Public read access
DROP POLICY IF EXISTS "Billing Assets Public Access" ON storage.objects;
CREATE POLICY "Billing Assets Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'billing-assets' );

-- Authenticated upload access
DROP POLICY IF EXISTS "Billing Assets Auth Upload" ON storage.objects;
CREATE POLICY "Billing Assets Auth Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'billing-assets' AND auth.role() = 'authenticated' );

-- Authenticated update access
DROP POLICY IF EXISTS "Billing Assets Auth Update" ON storage.objects;
CREATE POLICY "Billing Assets Auth Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'billing-assets' AND auth.role() = 'authenticated' );

-- Authenticated delete access
DROP POLICY IF EXISTS "Billing Assets Auth Delete" ON storage.objects;
CREATE POLICY "Billing Assets Auth Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'billing-assets' AND auth.role() = 'authenticated' );
