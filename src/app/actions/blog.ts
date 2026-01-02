'use server';

import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
    featured_image?: string;
    seo_title?: string;
    seo_description?: string;
};

// --- PUBLIC ACTIONS ---

export async function ping() {
    return { success: true, message: 'Pong', timestamp: new Date().toISOString() };
}

export async function getPublishedPosts() {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return data as BlogPost[];
}

export async function getPostBySlug(slug: string) {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) {
        return null;
    }

    return data as BlogPost;
}

// --- ADMIN ACTIONS ---

async function checkAdminSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('das_admin_session');
    if (!session || session.value !== 'authenticated') {
        throw new Error('Unauthorized access: invalid session');
    }
}

// Helper to debug Env Vars safely
async function checkEnvVars() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) return 'Missing NEXT_PUBLIC_SUPABASE_URL';
    if (!key) return 'Missing SUPABASE_SERVICE_ROLE_KEY';
    if (url.includes('placeholder')) return 'NEXT_PUBLIC_SUPABASE_URL is placeholder';
    if (key === 'placeholder-key') return 'SUPABASE_SERVICE_ROLE_KEY is placeholder';
    return null;
}

// Safe revalidate helper
function safeRevalidate(path: string) {
    try {
        revalidatePath(path);
    } catch (e) {
        console.error(`Revalidation failed for ${path}:`, e);
        // Do not throw, just log. This prevents the "Unexpected response" crash if revalidation fails.
    }
}

export async function getAllPostsAdmin() {
    try {
        await checkAdminSession();
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin posts:', error);
            return [];
        }

        return data as BlogPost[];
    } catch (error) {
        console.error('Admin Fetch Error:', error);
        return [];
    }
}

export async function getPostByIdAdmin(id: string) {
    try {
        await checkAdminSession();
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as BlogPost;
    } catch (error) {
        return null;
    }
}

export async function createPost(formData: FormData) {
    try {
        await checkAdminSession(); // Moved inside try

        // 1. Env Check
        const envError = await checkEnvVars();
        if (envError) return { success: false, message: `Server Config Error: ${envError}` };

        const supabaseAdmin = getSupabaseAdmin(); // Lazy init inside try

        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const status = formData.get('status') as 'draft' | 'published';
        const featured_image = formData.get('featured_image') as string;
        const seo_title = formData.get('seo_title') as string;
        const seo_description = formData.get('seo_description') as string;

        const { error } = await supabaseAdmin.from('blog_posts').insert({
            title,
            slug,
            content,
            excerpt,
            status,
            featured_image,
            seo_title,
            seo_description
        });

        if (error) return { success: false, message: error.message };

        safeRevalidate('/blog');
        safeRevalidate('/vribesadmin/blog');
        return { success: true };
    } catch (e) {
        console.error('Error in createPost:', e);
        return { success: false, message: 'Exception: ' + (e instanceof Error ? e.message : String(e)) };
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        await checkAdminSession(); // Moved inside try

        // 1. Env Check
        const envError = await checkEnvVars();
        if (envError) return { success: false, message: `Server Config Error: ${envError}` };

        const supabaseAdmin = getSupabaseAdmin(); // Lazy init inside try

        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const status = formData.get('status') as 'draft' | 'published';
        const featured_image = formData.get('featured_image') as string;
        const seo_title = formData.get('seo_title') as string;
        const seo_description = formData.get('seo_description') as string;

        const { error } = await supabaseAdmin.from('blog_posts').update({
            title,
            slug,
            content,
            excerpt,
            status,
            featured_image,
            seo_title,
            seo_description,
            updated_at: new Date().toISOString()
        }).eq('id', id);

        if (error) return { success: false, message: error.message };

        safeRevalidate('/blog');
        safeRevalidate('/vribesadmin/blog');
        safeRevalidate(`/blog/${slug}`);
        return { success: true };
    } catch (e) {
        console.error('Error in updatePost:', e);
        return { success: false, message: 'Exception: ' + (e instanceof Error ? e.message : String(e)) };
    }
}

export async function deletePost(id: string) {
    try {
        await checkAdminSession();
        const supabaseAdmin = getSupabaseAdmin();
        const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);

        if (error) throw new Error(error.message);
        safeRevalidate('/blog');
        safeRevalidate('/vribesadmin/blog');
    } catch (e) {
        console.error('Delete error', e);
        throw e;
    }
}
