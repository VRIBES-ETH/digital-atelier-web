import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SimpleNavbar() {
    return (
        <nav className="fixed w-full z-40 top-8 bg-das-light/90 backdrop-blur-md border-b border-das-border transition-all">
            <div className="max-w-4xl mx-auto px-6 h-16 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group text-gray-500 hover:text-das-dark transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-barlow text-xs tracking-[0.2em] uppercase">Digital Atelier</span>
                </Link>
                <div className="flex items-center gap-3">
                    <span className="font-poppins font-bold text-lg tracking-tight">Blockcha-in</span>
                    <span className="text-[10px] border border-das-dark px-2 py-0.5 rounded-sm uppercase tracking-wide font-bold">Private Service</span>
                </div>
            </div>
        </nav>
    );
}
