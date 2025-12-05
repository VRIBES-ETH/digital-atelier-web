-- 1. Update any invalid roles to 'client' (safety net)
UPDATE profiles 
SET role = 'client' 
WHERE role IS NULL OR role NOT IN ('admin', 'client');

-- 2. Drop the constraint if it already exists (to avoid errors and ensure correct definition)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 3. Add the check constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'client'));
