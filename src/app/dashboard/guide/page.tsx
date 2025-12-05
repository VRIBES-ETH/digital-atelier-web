"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, BookOpen, Shield, HelpCircle, ChevronDown, CheckCircle, AlertCircle } from "lucide-react";

interface AccordionItemProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

function AccordionItem({ title, icon: Icon, children, isOpen, onToggle }: AccordionItemProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${isOpen ? 'bg-das-dark text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-sm uppercase tracking-wider ${isOpen ? 'text-gray-900' : 'text-gray-600'}`}>
                        {title}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6 pt-0 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function GuidePage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">Digital Atelier Playbook</h1>
                <p className="text-gray-500">Manual de operaciones v1.0 para tu Private Suite.</p>
            </div>

            <div className="space-y-2">
                {/* SECCIÓN 1: Primeros Pasos */}
                <AccordionItem
                    title="Primeros Pasos: Configura tu Nodo"
                    icon={Zap}
                    isOpen={openIndex === 0}
                    onToggle={() => toggle(0)}
                >
                    <div className="space-y-4">
                        <p>
                            Bienvenido a tu centro de comando. Para empezar con el pie derecho, asegúrate de tener todo listo:
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>
                                    <strong>Perfil Ejecutivo:</strong> Completa tu perfil para definir tu voz y preferencias. Esto ayuda a la IA y a los editores a captar tu estilo.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span>
                                    <strong>Estado de LinkedIn:</strong> Verifica la barra lateral izquierda.
                                    <br />
                                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Conectado
                                    </span>
                                    <span className="mx-2 text-gray-400">vs</span>
                                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Requiere Acción
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </AccordionItem>

                {/* SECCIÓN 2: Flujos de Trabajo */}
                <AccordionItem
                    title="Flujos de Trabajo (Workflow)"
                    icon={BookOpen}
                    isOpen={openIndex === 1}
                    onToggle={() => toggle(1)}
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Básico</span>
                                Modo Co-Pilot ($25)
                            </h4>
                            <ol className="list-decimal list-inside space-y-2 text-xs text-gray-600">
                                <li>Añade una idea rápida al <strong>Bucket</strong>.</li>
                                <li>Ve a 'Mis Posts' y redacta el borrador.</li>
                                <li>Pulsa <strong>'Solicitar Revisión'</strong>.</li>
                                <li>Espera el feedback de tu editor.</li>
                                <li>Aplica correcciones y <strong>Programa</strong>.</li>
                            </ol>
                        </div>

                        <div className="bg-das-dark/5 p-4 rounded-lg border border-das-dark/10">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Premium</span>
                                Modo Ghostwriting
                            </h4>
                            <ol className="list-decimal list-inside space-y-2 text-xs text-gray-600">
                                <li>Recibes una <strong>notificación</strong> de nuevo post.</li>
                                <li>Revisas el borrador propuesto.</li>
                                <li>¿Te gusta? Pulsa <strong>'Aprobar y Programar'</strong>.</li>
                                <li>¿Cambios? Pulsa <strong>'Solicitar Cambios'</strong> y deja tus notas.</li>
                            </ol>
                        </div>
                    </div>
                </AccordionItem>

                {/* SECCIÓN 3: Herramientas */}
                <AccordionItem
                    title="Herramientas de la Suite"
                    icon={Shield}
                    isOpen={openIndex === 2}
                    onToggle={() => toggle(2)}
                >
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 text-orange-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Calendario Editorial</h4>
                                <p className="text-xs mt-1">
                                    Arrastra y suelta tus posts para reorganizar tu semana.
                                    <br />
                                    <span className="text-orange-600 font-medium">Naranja</span> = En proceso / Borrador.
                                    <br />
                                    <span className="text-green-600 font-medium">Verde</span> = Programado y listo.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 text-purple-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Bóveda de Activos</h4>
                                <p className="text-xs mt-1">
                                    Tu repositorio seguro. Sube aquí tus logos, fotos de perfil y recursos de marca.
                                    <span className="block mt-1 text-gray-400 italic text-[10px]">* Disponible solo en planes Ghostwriting.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                {/* SECCIÓN 4: FAQ */}
                <AccordionItem
                    title="FAQ Rápido"
                    icon={HelpCircle}
                    isOpen={openIndex === 3}
                    onToggle={() => toggle(3)}
                >
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">¿Puedo editar un post ya programado?</h4>
                            <p className="text-xs">
                                Sí, puedes hacerlo en cualquier momento. Sin embargo, por seguridad, el post volverá a estado <strong>Borrador</strong> para que confirmes la nueva versión antes de reprogramarlo.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">¿Caduca la conexión con LinkedIn?</h4>
                            <p className="text-xs">
                                Sí, las sesiones de seguridad de LinkedIn caducan cada <strong>60 días</strong>. El sistema te enviará una notificación y un correo cuando sea necesario reconectar.
                            </p>
                        </div>
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
}
