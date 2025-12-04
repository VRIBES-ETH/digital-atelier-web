"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Initialize Supabase Admin Client with Service Role Key
// This client bypasses RLS and has full access to the database
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

export async function inviteClientUser(formData: FormData) {
    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;
    const companyName = formData.get("companyName") as string;
    const planTier = formData.get("planTier") as string;
    const linkedinProfile = formData.get("linkedinProfile") as string;

    try {
        // 1. Invite user via Supabase Auth (sends email)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: {
                full_name: fullName,
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No se pudo invitar al usuario");

        // 2. Create/Update profile
        // The trigger might create it, but we ensure it's updated with our specific fields
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .update({
                company_name: companyName,
                plan_tier: planTier,
                linkedin_profile: linkedinProfile || null,
                role: "client",
                subscription_status: 'trialing', // Initial status
                updated_at: new Date().toISOString()
            })
            .eq("id", authData.user.id);

        if (profileError) throw profileError;

        revalidatePath("/admin/clients");
        return { success: true, message: "Invitación enviada correctamente" };
    } catch (error: any) {
        console.error("Error inviting client:", error);
        return { success: false, message: error.message };
    }
}

export async function createClientUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const companyName = formData.get("companyName") as string;
    const planTier = formData.get("planTier") as string;
    const linkedinProfile = formData.get("linkedinProfile") as string;

    try {
        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email so they can login immediately
            user_metadata: {
                full_name: fullName,
            },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No se pudo crear el usuario");

        // 2. Update profile with extra details (Company, Plan, LinkedIn)
        // The trigger 'on_auth_user_created' already created the row, we just update it
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .update({
                company_name: companyName,
                plan_tier: planTier,
                linkedin_profile: linkedinProfile || null,
                role: "client", // Ensure they are clients
                updated_at: new Date().toISOString()
            })
            .eq("id", authData.user.id);

        if (profileError) throw profileError;

        revalidatePath("/admin/clients");
        return { success: true, message: "Cliente creado correctamente" };
    } catch (error: any) {
        console.error("Error creating client:", error);
        return { success: false, message: error.message };
    }
}

