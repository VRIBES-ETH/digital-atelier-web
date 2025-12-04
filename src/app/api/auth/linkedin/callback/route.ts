import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin Client to bypass RLS when updating tokens
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
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // Contains user ID
    const error = searchParams.get("error");

    if (error || !code || !state) {
        return NextResponse.redirect(new URL("/dashboard?error=linkedin_auth_failed", request.url));
    }

    try {
        // 1. Exchange code for access token
        const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: `${new URL(request.url).origin}/api/auth/linkedin/callback`,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokenData.error_description || "Failed to exchange token");
        }

        // 2. Calculate expiration
        const expiresIn = tokenData.expires_in; // Seconds
        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        // 3. Fetch LinkedIn Profile to get 'sub' (User ID)
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!profileResponse.ok) {
            console.error("Failed to fetch LinkedIn profile during callback");
            // We continue but log it. Ideally we should fail or retry.
        }

        const profileData = await profileResponse.json();
        const linkedinSub = profileData.sub;

        // 4. Update User Profile in Supabase
        const userId = state;

        const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({
                linkedin_access_token: tokenData.access_token,
                linkedin_refresh_token: tokenData.refresh_token || null,
                linkedin_token_expires_at: expiresAt.toISOString(),
                linkedin_sub: linkedinSub, // Save the LinkedIn User ID
                linkedin_picture_url: profileData.picture, // Save Profile Picture
            })
            .eq("id", userId);

        if (updateError) throw updateError;

        return NextResponse.redirect(new URL("/dashboard?success=linkedin_connected", request.url));

    } catch (error) {
        console.error("LinkedIn Auth Error:", error);
        return NextResponse.redirect(new URL("/dashboard?error=linkedin_connection_error", request.url));
    }
}
