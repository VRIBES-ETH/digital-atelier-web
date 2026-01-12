"use client";

import SimpleNavbar from "@/components/SimpleNavbar";
// import AuditModal from "@/components/AuditModal"; // Removed for Web-only build
import { Lock, XCircle, AlertOctagon, Check, CheckCircle, TrendingUp, Crown, Search, Target, MessageSquare, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const FAQS = [
    {
        question: "¿Qué hace exactamente un Ghostwriter Blockchain?",
        answer: "Un <strong>Escritor Fantasma (Ghostwriter)</strong> especializado en Blockchain traduce tu conocimiento técnico y visión estratégica en contenido de alto impacto para LinkedIn. A diferencia de un redactor generalista, entiendo la diferencia entre PoS y PoW, las implicaciones de MiCA y el lenguaje que esperan los inversores institucionales."
    },
    {
        question: "¿Es seguro para CEOs de empresas reguladas (Fintech)?",
        answer: "Absolutamente. Mi metodología <strong>Compliance-First</strong> implica que ningún contenido se publica sin tu validación final. Entiendo las líneas rojas de la CNMV/SEC y redacto con la prudencia necesaria para evitar riesgos reputacionales, enfocándome en liderazgo de pensamiento (Thought Leadership) y no en consejos financieros."
    },
    {
        question: "¿Por qué LinkedIn y no Twitter/X?",
        answer: "Twitter es para el \"degen\" y la especulación rápida. <strong>LinkedIn es donde están el capital institucional, los partners estratégicos y el talento senior.</strong> Si tu objetivo es levantar una ronda Serie A/B o cerrar acuerdos B2B, tu reputación debe construirse en LinkedIn."
    },
    {
        question: "¿Cuánto tiempo requiere de mí? (El factor ROI)",
        answer: "<strong>La eficiencia es mi obsesión.</strong> Solo necesito 45-60 minutos al mes de entrevista grabada. De ahí extraigo el \"oro\" (tus tesis, historias y visión) y me encargo de toda la redacción, edición y estrategia. Tú solo revisas y das el \"ok\" final."
    },
    {
        question: "¿En qué te diferencias de una Agencia de PR Crypto?",
        answer: "PR busca \"alquilar\" audiencias de terceros (notas de prensa, menciones). Yo construyo <strong>tu propio canal de distribución</strong> y activo digital. Una nota de prensa muere en 24h; tu perfil de LinkedIn es un <em>compounder</em> que gana valor con el tiempo."
    },
    {
        question: "¿Escribes sobre precio o trading?",
        answer: "Solo si tu marca profesional lo requiere, y desde una perspectiva profesional y regulada. Nos enfocamos más en Infraestructura, Tesis de Inversión, Regulación (MiCA) y Casos de Uso Institucionales. Cero consejos financieros (NFA). Cero \"shilling\". Solo liderazgo de pensamiento serio."
    }
];

export default function BlockchainPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

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

            {/* BARRA DE ESCASEZ */}
            <div className="bg-das-dark text-white text-[10px] md:text-xs font-bold tracking-widest uppercase py-2 text-center border-b border-white/10 relative z-50">
                <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-das-accent animate-pulse"></span>
                    Estado Actual: Solo 2 plazas disponibles para Q2 2025
                </span>
            </div>

            <SimpleNavbar />

            {/* HERO SECTION */}
            <header className="pt-40 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center reveal">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                        Ghostwriting Blockchain para Ejecutivos<br />
                        <span className="text-gray-400">que lideran, no que escriben.</span>
                    </h1>

                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
                        El único servicio de <strong>Ghostwriting Blockchain</strong> y <strong>Escritor Fantasma</strong> diseñado para ejecutivos Fintech que entienden que, en este sector regulado, <strong>el silencio en LinkedIn es el error más caro</strong>.
                        <br /><br />
                        <span className="text-sm font-medium text-das-dark/80 bg-gray-200/50 px-2 py-1 rounded">No delego. No tengo juniors. Comunicación financiera y tecnológica de alto nivel.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://www.blockcha-in.com"
                            className="premium-btn inline-block bg-das-dark text-white px-8 py-4 font-poppins font-semibold text-sm tracking-wide uppercase rounded-sm shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                        >
                            Solicitar Acceso en Blockcha-in.com
                        </a>
                        <span className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 sm:hidden">
                            <Lock className="w-3 h-3" /> Plazas limitadas
                        </span>
                    </div>

                    <p className="mt-6 text-xs text-gray-400 font-medium">
                        *Proceso de selección activo. Solo perfiles cualificados.
                    </p>
                </div>
            </header>

            {/* THE PAIN */}
            <section className="py-20 px-6 bg-white border-y border-das-border">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 reveal">
                            <h2 className="text-2xl font-bold font-poppins">El dilema del CEO Blockchain 2026: Tu competencia ocupa tu vacío.</h2>
                            <p className="text-gray-600">Mientras tú cierras acuerdos en privado y diriges tu compañía, otros perfiles con menos experiencia están construyendo la autoridad pública que te corresponde como líder en Finanzas y Tecnología.</p>

                            <div className="space-y-4 pt-4">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-red-50 p-2 rounded text-red-900"><XCircle className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">El coste de oportunidad</h4>
                                        <p className="text-xs text-gray-500">Inversores y reguladores buscan y confían en voces autorizadas en LinkedIn. Si no estás, asumen que no tienes autoridad.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-red-50 p-2 rounded text-red-900"><AlertOctagon className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">El riesgo de delegar mal</h4>
                                        <p className="text-xs text-gray-500">Dejar tu marca personal a una agencia generalista o a un equipo de marketing sin experiencia en LinkedIn es un riesgo reputacional que no puedes permitirte.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#ECE5DD] p-6 rounded-lg relative reveal delay-200 shadow-inner border border-black/5 flex flex-col justify-center min-h-[200px]">
                            <div className="absolute -top-3 -right-3 bg-das-dark text-white px-3 py-1 text-xs font-bold uppercase tracking-widest transform rotate-2 shadow-lg z-10">La Realidad</div>

                            {/* WhatsApp Message Bubble (Incoming) */}
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm relative max-w-[95%] self-start">
                                {/* Bubble Tail */}
                                <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"></div>

                                {/* Sender Name */}
                                <p className="text-[11px] font-bold text-[#D65F29] mb-1 font-sans">CEO Fintech (Cliente actual)</p>

                                {/* Message Text */}
                                <p className="text-[13px] leading-relaxed text-gray-800 font-sans">
                                    Víctor, sé que debo empezar a publicar en mi perfil. Pero entre el board, compliance y la operativa diaria, LinkedIn siempre se me queda para mañana. Y ese 'mañana' nunca llega ¿puedes hablar ahora?
                                </p>

                                {/* Time */}
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-gray-400 font-sans">19:42</span>
                                </div>
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
                                    <div className="font-bold text-das-dark">Tu Escritor Fantasma (Víctor Ribes)</div>
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
                            <a href="https://www.blockcha-in.com" className="block text-center border border-gray-300 text-gray-600 py-3 text-xs font-bold uppercase tracking-widest hover:border-das-dark hover:text-das-dark transition-colors">Solicitar en Blockcha-in.com</a>
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
                            <a href="https://www.blockcha-in.com" className="block text-center bg-das-dark text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">Aplicar en Blockcha-in.com</a>
                        </div>

                        {/* AUTHORITY (WAITLIST) */}
                        <div className="bg-gray-50 p-8 border border-gray-200 rounded-sm relative overflow-hidden reveal delay-300">
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-6">
                                <span className="bg-das-dark text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-2">Lista de Espera</span>
                                <p className="text-xs text-gray-600 font-medium">Actualmente al máximo de capacidad para este nivel.</p>
                                <a href="https://www.blockcha-in.com" className="mt-4 underline text-xs font-bold text-das-dark">Unirme a la lista en Blockcha-in.com</a>
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

            {/* FAQ SECTION for Semantic Density */}
            <section className="py-24 px-6 bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-das-dark">Preguntas Frecuentes sobre <span className="text-gray-400">Ghostwriting Ejecutivo</span></h2>

                    <div className="space-y-4">
                        {FAQS.map((faq, index) => (
                            <div
                                key={index}
                                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'bg-gray-50 border-das-dark/20 shadow-sm' : 'bg-white hover:border-gray-300'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                >
                                    <span className={`font-bold text-lg font-poppins ${openFaqIndex === index ? 'text-das-dark' : 'text-gray-700'}`}>
                                        {faq.question}
                                    </span>
                                    {openFaqIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-das-dark flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100/50 mt-2">
                                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section id="auditoria" className="py-24 px-6 bg-das-dark text-white text-center relative overflow-hidden">
                <div className="max-w-2xl mx-auto relative z-10 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">No contratas un servicio.<br />Aplicas a una vacante.</h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Para garantizar la calidad de mi trabajo, mantengo un límite estricto de clientes activos. El primer paso es una auditoría ejecutiva de 30 min para ver si encajamos.
                    </p>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm max-w-lg mx-auto mb-8 text-left">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Tu aplicación incluye:</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex gap-3"><Search className="w-4 h-4 text-das-accent" /> Auditoría de tu perfil actual (Riesgos/Oportunidades)</li>
                            <li className="flex gap-3"><Target className="w-4 h-4 text-das-accent" /> Estrategia de posicionamiento preliminar</li>
                            <li className="flex gap-3"><MessageSquare className="w-4 h-4 text-das-accent" /> Validación de objetivos y química de trabajo</li>
                        </ul>
                    </div>

                    <a
                        href="https://cal.com/vribes/blockcha-in"
                        className="premium-btn inline-flex items-center gap-3 bg-white text-das-dark px-10 py-5 font-bold rounded-sm hover:bg-gray-100 transition-colors shadow-2xl"
                    >
                        <span>Solicitar Entrevista en Blockcha-in.com</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>

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

            {/* <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultSubject="Aplicación Blockcha-in - DAS" /> */}
        </main>
    );
}
