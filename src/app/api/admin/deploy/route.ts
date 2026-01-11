import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// This is the specific hook for Digital Atelier Web (Admin Blog)
const CLOUDFLARE_DEPLOY_HOOK = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/322857bb-95f5-4ada-b109-7a77d20d97c3";

export const runtime = 'edge';

export async function POST() {
    try {
        const admin = getSupabaseAdmin();

        // 1. Transition all 'ready' posts to 'published'
        const { data: updatedData, error: updateError } = await admin
            .from('blog_posts')
            .update({ status: 'published' })
            .eq('status', 'ready')
            .select('id');

        if (updateError) {
            console.error('Error transitioning statuses:', updateError);
            return NextResponse.json({ success: false, message: 'Fallo al actualizar estados en la DB: ' + updateError.message }, { status: 500 });
        }

        const updatedCount = updatedData?.length || 0;
        console.log(`Transitioned ${updatedCount} posts to published.`);

        // 2. Trigger Cloudflare Build
        console.log('Triggering Cloudflare build via hook...');
        const response = await fetch(CLOUDFLARE_DEPLOY_HOOK, {
            method: 'POST',
        });

        const hookResult = await response.text();
        console.log('Cloudflare hook response:', response.status, hookResult);

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: `Base de datos actualizada (${updatedCount} posts), pero fallo en Cloudflare (${response.status}): ${hookResult}`
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `¡Listo! Se han procesado ${updatedCount} artículos y se ha iniciado el despliegue.`
        });
    } catch (error) {
        console.error('Deploy error:', error);
        return NextResponse.json({ success: false, message: 'Network error triggering build' }, { status: 500 });
    }
}
