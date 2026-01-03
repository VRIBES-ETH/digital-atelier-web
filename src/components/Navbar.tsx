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

            {/* Mobile Menu Backdrop & Drawer */}
            <div className={`fixed inset-0 z-50 flex justify-end transition-visibility duration-300 ${isMenuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"}`}>

                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={closeMenu}
                ></div>

                {/* Drawer */}
                <div
                    style={{ backgroundColor: "#ffffff" }}
                    className={`relative h-full w-[300px] !bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-50 border-l border-gray-100 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 h-16 border-b border-gray-200 shrink-0">
                        <div className="flex flex-col leading-none">
                            <span className="font-poppins font-bold text-lg tracking-tighter text-das-dark">DIGITAL ATELIER</span>
                            <span className="font-barlow text-[9px] tracking-[0.2em] text-gray-500 uppercase">Solutions</span>
                        </div>
                        <button onClick={toggleMenu} className="p-2 text-das-dark hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Links - Centered & Flexible */}
                    <div className="flex flex-col flex-1 justify-center px-8 gap-5">
                        <Link href="/#expertise" onClick={closeMenu} className="text-sm font-barlow font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-das-dark transition-colors">Expertise</Link>
                        <Link href="/#servicios" onClick={closeMenu} className="text-sm font-barlow font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-das-dark transition-colors">Servicios</Link>
                        <Link href="/blockchain" onClick={closeMenu} className="text-sm font-barlow font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-das-dark transition-colors">Blockcha-in</Link>
                        <Link href="/#proceso" onClick={closeMenu} className="text-sm font-barlow font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-das-dark transition-colors">Proceso</Link>
                        <Link href="/report-ejecutivo-2026" onClick={closeMenu} className="text-sm font-barlow font-bold tracking-[0.15em] uppercase text-orange-600 hover:text-orange-700 transition-colors">Reporte 2026</Link>
                        <div className="h-px bg-gray-200 w-full my-2"></div>
                        <Link href="/blog" onClick={closeMenu} className="text-sm font-barlow font-bold tracking-[0.15em] uppercase text-gray-700 hover:text-das-dark transition-colors">Blog</Link>
                    </div>

                    {/* Footer CTA */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 shrink-0">
                        <a href="mailto:info@digitalateliersolutions.agency" className="block w-full text-center bg-das-dark text-white font-barlow font-bold uppercase tracking-widest py-3 text-xs rounded-sm hover:bg-gray-800 transition-colors shadow-sm">
                            Iniciar Proyecto
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
