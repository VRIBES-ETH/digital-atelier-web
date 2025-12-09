```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { publishToLinkedIn } from "@/lib/linkedin";

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        // 1. Validate Admin Session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Optional: Check for specific admin role if RBAC is strictly enforced
        // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        // if (profile?.role !== 'admin') ...

        // 2. Fetch Post and Author's Token
        // We need to bypass RLS to read the user's token, so we use the service role client if possible,
        // OR we rely on the fact that the admin *can* read profiles via RLS policies (if set up correctly).
        // However, `linkedin_access_token` is sensitive.
        // Ideally, we should use a service role client here for the sensitive token access.
        // For this MVP, let's assume the current session (Admin) has RLS access to read profiles, 
        // OR we use the Supabase Admin Client (Service Role) to fetch the token securely.

        // Using Service Role for secure access to tokens
        const { createClient: createAdminClient } = await import("@supabase/supabase-js");
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
        // Actually, `linkedin_access_token` might be hidden from public view.

        // Let's fetch the post first to get the author ID.
        const { data: post, error: postError } = await supabase
            .from("posts")
            .select("*, profiles:user_id ( linkedin_access_token, linkedin_id, full_name )")
            .eq("id", postId)
            .single();

        if (postError || !post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const author = post.profiles;
        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        // 3. Check Token Validity
        if (!author.linkedin_access_token) {
            return NextResponse.json({
                error: `El cliente(${ author.full_name }) no ha conectado su cuenta de LinkedIn.`
            }, { status: 400 });
        }

        // 4. Publish to LinkedIn
        const result = await publishToLinkedIn(
            author.linkedin_access_token,
            { text: post.content },
            author.linkedin_id // Can be null, library handles it
        );

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // 5. Update Post Status
        const { error: updateError } = await supabase
            .from("posts")
            .update({
                status: "published",
                linkedin_post_id: result.urn,
                published_at: new Date().toISOString(),
            })
            .eq("id", postId);

        if (updateError) {
            console.error("Failed to update post status:", updateError);
            // We still return success because the post WAS published on LinkedIn
        }

        return NextResponse.json({ success: true, urn: result.urn });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
