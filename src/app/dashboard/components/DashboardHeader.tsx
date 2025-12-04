"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

import { Bell, ChevronRight } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function DashboardHeader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const getTitle = () => {
        if (pathname === '/dashboard') return 'Resumen Ejecutivo';
        if (pathname === '/dashboard/posts') return 'Gestión de Contenidos';
        if (pathname === '/dashboard/analytics') return 'Analítica de Rendimiento';
        if (pathname === '/dashboard/calendar') return 'Calendario Editorial';
        if (pathname === '/dashboard/profile') return 'Perfil & Preferencias';
        if (pathname === '/dashboard/subscription') return 'Suscripción y Pagos';
        return 'Dashboard';
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 md:hidden sticky top-0 z-10">
                <span className="font-poppins font-bold text-das-dark">DAS Suite</span>
            </header>

            {/* Top Bar (Desktop) */}
            <header className="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">
                        {getTitle()}
                        {userId && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Admin View</span>}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell />
                </div>
            </header>
        </>
    );
}
