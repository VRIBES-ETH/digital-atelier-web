-- Create a singleton table for application settings
CREATE TABLE IF NOT EXISTS app_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row exists
    usdc_erc20_wallet TEXT,
    usdc_polygon_wallet TEXT,
    usdc_solana_wallet TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the initial row if it doesn't exist
INSERT INTO app_settings (id, usdc_erc20_wallet, usdc_polygon_wallet, usdc_solana_wallet)
VALUES (1, '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access to authenticated users (so clients can potentially see wallets later)
CREATE POLICY "Allow read access to authenticated users" ON app_settings
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow update access only to service_role (Admin actions use service_role)
-- Or if we want to allow specific admin users via RLS:
-- CREATE POLICY "Allow update access to admins" ON app_settings FOR UPDATE TO authenticated USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
-- For now, we rely on the Admin API using service_role, so explicit policy might not be strictly needed for the admin action if it bypasses RLS, but good to have 'service_role' full access implicitly.
