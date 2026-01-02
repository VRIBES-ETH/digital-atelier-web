import { NextResponse } from 'next/server';

// This is the specific hook for Digital Atelier Web (Admin Blog)
const CLOUDFLARE_DEPLOY_HOOK = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/322857bb-95f5-4ada-b109-7a77d20d97c3";

export async function POST() {
    try {
        const response = await fetch(CLOUDFLARE_DEPLOY_HOOK, {
            method: 'POST',
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, message: 'Cloudflare rejected the hook' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Build triggered' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Network error triggering build' }, { status: 500 });
    }
}