export async function getClients(status: string = 'all') {
    try {
        let query = supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("role", "client")
            .order("full_name", { ascending: true });

        if (status === 'active') {
            query = query.eq('subscription_status', 'active');
        } else if (status === 'churned') {
            query = query.in('subscription_status', ['canceled', 'past_due', 'unpaid']);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error fetching clients:", error);
        return { success: false, error: error.message };
    }
}

export async function getAdminStats() {
    try {
        const { count: activeClients, error: clientsError } = await supabaseAdmin
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("role", "client");

        if (clientsError) throw clientsError;

        const { count: postsPublished, error: postsError } = await supabaseAdmin
            .from("posts")
            .select("*", { count: 'exact', head: true })
            .eq("status", "published");

        if (postsError) throw postsError;

        return {
            success: true,
            stats: {
                activeClients: activeClients || 0,
                postsPublished: postsPublished || 0,
                mrr: 15400, // Placeholder until payments are ready
                retention: 98 // Placeholder
            }
        };
    } catch (error: any) {
        console.error("Error fetching stats:", error);
        return { success: false, error: error.message };
    }
}

export async function createPost(formData: FormData) {
    const clientId = formData.get("clientId") as string;
    const content = formData.get("content") as string;
    const scheduledFor = formData.get("scheduledFor") as string;
    const status = formData.get("status") as string || "draft";
    const referenceLink = formData.get("referenceLink") as string;

    // Image handling
    const imageFile = formData.get("imageFile") as File;
    let imageUrl = formData.get("imageUrl") as string;

    try {
        // Upload image if provided
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('post-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw new Error("Error al subir la imagen");
            }

            const { data } = supabaseAdmin.storage
                .from('post-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        const { error } = await supabaseAdmin
            .from("posts")
            .insert({
                client_id: clientId,
                content,
                scheduled_for: scheduledFor || null,
                status,
                image_url: imageUrl || null,
                reference_link: referenceLink || null,
                created_at: new Date().toISOString(),
            });

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard"); // Update client dashboard too
        return { success: true, message: "Post creado correctamente" };
    } catch (error: any) {
        console.error("Error creating post:", error);
        return { success: false, message: error.message };
    }
}

export async function updatePost(formData: FormData) {
    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const scheduledFor = formData.get("scheduledFor") as string;
    const status = formData.get("status") as string;
    const referenceLink = formData.get("referenceLink") as string;
    const internalNotes = formData.get("internalNotes") as string;

    // Image handling
    const imageFile = formData.get("imageFile") as File;
    let imageUrl = formData.get("imageUrl") as string;

    try {
        // Upload image if provided
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('post-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw new Error("Error al subir la imagen");
            }

            const { data } = supabaseAdmin.storage
                .from('post-images')
                .getPublicUrl(filePath);

            imageUrl = data.publicUrl;
        }

        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                content,
                scheduled_for: scheduledFor || null,
                status,
                image_url: imageUrl || null,
                reference_link: referenceLink || null,
                internal_notes: internalNotes || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");
        return { success: true, message: "Post actualizado correctamente" };
    } catch (error: any) {
        console.error("Error updating post:", error);
        return { success: false, message: error.message };
    }
}

export async function getPosts() {
    try {
        const { data, error } = await supabaseAdmin
            .from("posts")
            .select(`
                *,
                profiles:client_id (full_name, company_name, id, linkedin_picture_url)
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return { success: false, error: error.message };
    }
}

export async function publishToLinkedIn(postId: string) {
    // Initialize admin client inside the function to ensure env vars are ready
    const { createClient } = await import("@supabase/supabase-js");

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    // console.log("Service Role Key present:", !!serviceRoleKey);
    // console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    try {
        // console.log("Attempting to publish post:", postId);

        // 1. Fetch Post first (simple query)
        const { data: post, error: postError } = await supabaseAdmin
            .from("posts")
            .select("*")
            .eq("id", postId)
            .single();

        if (postError) {
            console.error("Error fetching post (simple):", postError);
            throw new Error(`Error DB buscando post: ${postError.message}`);
        }

        if (!post) {
            console.error("Post not found in DB for ID:", postId);
            throw new Error("El post no existe en la base de datos");
        }

        // 2. Fetch Client Profile for LinkedIn Token
        // console.log("Fetching profile for client_id:", post.client_id);

        if (!post.client_id) {
            throw new Error("El post no tiene un cliente asignado (client_id es null)");
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("linkedin_access_token, linkedin_sub")
            .eq("id", post.client_id)
            .single();

        if (profileError || !profile) {
            console.error("Error fetching client profile:", profileError);
            throw new Error(`No se encontró el perfil del cliente asociado (ID: ${post.client_id})`);
        }

        if (!profile.linkedin_access_token || !profile.linkedin_sub) {
            throw new Error("El cliente no tiene LinkedIn conectado (Falta token o ID)");
        }

        const accessToken = profile.linkedin_access_token;
        const authorUrn = `urn:li:person:${profile.linkedin_sub}`;
        let assetUrn = null;

        // 3. Handle Image Upload (if exists)
        if (post.image_url) {
            // A. Register Upload
            const registerResponse = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    registerUploadRequest: {
                        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                        owner: authorUrn,
                        serviceRelationships: [{
                            relationshipType: "OWNER",
                            identifier: "urn:li:userGeneratedContent"
                        }]
                    }
                })
            });

            if (!registerResponse.ok) {
                const err = await registerResponse.text();
                console.error("LinkedIn Register Upload Error:", err);
                throw new Error("Error registrando subida de imagen en LinkedIn");
            }

            const registerData = await registerResponse.json();
            const uploadUrl = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
            assetUrn = registerData.value.asset;

            // B. Download Image from Supabase/URL
            const imageResponse = await fetch(post.image_url);
            const imageBlob = await imageResponse.blob();

            // C. Upload Binary to LinkedIn
            const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/octet-stream"
                },
                body: imageBlob
            });

            if (!uploadResponse.ok) {
                const err = await uploadResponse.text();
                console.error("LinkedIn Binary Upload Error:", err);
                throw new Error("Error subiendo imagen a LinkedIn");
            }
        }

        // 4. Create UGC Post
        const postBody: any = {
            author: authorUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: post.content
                    },
                    shareMediaCategory: assetUrn ? "IMAGE" : "NONE"
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        };

        if (assetUrn) {
            postBody.specificContent["com.linkedin.ugc.ShareContent"].media = [{
                status: "READY",
                description: { text: "Image" },
                media: assetUrn,
                title: { text: "Image" }
            }];
        }

        const publishResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postBody)
        });

        if (!publishResponse.ok) {
            const errorData = await publishResponse.json();
            console.error("LinkedIn API Error:", errorData);
            throw new Error(`Error publicando en LinkedIn: ${errorData.message || 'API Error'}`);
        }

        const publishData = await publishResponse.json();

        // 5. Update Post Status in DB
        await supabaseAdmin
            .from("posts")
            .update({
                status: "published",
                linkedin_post_id: publishData.id,
                published_at: new Date().toISOString()
            })
            .eq("id", postId);

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");

        return { success: true, message: "Post publicado en LinkedIn correctamente" };

    } catch (error: any) {
        console.error("Error publishing to LinkedIn:", error);
        return { success: false, message: error.message };
    }
}

export async function clearPostFeedback(postId: string) {
    try {
        const { error } = await supabaseAdmin
            .from("posts")
            .update({ feedback_notes: null })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");
        return { success: true, message: "Feedback resuelto y eliminado" };
    } catch (error: any) {
        console.error("Error clearing feedback:", error);
        return { success: false, message: error.message };
    }
}

export async function adminUpdateProfile(formData: FormData) {
    try {
        const userId = formData.get("userId") as string;
        const headline = formData.get("headline") as string;
        const keyExperience = formData.get("keyExperience") as string;
        const mainLanguage = formData.get("mainLanguage") as string;
        const toneOfVoice = formData.get("toneOfVoice") as string;
        const contentPillars = formData.get("contentPillars") as string; // JSON string
        const upcomingTopics = formData.get("upcomingTopics") as string; // JSON string
        const stripeCustomerId = formData.get("stripeCustomerId") as string;

        if (!userId) throw new Error("User ID is required");

        const { error } = await supabaseAdmin
            .from("profiles")
            .update({
                headline,
                key_experience: keyExperience,
                main_language: mainLanguage,
                tone_of_voice: toneOfVoice,
                content_pillars: JSON.parse(contentPillars || "[]"),
                upcoming_topics: JSON.parse(upcomingTopics || "[]"),
                stripe_customer_id: stripeCustomerId || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

        if (error) throw error;

        revalidatePath("/admin/clients");
        return { success: true, message: "Perfil actualizado correctamente" };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, message: error.message };
    }
}

export async function adminRequestChanges(postId: string, feedback: string) {
    try {
        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                status: "changes_requested",
                feedback_notes: feedback
            })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");
        return { success: true, message: "Solicitud de cambios enviada al cliente" };
    } catch (error: any) {
        console.error("Error requesting changes:", error);
        return { success: false, message: error.message };
    }
}

export async function adminSendComment(postId: string, feedback: string) {
    try {
        // Just update feedback, do NOT change status
        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                feedback_notes: `[CONSEJO] ${feedback}` // Prefix to distinguish if needed, or just rely on status
            })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");
        return { success: true, message: "Comentario enviado al cliente" };
    } catch (error: any) {
        console.error("Error sending comment:", error);
        return { success: false, message: error.message };
    }
}

export async function rejectPost(postId: string, feedback: string) {
    try {
        const { error } = await supabaseAdmin
            .from("posts")
            .update({
                status: "draft", // Revert to draft
                feedback_notes: `[RECHAZADO] ${feedback}` // Add prefix to distinguish
            })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");
        return { success: true, message: "Post rechazado y devuelto a borrador" };
    } catch (error: any) {
        console.error("Error rejecting post:", error);
        return { success: false, message: error.message };
    }
}

export async function runScheduledPublishing() {
    try {
        const now = new Date().toISOString();
        const { data: posts, error } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('status', 'scheduled')
            .lte('scheduled_for', now);

        if (error) throw error;

        if (!posts || posts.length === 0) {
            return { success: true, message: 'No hay posts programados para publicar ahora.' };
        }

        let publishedCount = 0;
        let errors = 0;

        for (const post of posts) {
            try {
                await publishToLinkedIn(post.id);
                publishedCount++;
            } catch (err) {
                console.error(`Failed to publish post ${post.id}:`, err);
                errors++;
            }
        }

        revalidatePath("/admin");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: `Proceso completado. Publicados: ${publishedCount}, Errores: ${errors}`
        };
    } catch (error: any) {
        console.error("Error running scheduled publishing:", error);
        return { success: false, message: error.message };
    }
}
export async function getRecentActivity() {
    try {
        // 1. Fetch recent posts (last 10 updated or created)
        const { data: posts, error: postsError } = await supabaseAdmin
            .from("posts")
            .select(`
                id,
                status,
                created_at,
                updated_at,
                profiles:client_id (full_name, company_name)
            `)
            .order("updated_at", { ascending: false })
            .limit(10);

        if (postsError) {
            console.error("Error fetching posts for activity:", postsError);
            throw postsError;
        }

        // 2. Fetch recent clients (last 5 updated/created)
        const { data: newClients, error: clientsError } = await supabaseAdmin
            .from("profiles")
            .select("id, full_name, company_name, updated_at")
            .eq("role", "client")
            .order("updated_at", { ascending: false })
            .limit(5);

        if (clientsError) {
            console.error("Error fetching clients for activity:", clientsError);
            throw clientsError;
        }

        // 3. Normalize and Merge
        const activities = [
            ...(posts || []).map((post: any) => ({
                id: post.id,
                type: 'post',
                clientName: post.profiles?.full_name || 'Desconocido',
                companyName: post.profiles?.company_name,
                action: mapPostStatusToAction(post.status),
                date: new Date(post.updated_at || post.created_at),
                status: post.status,
                details: post.id ? `Post #${post.id.substring(0, 6)}...` : 'Post'
            })),
            ...(newClients || []).map((client: any) => ({
                id: client.id,
                type: 'client',
                clientName: client.full_name,
                companyName: client.company_name,
                action: 'Nuevo cliente registrado',
                date: new Date(client.updated_at || new Date()), // Fallback if null
                status: 'new',
                details: 'Registro'
            }))
        ];

        // 4. Sort by date descending
        activities.sort((a, b) => b.date.getTime() - a.date.getTime());

        // 5. Return top 10
        return { success: true, data: activities.slice(0, 10) };

    } catch (error: any) {
        console.error("Error fetching activity:", JSON.stringify(error, null, 2));
        return { success: false, error: error.message || "Unknown error" };
    }
}


