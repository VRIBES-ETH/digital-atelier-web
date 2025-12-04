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

async function fix() {
    const clientId = "81366bc2-b159-4873-a0b3-f9b4788eebd6";
    console.log(`\nFixing profile for ID: ${clientId}...`);

    // 1. Get current token
    const { data: profile, error } = await supabaseAdmin
        .from("profiles")
        .select("linkedin_access_token")
        .eq("id", clientId)
        .single();

    if (error || !profile?.linkedin_access_token) {
        console.error("Could not find profile or token:", error);
        return;
    }

    console.log("Found token. Fetching LinkedIn ID...");

    // 2. Fetch LinkedIn ID
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${profile.linkedin_access_token}`,
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch LinkedIn profile:", await response.text());
        return;
    }

    const linkedInData = await response.json();
    const sub = linkedInData.sub;
    console.log("Got LinkedIn ID (sub):", sub);

    // 3. Update DB
    const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ linkedin_sub: sub })
        .eq("id", clientId);

    if (updateError) {
        console.error("Error updating DB:", updateError);
    } else {
        console.log("SUCCESS: Database updated with linkedin_sub!");
    }
}

fix();
