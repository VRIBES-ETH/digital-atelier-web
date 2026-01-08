import Link from 'next/link';
import { Bot, PenTool, FileText, ArrowRight, Activity, Calendar, LayoutDashboard } from 'lucide-react';

export const metadata = {
    title: 'Digital Atelier Solutions | Admin Suite',
};

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 font-sans text-white">

            <div className="max-w-5xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-display font-bold tracking-tight mb-4">
                        Admin Suite <span className="text-orange-600">.AI</span>
                    </h1>
                    <p className="text-zinc-500 uppercase tracking-widest text-sm font-medium">
                        Sistema Operativo Industrial de Digital Atelier Solutions
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Module 1: Onboarding / Meeting Model */}
                    <Link href="/vribesadmin/onboarding" className="group relative bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col h-80 justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-orange-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-600/10 transition-colors"></div>

                        <div className="relative z-10">
                            <div className="bg-zinc-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <Bot className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <h2 className="text-2xl font-bold font-display mb-2 text-white">Onboarding <span className="text-orange-500">.AI</span></h2>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Pipeline industrial de 4 capas. Genera perfiles de voz, posicionamiento y contenido estratégico desde una transcripción.
                            </p>
                        </div>

                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors gap-2">
                            Acceder al Modelo <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>

                    {/* Module 2: Blog Management */}
                    <Link href="/vribesadmin/blog" className="group relative bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col h-80 justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors"></div>

                        <div className="relative z-10">
                            <div className="bg-zinc-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <PenTool className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <h2 className="text-2xl font-bold font-display mb-2 text-white">Editorial Manager</h2>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Editor Markdown/Visual completo para el blog. Gestiona publicaciones, estados, SEO y despliegue a producción.
                            </p>
                        </div>

                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors gap-2">
                            Gestionar Contenido <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>

                    {/* Module 3: Billing */}
                    <Link href="/vribesadmin/billing" className="group relative bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col h-80 justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-green-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-600/10 transition-colors"></div>

                        <div className="relative z-10">
                            <div className="bg-zinc-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <FileText className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <h2 className="text-2xl font-bold font-display mb-2 text-white">Facturación</h2>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Generador de facturas A4 en tiempo real. Gestión de clientes, configuración fiscal y exportación PDF/Impresión.
                            </p>
                        </div>

                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors gap-2">
                            Crear Facturas <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>

                </div>

                <div className="mt-16 border-t border-zinc-900 pt-8 flex justify-between items-center text-xs text-zinc-600 uppercase tracking-widest">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> System Status: Operational</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Env: Production (Local Proxy)</span>
                    </div>
                    <div>
                        DAS® Internal Tools v3.0
                    </div>
                </div>
            </div>
        </div>
    );
}
