-- Create Trigger Function if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create billing_invoices table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    number TEXT NOT NULL,
    date DATE NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue
    
    client_id UUID REFERENCES public.billing_clients(id),
    client_snapshot JSONB, -- Snapshot of client data at time of invoice
    
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    currency TEXT DEFAULT 'EUR',
    tax_rate NUMERIC DEFAULT 0,
    discount_rate NUMERIC DEFAULT 0,
    
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC NOT NULL DEFAULT 0,
    discount_amount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;

-- Create OPEN Policy for Development (Matches existing pattern)
DROP POLICY IF EXISTS "Enable all access for all users" ON public.billing_invoices;
CREATE POLICY "Enable all access for all users" ON public.billing_invoices
    FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_billing_invoices_modtime
    BEFORE UPDATE ON public.billing_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
