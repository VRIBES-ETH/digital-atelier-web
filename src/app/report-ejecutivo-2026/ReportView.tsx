'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { generateGeminiContent } from '../actions/gemini';
import { Sparkles, Lock, Unlock } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement
);

// --- Charts Configuration ---

const barOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f1f1f',
            titleColor: '#fff',
            bodyColor: '#ccc',
            borderColor: '#333',
            borderWidth: 1,
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: '#333' },
            ticks: { color: '#888' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#888' }
        }
    }
};

const donutOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'right' as const,
            labels: { color: '#ccc', font: { size: 12 } }
        }
    },
    cutout: '70%',
    elements: {
        arc: { borderWidth: 0 }
    }
};

export default function ReportView() {
    // State for Report Logic
    const [modalOpen, setModalOpen] = useState(false);

    // AI State
    const [profileInput, setProfileInput] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // Gate State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showGate, setShowGate] = useState(false);
    const [gateForm, setGateForm] = useState({ name: '', email: '' });
    const [gateLoading, setGateLoading] = useState(false);
    const [gateError, setGateError] = useState('');

    // Effect: Check Local Storage on Mount
    useEffect(() => {
        const unlocked = localStorage.getItem('report-2026-unlocked');
        if (unlocked === 'true') {
            setIsUnlocked(true);
        }
    }, []);

    useEffect(() => {
        if (isUnlocked) return;
        const handleScroll = () => {
            if (window.scrollY > 400 && !showGate) setShowGate(true);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isUnlocked, showGate]);

    useEffect(() => {
        if (showGate) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [showGate]);

    // Client-side Email Validation
    const BLACKLISTED_DOMAINS = [
        'spam.spam', 'mailinator.com', 'temp-mail.org', 'guerrillamail.com',
        '10minutemail.com', 'trashmail.com', 'yopmail.com', 'fools.com',
        'falso.com', 'fake.com', 'example.com', 'test.com', 'sharklasers.com',
        'getnada.com', 'spam.com', 'disposable.com'
    ];

    const validateEmailClient = (email: string) => {
        if (!email || !email.includes('@')) return { valid: false, message: "Email inválido." };
        const [localPart, domain] = email.toLowerCase().split('@');
        if (localPart.length < 2 || domain.length < 3) return { valid: false, message: "Email incompleto." };
        if (BLACKLISTED_DOMAINS.includes(domain) || domain.includes('spam')) return { valid: false, message: "Dominio no permitido." };
        return { valid: true };
    };

    const handleGateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGateLoading(true);
        setGateError('');

        const validation = validateEmailClient(gateForm.email);
        if (!validation.valid) {
            setGateError(validation.message!);
            setGateLoading(false);
            return;
        }

        try {
            const formBody = "userGroup=Reporte2026&mailingLists=&email=" + encodeURIComponent(gateForm.email) + "&firstName=" + encodeURIComponent(gateForm.name);
            const res = await fetch("https://app.loops.so/api/newsletter-form/cm2rflmgu01h51390iumvl8na", {
                method: "POST",
                body: formBody,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (res.ok) {
                localStorage.setItem('report-2026-unlocked', 'true');
                setIsUnlocked(true);
                setShowGate(false);
            } else {
                setGateError("Error al suscribir. Intenta de nuevo.");
            }
        } catch {
            setGateError("Error de conexión.");
        } finally {
            setGateLoading(false);
        }
    };

    const handleGeminiAnalysis = async () => {
        if (!profileInput.trim()) return;
        setAiLoading(true);
        const prompt = `Actúa como un consultor de marca personal experto en Web3. Analiza este perfil brevemente y da 3 consejos accionables para 2026: "${profileInput}"`;
        const res = await generateGeminiContent(prompt);
        if (res.success) setAiAnalysis(res.text || 'Sin respuesta.');
        else setAiAnalysis('Error conectando con la IA.');
        setAiLoading(false);
    }

    // Chart Data
    const dataSkills = {
        labels: ['Regulación', 'IA', 'Riesgos', 'Ventas', 'Solidity'],
        datasets: [{
            data: [35, 30, 25, 20, 5],
            backgroundColor: ['#ea580c', '#f97316', '#fb923c', '#71717a', '#3f3f46'],
        }]
    };

    const dataSectors = {
        labels: ['Finanzas', 'Logística', 'Gobierno', 'Gaming', 'Salud'],
        datasets: [{
            data: [42, 25, 15, 12, 6],
            backgroundColor: ['#ea580c', '#d97706', '#f59e0b', '#71717a', '#27272a'],
            borderWidth: 0,
        }]
    };

    return (
        <div className="bg-atelier-bg min-h-screen font-sans text-atelier-text selection:bg-atelier-accent selection:text-white pb-20 overflow-x-hidden">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Navbar */}
            <nav className="w-full border-b border-atelier-border bg-atelier-bg/95 backdrop-blur z-50 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-lg font-display font-bold tracking-tight text-white leading-none">DIGITAL ATELIER</span>
                        <span className="text-sm uppercase tracking-[0.3em] text-atelier-accent leading-none mt-1">SOLUTIONS</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        {!isUnlocked && <Lock className="w-4 h-4 text-orange-500" />}
                        {isUnlocked && <Unlock className="w-4 h-4 text-green-500" />}
                    </div>
                </div>
            </nav>

            <header className="w-full py-24 px-6 relative z-10 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className="inline-block py-1 px-3 border border-atelier-border rounded text-atelier-muted text-xs font-bold tracking-widest mb-6 uppercase bg-atelier-card">
                        Reporte de Mercado 2026
                    </span>
                    <h1 className="text-5xl md:text-8xl font-extrabold mb-8 text-white tracking-tight leading-tight font-display">
                        El Ejecutivo <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Blockchain</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-atelier-muted max-w-3xl mx-auto font-light leading-relaxed">
                        Análisis de tendencias en Digital Assets, RWA y Desarrollo de Marca Profesional.
                    </p>
                </motion.div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10 space-y-24">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Demanda Ejecutiva (YoY)', value: '+45%' },
                        { label: 'Salario Base Promedio', value: '$320k' },
                        { label: 'Modalidad Híbrida', value: 'DOMINANTE' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-atelier-card border border-atelier-border p-6 hover:border-atelier-accent/50 transition-colors"
                        >
                            <h3 className="text-atelier-muted text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                            <div className="mt-4 text-4xl font-extrabold text-white font-display">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Gate Overlay */}
                <AnimatePresence>
                    {!isUnlocked && showGate && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        >
                            <div className="bg-atelier-card border border-atelier-border p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Informe Privado</h3>
                                    <p className="text-atelier-muted text-sm">Acceso exclusivo para profesionales.</p>
                                </div>
                                <form onSubmit={handleGateSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Tu Nombre"
                                        required
                                        value={gateForm.name}
                                        onChange={(e) => setGateForm({ ...gateForm, name: e.target.value })}
                                        className="w-full bg-atelier-bg border border-atelier-border rounded-lg p-3 text-white focus:outline-none focus:border-atelier-accent"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Tu Email Profesional"
                                        required
                                        value={gateForm.email}
                                        onChange={(e) => setGateForm({ ...gateForm, email: e.target.value })}
                                        className="w-full bg-atelier-bg border border-atelier-border rounded-lg p-3 text-white focus:outline-none focus:border-atelier-accent"
                                    />
                                    {gateError && <p className="text-red-500 text-xs text-center">{gateError}</p>}
                                    <button
                                        type="submit"
                                        disabled={gateLoading}
                                        className="w-full bg-atelier-accent hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-orange-900/20"
                                    >
                                        {gateLoading ? 'Verificando...' : 'Leer Reporte Completo'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className={`space-y-20 transition-all duration-700 ${!isUnlocked ? 'filter blur-lg opacity-30 pointer-events-none' : ''}`}>

                    {/* Charts Section */}
                    <section className="bg-atelier-card/50 border border-atelier-border p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-atelier-accent" />
                            LinkedIn Talent Insights 2025
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="h-[300px] w-full bg-atelier-bg/50 p-4 rounded-xl border border-atelier-border">
                                <Bar data={dataSkills} options={barOptions} />
                            </div>
                            <div className="space-y-8">
                                <div className="border-l-4 border-atelier-accent pl-6 py-2">
                                    <h4 className="font-bold text-white text-lg">El fin del "Crypto Nomad"</h4>
                                    <p className="text-gray-400 mt-2 leading-relaxed">Migración masiva hacia jurisdicciones reguladas. La presencialidad vuelve a ser un factor clave de diferenciación.</p>
                                </div>
                                <div className="border-l-4 border-gray-700 pl-6 py-2">
                                    <h4 className="font-bold text-white text-lg font-display uppercase tracking-widest">Sectorización</h4>
                                    <div className="h-[200px] w-[200px] mt-4">
                                        <Doughnut data={dataSectors} options={donutOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Analysis Section */}
                    <section className="border border-atelier-border rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-atelier-card to-zinc-900 p-8 border-b border-atelier-border">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Auditoría IA de Perfil
                            </h3>
                            <p className="text-gray-400 text-sm">Pega tu "About" de LinkedIn para recibir 3 consejos estratégicos basados en los datos del reporte.</p>
                        </div>
                        <div className="p-8 bg-atelier-bg">
                            <textarea
                                value={profileInput}
                                onChange={(e) => setProfileInput(e.target.value)}
                                placeholder="Pega tu bio aquí..."
                                className="w-full bg-black border border-atelier-border rounded-lg p-4 text-gray-300 min-h-[100px] focus:border-purple-500 outline-none transition-colors"
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleGeminiAnalysis}
                                    disabled={aiLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                >
                                    {aiLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    Analizar con Gemini
                                </button>
                            </div>
                            {aiAnalysis && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 p-6 bg-zinc-900/50 border border-purple-500/20 rounded-lg"
                                >
                                    <h4 className="text-purple-400 font-bold mb-2 uppercase text-xs tracking-widest">Resultado de la IA</h4>
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{aiAnalysis}</p>
                                </motion.div>
                            )}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