export async function syncPostMetrics() {
    try {
        // 1. Fetch published posts with LinkedIn IDs
        const { data: posts, error: postsError } = await supabaseAdmin
            .from("posts")
            .select(`
                id,
                linkedin_post_id,
                client_id,
                profiles:client_id (linkedin_access_token)
            `)
            .eq("status", "published")
            .not("linkedin_post_id", "is", null);

        if (postsError) throw postsError;

        let updatedCount = 0;
        let errors = 0;

        // 2. Iterate and fetch metrics
        for (const post of posts || []) {
            try {
                const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
                if (!profile?.linkedin_access_token) continue;

                const metrics = await fetchLinkedInMetrics(post.linkedin_post_id, profile.linkedin_access_token);

                if (metrics) {
                    await supabaseAdmin
                        .from("posts")
                        .update({
                            likes_count: metrics.likes,
                            comments_count: metrics.comments,
                            shares_count: metrics.shares,
                            metrics_updated_at: new Date().toISOString()
                        })
                        .eq("id", post.id);
                    updatedCount++;
                }
            } catch (err) {
                console.error(`Error syncing metrics for post ${post.id}:`, err);
                errors++;
            }
        }

        revalidatePath("/admin");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: `Sincronización completada. Actualizados: ${updatedCount}, Errores: ${errors}`
        };

    } catch (error: any) {
        console.error("Error syncing metrics:", error);
        return { success: false, message: error.message };
    }
}

