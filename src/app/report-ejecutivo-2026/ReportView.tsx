'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    ArcElement,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Bar, Radar, Line, PolarArea, Doughnut } from 'react-chartjs-2';
import { generateGeminiContent } from '../actions/gemini';
import { Share2, Linkedin, Copy, Check, Twitter } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    ArcElement
);

// Chart Defaults
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#9CA3AF';
ChartJS.defaults.scale.grid.color = '#27272a';

const BLACKLISTED_DOMAINS = [
    'spam.spam',
    'mailinator.com',
    'temp-mail.org',
    'guerrillamail.com',
    '10minutemail.com',
    'trashmail.com',
    'yopmail.com',
    'fools.com',
    'falso.com',
    'fake.com',
    'example.com',
    'test.com',
    'sharklasers.com',
    'getnada.com',
    'spam.com'
];

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { valid: false, message: "El formato del correo no es válido." };

    const domain = email.split('@')[1].toLowerCase();
    if (BLACKLISTED_DOMAINS.includes(domain) || domain.includes('spam') || domain.split('.')[0] === 'test') {
        return { valid: false, message: "Por favor, utiliza un correo corporativo o personal válido." };
    }

    return { valid: true };
};

export default function ReportView() {
    // State for Report Logic
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const [profileInput, setProfileInput] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [goal2026, setGoal2026] = useState('');

    // State for Lead Gate
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

    // Effect: Scroll Listener for Gate
    useEffect(() => {
        if (isUnlocked) return;

        const handleScroll = () => {
            if (window.scrollY > 200 && !showGate) {
                setShowGate(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isUnlocked, showGate]);

    // Effect: Lock Body Scroll when Gate is Open
    useEffect(() => {
        if (showGate) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [showGate]);

    // Handle Gate Submit
    const handleGateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = isValidEmail(gateForm.email);
        if (!validation.valid) {
            setGateError(validation.message!);
            return;
        }

        setGateLoading(true);
        setGateError('');

        const formBody = "userGroup=Reporte2026&mailingLists=&email=" + encodeURIComponent(gateForm.email) + "&firstName=" + encodeURIComponent(gateForm.name);

        try {
            const res = await fetch("https://app.loops.so/api/newsletter-form/cm2rflmgu01h51390iumvl8na", {
                method: "POST",
                body: formBody,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (res.ok) {
                localStorage.setItem('report-2026-unlocked', 'true');
                setIsUnlocked(true);
                setShowGate(false);
            } else {
                setGateError("Hubo un error. Por favor intenta nuevamente.");
            }
        } catch (error) {
            setGateError("Error de conexión. Intenta nuevamente.");
        } finally {
            setGateLoading(false);
        }
    };

    // Modal Handlers
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Gemini Handlers
    const handleAnalyzeProfile = async () => {
        if (!profileInput.trim()) {
            alert("Por favor ingresa un texto.");
            return;
        }

        setModalTitle("Auditoría de Autoridad");
        setModalContent('<div class="flex flex-col items-center py-10 gap-3"><p class="text-atelier-accent font-bold animate-pulse">Analizando semántica ejecutiva...</p></div>');
        setLoading(true);
        openModal();

        try {
            const prompt = `Actua como Víctor Ribes, Ghostwriter Blockchain. Analiza este perfil de LinkedIn: "${profileInput}". 
      Criterios: Autoridad técnica vs Ruido. Usa un tono directo, profesional y sobrio.
      
      IMPORTANTE: NO uses markdown (* o **). Usa EXCLUSIVAMENTE etiquetas HTML <strong> para las negritas.
      
      Estructura de respuesta requerida (HTML):
      
      <h3 class="text-white font-bold text-lg mb-2 font-display">Puntuación: [0-100]/100</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">[Justificación breve usando <strong> para conceptos clave]</p>
      
      <h3 class="text-white font-bold text-lg mb-2 font-display">Veredicto Directo</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">[Análisis crítico en párrafos separados. Usa <strong> para énfasis]</p>
      
      <h3 class="text-white font-bold text-lg mb-2 font-display">3 Mejoras de Enfoque Boutique</h3>
      <ul class="list-disc pl-5 mb-8 space-y-3 text-gray-300">
        <li><strong>[Título de la Mejora]:</strong> [Explicación detallada]</li>
        <li><strong>[Título de la Mejora]:</strong> [Explicación detallada]</li>
        <li><strong>[Título de la Mejora]:</strong> [Explicación detallada]</li>
      </ul>
      
      <div class="mt-8 border-t border-atelier-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
            <p class="text-atelier-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Auditado por</p>
            <p class="text-white font-display font-bold text-base">Víctor Ribes</p>
            <p class="text-atelier-muted text-xs tracking-wide">Ghostwriter Blockchain & Estratega.</p>
        </div>
        <div class="text-right hidden sm:block">
            <p class="text-gray-600 text-[10px] font-mono uppercase tracking-widest">Digital Atelier Solutions</p>
        </div>
      </div>`;

            const result = await generateGeminiContent(prompt);

            if (result.success) {
                // 1. Extract Score (Expects "Puntuación: 75/100" or similar)
                const scoreMatch = result.data!.match(/Puntuación:?\s*(\d+)/i);
                const rawScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
                const finalScore = rawScore <= 10 ? rawScore : (rawScore / 10).toFixed(1); // Normalized to 0-10

                // 2. Generate Share Text based on score
                let shareText = "";
                if (parseFloat(finalScore.toString()) >= 8) {
                    shareText = `He puesto a prueba mi perfil de LinkedIn con la IA de Digital Atelier y he sacado un ${finalScore}/10.\n\nLa herramienta analiza autoridad real vs ruido.\n\nPruébalo aquí: https://digitalateliersolutions.agency/report-ejecutivo-2026`;
                } else {
                    shareText = `He analizado mi perfil con la IA de Digital Atelier. Score: ${finalScore}/10.\n\nTengo trabajo que hacer para posicionarme como autoridad en 2026.\n\nPruébalo aquí: https://digitalateliersolutions.agency/report-ejecutivo-2026`;
                }
                const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;

                // 3. Construct Virality Block HTML
                const viralityBlock = `
                    <div class="mt-8 bg-[#18181b] border border-[#27272a] p-6 rounded-lg relative overflow-hidden group">
                         <!-- Decorative Icon -->
                        <div class="absolute -top-6 -right-6 text-[#0a66c2] opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
                             <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </div>

                        <div class="relative z-10">
                            <h4 class="text-white font-bold font-display text-lg mb-2">
                                Tu Score de Autoridad: <span class="text-[#EA580C] text-2xl">${finalScore}/10</span>
                            </h4>
                            <p class="text-gray-300 text-sm mb-6 max-w-[90%] leading-relaxed">
                                ¿Quieres mejorar este número? Comparte tu resultado en LinkedIn etiquetando a <strong class="text-white">@VictorRibes</strong> y te daré <span class="text-[#EA580C] font-bold">3 ajustes de alto impacto</span> gratis.
                            </p>
                            
                            <a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white px-5 py-2.5 rounded text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-900/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                                Compartir Resultado
                            </a>
                        </div>
                    </div>
                `;

                setModalContent(result.data! + viralityBlock);
            } else {
                setModalContent(`<p class="text-red-500 font-bold">Error de Sistema:</p><p class="text-red-400 text-sm mt-2">${result.error}</p>`);
            }

        } catch (error) {
            console.error("Client Error:", error);
            setModalContent(`<p class="text-red-500">Error inesperado en cliente: ${(error as Error).message}</p>`);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateStrategy = async () => {
        if (!currentRole.trim() || !goal2026.trim()) {
            alert("Por favor completa ambos campos para generar tu estrategia.");
            return;
        }

        setModalTitle("Estrategia Boutique");
        setModalContent('<div class="flex flex-col items-center py-10 gap-3"><p class="text-atelier-accent font-bold animate-pulse">Diseñando roadmap...</p></div>');
        setLoading(true);
        openModal();

        try {
            const prompt = `Genera un plan de posicionamiento estratégico en LinkedIn (Roadmap 2026) para la siguiente transición profesional en el sector Web3/Blockchain:
      
      CONTEXTO: Estamos en Diciembre 2025. La estrategia es para ejecutar en 2026.
      Perfil Actual: "${currentRole}"
      Objetivo 2026: "${goal2026}"
      Enfoque: Estrategia de Contenidos y Marca Personal en LinkedIn para lograr esta transición.
      
      Estilo: Digital Atelier Solutions (Estratégico, sobrio, sin relleno).
      
      IMPORTANTE: NO uses markdown (* o **). Usa EXCLUSIVAMENTE etiquetas HTML <strong> para las negritas.
      
      Estructura HTML requerida:
      
      <div class="space-y-6">
        <div>
            <h3 class="text-white font-bold text-lg font-display mb-1">01. Fase de Autoridad (Q1-Q2 2026)</h3>
            <p class="text-gray-300 text-sm leading-relaxed">[Estrategia de contenidos específica para validar el nuevo rol de ${goal2026}, usando <strong> énfasis </strong>]</p>
        </div>
         <div>
            <h3 class="text-white font-bold text-lg font-display mb-1">02. Fase de Expansión (Q3 2026)</h3>
            <p class="text-gray-300 text-sm leading-relaxed">[Acciones de networking y contenido viral B2B para acercarse al objetivo, usando <strong> énfasis </strong>]</p>
        </div>
         <div>
            <h3 class="text-white font-bold text-lg font-display mb-1">03. Fase de Consolidación (Q4 2026)</h3>
            <p class="text-gray-300 text-sm leading-relaxed">[Cómo cerrar el año posicionado como ${goal2026}, usando <strong> énfasis </strong>]</p>
        </div>
      </div>

      <div class="mt-8 border-t border-atelier-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
            <p class="text-atelier-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Estrategia por</p>
            <p class="text-white font-display font-bold text-base">Víctor Ribes</p>
            <p class="text-atelier-muted text-xs tracking-wide">Ghostwriter Blockchain & Estratega.</p>
        </div>
        <div class="text-right hidden sm:block">
            <p class="text-gray-600 text-[10px] font-mono uppercase tracking-widest">Digital Atelier Solutions</p>
        </div>
      </div>`;

            const result = await generateGeminiContent(prompt);

            if (result.success) {
                setModalContent(result.data!);
            } else {
                setModalContent(`<p class="text-red-500 font-bold">Error de Sistema:</p><p class="text-red-400 text-sm mt-2">${result.error}</p>`);
            }
        } catch (error) {
            console.error("Client Error:", error);
            setModalContent(`<p class="text-red-500">Error inesperado en cliente: ${(error as Error).message}</p>`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    // --- Chart Data ---

    // 0. LinkedIn Talent Insights (Bar - Growth YoY)
    const linkedinSkillsData: ChartData<'bar'> = {
        labels: ['Estrategia Regulatoria', 'Integración IA', 'Gestión de Riesgos', 'Ventas Institucionales', 'Desarrollo Solidity'],
        datasets: [{
            label: 'Crecimiento YoY (%)',
            data: [35, 30, 25, 20, 5],
            backgroundColor: [
                '#EA580C', // Atelier Accent (Orange)
                '#F97316', // Orange 500
                '#FB923C', // Orange 400
                '#71717a', // Zinc 500
                '#3f3f46'  // Zinc 700
            ],
            borderRadius: 2
        }]
    };
    const linkedinSkillsOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { grid: { color: '#27272a' }, ticks: { color: '#9CA3AF' } }, y: { grid: { display: false }, ticks: { color: '#fff' } } }
    };

    // 1. Job Titles (Bar - 2023 vs 2025)
    // 1. Job Titles (Bar - 2023 vs 2025)
    const jobTitlesData: ChartData<'bar'> = {
        labels: ['Dev Lead', 'Head Digital Assets', 'Tokenomics Dir.', 'Chief Web3', 'Auditor'],
        datasets: [
            {
                label: '2023 (Base)',
                data: [85, 20, 15, 10, 40],
                backgroundColor: '#52525b', // Zinc 600
                borderRadius: 2
            },
            {
                label: '2025 (Actual)',
                data: [45, 95, 80, 65, 55],
                backgroundColor: '#EA580C', // Atelier Accent
                borderRadius: 2
            }
        ]
    };
    const jobTitlesOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { position: 'bottom', labels: { color: '#9CA3AF', usePointStyle: true, boxWidth: 8 } },
            tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fff',
                bodyColor: '#9CA3AF',
                callbacks: {
                    label: (context) => ` Demanda: ${context.parsed.x} / 100`
                }
            }
        },
        scales: {
            x: {
                display: true,
                grid: { color: '#27272a' },
                ticks: { color: '#52525b' },
                max: 100
            },
            y: {
                grid: { display: false },
                ticks: { color: '#fff', font: { weight: 'bold' } }
            }
        }
    };

    // 2. Skills (Radar - 2024 vs 2026)
    const skillsData: ChartData<'radar'> = {
        labels: ['Tech Core', 'Compliance/Legal', 'Finanzas Trad.', 'Comunidad', 'Negocio', 'Ciberseguridad'],
        datasets: [{
            label: 'Perfil 2026',
            data: [50, 95, 85, 40, 90, 75],
            borderColor: '#EA580C',
            backgroundColor: 'rgba(234, 88, 12, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#EA580C'
        }, {
            label: 'Perfil 2024',
            data: [90, 40, 30, 85, 50, 60],
            borderColor: '#52525b',
            backgroundColor: 'rgba(82, 82, 91, 0.1)',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0
        }]
    };
    const skillsOptions: ChartOptions<'radar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { grid: { color: '#27272a' }, angleLines: { color: '#27272a' }, pointLabels: { color: '#F3F4F6' }, ticks: { display: false } } },
        plugins: { legend: { position: 'bottom', labels: { color: '#9CA3AF' } } }
    };

    // 3. Sectors (Doughnut)
    const sectorData: ChartData<'doughnut'> = {
        labels: ['Finanzas', 'Logística', 'Gobierno', 'Gaming', 'Salud'],
        datasets: [{
            data: [42, 25, 15, 12, 6],
            backgroundColor: ['#EA580C', '#d97706', '#f59e0b', '#71717a', '#27272a'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };
    const sectorOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, color: '#9CA3AF' } },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.label}: ${context.parsed}%`
                }
            }
        }
    };

    // NEW: Compensation Structure (Stacked Bar)
    const compData: ChartData<'bar'> = {
        labels: ['2021 (Bull Run)', '2023 (Bear Market)', '2025 (Institucional)'],
        datasets: [
            {
                label: 'Salario Base (Cash)',
                data: [35, 60, 65],
                backgroundColor: '#EA580C', // Orange
                stack: 'Stack 0',
            },
            {
                label: 'Equity (Acciones)',
                data: [10, 25, 25],
                backgroundColor: '#FFFFFF', // White
                stack: 'Stack 0',
            },
            {
                label: 'Tokens (Grants)',
                data: [55, 15, 10],
                backgroundColor: '#3f3f46', // Zinc 700
                stack: 'Stack 0',
                borderRadius: { topLeft: 4, topRight: 4 }
            }
        ]
    };
    const compOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: '#9CA3AF' } },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.dataset.label}: ${context.parsed.y}%`
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false, color: '#27272a' },
                ticks: { color: '#9CA3AF', font: { size: 10 } }
            },
            y: {
                stacked: true,
                grid: { color: '#27272a' },
                ticks: {
                    display: true,
                    color: '#52525b',
                    callback: (value) => `${value}%`
                }
            }
        }
    };

    // 3. RWA Growth (Line)
    const rwaData: ChartData<'line'> = {
        labels: ['23', '24', '25', '26', '27', '28', '29', '30'],
        datasets: [{
            data: [0.5, 1.2, 2.5, 4.8, 7.5, 10.2, 13.0, 16.1],
            borderColor: '#EA580C',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(234, 88, 12, 0.2)');
                gradient.addColorStop(1, 'rgba(234, 88, 12, 0)');
                return gradient;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#fff'
        }]
    };
    const rwaOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#52525b' } },
            y: { border: { display: false }, grid: { color: '#27272a' }, ticks: { color: '#52525b' } }
        }
    };

    // 4. Geo Hubs (Polar Area)
    const geoData: ChartData<'polarArea'> = {
        labels: ['Dubai', 'Londres', 'Singapur', 'NY', 'Zug', 'HK'],
        datasets: [{
            data: [95, 88, 85, 82, 70, 75],
            backgroundColor: [
                'rgba(234, 88, 12, 0.9)',
                'rgba(255, 255, 255, 0.9)',
                'rgba(82, 82, 91, 0.8)',
                'rgba(63, 63, 70, 0.7)',
                'rgba(39, 39, 42, 0.6)',
                'rgba(24, 24, 27, 0.5)'
            ],
            borderWidth: 0
        }]
    };
    const geoOptions: ChartOptions<'polarArea'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { grid: { color: '#27272a' }, ticks: { display: false, backdropColor: 'transparent' } } },
        plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, color: '#9CA3AF' } } }
    };

    // 5. Algo Weights (Doughnut)
    const algoData: ChartData<'doughnut'> = {
        labels: ['Validación Pares', 'Dwell Time', 'Nichos', 'CTR', 'Likes'],
        datasets: [{
            data: [35, 30, 20, 10, 5],
            backgroundColor: ['#EA580C', '#FFFFFF', '#52525b', '#3f3f46', '#27272a'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };
    const algoOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
    };


    return (
        <div className="bg-atelier-bg min-h-screen font-sans text-atelier-text selection:bg-atelier-accent selection:text-white">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundSize: '40px 40px',
                backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
            }}></div>

            <div className="relative z-10 pb-20">

                {/* Navbar */}
                <nav className="w-full border-b border-atelier-border bg-atelier-bg/95 backdrop-blur z-50 sticky top-0">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-lg font-display font-bold tracking-tight text-white leading-none">DIGITAL ATELIER</span>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-accent leading-none mt-1">SOLUTIONS</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-atelier-muted uppercase tracking-wider">Informe Privado</p>
                            <p className="text-sm font-bold text-white">Víctor Ribes</p>
                        </div>
                    </div>
                </nav>

                {/* Header Section */}
                <header className="w-full py-12 md:py-20 px-6 border-b border-atelier-border">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block py-1 px-3 border border-atelier-border rounded text-atelier-muted text-xs font-bold tracking-widest mb-6 uppercase bg-atelier-card">
                            Reporte de Mercado 2026
                        </span>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-4xl md:text-7xl font-extrabold mb-6 text-white tracking-tight leading-tight font-display"
                        >
                            El Ejecutivo <span className="text-atelier-accent">Blockchain</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-atelier-muted max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            Análisis de tendencias profesionales en Digital Assets, RWA, Tokenización y Desarrollo de Marca Profesional bajo el nuevo algoritmo de LinkedIn 2026.
                        </motion.p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 space-y-20">

                    {/* Intro Stats Grid */}
                    {/* Intro Stats Grid (LinkedIn Data) */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <motion.div variants={fadeInUp} className="bg-atelier-card border border-atelier-border p-6 hover:border-blue-500 transition-colors">
                            <h3 className="text-atelier-muted text-xs font-bold uppercase tracking-wider">Demanda Ejecutiva (YoY)</h3>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-white font-display">+45%</span>
                            </div>
                            <p className="mt-2 text-gray-500 text-xs">Crecimiento en roles de liderazgo vs estancamiento en roles junior.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-atelier-card border border-atelier-border p-6 hover:border-teal-500 transition-colors">
                            <h3 className="text-atelier-muted text-xs font-bold uppercase tracking-wider">Salario Base Promedio</h3>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-white font-display">$320k</span>
                                <span className="text-xs text-atelier-accent font-bold">USD</span>
                            </div>
                            <p className="mt-2 text-gray-500 text-xs">Para roles de 'Head of Digital Assets' en mercados Tier 1.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="bg-atelier-card border border-atelier-border p-6 hover:border-purple-500 transition-colors">
                            <h3 className="text-atelier-muted text-xs font-bold uppercase tracking-wider">Modalidad Híbrida</h3>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-white font-display">DOMINANTE</span>
                            </div>
                            <p className="mt-2 text-gray-500 text-xs">Caída del 50% en roles 'Full Remote'. Retorno a hubs físicos.</p>
                        </motion.div>
                    </motion.div>

                    {/* Content Wrapper for Lead Gate */}
                    <div className={`space-y-20 transition-all duration-1000 ${!isUnlocked ? 'filter blur-xl opacity-30 pointer-events-none select-none' : ''}`}>

                        {/* LinkedIn Talent Insights 2025 (New Section) */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-atelier-card/50 border border-atelier-border p-8 rounded-2xl"
                        >
                            <div className="flex items-center mb-8 gap-3">
                                <span className="bg-[#0077b5] text-white px-2 py-1 rounded font-bold text-lg font-display">in</span>
                                <h3 className="text-2xl font-bold text-white font-display">LinkedIn Talent Insights 2025</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                {/* Chart */}
                                <div className="bg-atelier-bg border border-atelier-border p-6 rounded-xl">
                                    <h4 className="text-xs font-bold text-atelier-muted uppercase mb-6 text-center tracking-widest">Habilidades con Mayor Crecimiento (YoY)</h4>
                                    <div className="relative w-full h-[300px]">
                                        <Bar data={linkedinSkillsData} options={linkedinSkillsOptions} />
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: LinkedIn Talent Insights</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>

                                {/* Text Insights */}
                                <div className="space-y-8">
                                    <div className="border-l-4 border-atelier-accent pl-6">
                                        <h4 className="font-bold text-lg text-white mb-2 font-display">El fin del "Crypto Nomad"</h4>
                                        <p className="text-atelier-muted text-sm leading-relaxed">
                                            Migración masiva hacia jurisdicciones reguladas (EAU, Suiza, Singapur). La estrategia se hace presencial.
                                        </p>
                                    </div>
                                    <div className="border-l-4 border-gray-500 pl-6">
                                        <h4 className="font-bold text-lg text-white mb-2 font-display">La "IA" como Estándar</h4>
                                        <p className="text-atelier-muted text-sm leading-relaxed">
                                            El 14% de las descripciones de trabajo C-Level ahora exigen competencia en flujos de trabajo de IA.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>



                        {/* Section 1: Executive Profile (Refined) */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-8 border-l-2 border-atelier-accent pl-4">
                                <h2 className="text-3xl text-white mb-2 font-display font-bold">1. La Transformación del Perfil</h2>
                                <p className="text-atelier-muted max-w-2xl">
                                    De roles "Crypto-Nativos" a "Diplomáticos Regulatorios". Comparativa de mercado 2023-2026.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-atelier-card border border-atelier-border p-8">
                                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Evolución de Títulos (2023 vs 2025)</h3>
                                    <p className="text-xs text-atelier-muted mb-6">Índice de Demanda Relativa (0-100)</p>
                                    <div className="relative w-full h-[300px] max-h-[400px]">
                                        <Bar data={jobTitlesData} options={jobTitlesOptions} />
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: Digital Atelier Research</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>
                                <div className="bg-atelier-card border border-atelier-border p-8">
                                    <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Matriz de Habilidades (2026)</h3>
                                    <div className="relative w-full h-[300px] max-h-[400px]">
                                        <Radar data={skillsData} options={skillsOptions} />
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: Digital Atelier Research</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 2: Sector Landscape (New) */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                <div className="lg:col-span-1">
                                    <h2 className="text-3xl text-white mb-4 font-display font-bold">2. Panorama Laboral</h2>
                                    <p className="text-atelier-muted mb-6 text-sm leading-relaxed">
                                        Finanzas sigue dominando, pero la sorpresa es el auge en Logística (Supply Chain) y Gobierno (CBDC).
                                    </p>
                                    <ul className="space-y-4 text-sm mt-8">
                                        <li className="flex items-center justify-between text-gray-400 border-b border-atelier-border pb-2">
                                            <span className="flex items-center gap-3"><span className="w-2 h-2 bg-[#EA580C] rounded-full"></span> Finanzas</span>
                                            <span className="text-white font-mono font-bold">42%</span>
                                        </li>
                                        <li className="flex items-center justify-between text-gray-400 border-b border-atelier-border pb-2">
                                            <span className="flex items-center gap-3"><span className="w-2 h-2 bg-[#d97706] rounded-full"></span> Logística</span>
                                            <span className="text-white font-mono font-bold">25%</span>
                                        </li>
                                        <li className="flex items-center justify-between text-gray-400 border-b border-atelier-border pb-2">
                                            <span className="flex items-center gap-3"><span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span> Gobierno</span>
                                            <span className="text-white font-mono font-bold">15%</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="lg:col-span-2 bg-atelier-card border border-atelier-border p-8 flex flex-col items-center relative">
                                    <div className="relative w-full max-w-[400px] h-[300px] mt-2">
                                        <Doughnut data={sectorData} options={sectorOptions} />
                                    </div>
                                    <div className="w-full mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: Digital Atelier Research</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>
                            </div>

                            {/* Top Employers Grid (New) */}
                            <h3 className="text-xl font-bold text-white mb-6 mt-12 font-display px-1">Top Empleadores Corporativos (Q4 2025)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <motion.div whileHover={{ scale: 1.02 }} className="bg-atelier-card border border-atelier-border p-6 hover:border-gray-500 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Gigantes TradFi</h4>
                                        <span className="bg-green-900/30 text-green-400 text-[10px] px-2 py-1 rounded border border-green-900 uppercase font-bold">Alta Demanda</span>
                                    </div>
                                    <ul className="space-y-2 text-xs text-atelier-muted">
                                        <li><strong className="text-white">BlackRock:</strong> MD Digital Assets</li>
                                        <li><strong className="text-white">BBVA / Santander:</strong> Compliance MiCA</li>
                                    </ul>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="bg-atelier-card border border-atelier-border p-6 hover:border-blue-500 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Líderes Nativos</h4>
                                        <span className="bg-blue-900/30 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-900 uppercase font-bold">Escalando</span>
                                    </div>
                                    <ul className="space-y-2 text-xs text-atelier-muted">
                                        <li><strong className="text-white">Coinbase:</strong> VP Growth & Policy</li>
                                        <li><strong className="text-white">Kraken:</strong> Head of Institutional Sales</li>
                                    </ul>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="bg-atelier-card border border-atelier-border p-6 hover:border-purple-500 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Infraestructura</h4>
                                        <span className="bg-purple-900/30 text-purple-400 text-[10px] px-2 py-1 rounded border border-purple-900 uppercase font-bold">Estratégico</span>
                                    </div>
                                    <ul className="space-y-2 text-xs text-atelier-muted">
                                        <li><strong className="text-white">Chainlink Labs:</strong> Capital Markets Lead</li>
                                        <li><strong className="text-white">Fireblocks:</strong> Enterprise Security Dir.</li>
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* NEW INSIGHT: COMPENSATION STRUCTURE */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-atelier-card border border-atelier-border rounded-xl p-8 relative overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-atelier-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                                <div>
                                    <div className="inline-block bg-atelier-accent text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded mb-4">Dato Clave 2025</div>
                                    <h3 className="text-2xl font-bold text-white mb-4 font-display">El Nuevo Pacto Salarial: Equity vs. Tokens</h3>
                                    <p className="text-atelier-muted text-sm leading-relaxed mb-6">
                                        Los datos revelan un "Efecto Barbell": mientras los salarios junior se ajustan, la compensación ejecutiva sube (+37%) pero cambia de forma.
                                        <br /><br />
                                        Se ha producido un <strong className="text-white">desacople</strong>: El 51% de las empresas ahora separan totalmente el Equity de los Tokens. Los ejecutivos prefieren la estabilidad del Equity tradicional y Cash frente a la volatilidad de los Token Grants (que han caído un 75% en volumen).
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                            <span className="text-xs text-gray-400">Preferencia por la propiedad real (Equity).</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                                            <span className="text-xs text-gray-400">Tokens reservados solo para largo plazo.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-atelier-bg p-6 rounded-xl border border-atelier-border flex flex-col items-center">
                                    <h4 className="text-[10px] font-bold text-atelier-muted uppercase mb-4 text-center tracking-widest">Estructura Paquete C-Level</h4>
                                    <div className="relative w-full h-[250px]">
                                        <Bar data={compData} options={compOptions} />
                                    </div>
                                    <div className="w-full mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: Dragonfly Capital 2025</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 3: Infra & RWA */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-8 border-l-2 border-atelier-accent pl-4">
                                <h2 className="text-3xl text-white mb-2 font-display font-bold">3. Infraestructura & RWA</h2>
                                <p className="text-atelier-muted max-w-2xl">
                                    Las Stablecoins y la Tokenización de Activos Reales son los nuevos pilares de contenido de alto valor.
                                </p>
                            </div>
                            <div className="bg-atelier-card border border-atelier-border p-8">
                                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Crecimiento TVL (RWA)</h3>
                                <p className="text-xs text-atelier-muted mb-6">Proyección en Trillones de USD</p>
                                <div className="relative w-full h-[350px]">
                                    <Line data={rwaData} options={rwaOptions} />
                                </div>
                                <div className="mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                    <span>Fuente: Digital Atelier Research</span>
                                    <span>www.digitalateliersolutions.agency</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 4: Roadmap 2026 (New) */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl text-white mb-2 font-display font-bold">4. Tendencias & Roadmap 2026</h2>
                                <p className="text-atelier-muted">Cronograma estratégico para la integración institucional.</p>
                            </div>

                            <div className="max-w-4xl mx-auto relative pl-6 border-l-2 border-atelier-border space-y-12">
                                {/* Q1 */}
                                <div className="relative group">
                                    <div className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-atelier-bg border-4 border-atelier-accent text-white flex items-center justify-center font-bold text-[10px] z-10 group-hover:scale-110 transition-transform">Q1</div>
                                    <div className="bg-atelier-card border border-atelier-border p-6 rounded hover:border-atelier-accent transition-colors">
                                        <h4 className="text-xl font-bold text-white mb-2 font-display">La Fusión AI-Blockchain</h4>
                                        <p className="text-sm text-atelier-muted">Aparición del rol "Director de Integridad de Datos". La inmutabilidad verifica a los agentes de IA.</p>
                                    </div>
                                </div>

                                {/* Q2 */}
                                <div className="relative group">
                                    <div className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-atelier-bg border-4 border-white text-black flex items-center justify-center font-bold text-[10px] z-10 group-hover:scale-110 transition-transform">Q2</div>
                                    <div className="bg-atelier-card border border-atelier-border p-6 rounded hover:border-white transition-colors">
                                        <h4 className="text-xl font-bold text-white mb-2 font-display">Tokenización RWA Masiva</h4>
                                        <p className="text-sm text-atelier-muted">Ejecutivos con "Doble Licencia" (Real Estate + Smart Contracts) lideran la gestión de activos.</p>
                                    </div>
                                </div>

                                {/* Q4 */}
                                <div className="relative group">
                                    <div className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-atelier-bg border-4 border-gray-600 text-white flex items-center justify-center font-bold text-[10px] z-10 group-hover:scale-110 transition-transform">Q4</div>
                                    <div className="bg-atelier-card border border-atelier-border p-6 rounded hover:border-gray-600 transition-colors">
                                        <h4 className="text-xl font-bold text-white mb-2 font-display">Gobernanza DAO Pro</h4>
                                        <p className="text-sm text-atelier-muted">Estandarización del "Delegado Profesional". Gestión de voto político corporativo en protocolos.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 5: Geographic Hubs */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                <div className="lg:col-span-1">
                                    <h2 className="text-3xl text-white mb-4 font-display font-bold">5. Hubs Globales</h2>
                                    <p className="text-atelier-muted mb-6 text-sm leading-relaxed">
                                        El talento ejecutivo se concentra donde existe claridad regulatoria. Dubai y Londres lideran la atracción de perfiles institucionales.
                                    </p>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <span className="w-2 h-2 bg-atelier-accent rounded-full"></span> Dubai (VARA)
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <span className="w-2 h-2 bg-white rounded-full"></span> Londres (MiCA/UK)
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <span className="w-2 h-2 bg-gray-600 rounded-full"></span> Singapur (MAS)
                                        </li>
                                    </ul>
                                    <div className="mt-8 p-4 bg-atelier-bg/50 border border-atelier-border rounded-lg">
                                        <p className="text-xs text-atelier-muted">
                                            <strong className="text-white block mb-1 font-display">Índice Atelier (0-100)</strong>
                                            Puntuación compuesta: Claridad Regulatoria + Densidad de Talento Institucional.
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 bg-atelier-card border border-atelier-border p-8">
                                    <div className="relative w-full h-[300px]">
                                        <PolarArea data={geoData} options={geoOptions} />
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: Digital Atelier Research</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 4: Algorithm 2026 */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-8 border-l-2 border-atelier-accent pl-4">
                                <h2 className="text-3xl text-white mb-2 font-display font-bold">6. Algoritmo: Knowledge Velocity</h2>
                                <p className="text-atelier-muted max-w-2xl">
                                    LinkedIn priorizará la profundidad técnica y la validación de pares sobre los likes rápidos.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="bg-atelier-card border border-atelier-border p-8">
                                    <div className="relative w-full h-[300px]">
                                        <Doughnut data={algoData} options={algoOptions} />
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-atelier-border/50 flex justify-between items-center text-[9px] text-atelier-muted uppercase tracking-widest font-mono opacity-60">
                                        <span>Fuente: LinkedIn Algorithm Analysis</span>
                                        <span>www.digitalateliersolutions.agency</span>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="border-b border-atelier-border pb-6">
                                        <h4 className="text-white font-bold text-lg mb-1 font-display">01. Validación de Pares</h4>
                                        <p className="text-sm text-atelier-muted">Un comentario de otro experto en tu nicho tiene un peso 10x superior a un like genérico.</p>
                                    </div>
                                    <div className="border-b border-atelier-border pb-6">
                                        <h4 className="text-white font-bold text-lg mb-1 font-display">02. Dwell Time</h4>
                                        <p className="text-sm text-atelier-muted">El tiempo de lectura es el KPI definitivo. El contenido debe detener el scroll.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 5: The 4E Matrix */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-8 border-l-2 border-atelier-accent pl-4">
                                <h2 className="text-3xl text-white mb-2 font-display font-bold">7. Estrategia Editorial: La Matriz 4E</h2>
                                <p className="text-atelier-muted max-w-2xl">
                                    Distribución táctica para maximizar la autoridad sin fatigar a la audiencia institucional.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Educar */}
                                <div className="bg-atelier-card border border-atelier-border p-6 hover:border-atelier-accent transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-white font-bold font-display text-lg">Educar</h3>
                                        <span className="text-2xl font-bold text-atelier-accent font-display opacity-80 group-hover:opacity-100">40%</span>
                                    </div>
                                    <p className="text-xs text-atelier-muted leading-relaxed mb-3">
                                        Desglosar conceptos complejos (Cross-chain, MPC). La base de la confianza técnica.
                                    </p>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Formatos: PDF, Guías</span>
                                </div>

                                {/* Involucrar */}
                                <div className="bg-atelier-card border border-atelier-border p-6 hover:border-white transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-white font-bold font-display text-lg">Involucrar</h3>
                                        <span className="text-2xl font-bold text-white font-display opacity-80 group-hover:opacity-100">30%</span>
                                    </div>
                                    <p className="text-xs text-atelier-muted leading-relaxed mb-3">
                                        Opinión fuerte sobre mercado y regulación. Impulsa el debate y el Dwell Time.
                                    </p>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Formatos: Encuestas, Textos</span>
                                </div>

                                {/* Humanizar */}
                                <div className="bg-atelier-card border border-atelier-border p-6 hover:border-gray-400 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-white font-bold font-display text-lg">Humanizar</h3>
                                        <span className="text-2xl font-bold text-gray-400 font-display opacity-80 group-hover:opacity-100">20%</span>
                                    </div>
                                    <p className="text-xs text-atelier-muted leading-relaxed mb-3">
                                        Vulnerabilidad estratégica y cultura (P2B). Conexión emocional anti-IA.
                                    </p>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Formatos: Historias, Fotos</span>
                                </div>

                                {/* Evidencia */}
                                <div className="bg-atelier-card border border-atelier-border p-6 hover:border-gray-600 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-white font-bold font-display text-lg">Evidencia</h3>
                                        <span className="text-2xl font-bold text-gray-600 font-display opacity-80 group-hover:opacity-100">10%</span>
                                    </div>
                                    <p className="text-xs text-atelier-muted leading-relaxed mb-3">
                                        Casos de éxito y milestones corporativos. Convierte la reputación en leads.
                                    </p>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Formatos: Hitos, Prensa</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 6: Brand Building Flow */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl text-white mb-2 font-display font-bold">8. El Método <span className="text-atelier-accent">Blockcha-in®</span> de Digital Atelier</h2>
                                <p className="text-atelier-muted mb-6">Máximo impacto. Mínima fricción.</p>

                                <a
                                    href="https://www.blockcha-in.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-atelier-border bg-atelier-card/50 text-[10px] uppercase tracking-widest text-atelier-muted hover:text-white hover:border-atelier-accent transition-all duration-300 group"
                                >
                                    <span>Explorar Servicio</span>
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </a>
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-stretch gap-0 md:gap-4 max-w-5xl mx-auto">
                                {/* Step 1 */}
                                <div className="flex-1 bg-atelier-card border border-atelier-border p-8 text-center group transition-all hover:border-atelier-accent">
                                    <span className="text-4xl font-display font-bold text-atelier-accent mb-4 block">01</span>
                                    <h4 className="text-white font-bold text-lg mb-2">Voiceboard™</h4>
                                    <p className="text-xs text-atelier-muted leading-relaxed">
                                        Reuniones mensuales de estrategia y contenido alineadas a tu voz y rol profesional.
                                    </p>
                                </div>

                                {/* Connector */}
                                <div className="border-l border-dashed border-gray-600 h-10 mx-auto md:h-auto md:w-16 md:border-l-0 md:border-t md:my-auto"></div>

                                {/* Step 2 */}
                                <div className="flex-1 bg-atelier-card border border-atelier-border p-8 text-center group transition-all hover:border-white">
                                    <span className="text-4xl font-display font-bold text-white mb-4 block">02</span>
                                    <h4 className="text-white font-bold text-lg mb-2">Ghostwriting</h4>
                                    <p className="text-xs text-atelier-muted leading-relaxed">
                                        Transformación de ideas en narrativas de alta autoridad técnica. Tú sigues liderando, nosotros nos encargamos de que te escuchen.
                                    </p>
                                </div>

                                {/* Connector */}
                                <div className="border-l border-dashed border-gray-600 h-10 mx-auto md:h-auto md:w-16 md:border-l-0 md:border-t md:my-auto"></div>

                                {/* Step 3 */}
                                <div className="flex-1 bg-atelier-card border border-atelier-border p-8 text-center group transition-all hover:border-gray-500">
                                    <span className="text-4xl font-display font-bold text-gray-600 mb-4 block">03</span>
                                    <h4 className="text-white font-bold text-lg mb-2">Aprobación</h4>
                                    <p className="text-xs text-atelier-muted leading-relaxed">
                                        Revisión en suite interna. Un click para aprobar, nos encargamos de publicación y gestión de perfil.
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* AI Tools Section */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <h2 className="text-2xl font-bold text-white font-display">Herramientas Ejecutivas</h2>
                                <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    POWERED BY GEMINI API
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Tool 1 */}
                                <div className="bg-atelier-card border border-atelier-border p-8">
                                    <h3 className="text-lg font-bold text-white mb-2 font-display"><span className="text-atelier-accent">01.</span> Auditor de Autoridad</h3>
                                    <p className="text-sm text-atelier-muted mb-4">
                                        Pega tu &quot;About&quot; o &quot;Titular&quot;. La IA simulará el algoritmo de 2026 para puntuar tu autoridad ejecutiva.
                                    </p>
                                    <textarea
                                        value={profileInput}
                                        onChange={(e) => setProfileInput(e.target.value)}
                                        className="w-full bg-black border border-atelier-border text-white p-4 text-sm focus:border-atelier-accent outline-none transition-colors mb-4 font-mono resize-none"
                                        rows={3}
                                        placeholder="Pega tu texto aquí..."
                                    ></textarea>
                                    <button onClick={handleAnalyzeProfile} disabled={loading} className="w-full bg-white hover:bg-gray-200 text-black font-bold text-xs py-3 px-4 transition-all uppercase tracking-widest border border-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'Analizando...' : 'Auditar Perfil'}
                                    </button>
                                </div>

                                {/* Tool 2 */}
                                <div className="bg-atelier-card border border-atelier-border p-8">
                                    <h3 className="text-lg font-bold text-white mb-2 font-display"><span className="text-atelier-accent">02.</span> Generador de Estrategia</h3>
                                    <p className="text-sm text-atelier-muted mb-4">
                                        Define tu punto de partida y tu meta. Diseñaremos un roadmap a medida para 2026.
                                    </p>
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                value={currentRole}
                                                onChange={(e) => setCurrentRole(e.target.value)}
                                                className="w-full bg-black border border-atelier-border text-white p-3 text-sm focus:border-atelier-accent outline-none font-mono placeholder-gray-700"
                                                placeholder="Rol Actual (ej. Abogado, Dev...)"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                value={goal2026}
                                                onChange={(e) => setGoal2026(e.target.value)}
                                                className="w-full bg-black border border-atelier-border text-white p-3 text-sm focus:border-atelier-accent outline-none font-mono placeholder-gray-700"
                                                placeholder="Objetivo 2026 (ej. CEO, Speaker...)"
                                            />
                                        </div>
                                        <button onClick={handleGenerateStrategy} disabled={loading} className="w-full border border-atelier-border text-white hover:border-atelier-accent hover:text-atelier-accent font-bold text-xs py-3 px-4 transition-all uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                            {loading ? 'Generando Roadmap...' : 'Generar Estrategia'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="py-16 border-t border-atelier-border/30"
                        >
                            <div className="max-w-4xl mx-auto text-center px-4">
                                <div className="inline-flex items-center justify-center p-3 mb-6 bg-atelier-muted/5 rounded-full border border-atelier-border/50">
                                    <Share2 className="text-atelier-muted w-5 h-5" />
                                </div>

                                <h2 className="text-2xl text-white font-display font-medium tracking-tight mb-3">
                                    Comparte este report con tu audiencia
                                </h2>
                                <p className="text-atelier-muted text-sm font-light leading-relaxed max-w-xl mx-auto mb-10">
                                    Análisis de tendencias profesionales en Digital Assets, RWA, Tokenización y Desarrollo de Marca Profesional bajo el nuevo algoritmo de LinkedIn 2026.
                                </p>

                                <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-4xl mx-auto">
                                    {/* LinkedIn Button */}
                                    <a
                                        href={currentUrl ? `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`He estado analizando el Reporte de Mercado 2026 de Digital Atelier: RWA, Compensación de salarios y el nuevo algoritmo de LinkedIn.\n\nLectura obligatoria para entender la institucionalización del sector blockchain👇\n\n${currentUrl}`)}` : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative w-full md:w-auto px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors flex items-center justify-center gap-4 ${currentUrl ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        <Linkedin className="w-4 h-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <span>Compartir en LinkedIn</span>
                                    </a>

                                    {/* X (Twitter) Button */}
                                    <a
                                        href={currentUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`He estado analizando el Reporte de Mercado 2026 de Digital Atelier: RWA, Compensación de salarios y el nuevo algoritmo de LinkedIn.\n\nLectura obligatoria para entender la institucionalización del sector blockchain👇`)}&url=${encodeURIComponent(currentUrl)}` : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative w-full md:w-auto px-8 py-4 bg-black border border-zinc-800 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors flex items-center justify-center gap-4 ${currentUrl ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-white opacity-90 group-hover:opacity-100 transition-opacity">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                        </svg>
                                        <span>Compartir en X</span>
                                    </a>

                                    {/* Copy Link Button */}
                                    <button
                                        onClick={handleCopyLink}
                                        className="group w-full md:w-auto px-6 py-4 text-atelier-muted hover:text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-colors"
                                    >
                                        {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        <span className="border-b border-transparent group-hover:border-atelier-muted transition-all">{linkCopied ? 'URL Copiada' : 'Copiar Enlace'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.section>

                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-atelier-border bg-atelier-card py-12 mt-20">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h4 className="text-lg font-display font-bold text-white tracking-widest mb-2 shadow-glow">DIGITAL ATELIER <span className="text-atelier-accent">SOLUTIONS</span></h4>
                        <p className="text-atelier-muted text-xs mb-6">
                            Agencia Boutique de Comunicación Blockchain Institucional
                        </p>
                        <div className="text-[10px] text-gray-600 font-mono uppercase">
                            &copy; 2025 Víctor Ribes. Todos los derechos reservados.
                        </div>
                    </div>
                </footer>

                {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                        <div className="bg-atelier-bg border border-atelier-border p-8 max-w-lg w-full relative shadow-2xl">
                            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer">✕</button>

                            <div className="mb-6 border-b border-atelier-border pb-4">
                                <span className="text-atelier-accent text-[10px] font-bold uppercase tracking-widest">DIGITAL ATELIER AI</span>
                                <h3 className="text-2xl font-bold text-white mt-1 font-display">{modalTitle}</h3>
                            </div>

                            <div className="text-gray-300 text-sm space-y-4 max-h-[60vh] overflow-y-auto leading-relaxed">
                                {/* Dangerously Set HTML required for the formatted response from Gemini */}
                                <div dangerouslySetInnerHTML={{ __html: modalContent.replace(/```html/g, '').replace(/```/g, '') }} />
                            </div>
                        </div>
                    </div>
                )}
                {/* Gate Modal */}
                {showGate && !isUnlocked && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
                        <div className="bg-atelier-bg border border-atelier-accent/50 p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(234,88,12,0.2)] rounded-xl">
                            <div className="text-center mb-8">
                                <span className="text-atelier-accent text-[10px] font-bold uppercase tracking-[0.2em]">Acceso Exclusivo</span>
                                <h3 className="text-3xl font-bold text-white mt-2 font-display">Desbloquear Informe</h3>
                                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                                    Este reporte contiene datos sensibles de mercado reservados para profesionales del sector.
                                </p>
                            </div>

                            <form onSubmit={handleGateSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 block">Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={gateForm.name}
                                        onChange={(e) => setGateForm({ ...gateForm, name: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-800 focus:border-atelier-accent text-white p-3 rounded text-sm outline-none transition-colors"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 block">Email Profesional</label>
                                    <input
                                        type="email"
                                        required
                                        value={gateForm.email}
                                        onChange={(e) => setGateForm({ ...gateForm, email: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-800 focus:border-atelier-accent text-white p-3 rounded text-sm outline-none transition-colors"
                                        placeholder="tu@empresa.com"
                                    />
                                </div>

                                {gateError && <p className="text-red-500 text-xs text-center">{gateError}</p>}

                                <button
                                    type="submit"
                                    disabled={gateLoading}
                                    className="w-full bg-atelier-accent hover:bg-orange-600 text-white font-bold py-4 rounded text-sm uppercase tracking-widest transition-all mt-4 disabled:opacity-50 shadow-lg shadow-orange-900/20"
                                >
                                    {gateLoading ? 'Verificando...' : 'Acceder al Reporte'}
                                </button>

                                <p className="text-[10px] text-gray-600 text-center mt-4">
                                    Al acceder, te unirás a nuestra lista de inteligencia de mercado. Cero spam.
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
