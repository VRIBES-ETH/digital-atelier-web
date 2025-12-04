"use client";

import { LayoutGrid, Users, PenTool, Settings, LogOut, Calendar, Search, Bell, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: "/admin", icon: LayoutGrid, label: "Overview" },
        { href: "/admin/clients", icon: Users, label: "Clientes" },
        { href: "/admin/content", icon: PenTool, label: "Contenido" },
        { href: "/admin/calendar", icon: Calendar, label: "Calendario" },
        { href: "/admin/settings", icon: Settings, label: "Configuración" },
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FA] text-gray-900 font-sans">
            {/* 1. SIDEBAR (Oscura para consistencia) */}
            <aside className="w-20 flex flex-col items-center py-6 bg-[#0F1115] shrink-0 fixed h-full z-30">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-white mb-8 text-lg shadow-lg shadow-orange-900/20">DA</div>

                <nav className="flex-1 space-y-4 w-full px-3 flex flex-col items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${isActive(item.href)
                                    ? 'bg-white text-black shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <item.icon size={20} />
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto mb-4 flex flex-col items-center gap-4">
                    <button
                        onClick={async () => {
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            window.location.href = '/login';
                        }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-white text-xs font-bold">
                        VR
                    </div>
                </div>
            </aside>

            {/* 2. MAIN AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden ml-20">

                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-gray-900">
                        {pathname === '/admin' && 'Panel de Control'}
                        {pathname === '/admin/clients' && 'Gestión de Clientes'}
                        {pathname === '/admin/content' && 'Producción de Contenido'}
                        {pathname === '/admin/calendar' && 'Calendario Editorial'}
                        {pathname === '/admin/settings' && 'Configuración'}
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="relative w-96 hidden md:block">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar cliente, post o estado..."
                                className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        <button className="text-gray-500 hover:text-gray-900 relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
                    <div className="p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

