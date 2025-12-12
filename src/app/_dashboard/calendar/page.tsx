import { createClient } from "@/lib/supabase/server";
import CalendarClient from "@/components/CalendarClient";
import { redirect } from "next/navigation";
import { fetchLinkedInProfile } from "../actions";

export default async function CalendarPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Profile to get LinkedIn token
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    let linkedinProfile = null;
    if (profile?.linkedin_access_token) {
        linkedinProfile = await fetchLinkedInProfile(profile.linkedin_access_token);
    }

    // Fetch all posts for this client
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        console.error("Error fetching posts for calendar:", error);
    }

    return (
        <CalendarClient posts={posts || []} linkedinProfile={linkedinProfile} />
    );
}
