'use server';

export const runtime = 'edge';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
    const password = formData.get('password');
    const adminPassword = process.env.ADMIN_PASSWORD || 'DAS_ADMIN2026';

    if (password === adminPassword) {
        // Create session
        const cookieStore = await cookies();
        cookieStore.set('das_admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return { success: true };
    } else {
        return { error: 'Contraseña incorrecta' };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('das_admin_session');
    redirect('/vribesadmin/login');
}
