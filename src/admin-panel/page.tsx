'use client';

import { useState } from 'react';
import { logoutAdmin } from '@/app/actions/admin-auth';
import { LogOut, FileText, Sparkles, Download, Settings, Database, Loader2, Play } from 'lucide-react';

// Types simplified for disabled state
type AnalysisResult = any;

export default function AdminDashboard() {
    // State
    const [transcript, setTranscript] = useState('');
    const [model, setModel] = useState('gpt-4o');
    const [clientName, setClientName] = useState('');
    const [clientPhase, setClientPhase] = useState('Onboarding');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<'voice' | 'positioning' | 'rules' | 'content'>('voice');
    const [error, setError] = useState('');

    const handleProcess = async () => {
        // Feature temporarily disabled to optimize bundle size for Cloudflare Free Tier
        setError("AI Suite disabled for optimization. Please contact support.");
        return;
    };

    const downloadFile = (data: any, suffix: string) => {
        const safeName = clientName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'cliente';
        const safePhase = clientPhase.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'onboarding';
        const safeModel = model.replace(/[^a-z0-9]/gi, '-').toLowerCase(); // sanitize model name
        const date = new Date().toISOString().split('T')[0];
        const filename = `${safeName}_${safePhase}_${safeModel}_${suffix}_${date}.json`;

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleDownloadAll = () => {
        if (!result) return;
        downloadFile(result.voiceProfile, 'voice_profile');
        setTimeout(() => downloadFile(result.positioningProfile, 'positioning_profile'), 100);
        setTimeout(() => downloadFile(result.operationalRules, 'operational_rules'), 200);
        setTimeout(() => downloadFile(result.contentOutputs, 'content_outputs'), 300);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10 h-screen flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-zinc-800 pb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Onboarding Suite <span className="text-orange-600">.AI</span></h1>
                    <p className="text-zinc-400 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema Operativo Industrial v2.0 • 4-Layer Architecture
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <form action={logoutAdmin}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-900/30 rounded text-red-400 text-sm hover:bg-red-900/30 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Salir
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">

                {/* Left Column: Input (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                                <Database className="w-4 h-4 text-orange-500" />
                                Datos del Cliente
                            </h2>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="bg-black border border-zinc-700 text-xs text-zinc-300 rounded px-2 py-1 focus:border-orange-500 outline-none"
                            >
                                <option value="gpt-4o">OpenAI GPT-4o</option>
                                <option value="claude-sonnet-4-5">Claude Sonnet 4.5 (Latest)</option>
                                <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (Legacy)</option>
                                <option value="gemini-1.5-pro">Gemini 2.5 Flash (Free Tier)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Nombre Cliente"
                                className="bg-black/50 border border-zinc-800 rounded p-2 text-sm text-white placeholder:text-zinc-600 focus:border-orange-600 outline-none"
                            />
                            <input
                                type="text"
                                value={clientPhase}
                                onChange={(e) => setClientPhase(e.target.value)}
                                placeholder="Fase (ej: Onboarding)"
                                className="bg-black/50 border border-zinc-800 rounded p-2 text-sm text-white placeholder:text-zinc-600 focus:border-orange-600 outline-none"
                            />
                        </div>

                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Pega aquí la transcripción limpia..."
                            className="flex-1 w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 resize-none font-mono mb-4"
                        />

                        {error && (
                            <p className="text-red-400 text-xs mb-4 text-center">{error}</p>
                        )}

                        <button
                            onClick={handleProcess}
                            disabled={loading || !transcript}
                            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shrink-0 ${loading || !transcript
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-900/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generando 4 Capas...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-current" />
                                    Ejecutar Pipeline Industrial
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column: Output Preview (8 cols) */}
                <div className="lg:col-span-8 flex flex-col overflow-hidden h-full">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-0 h-full flex flex-col overflow-hidden relative">
                        {/* Tab Bar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black/20 shrink-0 overflow-x-auto">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setActiveTab('voice')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${activeTab === 'voice' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    1. Perfil Voz (Estable)
                                </button>
                                <button
                                    onClick={() => setActiveTab('positioning')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${activeTab === 'positioning' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    2. Posicionamiento
                                </button>
                                <button
                                    onClick={() => setActiveTab('rules')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${activeTab === 'rules' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    3. Reglas (Ejecución)
                                </button>
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${activeTab === 'content' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    4. Contenido (Outputs)
                                </button>
                            </div>

                            <button
                                onClick={handleDownloadAll}
                                disabled={!result}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap ${!result ? 'opacity-30 cursor-not-allowed bg-zinc-800 text-zinc-500' : 'bg-green-900/30 text-green-400 border border-green-900/50 hover:bg-green-900/50'}`}
                            >
                                <Download className="w-3 h-3" />
                                Download All (4 JSONs)
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-auto p-8 relative bg-[#0a0a0a]">
                            {result ? (
                                <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-400 prose-headings:text-zinc-100 prose-strong:text-orange-500">
                                    {/* Simply rendering the Markdown content. In a real app we might use a MD parser,
                                        but for now pre-wrap is enough to inspect structure or use a simple whitespace preserve. */}
                                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-300">
                                        {activeTab === 'voice' && JSON.stringify(result.voiceProfile, null, 2)}
                                        {activeTab === 'positioning' && JSON.stringify(result.positioningProfile, null, 2)}
                                        {activeTab === 'rules' && JSON.stringify(result.operationalRules, null, 2)}
                                        {activeTab === 'content' && JSON.stringify(result.contentOutputs, null, 2)}
                                    </pre>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                                    <FileText className="w-16 h-16 opacity-10" />
                                    <p className="text-sm">El análisis industrial aparecerá aquí...</p>
                                </div>
                            )}

                            {/* Overlay Loading State */}
                            {loading && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white">
                                    <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
                                    <p className="font-display font-bold animate-pulse">Procesando Arquitectura de 4 Capas...</p>
                                    <p className="text-xs text-zinc-500 mt-2">Stage 1: Voz & Posicionamiento</p>
                                    <p className="text-xs text-zinc-500">Stage 2: Reglas & Content</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
