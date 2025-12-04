"use client";

import { X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface AuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultSubject?: string;
}

export default function AuditModal({ isOpen, onClose, defaultSubject = "Solicitud de Auditoría de Comunicación - DAS" }: AuditModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-das-dark/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
                <div
                    className={`bg-white w-full max-w-lg rounded-sm shadow-2xl transform transition-all duration-300 relative pointer-events-auto ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                >
                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-das-dark transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h3 className="font-poppins font-bold text-2xl mb-2">Solicitar Auditoría</h3>
                            <p className="text-sm text-gray-500">Analizaremos tu comunicación actual y te diremos dónde estás perdiendo credibilidad institucional.</p>
                        </div>

                        <form action="mailto:info@digitalateliersolutions.agency" method="post" encType="text/plain" className="space-y-5">
                            <input type="hidden" name="subject" value={defaultSubject} />

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Nombre Completo</label>
                                <input type="text" name="nombre" required className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white" placeholder="Tu nombre" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Corporativo</label>
                                <input type="email" name="email" required className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white" placeholder="nombre@empresa.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">URL del Proyecto / Deck</label>
                                <input type="text" name="referencia" required className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white" placeholder="www.tuproyecto.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Objetivo Principal</label>
                                <div className="relative">
                                    <select name="objetivo" className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                                        <option value="Levantar Capital">Levantar Capital (Inversores)</option>
                                        <option value="Aprobación Regulatoria">Aprobación Regulatoria (Legal)</option>
                                        <option value="Partnerships B2B">Partnerships B2B</option>
                                        <option value="Captación Usuarios">Captación de Usuarios</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Detalles Adicionales</label>
                                <textarea name="detalles" rows={3} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-das-dark transition-colors bg-gray-50 focus:bg-white resize-none" placeholder="¿Algo específico que te preocupe?"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-das-dark text-white font-poppins font-bold py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Solicitar Auditoría
                            </button>

                            <p className="text-[10px] text-center text-gray-400 mt-4">
                                Al enviar, se abrirá tu cliente de correo predeterminado.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
