import Image from "next/image";
import SimpleNavbar from "@/components/SimpleNavbar";
import LinkedInAnalysisForm from "@/components/LinkedInAnalysisForm";
import { Camera, Layout, Type, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Análisis de Perfil LinkedIn | Digital Atelier Solutions",
    description: "Recibe un diagnóstico profesional de tu perfil de LinkedIn para potenciar tu marca personal.",
};

export default function LinkedInAnalysisPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] selection:bg-das-accent/20">
            <SimpleNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-50/40 rounded-full blur-3xl opacity-50" />
                    <div className="bg-noise absolute inset-0 opacity-[0.4]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200 backdrop-blur-sm mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Cupos limitados por semana
                        </span>
                    </div>

                    <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-das-dark leading-[1.1] mb-6 tracking-tight">
                        ¿Tu perfil de LinkedIn comunica <br className="hidden md:block" />
                        <span className="relative inline-block">
                            lo que realmente haces?
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-das-accent/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                            </svg>
                        </span>
                    </h1>

                    <p className="font-raleway text-lg md:text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
                        Comparte tu perfil y te enviaré a tu email un <span className="font-semibold text-das-dark">análisis profesional</span> con ideas concretas para destacar en tu sector.
                    </p>

                    <LinkedInAnalysisForm />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white border-y border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-das-dark mb-4">
                            ¿Qué incluye el análisis de tu perfil?
                        </h2>
                        <p className="font-raleway text-gray-500">Revisión manual punto por punto.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-gray-700 group-hover:bg-das-light group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-100">
                                <Camera className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-poppins font-semibold text-lg text-das-dark mb-3">Tu Imagen Profesional</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                La primera impresión cuenta. Te digo si tu foto y banner transmiten la autoridad que buscas o si están saboteando tu credibilidad.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-gray-700 group-hover:bg-das-light group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-100">
                                <Layout className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-poppins font-semibold text-lg text-das-dark mb-3">Claridad del Mensaje</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Tu banner y tu "About" son espacios valiosos. Te muestro cómo usarlos para que quien entre sepa exactamente el valor que aportas y por qué debería de conectar contigo.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-gray-700 group-hover:bg-das-light group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-100">
                                <Type className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-poppins font-semibold text-lg text-das-dark mb-3">Headline de Impacto</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Tu titular decide si alguien hace clic en tu perfil. Te doy alternativas concretas a "CEO at Company" que llamen la atención.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Authority Section */}
            <section className="bg-das-dark text-white py-20 px-6 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-800/50 to-transparent pointer-events-none" />

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">

                    <div className="flex-1 space-y-8">
                        <h2 className="font-poppins font-bold text-3xl md:text-4xl leading-tight">
                            De desconocido a referente.<br />
                            <span className="text-gray-400">Todo empieza por tu perfil.</span>
                        </h2>

                        <div className="space-y-6">
                            <p className="text-gray-300 leading-relaxed font-raleway">
                                Te envío un análisis <strong className="text-white">honesto y útil</strong>.
                                He analizado cientos de perfiles de CEOs y Founders en blockchain y finanzas.
                                Sé qué funciona y qué es ruido.
                            </p>

                            <ul className="space-y-3">
                                {[
                                    "Recibirás feedback específico (no genérico).",
                                    "Ideas aplicables en 10 minutos.",
                                    "Objetivo: transmitir autoridad y confianza."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4">
                            <p className="font-bold text-white mb-1 font-poppins">Victor Ribes</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-barlow">Founder Digital Atelier Solutions</p>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-das-accent/20 to-blue-500/20 rounded-2xl transform rotate-3 scale-105" />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl bg-gray-800">
                                {/* Using the image we found in public/images */}
                                <Image
                                    src="/images/victor-ribes.png"
                                    alt="Victor Ribes"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-das-dark/90 via-transparent to-transparent opacity-60" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 px-6 border-t border-gray-100/50">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-gray-400 font-barlow uppercase tracking-wider">
                        © {new Date().getFullYear()} Digital Atelier Solutions.
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Optional social links could go here */}
                    </div>
                </div>
            </footer>
        </main>
    );
}
