import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function fixPost() {
    console.log("Searching for post...");
    // Search for the post by content snippet from the screenshot
    const { data: posts, error } = await supabaseAdmin
        .from("posts")
        .select("*")
        .ilike("content", "%El 56% de los líderes terminó 2024 fundido%")
        .limit(1);

    if (error || !posts || posts.length === 0) {
        console.error("Post not found!", error);
        return;
    }

    const post = posts[0];
    console.log("Found post:", post.id);

    const { error: updateError } = await supabaseAdmin
        .from("posts")
        .update({
            status: "published",
            published_at: new Date().toISOString(),
        })
        .eq("id", post.id);

    if (updateError) {
        console.error("Update failed:", updateError);
    } else {
        console.log("SUCCESS: Post marked as published!");
    }
}

fixPost();
