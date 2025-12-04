"use client";

import { useState } from "react";
import { ArrowRight, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (user) {
                // Fetch profile to know where to redirect
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                const role = profile?.role || 'client';

                if (role === 'admin') {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-das-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white rounded-sm shadow-2xl relative z-10 overflow-hidden">
                <div className="h-2 bg-das-accent w-full"></div>
                <div className="p-10">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6 group">
                            <span className="font-poppins font-bold text-2xl tracking-tighter text-das-dark">DIGITAL ATELIER</span>
                            <span className="block font-barlow text-[10px] tracking-[0.2em] text-gray-400 uppercase group-hover:text-das-accent transition-colors">Private Suite</span>
                        </Link>
                        <h2 className="font-poppins font-bold text-xl text-gray-800">Acceso Cliente</h2>
                        <p className="text-sm text-gray-500 mt-2">Introduce tus credenciales para gestionar tu contenido.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-3 rounded-sm text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Corporativo</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white"
                                placeholder="nombre@empresa.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-das-dark text-white font-poppins font-bold py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Verificando...</span>
                            ) : (
                                <>
                                    <span>Entrar a la Suite</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                            <Lock className="w-3 h-3" /> Conexión segura y encriptada
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
