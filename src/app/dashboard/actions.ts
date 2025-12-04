"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";

export async function getLinkedInAuthUrl() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/auth/linkedin/callback`;
    const scope = "profile email openid w_member_social"; // Updated to new standard scopes
    const state = user.id; // We use user ID as state to map callback

    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId!,
        redirect_uri: redirectUri,
        state: state,
        scope: scope,
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export async function fetchLinkedInProfile(accessToken: string) {
    try {
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch LinkedIn profile');
        }

        const data = await response.json();
        return {
            name: data.name,
            email: data.email,
            picture: data.picture,
            sub: data.sub // LinkedIn ID
        };
    } catch (error) {
        console.error('Error fetching LinkedIn profile:', error);
        return null;
    }
}

export async function approvePost(postId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    // Initialize admin client to bypass RLS
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

    try {
        // 1. Verify ownership
        const { data: post, error: fetchError } = await supabaseAdmin
            .from("posts")
            .select("client_id")
            .eq("id", postId)
            .single();

        if (fetchError || !post) throw new Error("Post no encontrado");
        if (post.client_id !== user.id) throw new Error("No tienes permiso para aprobar este post");

        // 2. Perform update as admin
        const { error } = await supabaseAdmin
            .from("posts")
            .update({ status: "scheduled", feedback: null })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/dashboard");
        revalidatePath("/admin/content");
        return { success: true, message: "Post aprobado correctamente" };
    } catch (error: any) {
        console.error("Error approving post:", error);
        return { success: false, message: error.message };
    }
}

export async function requestChanges(postId: string, feedback: string) {
    // We use the service role key here to bypass RLS policies that might restrict
    // clients from updating posts (e.g. if they can only update 'draft' posts).
    // We must verify ownership first to be secure.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    // Initialize admin client
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

    try {
        // 1. Verify ownership
        const { data: post, error: fetchError } = await supabaseAdmin
            .from("posts")
            .select("client_id")
            .eq("id", postId)
            .single();

        if (fetchError || !post) throw new Error("Post no encontrado");
        if (post.client_id !== user.id) throw new Error("No tienes permiso para editar este post");

        // 2. Perform update as admin
        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                status: "changes_requested",
                feedback: feedback
            })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/dashboard");
        revalidatePath("/admin/content");
        return { success: true, message: "Solicitud de cambios enviada" };
    } catch (error: any) {
        console.error("Error requesting changes:", error);
        return { success: false, message: error.message };
    }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    const headline = formData.get("headline") as string;
    const keyExperience = formData.get("keyExperience") as string;
    const mainLanguage = formData.get("mainLanguage") as string;
    const toneOfVoice = formData.get("toneOfVoice") as string;
    const contentPillars = formData.get("contentPillars") as string; // JSON string

    try {
        const { error } = await supabase
            .from("profiles")
            .update({
                headline,
                key_experience: keyExperience,
                main_language: mainLanguage,
                tone_of_voice: toneOfVoice,
                content_pillars: JSON.parse(contentPillars),
            })
            .eq("id", user.id);

        if (error) throw error;

        revalidatePath("/dashboard/profile");
        return { success: true, message: "Perfil actualizado correctamente" };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, message: error.message };
    }
}

export async function createClientPost(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    // Initialize admin client for storage operations (bypassing RLS)
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

    const content = formData.get("content") as string;
    const referenceLink = formData.get("referenceLink") as string;
    const imageFile = formData.get("imageFile") as File;
    const scheduledFor = formData.get("scheduledFor") as string;
    const actionType = formData.get("actionType") as string; // 'draft' or 'schedule'

    let imageUrl = null;
    let status = "draft";

    if (actionType === 'schedule' && scheduledFor) {
        status = "scheduled";
    } else if (actionType === 'pending_approval') {
        status = "pending_approval";
    } else if (actionType === 'publish_now') {
        status = "published";
    }

    try {
        // Upload image if provided
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Use supabaseAdmin to bypass RLS for upload
            const { error: uploadError } = await supabaseAdmin.storage
                .from('post-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw new Error("Error al subir la imagen. Por favor intenta de nuevo.");
            }

            const { data } = supabaseAdmin.storage
                .from('post-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        const { error } = await supabaseAdmin
            .from("posts")
            .insert({
                client_id: user.id,
                content,
                reference_link: referenceLink || null,
                status: status,
                scheduled_for: scheduledFor || null,
                author_role: "client",
                image_url: imageUrl,
                created_at: new Date().toISOString(),
            });

        if (error) throw error;

        revalidatePath("/dashboard/posts");
        let message = "Borrador guardado correctamente";
        if (status === 'scheduled') message = "Post programado correctamente";
        else if (status === 'pending_approval') message = "Post enviado a revisión";
        else if (status === 'published') message = "Post publicado correctamente";

        return { success: true, message };
    } catch (error: any) {
        console.error("Error creating client post:", error);
        return { success: false, message: error.message };
    }
}

export async function rescheduleClientPost(postId: string, newDate: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    // Initialize admin client to bypass potential RLS issues with updates
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

    try {
        // Verify ownership
        const { data: post, error: fetchError } = await supabaseAdmin
            .from("posts")
            .select("client_id, status")
            .eq("id", postId)
            .single();

        if (fetchError || !post) throw new Error("Post no encontrado");
        if (post.client_id !== user.id) throw new Error("No tienes permiso para editar este post");
        if (post.status === 'published') throw new Error("No se puede reprogramar un post ya publicado");

        // Determine new status: if it was draft, keep draft. If it was scheduled, keep scheduled.
        // If it was pending_approval, keep pending_approval.
        // Basically, we just update the date.
        // HOWEVER, if it was 'draft' and we give it a date, maybe it should stay 'draft' until explicitly scheduled?
        // The user requirement says "preserve 'draft' or 'pending_approval'".
        // So we will NOT update the status, only the date.

        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                scheduled_for: newDate,
            })
            .eq("id", postId);

        if (error) throw error;



        revalidatePath("/dashboard/posts");
        return { success: true, message: "Fecha actualizada correctamente" };
    } catch (error: any) {
        console.error("Error rescheduling post:", error);
        return { success: false, message: error.message };
    }
}


export async function deletePost(postId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    // Initialize admin client to bypass RLS
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

    try {
        // Verify ownership
        const { data: post, error: fetchError } = await supabaseAdmin
            .from("posts")
            .select("client_id")
            .eq("id", postId)
            .single();

        if (fetchError || !post) throw new Error("Post no encontrado");
        if (post.client_id !== user.id) throw new Error("No tienes permiso para eliminar este post");

        const { error } = await supabaseAdmin
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/dashboard/posts");
        return { success: true, message: "Post eliminado correctamente" };
    } catch (error: any) {
        console.error("Error deleting post:", error);
        return { success: false, message: error.message };
    }
}

export async function updateClientPost(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "No autenticado" };
    }

    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const referenceLink = formData.get("referenceLink") as string;
    const internalNotes = formData.get("internalNotes") as string;
    const actionType = formData.get("actionType") as string;
    const scheduledFor = formData.get("scheduledFor") as string;
    const imageFile = formData.get("imageFile") as File;

    // Determine status based on action
    let status = 'draft';
    if (actionType === 'schedule' && scheduledFor) {
        status = 'scheduled';
    } else if (actionType === 'pending_approval') {
        status = 'pending_approval';
    } else if (actionType === 'publish_now') {
        status = 'published';
    } else if (actionType === 'review_requested') {
        status = 'pending_approval'; // Map 'review_requested' to 'pending_approval'
    }

    // Initialize admin client
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

    try {
        // Verify ownership
        const { data: post, error: fetchError } = await supabaseAdmin
            .from("posts")
            .select("client_id, image_url")
            .eq("id", postId)
            .single();

        if (fetchError || !post) throw new Error("Post no encontrado");
        if (post.client_id !== user.id) throw new Error("No tienes permiso para editar este post");

        let imageUrl = post.image_url;

        // Handle Image Upload if new file provided
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabaseAdmin
                .storage
                .from('post-images')
                .upload(fileName, imageFile, {
                    contentType: imageFile.type,
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabaseAdmin
                .storage
                .from('post-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                content,
                reference_link: referenceLink || null,
                internal_notes: internalNotes || null,
                status: status,
                scheduled_for: scheduledFor || null,
                image_url: imageUrl,
                updated_at: new Date().toISOString(),
                published_at: status === 'published' ? new Date().toISOString() : undefined,
                // Clear feedback if status is changing to pending, scheduled, or published
                feedback_notes: (status === 'pending_approval' || status === 'scheduled' || status === 'published') ? null : undefined
            })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/dashboard/posts");
        return { success: true, message: "Post actualizado correctamente" };
    } catch (error: any) {
        console.error("Error updating client post:", error);
        return { success: false, message: error.message };
    }
}

export async function createPortalSession() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("stripe_customer_id")
            .eq("id", user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            // return { success: false, message: "No tienes una suscripción activa" };
            redirect("/dashboard/subscription?error=no_subscription");
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/subscription`,
        });

        if (portalSession.url) {
            redirect(portalSession.url);
        }
    } catch (error: any) {
        console.error("Error creating portal session:", error);
        // In a server action for a form, we can't easily return an error to UI without useFormState.
        // We redirect to error state.
        redirect("/dashboard/subscription?error=portal_error");
    }
}

