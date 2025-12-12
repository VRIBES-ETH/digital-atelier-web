"use client";

import Navbar from "@/components/Navbar";
import LinkedInFeed from "@/components/LinkedInFeed";
import LoopsForm from "@/components/LoopsForm";
import { ShieldCheck, Eye, Award, ArrowRight, Globe, Presentation, FileText, PenTool, Building2, BarChart3, Check } from "lucide-react";
import { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "consultoria-inicial-das" });
      cal("ui", { "theme": "light", "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
    })();

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
      <header id="expertise" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <div className="technical text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6 border-l-2 border-das-dark pl-3">
              Agencia Boutique Copywriting & Ghostwriting Blockchain
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              Textos claros para <br />
              <span className="text-gray-400">proyectos serios.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-lg mb-10 leading-relaxed font-raleway">
              Comunicación estratégica para infraestructura blockchain y finanzas descentralizadas. Elevamos tu narrativa al estándar institucional para atraer capital y partnerships estratégicos.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                data-cal-link="vribes/consultoria-inicial-das"
                data-cal-config='{"layout":"month_view"}'
                className="btn group px-8 py-4 bg-das-dark text-white text-sm font-semibold tracking-wide uppercase hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2"
              >
                Auditoría de Comunicación
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="#servicios" className="btn px-8 py-4 bg-white border border-gray-200 text-das-dark text-sm font-semibold tracking-wide uppercase hover:bg-gray-50 transition-all hover:border-gray-400">
                Ver Servicios
              </Link>
            </div>
          </div>

          {/* Abstract Visual */}
          <div className="relative hidden lg:block h-full min-h-[500px] reveal delay-200">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gray-50/50 rounded-full opacity-60 blur-3xl animate-pulse-slow"></div>

            <div className="relative z-10 p-10 rounded-sm max-w-md ml-auto animate-float bg-[#F8F9FA] border border-gray-100 shadow-2xl">
              <div className="space-y-8">
                <div className="flex gap-5 items-start border-b border-gray-100/50 pb-6">
                  <div className="w-10 h-10 bg-das-dark flex items-center justify-center text-white rounded-full shrink-0 shadow-lg">
                    <ShieldCheck className="w-5 h-5 stroke-1" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base">Compliance First</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">Cero riesgo regulatorio. Terminología validada para mercados regulados (MiCA, SEC).</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start border-b border-gray-100/50 pb-6">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center text-das-dark rounded-full shrink-0 shadow-sm">
                    <Eye className="w-5 h-5 stroke-1" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base">Claridad, no tecnicismos</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">Si un CFO tradicional no lo entiende, lo reescribimos hasta que lo haga.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center text-das-dark rounded-full shrink-0 shadow-sm">
                    <Award className="w-5 h-5 stroke-1" />
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
          <div className="mb-16 reveal text-center md:text-left">
            <span className="technical text-xs font-bold tracking-widest uppercase text-gray-500">Nuestros Servicios</span>
            <h2 className="font-poppins font-bold text-4xl md:text-5xl mt-4 max-w-2xl leading-tight">Qué hacemos en el Atelier</h2>
            <p className="mt-6 text-sm italic text-gray-600 font-poppins tracking-wide max-w-2xl">
              "Bridging the gap between Decentralized Tech and Institutional Finance."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* --- Fila 1: Estrategia --- */}

            {/* Card 1: Web Copy Institucional */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-das-accent group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <Globe className="w-5 h-5 stroke-[1]" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-4 tracking-tight">Web Copy<br />Institucional</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-raleway h-20">
                Elevamos tu web al estándar de la banca de inversión. Mensajes diseñados para generar confianza en capital institucional y <em>family offices</em>.
              </p>
            </div>

            {/* Card 2: Tesis & Pitch Decks */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-das-accent group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <Presentation className="w-5 h-5 stroke-[1]" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-4 tracking-tight">Tesis &<br />Pitch Decks</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-raleway h-20">
                Cerramos el gap entre Web3 y TradFi. Traducimos tu tecnología en una narrativa financiera capaz de superar una <em>Due Diligence</em>.
              </p>
            </div>

            {/* Card 3: Whitepapers & Docs */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-das-accent group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <FileText className="w-5 h-5 stroke-[1]" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-4 tracking-tight">Whitepapers<br />& Docs</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-raleway h-20">
                Documentación técnica rigurosa y <em>compliance-first</em>. Estructura y tono profesional listos para revisión regulatoria.
              </p>
            </div>

            {/* --- Fila 2: Autoridad --- */}

            {/* Card 4: Ghostwriting Ejecutivo */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-das-accent group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <PenTool className="w-5 h-5 stroke-[1]" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-4 tracking-tight">Ghostwriting<br />Ejecutivo</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-raleway h-20">
                Posicionamiento C-Level. Tu perfil como líder de industria con análisis de mercado serios, alejados del ruido de las redes sociales.
              </p>
            </div>

            {/* Card 5: Comunicación Corporativa */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-das-accent group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <Building2 className="w-5 h-5 stroke-[1]" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-4 tracking-tight">Comunicación<br />Corporativa</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-raleway h-20">
                Gestión de LinkedIn con tono institucional. Comunicamos tus hitos y alianzas con la sobriedad que exigen las grandes empresas.
              </p>
            </div>

            {/* Card 6: Market Intelligence */}
            <div className="group bg-white p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 reveal delay-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-das-accent group-hover:h-full transition-all duration-300"></div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-das-dark group-hover:text-white transition-colors duration-300">
                <BarChart3 className="w-5 h-5 stroke-[1]" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-4 tracking-tight">Market<br />Intelligence</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-raleway h-20">
                Newsletters y artículos de profundidad. Educamos a tu ecosistema con análisis de valor, no con <em>hype</em> insostenible.
              </p>
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
            <div className="border border-das-accent/50 p-8 bg-white/10 relative rounded-sm transform md:-translate-y-4 shadow-2xl shadow-blue-900/20 reveal delay-200 ring-1 ring-das-accent/30">
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
            <Link href="/blockchain" className="inline-flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-das-dark font-bold uppercase tracking-wide group">
              Solicitar disponibilidad Blockcha-in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* PODCAST SECTION */}
          <div className="mt-32 pt-20 border-t border-white/10 grid md:grid-cols-2 gap-12 items-center reveal">
            <div className="order-2 md:order-1">
              <span className="technical text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 block">Market Intelligence</span>
              <h2 className="font-poppins font-bold text-3xl mb-6 leading-tight">Analizamos lo que mueve el mercado.</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-raleway">
                Transformamos los reportes institucionales complejos (+50 páginas de BlackRock, a16z, FMI) en cápsulas de audio de 15 minutos. Información accionable para ejecutivos sin tiempo.
              </p>
              <Link href="https://open.spotify.com/show/2aFmi63QGsRXOR1NfkTTwd" target="_blank" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white hover:text-das-accent transition-colors group">
                Escuchar en Spotify <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-[#191414] rounded-xl shadow-2xl overflow-hidden border border-white/5 transform hover:scale-[1.02] transition-transform duration-500">
                <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/show/2aFmi63QGsRXOR1NfkTTwd?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </div>
            </div>
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
            <div className="hidden md:block absolute top-[2rem] left-0 w-full h-[2px] bg-[#E5E5E5] z-0"></div>

            {/* Step 1 - Active Default */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-100 group">
              <div className="w-16 h-16 bg-white border-2 border-das-accent text-das-accent flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-full relative z-10 mx-auto md:mx-0 transition-all duration-300 transform group-hover:scale-105 shadow-sm">01</div>
              <h3 className="font-bold font-poppins text-xl mb-3">Análisis</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Entendemos tu propuesta de valor real y detectamos las brechas de tu narrativa actual.</p>
            </div>
            {/* Step 2 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-200 group">
              <div className="w-16 h-16 bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-full relative z-10 mx-auto md:mx-0 transition-all duration-300 transform group-hover:scale-105 group-hover:border-das-accent group-hover:text-das-accent shadow-sm">02</div>
              <h3 className="font-bold font-poppins text-xl mb-3">Estrategia</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Diseñamos una narrativa de autoridad que captura atención sin cruzar líneas rojas. Mensajes potentes, seguros y orientados a conversión.</p>
            </div>
            {/* Step 3 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-300 group">
              <div className="w-16 h-16 bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-full relative z-10 mx-auto md:mx-0 transition-all duration-300 transform group-hover:scale-105 group-hover:border-das-accent group-hover:text-das-accent shadow-sm">03</div>
              <h3 className="font-bold font-poppins text-xl mb-3">Producción</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Nos integramos in-house con tu equipo de marketing. Escritura ágil y coordinada para eliminar cuellos de botella y asegurar consistencia.</p>
            </div>
            {/* Step 4 */}
            <div className="relative bg-white pt-4 md:pt-0 reveal delay-100 group">
              <div className="w-16 h-16 bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-xl font-bold font-barlow mb-6 rounded-full relative z-10 mx-auto md:mx-0 transition-all duration-300 transform group-hover:scale-105 group-hover:border-das-accent group-hover:text-das-accent shadow-sm">04</div>
              <h3 className="font-bold font-poppins text-xl mb-3">Entrega</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Textos listos para publicar. Directo al grano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT FOUNDER */}
      <section className="py-32 px-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16 reveal">
          <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-200 rounded-full overflow-hidden shrink-0 shadow-2xl border-4 border-white">
            <img src="/images/victor-ribes.png" alt="Victor Ribes" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <blockquote className="text-xl md:text-2xl font-poppins font-medium text-das-dark mb-8 leading-relaxed">
              "Trabajo solo. Sin equipo junior. Sin intermediarios. Sin plantillas. Tú hablas conmigo, yo escribo para ti."
            </blockquote>
            <div>
              <h4 className="font-bold font-poppins text-lg">Víctor Ribes</h4>
              <p className="text-xs text-gray-500 font-barlow tracking-[0.2em] uppercase mt-1">Fundador Digital Atelier Solutions</p>
              <p className="text-sm text-gray-600 mt-6 leading-relaxed max-w-lg mb-8">
                Activo en el ecosistema desde 2016. Deja tu email y te mandaré los mejores consejos o avances en comunicación institucional para empresas blockchain.
              </p>
              <div className="max-w-md mx-auto md:mx-0">
                <LoopsForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LinkedInFeed />

      {/* FOOTER / CONTACT (Cal.com Integration) */}
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
              <a href="mailto:info@digitalateliersolutions.agency" className="text-sm font-bold uppercase tracking-wider hover:text-das-accent transition-colors">
                info@digitalateliersolutions.agency
              </a>
              <div className="flex gap-6 text-xs font-bold tracking-widest uppercase text-gray-400 mt-4">
                <a href="https://www.linkedin.com/company/digital-atelier-solutions" target="_blank" className="hover:text-das-dark transition-colors">LinkedIn</a>
                <a href="https://www.linkedin.com/newsletters/digital-atelier-insights-7326874278258257921/" target="_blank" className="hover:text-das-dark transition-colors">Newsletter</a>
              </div>
            </div>
          </div>

          {/* Right Column: Cal.com Embed */}
          {/* Right Column: Booking Card (Subtle) */}
          <div className="relative h-full flex items-center justify-center reveal delay-200">
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-sm w-full max-w-md shadow-sm hover:shadow-md transition-shadow group">
              <div className="mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-das-dark group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.25V14" /><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></svg>
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

    </main>
  );
}
