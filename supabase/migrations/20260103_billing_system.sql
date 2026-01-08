-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Billing Clients Table
create table if not exists public.billing_clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    company_name text,
    tax_id text,
    address text,
    email text,
    notes text
);

-- Enable RLS
alter table public.billing_clients enable row level security;

-- Policies (Adjust based on your Auth setup, assuming authenticated admins)
create policy "Enable all access for authenticated users" on public.billing_clients
    for all using (auth.role() = 'authenticated');


-- 2. Billing Settings Table (Single Row usually)
create table if not exists public.billing_settings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    org_name text not null default 'Digital Atelier Solutions',
    org_address text,
    org_tax_id text,
    payment_details jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.billing_settings enable row level security;

-- Policies
create policy "Enable all access for authenticated users" on public.billing_settings
    for all using (auth.role() = 'authenticated');

-- 3. Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_billing_clients_updated_at
    before update on public.billing_clients
    for each row
    execute procedure public.handle_updated_at();