export async function getAnalyticsData(overrideUserId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "No autenticado" };

    let targetUserId = user.id;

    // Check for impersonation
    if (overrideUserId && overrideUserId !== user.id) {
        // Verify admin role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === 'admin') {
            targetUserId = overrideUserId;
        } else {
            console.warn(`Unauthorized impersonation attempt by user ${user.id}`);
            // Fallback to own ID or error? Fallback seems safer/less noisy, but maybe error is better.
            // Let's fallback to own ID to prevent leaking data, effectively ignoring the param.
        }
    }

    // Use admin client if impersonating to ensure RLS doesn't block
    let db = supabase;
    if (targetUserId !== user.id) {
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
        db = supabaseAdmin as any;
    }

    try {
        const { data: posts, error } = await db
            .from("posts")
            .select("id, content, status, created_at, likes_count, comments_count, shares_count, image_url")
            .eq("client_id", targetUserId)
            .eq("status", "published") // Only published posts count for analytics
            .order("created_at", { ascending: false });

        if (error) throw error;

        const totalPosts = posts?.length || 0;
        const totalLikes = posts?.reduce((acc: number, post: any) => acc + (post.likes_count || 0), 0) || 0;
        const totalComments = posts?.reduce((acc: number, post: any) => acc + (post.comments_count || 0), 0) || 0;
        const totalShares = posts?.reduce((acc: number, post: any) => acc + (post.shares_count || 0), 0) || 0;

        const engagementRate = totalPosts > 0
            ? ((totalLikes + totalComments + totalShares) / totalPosts).toFixed(1)
            : "0";

        // Top Posts
        const topPosts = [...(posts || [])]
            .sort((a: any, b: any) => ((b.likes_count || 0) + (b.comments_count || 0)) - ((a.likes_count || 0) + (a.comments_count || 0)))
            .slice(0, 3);

        return {
            success: true,
            data: {
                overview: {
                    totalPosts,
                    totalLikes,
                    totalComments,
                    engagementRate
                },
                topPosts,
                recentPosts: posts?.slice(0, 5) || []
            }
        };

    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return { success: false, message: error.message };
    }
}

// --- Notification Actions ---

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }

    return data;
}

export async function markNotificationAsRead(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) {
        console.error("Error marking notification as read:", error);
    }
}

// --- LinkedIn Token Monitor ---

export async function checkLinkedInTokenStatus() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isValid: false };

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('linkedin_access_token, linkedin_token_expires_at')
        .eq('id', user.id)
        .single();

    if (error || !profile || !profile.linkedin_access_token) {
        return { isValid: false };
    }

    if (profile.linkedin_token_expires_at) {
        const expiresAt = new Date(profile.linkedin_token_expires_at);
        if (expiresAt < new Date()) {
            return { isValid: false };
        }
    }

    return { isValid: true };
}
