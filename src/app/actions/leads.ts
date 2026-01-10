'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function saveLead(email: string, source: string, metadata: any = {}) {
    try {
        // Use Admin Client to bypass RLS if needed, ensuring we can always write.
        const supabase = getSupabaseAdmin();

        const { error } = await supabase.from('leads').insert({
            email,
            source,
            metadata // Supabase JS handles object -> jsonb automatic conversion
        });

        if (error) {
            console.error("Supabase Lead Safety Net Error:", error);
            // Return false but don't throw, we want the main flow to continue if this backup fails.
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e: any) {
        console.error("Save Lead Safety Net Exception:", e);
        return { success: false, error: e.message };
    }
}
