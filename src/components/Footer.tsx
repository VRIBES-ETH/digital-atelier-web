'use client';

import { ArrowRight, CalendarClock, Linkedin, Newspaper, Mail } from 'lucide-react';
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Footer() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal("ui", { "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        })();
    }, []);

    return (
        <footer id="contacto" className="bg-white text-das-dark py-24 px-6 border-t border-das-border">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

                {/* Left Column: Copy */}
                <div className="reveal">
                    <span className="technical text-xs font-bold tracking-widest uppercase text-das-accent">Contacto</span>
                    <h2 className="font-poppins font-bold text-4xl md:text-5xl mt-4 mb-6 leading-tight">
                        Eleva el estándar de tu comunicación.
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mb-8">
                        Un copywriter especializado es el activo estratégico que diferencia a los proyectos líderes. Reserva 20 minutos para ver cómo potenciar tu autoridad y claridad.
                    </p>

                    <div className="flex flex-col gap-4 mt-8">
                        <a href="mailto:info@digitalateliersolutions.agency" className="text-sm font-bold uppercase tracking-wider hover:text-das-accent transition-colors flex items-center gap-2">
                            <Mail className="w-4 h-4" /> info@digitalateliersolutions.agency
                        </a>
                        <div className="flex gap-6 text-xs font-bold tracking-widest uppercase text-gray-400 mt-4">
                            <a href="https://www.linkedin.com/company/digital-atelier-solutions" target="_blank" className="hover:text-das-dark transition-colors flex items-center gap-2">
                                <Linkedin className="w-4 h-4" /> LinkedIn
                            </a>
                            <a href="https://www.linkedin.com/newsletters/digital-atelier-insights-7326874278258257921/" target="_blank" className="hover:text-das-dark transition-colors flex items-center gap-2">
                                <Newspaper className="w-4 h-4" /> Newsletter
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Card (Subtle) */}
                <div className="relative h-full flex items-center justify-center reveal delay-200">
                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-sm w-full max-w-md shadow-sm hover:shadow-md transition-shadow group">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-das-dark group-hover:scale-110 transition-transform duration-300">
                                <CalendarClock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold font-poppins text-lg">Consultoría Inicial</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">20 Minutos • Google Meet</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                            Hablemos de tus objetivos. Una sesión rápida para ver si encajamos, sin presión de venta.
                        </p>
                        <button
                            data-cal-link="vribes/consultoria-inicial-das"
                            data-cal-config='{"layout":"month_view"}'
                            className="w-full btn bg-das-dark text-white text-sm font-semibold tracking-wide uppercase py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            Reservar Hueco <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                <p>© 2025 Digital Atelier Solutions.</p>
                <div className="flex gap-4">
                    <a href="/aviso-legal" className="hover:text-das-dark">Aviso Legal</a>
                    <a href="/privacidad" className="hover:text-das-dark">Privacidad</a>
                </div>
            </div>
        </footer>
    );
}
