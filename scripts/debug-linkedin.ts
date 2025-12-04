import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("--- DEBUG INFO ---");
console.log("Supabase URL:", supabaseUrl);
console.log("Service Role Key exists:", !!serviceRoleKey);
console.log("Service Role Key length:", serviceRoleKey?.length);

if (!supabaseUrl || !serviceRoleKey) {
    console.error("CRITICAL: Missing env vars");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function check() {
    const clientId = "81366bc2-b159-4873-a0b3-f9b4788eebd6";
    console.log(`\nChecking profile for ID: ${clientId}...`);

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", clientId)
        .single();

    if (error) {
        console.error("ERROR fetching profile:", error);
    } else {
        console.log("SUCCESS: Profile found!");
        console.log("Name:", data.full_name);
        console.log("LinkedIn Token exists:", !!data.linkedin_access_token);
        console.log("LinkedIn Sub exists:", !!data.linkedin_sub);
    }
}

check();
