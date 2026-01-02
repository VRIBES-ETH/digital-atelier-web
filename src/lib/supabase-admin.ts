import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for admin operations (bypasses RLS)
// ONLY use this in Server Actions or API routes, NEVER on the client side
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
