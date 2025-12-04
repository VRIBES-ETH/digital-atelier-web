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

async function checkProfileSchema() {
    console.log("Checking 'profiles' table schema for Executive Profile fields...");

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("headline, key_experience, main_language, tone_of_voice, content_pillars")
        .limit(1);

    if (error) {
        console.error("ERROR checking columns:", error.message);
        if (error.message.includes("does not exist")) {
            console.log("\nCONCLUSION: One or more columns are missing!");
        }
    } else {
        console.log("SUCCESS: All Executive Profile columns exist.");
    }
}

checkProfileSchema();
