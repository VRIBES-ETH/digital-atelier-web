-- Relax RLS for Billing System (Allow Anon/Public access for local dev)

-- 1. Billing Clients
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.billing_clients;
CREATE POLICY "Enable all access for anon" ON public.billing_clients
    FOR ALL USING (true) WITH CHECK (true);

-- 2. Billing Settings
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.billing_settings;
CREATE POLICY "Enable all access for anon" ON public.billing_settings
    FOR ALL USING (true) WITH CHECK (true);

-- 3. Storage Policies (Billing Assets)
-- Drop previous authenticated-only policies
DROP POLICY IF EXISTS "Billing Assets Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Billing Assets Auth Delete" ON storage.objects;
-- Ensure we have a public policy for everything (Read/Write/Delete) for this bucket
-- NOTE: This effectively makes the bucket public-writable. Verify security implications for PROD.
CREATE POLICY "Billing Assets Public Write"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'billing-assets' );

CREATE POLICY "Billing Assets Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'billing-assets' );

CREATE POLICY "Billing Assets Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'billing-assets' );
