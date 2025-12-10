import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
    return NextResponse.json({ message: 'Cron disabled for web-only build' });
}
