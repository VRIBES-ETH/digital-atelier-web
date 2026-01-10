import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// This is the specific hook for Digital Atelier Web (Admin Blog)
const CLOUDFLARE_DEPLOY_HOOK = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/322857bb-95f5-4ada-b109-7a77d20d97c3";

export const runtime = 'edge';

export async function POST() {
    try {
        const admin = getSupabaseAdmin();

        // 1. Transition all 'ready' posts to 'published'
        const { error: updateError } = await admin
            .from('blog_posts')
            .update({ status: 'published' })
            .eq('status', 'ready');

        if (updateError) {
            console.error('Error transitioning statuses:', updateError);
            return NextResponse.json({ success: false, message: 'Failed to update post statuses' }, { status: 500 });
        }

        // 2. Trigger Cloudflare Build
        const response = await fetch(CLOUDFLARE_DEPLOY_HOOK, {
            method: 'POST',
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, message: 'Cloudflare rejected the hook' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Posts published and build triggered' });
    } catch (error) {
        console.error('Deploy error:', error);
        return NextResponse.json({ success: false, message: 'Network error triggering build' }, { status: 500 });
    }
}
