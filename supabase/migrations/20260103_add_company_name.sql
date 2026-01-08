-- Add company_name to billing_clients
ALTER TABLE public.billing_clients ADD COLUMN IF NOT EXISTS company_name TEXT;