async function fetchLinkedInMetrics(postUrn: string, accessToken: string) {
    try {
        // Ensure URN is properly encoded if needed, but usually passed as is
        // Endpoint: https://api.linkedin.com/v2/socialActions/{urn}
        const response = await fetch(`https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        if (!response.ok) {
            console.error(`LinkedIn API Error (${response.status}):`, await response.text());
            return null;
        }

        const data = await response.json();

        return {
            likes: data.likesSummary?.totalLikes || 0,
            comments: data.commentsSummary?.totalComments || 0,
            shares: 0 // Shares might need a different endpoint or are part of organizational entity
        };
    } catch (error) {
        console.error("Error fetching LinkedIn metrics:", error);
        return null;
    }
}

function mapPostStatusToAction(status: string) {
    switch (status) {
        case 'published': return 'Publicó un post';
        case 'approved': return 'Aprobó un post';
        case 'changes_requested': return 'Solicitó cambios';
        case 'pending_approval': return 'Envió a aprobación';
        case 'draft': return 'Creó un borrador';
        default: return 'Actualizó un post';
    }
}

export async function getReviewQueue() {
    try {
        const { data, error } = await supabaseAdmin
            .from("posts")
            .select(`
                id,
                content,
                status,
                created_at,
                scheduled_for,
                profiles:client_id (
                    id,
                    full_name,
                    company_name,
                    plan_tier,
                    linkedin_picture_url
                )
            `)
            .eq("status", "pending_approval")
            .order("created_at", { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("Error fetching review queue:", error);
        return { success: false, error: error.message };
    }
}

export async function getPostById(postId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from("posts")
            .select(`
                *,
                profiles:client_id (
                    id,
                    full_name,
                    company_name,
                    plan_tier,
                    linkedin_picture_url
                )
            `)
            .eq("id", postId)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error fetching post:", error);
        return { success: false, error: error.message };
    }
}

export async function approvePost(postId: string) {
    try {
        const { error } = await supabaseAdmin
            .from("posts")
            .update({ status: "scheduled", feedback_notes: null })
            .eq("id", postId);

        if (error) throw error;

        revalidatePath("/admin/content");
        revalidatePath("/dashboard");
        return { success: true, message: "Post aprobado y programado" };
    } catch (error: any) {
        console.error("Error approving post:", error);
        return { success: false, message: error.message };
    }
}
