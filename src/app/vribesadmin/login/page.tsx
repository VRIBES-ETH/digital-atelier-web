'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions/admin-auth';
import { Loader2, Lock } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        try {
            const result = await loginAdmin(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            } else if (result?.success) {
                // Hard redirect to ensure cookie is respected by Middleware
                window.location.href = '/vribesadmin';
            }
        } catch (e: any) {
            console.error(e);
            setError(`Error: ${e.message || String(e)}`);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] relative">
            <div className="w-full max-w-sm p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-orange-950/30 rounded-full flex items-center justify-center border border-orange-900/50 mb-4">
                        <Lock className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-xl font-bold text-white font-display text-center">Acceso Restringido</h1>
                    <p className="text-zinc-500 text-sm mt-2 text-center">Digital Atelier Solutions Internal</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="sr-only">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Credencial de Acceso"
                            required
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-600 transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-950/30 border border-red-900/50 rounded text-red-400 text-xs text-center font-medium animate-pulse break-all">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar al Sistema'}
                    </button>
                </form>
            </div>
            <div className="absolute bottom-4 right-4 text-xs text-zinc-800">v2.1 (Debug)</div>
        </div>
    );
}
