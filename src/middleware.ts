import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // For the public website, we mainly use middleware for localized routing or simple headers if needed.
    // Currently, it's a pass-through.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
