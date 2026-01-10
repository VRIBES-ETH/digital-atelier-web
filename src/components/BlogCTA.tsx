'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Linkedin } from 'lucide-react';

interface BlogCTAProps {
    type: 'linkedin_audit' | 'report_2026';
}

export default function BlogCTA({ type }: BlogCTAProps) {
    const isReport = type === 'report_2026';

    const content = isReport ? {
        icon: <FileText className="w-8 h-8 text-orange-500" />,
        title: "Informe Ejecutivo 2026",
        description: "Accede al análisis de tendencias en Digital Assets y Tokenización. Incluye roadmap estratégico.",
        buttonText: "Leer Reporte Privado",
        href: "/report-ejecutivo-2026",
        gradient: "from-orange-500/10 to-transparent",
        borderColor: "border-orange-500/30"
    } : {
        icon: <Linkedin className="w-8 h-8 text-[#0a66c2]" />,
        title: "¿Tu Perfil Genera Negocio?",
        description: "Recibe una auditoría gratuita de tu perfil de LinkedIn. Descubre si proyectas autoridad o ruido.",
        buttonText: "Solicitar Auditoría",
        href: "/analisis-linkedin",
        gradient: "from-blue-500/10 to-transparent",
        borderColor: "border-blue-500/30"
    };

    return (
        <div className={`relative overflow-hidden rounded-xl border ${content.borderColor} bg-white/5 backdrop-blur-sm p-8 my-12 group hover:border-opacity-100 transition-all`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${content.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="bg-white p-4 rounded-full shadow-sm shrink-0">
                    {content.icon}
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                        {content.title}
                    </h3>
                    <p className="text-gray-600 font-raleway text-sm leading-relaxed">
                        {content.description}
                    </p>
                </div>

                <Link
                    href={content.href}
                    className="shrink-0 bg-black text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                    {content.buttonText}
                    <ArrowRight className="w-4 h-4 text-orange-500" />
                </Link>
            </div>
        </div>
    );
}
