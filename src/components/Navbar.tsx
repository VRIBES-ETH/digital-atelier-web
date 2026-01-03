"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <div className="hidden lg:flex items-center gap-8 font-barlow font-medium text-xs tracking-[0.15em] uppercase text-gray-600">
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
                    <Link href="/report-ejecutivo-2026" className="text-orange-600 hover:text-orange-700 transition-colors relative group font-bold">
                        Reporte 2026
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-600 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/blog" className="hover:text-das-dark transition-colors relative group">
                        Blog
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-das-dark transition-all group-hover:w-full"></span>
                    </Link>
                    <a href="mailto:info@digitalateliersolutions.agency" className="bg-das-dark text-white px-6 py-2.5 rounded-sm hover:bg-gray-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5 duration-300">
                        Contacto
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} className="lg:hidden p-2 text-das-dark z-50 relative">
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-das-dark/95 backdrop-blur-xl z-50 flex flex-col transition-all duration-500 ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>

                {/* Mobile Header (Logo + Close) */}
                <div className="flex justify-between items-center px-6 h-20 border-b border-white/10">
                    <div className="flex flex-col leading-none text-white">
                        <span className="font-poppins font-bold text-xl tracking-tighter">DIGITAL ATELIER</span>
                        <span className="font-barlow text-[10px] tracking-[0.2em] text-gray-400 uppercase">Solutions</span>
                    </div>
                    <button onClick={toggleMenu} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col justify-center items-center flex-1 gap-8">
                    <Link href="/#expertise" onClick={closeMenu} className="text-3xl font-playfair font-bold text-white hover:text-das-accent transition-colors tracking-tight">Expertise</Link>
                    <Link href="/#servicios" onClick={closeMenu} className="text-3xl font-playfair font-bold text-white hover:text-das-accent transition-colors tracking-tight">Servicios</Link>
                    <Link href="/blockchain" onClick={closeMenu} className="text-3xl font-playfair font-bold text-white hover:text-das-accent transition-colors tracking-tight">Blockcha-in</Link>
                    <Link href="/#proceso" onClick={closeMenu} className="text-3xl font-playfair font-bold text-white hover:text-das-accent transition-colors tracking-tight">Proceso</Link>
                    <Link href="/report-ejecutivo-2026" onClick={closeMenu} className="text-3xl font-playfair font-bold text-orange-500 hover:text-orange-400 transition-colors tracking-tight">Reporte 2026</Link>
                    <Link href="/blog" onClick={closeMenu} className="text-3xl font-playfair font-bold text-white hover:text-das-accent transition-colors tracking-tight">Blog</Link>
                </div>

                {/* Mobile Footer (CTA) */}
                <div className="p-8 border-t border-white/10 pb-12">
                    <a href="mailto:info@digitalateliersolutions.agency" className="block w-full text-center bg-white text-das-dark font-barlow font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-gray-200 transition-colors">
                        Iniciar Proyecto
                    </a>
                </div>
            </div>
        </nav>
    );
}
