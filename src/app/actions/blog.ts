'use server';

import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
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
        throw new Error('Unauthorized access');
    }
}

export async function getAllPostsAdmin() {
    await checkAdminSession();

    const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin posts:', error);
        return [];
    }

    return data as BlogPost[];
}

export async function getPostByIdAdmin(id: string) {
    await checkAdminSession();

    const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as BlogPost;
}

export async function createPost(formData: FormData) {
    await checkAdminSession();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const status = formData.get('status') as 'draft' | 'published';
    const featured_image = formData.get('featured_image') as string;
    const seo_title = formData.get('seo_title') as string;
    const seo_description = formData.get('seo_description') as string;

    try {
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

        if (error) throw new Error(error.message);
        revalidatePath('/blog');
        revalidatePath('/vribesadmin/blog');
    } catch (e) {
        console.error('Error in createPost:', e);
        throw new Error('Failed to create post: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
}

export async function updatePost(id: string, formData: FormData) {
    await checkAdminSession();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const status = formData.get('status') as 'draft' | 'published';
    const featured_image = formData.get('featured_image') as string;
    const seo_title = formData.get('seo_title') as string;
    const seo_description = formData.get('seo_description') as string;

    try {
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

        if (error) throw new Error(error.message);
        revalidatePath('/blog');
        revalidatePath('/vribesadmin/blog');
        revalidatePath(`/blog/${slug}`);
    } catch (e) {
        console.error('Error in updatePost:', e);
        throw new Error('Failed to update post: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
}

export async function deletePost(id: string) {
    await checkAdminSession();

    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/blog');
    revalidatePath('/vribesadmin/blog');
}
