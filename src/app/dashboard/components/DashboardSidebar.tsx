"use client";

import { LayoutDashboard, FileText, Calendar, Settings, LogOut, User, BarChart3, Box, Lock, Book } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { checkLinkedInTokenStatus, getLinkedInAuthUrl } from "@/app/dashboard/actions";

function LinkedInStatusBadge() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');

    useEffect(() => {
        checkLinkedInTokenStatus().then(res => {
            setStatus(res.isValid ? 'connected' : 'disconnected');
        });
    }, []);

    const handleConnect = async () => {
        const url = await getLinkedInAuthUrl();
        window.location.href = url;
    };

    if (status === 'loading') return <span className="text-[9px] text-gray-500">Verificando...</span>;

    if (status === 'connected') {
        return (
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-bold text-green-400 uppercase tracking-wide">Conectado</span>
            </div>
        );
    }

    return (
        <button onClick={handleConnect} className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors">
            <span className="relative flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">Desconectado</span>
        </button>
    );
}

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);

    const userId = searchParams.get("userId");
    const queryParams = userId ? `?userId=${userId}` : "";

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const targetId = userId || user.id;
                const { data } = await supabase.from("profiles").select("*").eq("id", targetId).single();
                setProfile(data);
            }
        }
        fetchProfile();
    }, [userId]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/posts", label: "Mis Posts", icon: FileText },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/dashboard/calendar", label: "Calendario", icon: Calendar },
        { href: "/dashboard/assets", label: "Bóveda", icon: Box },
    ];

    const accountItems = [
        { href: "/dashboard/guide", label: "Guía de Uso", icon: Book },
        { href: "/dashboard/profile", label: "Perfil Ejecutivo", icon: User },
        { href: "/dashboard/subscription", label: "Suscripción", icon: Settings },
    ];

    function getInitials(name: string) {
        return name
            ?.split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'VR';
    }

    return (
        <aside className="w-64 bg-[#0F1115] text-white fixed h-full z-20 hidden md:flex flex-col border-r border-gray-800">
            <div className="p-8 mb-2">
                <Link href="/" className="flex flex-col leading-none group">
                    <h1 className="font-bold text-xl tracking-tight text-white">DIGITAL <span className="text-orange-500">ATELIER</span></h1>
                    <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mt-1">Private Suite</p>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isVault = item.label === "Bóveda";
                    const isLocked = isVault && profile?.plan_tier === 'copilot';

                    return (
                        <Link
                            key={item.href}
                            href={`${item.href}${queryParams}`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors 
                                ${isActive(item.href) ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                ${isLocked ? 'opacity-60' : ''}
                            `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                            {isLocked && <Lock className="w-3 h-3 ml-auto text-gray-500" />}
                        </Link>
                    );
                })}

                <div className="pt-6 mt-6 border-t border-gray-800">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cuenta</p>
                    {accountItems.map((item) => (
                        <Link
                            key={item.href}
                            href={`${item.href}${queryParams}`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <div className="p-4 mt-auto">
                {/* LinkedIn Status Footer en Sidebar */}
                <div className="pt-4 mt-auto border-t border-gray-800">
                    <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Estado</span>
                        <LinkedInStatusBadge />
                    </div>

                    {/* Perfil de Usuario */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {profile ? getInitials(profile.full_name) : '...'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-medium truncate">{profile?.full_name || 'Cargando...'}</p>
                            <p className="text-gray-400 text-xs truncate">Plan {profile?.plan_tier || '...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
