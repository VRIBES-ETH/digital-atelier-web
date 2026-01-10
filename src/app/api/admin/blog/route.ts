import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export const runtime = 'edge'; // Required for Cloudflare Pages

// Helper for Safe Revalidation
function safeRevalidate(path: string) {
    try {
        revalidatePath(path);
    } catch (e) {
        console.error(`Revalidation failed for ${path}:`, e);
    }
}

export async function POST(req: NextRequest) {
    try {
        // 1. Session Check (Basic cookie check)
        const session = req.cookies.get('das_admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Body via FormData
        const formData = await req.formData();
        const action = formData.get('_action') as string; // 'create' or 'update'

        const supabaseAdmin = getSupabaseAdmin();

        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const status = formData.get('status') as 'draft' | 'published';
        const featured_image = formData.get('featured_image') as string;
        const seo_title = formData.get('seo_title') as string;
        const seo_description = formData.get('seo_description') as string; const tagsRaw = formData.get('tags') as string; const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

        if (action === 'create') {
            const { error } = await supabaseAdmin.from('blog_posts').insert({
                title, slug, content, excerpt, status, featured_image, seo_title, seo_description, tags
            });

            if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

            safeRevalidate('/blog');
            safeRevalidate('/vribesadmin/blog');
            return NextResponse.json({ success: true, message: 'Post created' });
        }

        if (action === 'update') {
            const id = formData.get('id') as string;
            if (!id) return NextResponse.json({ success: false, message: 'Missing ID for update' }, { status: 400 });

            const { error } = await supabaseAdmin.from('blog_posts').update({
                title, slug, content, excerpt, status, featured_image, seo_title, seo_description, tags,
                updated_at: new Date().toISOString()
            }).eq('id', id);

            if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

            safeRevalidate('/blog');
            safeRevalidate('/vribesadmin/blog');
            safeRevalidate(`/blog/${slug}`);
            return NextResponse.json({ success: true, message: 'Post updated' });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown server error'
        }, { status: 500 });
    }
}
