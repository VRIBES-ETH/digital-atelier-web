-- Add Stripe product columns to app_settings
ALTER TABLE app_settings
ADD COLUMN IF NOT EXISTS stripe_product_copilot TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_seed TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_growth TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_authority TEXT;
