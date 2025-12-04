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
    console.log("Checking 'posts' table for 'author_role' column...");

    const { data, error } = await supabaseAdmin
        .from("posts")
        .select("author_role")
        .limit(1);

    if (error) {
        console.error("ERROR checking column:", error.message);
        if (error.message.includes("does not exist")) {
            console.log("\nCONCLUSION: The 'author_role' column is MISSING.");
        }
    } else {
        console.log("SUCCESS: Column 'author_role' exists.");
    }
}

checkSchema();
