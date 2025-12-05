import { createClient } from "@/lib/supabase/server";
import ClientPostsBrowser from "@/components/ClientPostsBrowser";
import ClientPostCreateModal from "@/components/ClientPostCreateModal";
import { redirect } from "next/navigation";
import { fetchLinkedInProfile } from "../actions";

export default async function MyPostsPage({
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

    // Fetch Profile to get LinkedIn token
    const { data: profile } = await db.from("profiles").select("*").eq("id", targetUserId).single();

    let linkedinProfile = null;
    if (profile?.linkedin_access_token) {
        linkedinProfile = await fetchLinkedInProfile(profile.linkedin_access_token);
    }

    // Fetch all posts for this client
    const { data: posts, error } = await db
        .from("posts")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return <div>Error cargando los posts.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-poppins font-bold text-2xl text-das-dark">Mis Posts</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona y revisa todo tu contenido desde aquí.</p>
                </div>
                <ClientPostCreateModal userRole={isAdmin ? 'admin' : 'client'} />
            </div>

            <ClientPostsBrowser posts={posts || []} linkedinProfile={linkedinProfile} userRole={isAdmin ? 'admin' : 'client'} />
        </div>
    );
}
