import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // SAFEGUARD: If Supabase keys are missing (Web-only mode), skip all auth logic
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return response
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes logic
    // Protected routes logic - TEMPORARILY DISABLED FOR WEB-ONLY DEPLOY
    /*
    if (user) {
        // If user is logged in, check their role
        // We can fetch this from the 'profiles' table we just created
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role || 'client'

        // 1. Admin trying to access Client Dashboard -> Redirect to Admin
        // EXCEPTION: Allow if impersonating (has userId param)
        const hasImpersonationParam = request.nextUrl.searchParams.has('userId');
        if (request.nextUrl.pathname.startsWith('/dashboard') && role === 'admin' && !hasImpersonationParam) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        // 2. Client trying to access Admin -> Redirect to Dashboard
        if (request.nextUrl.pathname.startsWith('/admin') && role === 'client') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // 3. Logged in user trying to access Login -> Redirect based on role
        if (request.nextUrl.pathname === '/login') {
            return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url))
        }
    } else {
        // Not logged in
        if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    */

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
