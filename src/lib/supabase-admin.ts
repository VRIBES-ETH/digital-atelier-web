import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Client for admin operations (bypasses RLS)
// ONLY use this in Server Actions or API routes, NEVER on the client side
// Validate keys before creation to avoid silent failures
if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder')) {
    console.error('CRITICAL: Supabase Admin keys missing or invalid in runtime environment.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
