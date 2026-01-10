'use client';

import { useState } from 'react';
import { Rocket, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function DeployButton() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleDeploy = async () => {
        if (!confirm('¿Estás seguro de que quieres publicar los cambios en VIVO?\nEsto tardará unos 2 minutos.')) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/admin/deploy', { method: 'POST' });
            if (!res.ok) throw new Error('Error triggering build');
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <button
            onClick={handleDeploy}
            disabled={status === 'loading' || status === 'success'}
            className={`
                btn px-6 py-3 rounded-lg flex items-center gap-2 font-bold tracking-wide text-sm transition-all shadow-lg
                ${status === 'idle' ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white hover:shadow-zinc-900/50' : ''}
                ${status === 'loading' ? 'bg-zinc-800 text-gray-400 cursor-wait' : ''}
                ${status === 'success' ? 'bg-green-600 text-white cursor-default' : ''}
                ${status === 'error' ? 'bg-red-600 text-white' : ''}
            `}
        >
            {status === 'idle' && <><Rocket className="w-4 h-4" /> PUBLICAR EN VIVO</>}
            {status === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> INICIANDO...</>}
            {status === 'success' && <><CheckCircle className="w-4 h-4" /> ¡DESPLEGANDO!</>}
            {status === 'error' && <><AlertCircle className="w-4 h-4" /> ERROR</>}
        </button>
    );
}
