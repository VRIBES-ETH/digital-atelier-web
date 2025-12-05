-- 1. Drop the existing check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

-- 2. Update existing 'validator' plans to 'copilot'
UPDATE profiles SET plan_tier = 'copilot' WHERE plan_tier = 'validator';

-- 3. Add the new check constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_tier_check 
    CHECK (plan_tier IN ('copilot', 'seed', 'growth', 'authority'));
