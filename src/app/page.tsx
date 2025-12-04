"use client";

import Navbar from "@/components/Navbar";
import AuditModal from "@/components/AuditModal";
import { ShieldCheck, Eye, Award, Feather, Presentation, MessageSquare, Check, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
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

      <Navbar />

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <div className="technical text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6 border-l-2 border-das-dark pl-3">
              Agencia Boutique Copywriting & Ghostwriting
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              Textos claros para <br />
              <span className="text-gray-400">proyectos serios.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-lg mb-10 leading-relaxed font-raleway">
              No hacemos marketing crypto genérico. Escribimos para proyectos que buscan capital institucional,
              aprobaciones regulatorias y partnerships estratégicos.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn px-8 py-4 bg-das-dark text-white text-sm font-semibold tracking-wide uppercase hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1"
              >
                Auditoría de Comunicación
              </button>
              <Link href="#servicios" className="btn px-8 py-4 bg-white border border-gray-200 text-das-dark text-sm font-semibold tracking-wide uppercase hover:bg-gray-50 transition-all hover:border-gray-400">
                Ver Servicios
              </Link>
            </div>
          </div>

          {/* Abstract Visual */}
          <div className="relative hidden lg:block h-full min-h-[500px] reveal delay-200">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-tr from-gray-200 via-gray-100 to-transparent rounded-full opacity-60 blur-3xl animate-pulse-slow"></div>

            <div className="relative z-10 glass-panel p-10 rounded-sm max-w-md ml-auto animate-float">
              <div className="space-y-8">
                <div className="flex gap-5 items-start border-b border-gray-100/50 pb-6">
                  <div className="w-10 h-10 bg-das-dark flex items-center justify-center text-white rounded-full shrink-0 shadow-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base">Compliance First</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">Cero riesgo regulatorio. Terminología validada para mercados regulados (MiCA, SEC).</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start border-b border-gray-100/50 pb-6">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center text-das-dark rounded-full shrink-0 shadow-sm">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base">Claridad, no tecnicismos</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">Si un CFO tradicional no lo entiende, lo reescribimos hasta que lo haga.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center text-das-dark rounded-full shrink-0 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base">Expertise Real</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">+8 años en el sector. Sin juniors. Sin IA generativa sin supervisión.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SERVICIOS */}
      <section id="servicios" className="py-32 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 reveal">
            <span className="technical text-xs font-bold tracking-widest uppercase text-gray-500">Nuestros Servicios</span>
            <h2 className="font-poppins font-bold text-4xl md:text-5xl mt-4 max-w-2xl leading-tight">Qué hacemos en el Atelier</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-100">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <Feather className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-poppins font-bold text-2xl mb-4">Copywriting &<br />Storytelling</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Webs, whitepapers y landings con estándar institucional. ¿Lo entiende un inversor tradicional? ¿Pasa revisión legal? Si la respuesta es no, nosotros lo arreglamos.
              </p>
              <ul className="text-xs space-y-3 text-gray-500 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-das-dark rounded-full"></div>Whitepapers Técnicos
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-das-dark rounded-full"></div>Web Copy Institucional
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-200">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <Presentation className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-poppins font-bold text-2xl mb-4">Pitch Decks &<br />Research</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Transformamos análisis técnico en narrativa de inversión. Traducimos métricas on-chain a lenguaje financiero que convence a los fondos.
              </p>
              <ul className="text-xs space-y-3 text-gray-500 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-das-dark rounded-full"></div>Narrativa de Inversión
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-das-dark rounded-full"></div>Investor Decks
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-300">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <MessageSquare className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-poppins font-bold text-2xl mb-4">Consultoría &<br />Messaging</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Definimos qué dices, cómo lo dices y dónde lo amplificas. Unificación de mensaje para que CEO, equipo y marca hablen el mismo idioma.
              </p>
              <ul className="text-xs space-y-3 text-gray-500 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-das-dark rounded-full"></div>Identidad Verbal
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-das-dark rounded-full"></div>Estrategia PR
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCKCHA-IN DARK SECTION */}
      <section id="blockcha-in" className="py-32 px-6 bg-das-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 reveal">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-poppins font-bold text-2xl tracking-tighter">Blockcha-in</span>
                <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-bold uppercase tracking-wide">Producto DAS</span>
              </div>
              <h2 className="font-poppins font-bold text-4xl lg:text-5xl leading-tight">
                Ghostwriting Ejecutivo<br />para Líderes Web3.
              </h2>
            </div>
            <p className="text-gray-400 max-w-md text-base leading-relaxed">
              Tu agenda está llena. LinkedIn no es prioridad. Pero el mercado espera verte activo. Construimos tu autoridad sin que escribas una sola palabra.
            </p>
          </div>

          {/* Pricing / Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Seed */}
            <div className="border border-white/10 p-8 bg-white/5 hover:bg-white/10 transition-colors rounded-sm reveal delay-100">
              <span className="technical text-xs font-bold text-gray-400 tracking-widest uppercase">Seed Plan</span>
              <div className="mt-6 mb-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-poppins">$500</span>
                <span className="text-sm text-gray-500">/mes</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-6">Inicio sólido para perfiles que arrancan.</p>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> 8-10 posts/mes</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Enfoque personal</li>
              </ul>
            </div>

            {/* Plan Growth */}
            <div className="border border-white/20 p-8 bg-white/10 relative rounded-sm transform md:-translate-y-4 shadow-2xl shadow-black/50 reveal delay-200">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider">Popular</div>
              <span className="technical text-xs font-bold text-white tracking-widest uppercase">Growth Plan</span>
              <div className="mt-6 mb-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-poppins">$900</span>
                <span className="text-sm text-gray-400">/mes</span>
              </div>
              <p className="text-sm text-gray-300 mb-8 border-b border-white/10 pb-6">Autoridad visible y constante.</p>
              <ul className="space-y-4 text-sm text-gray-200">
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> 12-14 posts/mes</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Análisis de sector</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Optimización perfil</li>
              </ul>
            </div>

            {/* Plan Authority */}
            <div className="border border-white/10 p-8 bg-white/5 hover:bg-white/10 transition-colors rounded-sm reveal delay-300">
              <span className="technical text-xs font-bold text-gray-400 tracking-widest uppercase">Authority Plan</span>
              <div className="mt-6 mb-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-poppins">$1,500</span>
                <span className="text-sm text-gray-500">/mes</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-6">Posicionamiento C-Suite total.</p>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> 20-22 posts/mes</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Engagement estratégico</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Lead generation</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center reveal">
            <Link href="/blockchain" className="inline-flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors border-b border-white pb-1 group">
              Solicitar disponibilidad Blockcha-in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="py-32 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center reveal">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl">Proceso de Trabajo</h2>
            <p className="text-gray-500 mt-3">Sin rondas infinitas. Sin intermediarios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Line connector for desktop */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-[1px] bg-gray-100 -z-10"></div>

            {/* Step 1 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-100">
              <div className="w-16 h-16 bg-das-dark text-white flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-sm shadow-xl shadow-gray-200">01</div>
              <h3 className="font-bold font-poppins text-lg mb-3">Análisis</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Entendemos tu tecnología y dónde falla tu comunicación actual.</p>
            </div>
            {/* Step 2 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-200">
              <div className="w-16 h-16 bg-white border border-gray-200 text-das-dark flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-sm">02</div>
              <h3 className="font-bold font-poppins text-lg mb-3">Estrategia</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Definimos mensajes clave y términos a evitar por riesgo regulatorio.</p>
            </div>
            {/* Step 3 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-300">
              <div className="w-16 h-16 bg-white border border-gray-200 text-das-dark flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-sm">03</div>
              <h3 className="font-bold font-poppins text-lg mb-3">Producción</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Escritura compliance-first. Eliminamos jerga. Validamos contigo.</p>
            </div>
            {/* Step 4 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-100">
              <div className="w-16 h-16 bg-white border border-gray-200 text-das-dark flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-sm">04</div>
              <h3 className="font-bold font-poppins text-lg mb-3">Entrega</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Textos listos para publicar. Directo al grano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT FOUNDER */}
      <section className="py-32 px-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16 reveal">
          <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-200 rounded-full overflow-hidden shrink-0 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
            {/* Placeholder for Founder Image */}
            <img src="https://ui-avatars.com/api/?name=Victor+Ribes&background=0f1115&color=fff&size=300" alt="Victor Ribes" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <blockquote className="text-xl md:text-2xl font-poppins font-medium text-das-dark mb-8 leading-relaxed">
              "Trabajo solo. Sin equipo junior. Sin intermediarios. Sin plantillas. Tú hablas conmigo, yo escribo para ti."
            </blockquote>
            <div>
              <h4 className="font-bold font-poppins text-lg">Víctor Ribes</h4>
              <p className="text-xs text-gray-500 font-barlow tracking-[0.2em] uppercase mt-1">Fundador Digital Atelier Solutions</p>
              <p className="text-sm text-gray-600 mt-6 leading-relaxed max-w-lg">
                Activo en el ecosistema desde 2016. Liderando una newsletter leída por +600 C-Levels. Elevando la comunicación blockchain al nivel institucional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer id="contacto" className="bg-das-dark text-white py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="reveal">
            <h2 className="font-poppins font-bold text-3xl mb-6">¿Empezamos?</h2>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
              Buscamos proyectos serios que quieran comunicar con rigor. Si ese eres tú, hablemos.
            </p>
            <a href="mailto:info@digitalateliersolutions.agency" className="text-xl md:text-2xl font-bold underline decoration-1 underline-offset-8 hover:text-gray-300 transition-colors">
              info@digitalateliersolutions.agency
            </a>
          </div>
          <div className="flex flex-col md:items-end justify-between reveal delay-100">
            <div className="flex flex-col md:items-end gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Siguenos</span>
              <div className="flex gap-6 text-sm font-medium tracking-widest uppercase text-gray-400">
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">Newsletter</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
              </div>
            </div>

            <div className="mt-12 md:mt-0 flex flex-col md:items-end gap-2 text-gray-600 text-xs">
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-400">Aviso Legal</a>
                <a href="#" className="hover:text-gray-400">Privacidad</a>
              </div>
              <p>© 2025 Digital Atelier Solutions. Castellón, España.</p>
            </div>
          </div>
        </div>
      </footer>

      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
