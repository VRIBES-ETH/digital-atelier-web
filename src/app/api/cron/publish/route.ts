import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { publishToLinkedIn } from '@/app/admin/actions';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function GET(request: Request) {
    try {
        // 1. Verify Cron Secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Find posts ready to publish
        // Status = 'scheduled' AND scheduled_for <= NOW()
        const now = new Date().toISOString();
        const { data: posts, error } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('status', 'scheduled')
            .lte('scheduled_for', now);

        if (error) throw error;

        if (!posts || posts.length === 0) {
            return NextResponse.json({ success: true, message: 'No posts to publish', count: 0 });
        }

        console.log(`Found ${posts.length} posts to publish`);

        // 3. Publish each post
        const results = [];
        for (const post of posts) {
            try {
                console.log(`Publishing post ${post.id}...`);
                const result = await publishToLinkedIn(post.id);
                results.push({ id: post.id, success: result.success, message: result.message });
            } catch (err: any) {
                console.error(`Failed to publish post ${post.id}:`, err);
                results.push({ id: post.id, success: false, message: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${posts.length} posts`,
            results
        });

    } catch (error: any) {
        console.error('Cron Job Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
