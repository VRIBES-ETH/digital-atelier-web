import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Admin Authentication Protection
    if (path.startsWith('/vribesadmin')) {
        // Exclude the login page itself from protection to avoid infinite loop
        if (path === '/vribesadmin/login') {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('das_admin_session')?.value;

        if (!adminSession) {
            return NextResponse.redirect(new URL('/vribesadmin/login', request.url));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
