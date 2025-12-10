import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchLinkedInProfile } from "../actions";
import ExecutiveProfileForm from "@/components/ExecutiveProfileForm";

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Initialize admin client for impersonation if needed
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

    // 1. Check if current user is admin
    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const isAdmin = currentUserProfile?.role === 'admin';
    const targetUserId = (isAdmin && searchParams.userId) ? (searchParams.userId as string) : user.id;

    // Use supabaseAdmin if impersonating to bypass RLS, otherwise standard client
    const db = (isAdmin && searchParams.userId) ? supabaseAdmin : supabase;

    // Fetch Profile
    const { data: profile } = await db
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();

    // Fetch LinkedIn Profile
    let linkedinProfile = null;
    if (profile?.linkedin_access_token) {
        linkedinProfile = await fetchLinkedInProfile(profile.linkedin_access_token);
    }

    return (
        <ExecutiveProfileForm profile={profile} linkedinProfile={linkedinProfile} />
    );
}
