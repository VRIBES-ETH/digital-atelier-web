import SimpleNavbar from "@/components/SimpleNavbar";
import { Building2, FileText, Megaphone, Users, ShieldCheck, ArrowRight, Network } from "lucide-react";

export default function CorporatePage() {
    return (
        <main className="bg-white min-h-screen font-sans selection:bg-das-dark selection:text-white">
            <SimpleNavbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-das-dark animate-pulse"></span>
                        <span className="text-xs font-mono uppercase tracking-wider text-gray-600">Para Empresas Reguladas & Institucionales</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-das-dark animate-fade-in-up max-w-6xl mx-auto">
                        Tu tecnología es compleja. <br /> <span className="text-gray-400">Tu comunicación no puede serlo.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-100">
                        No somos una "Agencia Crypto" de 2021 centrada en notas de prensa y hype. Somos tu <strong>Socio de Comunicación Estratégica</strong>. Gestionamos tu Presencia de Marca en LinkedIn, tus Whitepapers y tu Reputación Corporativa.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
                        <a
                            href="https://www.blockcha-in.com/corporate"
                            className="bg-das-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all flex items-center gap-2 group"
                        >
                            Agendar Consultoría Corporativa
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <span className="text-xs text-gray-400">Solo proyectos con entidad legal verificada.</span>
                    </div>
                </div>
            </section>

            {/* THE PROBLEM: ANTI-PR AGENCY */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-das-dark">El modelo "Agencia PR 2021" está roto</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Megaphone className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Notas de Prensa que nadie lee</h3>
                                    <p className="text-sm text-gray-600">Pagar $2k para salir en un medio que solo leen bots no construye marca. Construye vanidad.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Juniors manejando tu reputación</h3>
                                    <p className="text-sm text-gray-600">Delegar tu LinkedIn corporativo a un becario es el riesgo más caro que puedes correr en un sector regulado (MiCA).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 border-b pb-4">Nuestra Propuesta de Valor (2026)</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-das-dark mt-1" />
                                <div>
                                    <span className="font-bold block">Compliance-First</span>
                                    <span className="text-sm text-gray-600">Contenido revisado para evitar riesgos con CNMV/SEC. Cero consejos financieros.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Network className="w-5 h-5 text-das-dark mt-1" />
                                <div>
                                    <span className="font-bold block">Gestión Integral en LinkedIn</span>
                                    <span className="text-sm text-gray-600">Company Page + Estrategia de Empleados (Advocacy). Dominamos el feed, no la prensa.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-das-dark mt-1" />
                                <div>
                                    <span className="font-bold block">Technical Writing Real</span>
                                    <span className="text-sm text-gray-600">Whitepapers, Gitbook, Documentación API. Hablamos tu idioma técnico.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SECTORS & METHODOLOGY (SEO DENSITY) */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* LEFT: SECTORS */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-das-dark">Especialización Sectorial</h2>
                            <p className="text-gray-600 leading-relaxed">
                                No escribimos "sobre crypto" en general. Entendemos las verticales institucionales que mueven el mercado en 2026.
                            </p>

                            <div className="space-y-6">
                                <div className="border-l-2 border-das-dark pl-6">
                                    <h3 className="font-bold text-lg mb-2">Digital Asset Treasuries (DATs)</h3>
                                    <p className="text-sm text-gray-600">
                                        Empresas cotizadas con Bitcoin/Ethereum/Solana/XRP en balance. Comunicamos la estrategia de tesorería a accionistas tradicionales sin generar fricción, alineando la narrativa como lo hacen MSTR y Tesla.
                                    </p>
                                </div>
                                <div className="border-l-2 border-gray-200 pl-6">
                                    <h3 className="font-bold text-lg mb-2">Tokenización (RWA)</h3>
                                    <p className="text-sm text-gray-600">
                                        Real Estate, Bonos y Crédito Privado on-chain. Traducimos la eficiencia tecnológica en ventajas financieras tangibles para inversores institucionales (BlackRock narrative).
                                    </p>
                                </div>
                                <div className="border-l-2 border-gray-200 pl-6">
                                    <h3 className="font-bold text-lg mb-2">Infraestructura & L2s</h3>
                                    <p className="text-sm text-gray-600">
                                        Rollups, Modularidad y ZK-Proofs. Explicamos la escalabilidad técnica como ventaja competitiva de negocio, no solo como código.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: COMPLIANCE METHODOLOGY */}
                        <div className="bg-gray-50 p-10 rounded-2xl">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <ShieldCheck className="w-5 h-5 text-das-dark" />
                                <span className="font-bold uppercase tracking-wider text-xs">The Safety Layer</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-6">Metodología "Anti-Crisis"</h2>

                            <div className="space-y-6 text-sm text-gray-600">
                                <p>
                                    En un mercado donde un tweet mal redactado puede tumbar un token o atraer una carta de la SEC, nuestro proceso de redacción es militar:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-2">
                                        <ArrowRight className="w-4 h-4 mt-0.5 text-das-dark" />
                                        <span>**Auditoría de Lenguaje:** Eliminación sistemática de términos absolutistas ("Garantizado", "Seguro", "Moon") que activan alertas regulatorias.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <ArrowRight className="w-4 h-4 mt-0.5 text-das-dark" />
                                        <span>**Tono Institucional:** Elevamos el discurso del "Slang de Discord" a "Comunicados para el Consejo de Administración".</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <ArrowRight className="w-4 h-4 mt-0.5 text-das-dark" />
                                        <span>**Gestión de FUD:** Protocolos pre-aprobados para responder a crisis de liquidez, hacks o volatilidad con transparencia y control.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-24 px-6 border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 text-center">Stack de Comunicación Integral</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="p-8 border border-gray-200 rounded-xl hover:border-das-dark transition-colors group">
                            <Building2 className="w-10 h-10 mb-6 text-gray-400 group-hover:text-das-dark transition-colors" />
                            <h3 className="text-xl font-bold mb-4">Gestión de Marca LinkedIn</h3>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Tomamos el control de tu <strong>Company Page</strong>. Diseñamos la narrativa, el calendario editorial y gestionamos la interacción. Transformamos tu página de un "tablón de anuncios" a un canal de medios propio.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-2">
                                <li>• Calendario Editorial Estratégico</li>
                                <li>• Diseño de Creatividades Corporativas</li>
                                <li>• Community Management Reactivo</li>
                            </ul>
                        </div>

                        {/* Service 2 */}
                        <div className="p-8 border border-gray-200 rounded-xl hover:border-das-dark transition-colors group">
                            <Users className="w-10 h-10 mb-6 text-gray-400 group-hover:text-das-dark transition-colors" />
                            <h3 className="text-xl font-bold mb-4">Employee Advocacy</h3>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Tu marca personal escala, pero la de tus empleados multiplica. Creamos <strong>Pautas de Comunicación</strong> y contenido "listo para publicar" para que tu equipo técnico y de ventas amplifique el mensaje corporativo.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-2">
                                <li>• Playbooks de Comunicación Interna</li>
                                <li>• Ghostwriting para Key Executives</li>
                                <li>• Formación en LinkedIn para equipos</li>
                            </ul>
                        </div>

                        {/* Service 3 */}
                        <div className="p-8 border border-gray-200 rounded-xl hover:border-das-dark transition-colors group">
                            <FileText className="w-10 h-10 mb-6 text-gray-400 group-hover:text-das-dark transition-colors" />
                            <h3 className="text-xl font-bold mb-4">Copywriting Técnico</h3>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Documentación que los desarrolladores aman y los inversores entienden. Traducimos código complejo en propuesta de valor clara sin perder el rigor técnico.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-2">
                                <li>• Redacción de Whitepapers</li>
                                <li>• Optimización de Gitbook/Docs</li>
                                <li>• One-Pagers para Inversores</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-24 px-6 bg-das-dark text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">¿Hablamos de Estrategia Corporativa?</h2>
                    <p className="text-gray-400 mb-8">
                        Sin compromiso. Solo una conversación honesta sobre cómo alinear tu comunicación con tus objetivos de negocio en 2026.
                    </p>
                    <a
                        href="https://www.blockcha-in.com/corporate"
                        className="inline-block bg-white text-das-dark px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                    >
                        Solicitar Propuesta B2B
                    </a>
                </div>
            </section>
        </main>
    );
}
