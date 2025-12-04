import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("CRITICAL: Missing env vars");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function checkSchema() {
    console.log("Checking 'posts' table schema...");

    // We'll try to select the columns. If they don't exist, Supabase will throw an error.
    const { data, error } = await supabaseAdmin
        .from("posts")
        .select("id, linkedin_post_id, published_at")
        .limit(1);

    if (error) {
        console.error("ERROR checking columns:", error.message);
        if (error.message.includes("does not exist")) {
            console.log("\nCONCLUSION: One or more columns are missing!");
        }
    } else {
        console.log("SUCCESS: Columns 'linkedin_post_id' and 'published_at' exist.");
    }
}

checkSchema();
