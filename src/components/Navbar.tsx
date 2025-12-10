"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ "namespace": "consultoria-inicial-das" });
            cal("ui", { "styles": { "branding": { "brandColor": "#0f1115" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        })();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = !isMenuOpen ? "hidden" : "";
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = "";
    };

    return (
        <nav className="fixed w-full z-40 top-0 transition-all duration-300 bg-das-light/80 backdrop-blur-md border-b border-das-border">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex flex-col leading-none group z-50 relative">
                    <span className="font-poppins font-bold text-xl tracking-tighter group-hover:opacity-70 transition-opacity">DIGITAL ATELIER</span>
                    <span className="font-barlow text-[10px] tracking-[0.2em] text-gray-500 uppercase">Solutions</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-barlow font-medium text-xs tracking-[0.15em] uppercase text-gray-600">
                    <Link href="/#expertise" className="hover:text-das-dark transition-colors relative group">
                        Expertise
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-das-dark transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/#servicios" className="hover:text-das-dark transition-colors relative group">
                        Servicios
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-das-dark transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/blockchain" className="hover:text-das-dark transition-colors relative group">
                        Blockcha-in
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-das-dark transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/#proceso" className="hover:text-das-dark transition-colors relative group">
                        Proceso
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-das-dark transition-all group-hover:w-full"></span>
                    </Link>
                    <button data-cal-namespace="consultoria-inicial-das" data-cal-link="vribes/consultoria-inicial-das" data-cal-config='{"layout":"month_view"}' className="bg-das-dark text-white px-6 py-2.5 rounded-sm hover:bg-gray-800 active:bg-gray-900 transition-all hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 duration-300 cursor-pointer">
                        Agenda tu Llamada
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} className="md:hidden p-2 text-das-dark z-50 relative">
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-das-light z-40 flex flex-col justify-center items-center transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="flex flex-col gap-8 text-center font-poppins text-2xl font-bold">
                    <Link href="/#expertise" onClick={closeMenu} className="hover:text-gray-500 active:scale-95 transition-all">Expertise</Link>
                    <Link href="/#servicios" onClick={closeMenu} className="hover:text-gray-500 active:scale-95 transition-all">Servicios</Link>
                    <Link href="/blockchain" onClick={closeMenu} className="hover:text-gray-500 active:scale-95 transition-all">Blockcha-in</Link>
                    <Link href="/#proceso" onClick={closeMenu} className="hover:text-gray-500 active:scale-95 transition-all">Proceso</Link>
                    <button data-cal-namespace="consultoria-inicial-das" data-cal-link="vribes/consultoria-inicial-das" data-cal-config='{"layout":"month_view"}' className="mt-4 bg-das-dark text-white px-8 py-3 rounded-sm active:bg-gray-800 active:scale-95 transition-all text-base w-full max-w-xs mx-auto cursor-pointer">Agenda tu Llamada</button>
                </div>
            </div>
        </nav>
    );
}
