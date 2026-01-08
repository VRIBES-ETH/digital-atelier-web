-- Create billing_clients table
CREATE TABLE IF NOT EXISTS public.billing_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    tax_id TEXT, -- CIF/NIF
    address TEXT,
    email TEXT,
    notes TEXT
);

-- Create billing_settings table (Single Row intended)
CREATE TABLE IF NOT EXISTS public.billing_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    org_name TEXT DEFAULT 'Digital Atelier Solutions',
    org_address TEXT,
    org_tax_id TEXT,
    payment_details JSONB DEFAULT '{}'::jsonb -- Can store IBAN, Swift, etc structure
);

-- Enable RLS
ALTER TABLE public.billing_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_settings ENABLE ROW LEVEL SECURITY;

-- Create Policies (Permissive for Admin Panel MVP)
-- In a real production app with Auth, these would be restricted to role='admin'
CREATE POLICY "Enable all access for all users" ON public.billing_clients
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.billing_settings
    FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings row if not exists
INSERT INTO public.billing_settings (org_name)
SELECT 'Digital Atelier Solutions'
WHERE NOT EXISTS (SELECT 1 FROM public.billing_settings);
