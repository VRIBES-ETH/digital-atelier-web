"use client";

import SimpleNavbar from "@/components/SimpleNavbar";
import AuditModal from "@/components/AuditModal";
import { Lock, XCircle, AlertOctagon, Check, CheckCircle, TrendingUp, Crown, Search, Target, MessageSquare, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlockchainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-screen bg-das-light text-das-dark overflow-x-hidden">
            {/* Texture */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-50 bg-noise mix-blend-multiply opacity-60"></div>

            {/* Status Bar */}
            {/* Status Bar */}
            <div className="bg-das-dark text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase py-3 text-center sticky top-0 z-50 flex justify-center items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-das-accent inline-block animate-pulse"></span>
                <span>Estado Actual: Solo 4 plazas disponibles para Q1 2026</span>
            </div>

            <SimpleNavbar />

            {/* HERO SECTION */}
            <header className="pt-40 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center reveal active">
                    <h2 className="font-poppins font-bold text-3xl md:text-5xl mb-8 leading-tight">
                        Tu tiempo vale más que <br />
                        <span className="text-gray-400">escribir posts de LinkedIn.</span>
                    </h2>
                    <p className="text-gray-600 mb-12 text-lg font-raleway">
                        Deja que <strong className="text-das-dark">un ghostwriter ejecutivo</strong> trabaje por ti, mientras tú diriges la empresa.
                    </p>
                    <div className="inline-block bg-gray-100 rounded-sm px-4 py-2 text-xs font-medium text-gray-600 mb-8">
                        No delego. No tengo juniors. Por eso hay lista de espera.
                    </div>

                    <button data-cal-namespace="blockcha-in" data-cal-link="vribes/blockcha-in" data-cal-config='{"layout":"month_view"}' className="premium-btn bg-das-dark text-white px-10 py-4 rounded-sm font-bold tracking-widest uppercase text-xs hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        Aplicar para Acceso
                    </button>

                    <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-wider">
                        *Proceso de selección activo. Solo perfiles cualificados.
                    </p>
                </div>
            </header>

            {/* THE PAIN */}
            <section className="py-20 px-6 bg-white border-y border-das-border">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 reveal">
                            <h2 className="text-2xl font-bold font-poppins">Tu competencia está ocupando el vacío que dejas.</h2>
                            <p className="text-gray-600">Mientras tú cierras acuerdos en privado, otros con la mitad de tu experiencia están construyendo la autoridad pública que te corresponde.</p>

                            <div className="space-y-4 pt-4">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-red-50 p-2 rounded text-red-900"><XCircle className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">El coste de oportunidad</h4>
                                        <p className="text-xs text-gray-500">Inversores y reguladores buscan voces autorizadas en LinkedIn. Si no estás, asumen que no tienes opinión.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-red-50 p-2 rounded text-red-900"><AlertOctagon className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">El riesgo de delegar mal</h4>
                                        <p className="text-xs text-gray-500">Dejar tu marca personal a una agencia generalista es un riesgo de reputación que no puedes permitirte.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 border border-gray-100 rounded-sm relative reveal delay-200">
                            <div className="absolute -top-3 -right-3 bg-das-dark text-white px-3 py-1 text-xs font-bold uppercase tracking-widest transform rotate-2 shadow-lg">La Realidad</div>
                            <blockquote className="font-raleway text-lg italic leading-relaxed text-gray-700">
                                "Víctor, sé que debo publicar. Pero entre el board, Compliance y la operativa diaria, LinkedIn siempre queda para mañana. Y ese 'mañana' nunca llega."
                            </blockquote>
                            <div className="mt-6 flex items-center gap-3 opacity-60">
                                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">CEO Fintech (Cliente actual)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE BOUTIQUE DIFFERENCE */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 reveal">
                            <span className="text-das-accent font-bold tracking-widest uppercase text-xs mb-2 block">El enfoque Boutique</span>
                            <h2 className="text-3xl font-bold mb-6">No es una agencia.<br />Es una alianza estratégica.</h2>
                            <div className="prose text-gray-600 font-raleway space-y-4">
                                <p>Las agencias escalan contratando juniors. Yo escalo seleccionando mejores clientes. Esa diferencia lo cambia todo.</p>
                                <p><strong>Soy Víctor Ribes.</strong> No hay account managers, no hay teléfono roto. Tú hablas conmigo, yo escribo para ti.</p>
                                <p>Entiendo la diferencia entre PoS y PoW. Sé por qué MiCA cambia las reglas del juego. No necesito que me expliques tu industria.</p>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="md:w-1/2 w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden reveal delay-200">
                            <div className="grid grid-cols-2 text-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 bg-gray-50">
                                <div className="py-3 text-gray-400">Agencia Tradicional</div>
                                <div className="py-3 bg-das-dark text-white">Digital Atelier</div>
                            </div>
                            <div className="divide-y divide-gray-100 text-sm">
                                <div className="grid grid-cols-2 p-4">
                                    <div className="text-gray-500">Escribe un Junior/IA</div>
                                    <div className="font-bold text-das-dark">Escribe Víctor Ribes</div>
                                </div>
                                <div className="grid grid-cols-2 p-4">
                                    <div className="text-gray-500">Objetivo: Volumen</div>
                                    <div className="font-bold text-das-dark">Objetivo: Autoridad</div>
                                </div>
                                <div className="grid grid-cols-2 p-4">
                                    <div className="text-gray-500">Riesgo reputacional</div>
                                    <div className="font-bold text-das-dark">Compliance-First</div>
                                </div>
                                <div className="grid grid-cols-2 p-4">
                                    <div className="text-gray-500">Tono genérico</div>
                                    <div className="font-bold text-das-dark">Tu voz exacta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE METHOD */}
            <section className="py-24 px-6 bg-das-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-4xl font-bold">Máximo impacto. Mínima fricción.</h2>
                        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                            Tu tiempo vale más que el dinero. He diseñado un proceso que solo requiere 60 minutos de tu mes para generar 30 días de presencia ejecutiva.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        {/* Step 1 */}
                        <div className="p-6 border border-white/10 bg-white/5 rounded-sm hover:border-das-accent/50 transition-colors group reveal delay-100">
                            <div className="text-4xl font-bold text-white/10 group-hover:text-das-accent transition-colors mb-4">01</div>
                            <h3 className="text-lg font-bold mb-2">Voiceboard™</h3>
                            <p className="text-sm text-gray-400">Capturo tu tono y pensamiento estratégico en una sesión de onboarding. Sin cuestionarios infinitos.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="p-6 border border-white/10 bg-white/5 rounded-sm hover:border-das-accent/50 transition-colors group reveal delay-200">
                            <div className="text-4xl font-bold text-white/10 group-hover:text-das-accent transition-colors mb-4">02</div>
                            <h3 className="text-lg font-bold mb-2">Ghostwriting</h3>
                            <p className="text-sm text-gray-400">Transformo tus ideas en narrativas de negocio. Uso frameworks persuasivos adaptados a B2B institucional.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="p-6 border border-white/10 bg-white/5 rounded-sm hover:border-das-accent/50 transition-colors group reveal delay-300">
                            <div className="text-4xl font-bold text-white/10 group-hover:text-das-accent transition-colors mb-4">03</div>
                            <h3 className="text-lg font-bold mb-2">Aprobación</h3>
                            <p className="text-sm text-gray-400">Revisas en Notion. Un clic para aprobar. Yo me encargo de publicar, comentar y medir.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING TIERS */}
            <section id="pricing" className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
                        <div>
                            <h2 className="text-3xl font-bold">Membresías Trimestrales</h2>
                            <p className="text-gray-600 mt-2">Trabajo artesanal. Calidad sobre volumen. Plazas estrictamente limitadas.</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest text-das-dark">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Abierto para Q2
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* SEED */}
                        <div className="bg-white p-8 border border-gray-200 rounded-sm opacity-75 hover:opacity-100 transition-opacity reveal delay-100">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl font-poppins text-gray-500">SEED</h3>
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold">$500</span><span className="text-sm text-gray-400">/mes</span>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600 mb-8">
                                <li className="flex gap-2"><Check className="w-4 h-4 text-das-dark" /> Presencia mínima viable</li>
                                <li className="flex gap-2"><Check className="w-4 h-4 text-das-dark" /> 2-3 posts semanales</li>
                                <li className="flex gap-2"><Check className="w-4 h-4 text-das-dark" /> Auditoría básica</li>
                            </ul>
                            <button data-cal-namespace="blockcha-in" data-cal-link="vribes/blockcha-in" data-cal-config='{"layout":"month_view"}' className="block w-full text-center border border-gray-300 text-gray-600 py-3 text-xs font-bold uppercase tracking-widest hover:border-das-dark hover:text-das-dark transition-colors cursor-pointer">Solicitar</button>
                        </div>

                        {/* GROWTH (MAIN) */}
                        <div className="bg-white p-8 border-2 border-das-dark rounded-sm shadow-xl relative transform scale-105 z-10 reveal delay-200 ring-2 ring-das-accent shadow-glow">
                            <div className="absolute top-0 inset-x-0 bg-das-dark text-white text-[10px] font-bold uppercase tracking-widest text-center py-1">Opción Recomendada</div>
                            <div className="flex justify-between items-start mb-4 mt-2">
                                <h3 className="font-bold text-xl font-poppins">GROWTH</h3>
                                <TrendingUp className="w-5 h-5 text-das-dark" />
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$900</span><span className="text-sm text-gray-400">/mes</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
                                Para ejecutivos que quieren liderar la conversación en su nicho.
                            </p>
                            <ul className="space-y-3 text-sm text-das-dark mb-8 font-medium">
                                <li className="flex gap-2"><CheckCircle className="w-4 h-4" /> <strong>3-4 posts semanales</strong></li>
                                <li className="flex gap-2"><CheckCircle className="w-4 h-4" /> Gestión de comentarios (Growth Hacking)</li>
                                <li className="flex gap-2"><CheckCircle className="w-4 h-4" /> Optimización mensual</li>
                                <li className="flex gap-2"><CheckCircle className="w-4 h-4" /> Soporte prioritario</li>
                            </ul>
                            <button data-cal-namespace="blockcha-in" data-cal-link="vribes/blockcha-in" data-cal-config='{"layout":"month_view"}' className="block w-full text-center bg-das-dark text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer">Aplicar ahora</button>
                        </div>

                        {/* AUTHORITY (WAITLIST) */}
                        <div className="bg-gray-50 p-8 border border-gray-200 rounded-sm relative overflow-hidden reveal delay-300">
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-6">
                                <span className="bg-das-dark text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-2">Lista de Espera</span>
                                <p className="text-xs text-gray-600 font-medium">Actualmente al máximo de capacidad para este nivel.</p>
                                <button data-cal-namespace="blockcha-in" data-cal-link="vribes/blockcha-in" data-cal-config='{"layout":"month_view"}' className="mt-4 underline text-xs font-bold text-das-dark cursor-pointer">Consultar disponibilidad</button>
                            </div>

                            <div className="flex justify-between items-start mb-4 opacity-50">
                                <h3 className="font-bold text-xl font-poppins">AUTHORITY</h3>
                                <Crown className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="mb-6 opacity-50">
                                <span className="text-3xl font-bold">$1,500</span><span className="text-sm text-gray-400">/mes</span>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-500 mb-8 opacity-50">
                                <li className="flex gap-2"><Check className="w-4 h-4" /> Full C-Suite Service</li>
                                <li className="flex gap-2"><Check className="w-4 h-4" /> 5-6 posts semanales</li>
                                <li className="flex gap-2"><Check className="w-4 h-4" /> PR & Media Relations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section id="auditoria" className="py-24 px-6 bg-das-dark text-white text-center relative overflow-hidden">
                <div className="max-w-2xl mx-auto relative z-10 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">No contrates un servicio.<br />Aplica a una vacante.</h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Para garantizar la calidad de mi trabajo, mantengo un límite estricto de clientes activos. El primer paso es una auditoría ejecutiva de 30 min para ver si encajamos.
                    </p>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm max-w-lg mx-auto mb-8 text-left">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Tu aplicación incluye:</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex gap-3"><Search className="w-4 h-4 text-das-accent" /> Auditoría de tu perfil actual (Riesgos/Oportunidades)</li>
                            <li className="flex gap-3"><Target className="w-4 h-4 text-das-accent" /> Estrategia de posicionamiento preliminar</li>
                            <li className="flex gap-3"><MessageSquare className="w-4 h-4 text-das-accent" /> Validación de tono y química de trabajo</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="premium-btn inline-flex items-center gap-3 bg-white text-das-dark px-10 py-5 font-bold rounded-sm hover:bg-gray-100 transition-colors shadow-2xl"
                    >
                        <span>Solicitar Entrevista de Acceso</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest">
                        Sin compromiso. Si no encajamos, te lo diré honestamente.
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 bg-[#0a0c0f] border-t border-white/5 text-gray-600 text-xs flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
                <p>© 2025 Digital Atelier Solutions. Todos los derechos reservados.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="/privacidad" className="hover:text-gray-400">Privacidad</a>
                    <a href="/aviso-legal" className="hover:text-gray-400">Aviso Legal</a>
                    <a href="https://linkedin.com" className="hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
                </div>
            </footer>

            <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultSubject="Aplicación Blockcha-in - DAS" />
        </main >
    );
}
