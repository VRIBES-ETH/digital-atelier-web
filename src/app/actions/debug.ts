'use server';

// Zero-dependency ping to test Server Action infrastructure
export async function debugPing() {
    console.log('Debug Ping received');
    return {
        success: true,
        message: 'Debug Pong',
        timestamp: new Date().toISOString(),
        env: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
    };
}
