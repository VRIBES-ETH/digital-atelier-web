import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = 'edge';

// function to get admin client safely
function getSupabaseAdmin() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return null; // Return null if keys are missing (e.g. in Web-only prod)
    }
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;
    const supabaseAdmin = getSupabaseAdmin();

    // If we don't have admin access (no keys), we can't update DB.
    // In "Web only" deployment, this is expected behavior.
    if (!supabaseAdmin) {
        console.warn("Supabase keys missing. Skipping DB update for Stripe webhook.");
        return new NextResponse(null, { status: 200 });
    }

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        await supabaseAdmin
            .from("profiles")
            .update({
                stripe_customer_id: subscription.customer as string,
                subscription_status: subscription.status,
                plan_tier: 'pro', // Assuming single plan for now, or map from priceId
                current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            })
            .eq("id", session.metadata.userId);
    }

    if (event.type === "customer.subscription.updated") {
        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_status: session.status,
                current_period_end: new Date(session.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_customer_id", session.customer);
    }

    if (event.type === "customer.subscription.deleted") {
        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_status: "canceled",
                current_period_end: new Date(session.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_customer_id", session.customer);
    }

    return new NextResponse(null, { status: 200 });
}
