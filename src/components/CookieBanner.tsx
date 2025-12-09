"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('das-cookie-consent');
        if (!consent) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('das-cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-das-dark text-white p-4 border-t border-white/10 z-[100] reveal active">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs md:text-sm text-gray-300 text-center md:text-left">
                    Usamos cookies propias y de terceros (Spotify, Cal.com) para mejorar tu experiencia. Al continuar navegando, aceptas su uso.
                    <Link href="/privacidad" className="underline ml-1 hover:text-white">Ver Política</Link>
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={acceptCookies}
                        className="bg-white text-das-dark px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
