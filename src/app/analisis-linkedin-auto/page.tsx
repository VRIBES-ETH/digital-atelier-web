'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldCheck, ArrowRight, Loader2, Linkedin } from 'lucide-react';

// Define the response type based on our API
type AnalysisResult = {
    score: number;
    headline_critique: string;
    summary_critique: string;
    key_strengths: string[];
    key_weaknesses: string[];
    hook_suggestion: string;
    improved_headline: string;
};

export default function LinkedInAnalyzer() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('Initializing...');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [profile, setProfile] = useState<{ full_name: string; headline: string; image: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.includes('linkedin.com/in/')) {
            alert('Please enter a valid LinkedIn profile URL');
            return;
        }

        setIsLoading(true);
        setResult(null);

        // Simulate scanning steps for UX
        const steps = [
            "Accessing LinkedIn Public Data...",
            "Extracting Experience & Skills...",
            "Analyzing Personal Brand Authority...",
            "Checking Sales Conversion capability...",
            "Generating Expert Report..."
        ];

        for (let i = 0; i < steps.length; i++) {
            setLoadingStep(steps[i]);
            await new Promise(r => setTimeout(r, 800)); // Fake delay for UX
        }

        try {
            const res = await fetch('/api/analyze-linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }), // URL is sent but ignored by Mock Backend
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            setProfile(data.profile);
            setResult(data.analysis);
        } catch (err) {
            alert('Failed to analyze profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">

            {/* HEADER */}
            <header className="py-6 border-b bg-white">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold font-serif">Digital Atelier Solutions</h1>
                    <span className="text-xs uppercase tracking-widest text-slate-500">AI Audit Tool</span>
                </div>
            </header>

            <main className="container mx-auto px-4 max-w-4xl mt-12">

                {/* INPUT SECTION */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                        Is your LinkedIn Profile <span className="text-blue-600">selling for you?</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                        Get a free, AI-powered audit of your personal brand. Discover exactly what's holding you back from more leads and authority.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto relative">
                        <input
                            type="text"
                            placeholder="https://www.linkedin.com/in/your-profile"
                            className="flex-1 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze Free'}
                        </button>
                    </form>
                    <p className="text-xs text-slate-400 mt-4">
                        <ShieldCheck className="w-3 h-3 inline mr-1" />
                        Safe & Private. We don't modify your profile.
                    </p>
                </div>

                {/* LOADING STATE */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
                                    <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Analyzing Profile...</h3>
                            <p className="text-slate-500 animate-pulse">{loadingStep}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* RESULTS SECTION */}
                {result && profile && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid gap-8"
                    >
                        {/* HEADLINE SCORECARD */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row items-center gap-6">
                                <img src={profile.image} alt={profile.full_name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                                <div className="text-center md:text-left flex-1">
                                    <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                                    <p className="text-slate-300 text-sm mt-1">{profile.headline}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className={`text-5xl font-black ${result.score > 70 ? 'text-green-400' : result.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {result.score}
                                    </div>
                                    <span className="text-xs uppercase tracking-wider text-slate-400">Profile Score</span>
                                </div>
                            </div>

                            <div className="p-8 grid md:grid-cols-2 gap-12">
                                {/* STRENGTHS & WEAKNESSES */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <AlertTriangle className="text-yellow-500" />
                                        Critical Issues found
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.key_weaknesses.map((w, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-700 items-start">
                                                <span className="text-red-500 font-bold">✕</span> {w}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="text-lg font-bold mt-8 mb-4 flex items-center gap-2">
                                        <CheckCircle className="text-green-500" />
                                        Doing well
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.key_strengths.map((s, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-700 items-start">
                                                <span className="text-green-500 font-bold">✓</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* HIGH LEVEL CRITIQUE */}
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                        <h4 className="font-bold text-blue-900 text-sm uppercase mb-2">Headline Analysis</h4>
                                        <p className="text-slate-700 text-sm italic">"{result.headline_critique}"</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h4 className="font-bold text-slate-900 text-sm uppercase mb-2">About Section Analysis</h4>
                                        <p className="text-slate-700 text-sm italic">"{result.summary_critique}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* THE GATE (BLURRED CONTENT) */}
                        <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 filter blur-sm select-none opacity-50 relative z-0">
                                <h3 className="text-xl font-bold mb-4">Detailed Action Plan & Scripts</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-green-600 mb-2">Recommended New Headline</h4>
                                        <p className="text-lg font-medium">Author | Speaker | Helping Companies Scale X...</p>
                                        <p className="text-slate-500 text-sm mt-2">This version targets your ideal client directly by...</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-600 mb-2">Your New "Hook"</h4>
                                        <p className="text-lg font-medium">"I spent 10 years learning X so you don't have to..."</p>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-4">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                </div>
                            </div>

                            {/* CALL TO ACTION OVERLAY */}
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-slate-200">
                                    <h3 className="text-2xl font-bold font-serif mb-2">Unlock Your Full Audit</h3>
                                    <p className="text-slate-600 mb-6">
                                        Get the <b>rewritten headline</b>, <b>custom hooks</b>, and <b>step-by-step fix list</b> (PDF) sent to your inbox.
                                    </p>
                                    <button className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        Unlock Free Report <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <p className="text-xs text-slate-400 mt-4">No spam. Unsubscribe anytime.</p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </main>
        </div>
    );
}
