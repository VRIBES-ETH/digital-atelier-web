"use client";

import { useState } from "react";
import { Megaphone, Send, Users, Bell, Loader2, CheckCircle, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { sendBroadcast } from "../actions";

interface Broadcast {
    id: string;
    title: string;
    message: string;
    type: string;
    target_segment: string;
    recipients_count: number;
    created_at: string;
}

interface BroadcastClientProps {
    history: Broadcast[];
}

export default function BroadcastClient({ history }: BroadcastClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [messageState, setMessageState] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State for Reuse
    const [formData, setFormData] = useState({
        target: 'all',
        title: '',
        message: '',
        type: 'info',
        includeActive: true,
        includeInactive: false
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setMessageState(null);

        const data = new FormData();
        data.append("target", formData.target);
        data.append("title", formData.title);
        data.append("message", formData.message);
        data.append("type", formData.type);
        data.append("includeActive", String(formData.includeActive));
        data.append("includeInactive", String(formData.includeInactive));

        const result = await sendBroadcast(data);

        setIsLoading(false);
        if (result.success) {
            setMessageState({ type: 'success', text: result.message });
            setFormData({
                target: 'all',
                title: '',
                message: '',
                type: 'info',
                includeActive: true,
                includeInactive: false
            }); // Reset
        } else {
            setMessageState({ type: 'error', text: result.message });
        }
    }

    const handleReuse = (broadcast: Broadcast) => {
        setFormData({
            target: broadcast.target_segment,
            title: broadcast.title,
            message: broadcast.message,
            type: broadcast.type,
            includeActive: true, // Default to active when reusing for now
            includeInactive: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getTargetLabel = (target: string) => {
        switch (target) {
            case 'all': return 'Todos los Clientes';
            case 'copilot': return 'Plan Co-Pilot';
            case 'seed': return 'Plan Seed';
            case 'growth': return 'Plan Growth';
            case 'authority': return 'Plan Authority';
            default: return target;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'action_required': return '🔥';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="max-w-3xl mx-auto w-full space-y-8">

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-orange-600" size={32} />
                                <span className="text-sm font-bold text-gray-600">Enviando notificaciones...</span>
                            </div>
                        </div>
                    )}

                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Megaphone size={20} className="text-orange-600" /> Redactar Nuevo Mensaje
                    </h2>

                    {messageState && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageState.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {messageState.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                            <p className="text-sm font-medium">{messageState.text}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. SEGMENTACIÓN */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Users size={16} /> Destinatarios
                            </label>
                            <select
                                value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            >
                                <option value="all">Todos los Planes</option>
                                <option value="copilot">Plan Co-Pilot ($25)</option>
                                <option value="seed">Plan Seed ($500)</option>
                                <option value="growth">Plan Growth ($900)</option>
                                <option value="authority">Plan Authority ($1500)</option>
                            </select>

                            {/* Status Filter */}
                            <div className="mt-3 flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.includeActive}
                                        onChange={(e) => setFormData({ ...formData, includeActive: e.target.checked })}
                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    Incluir Activos
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.includeInactive}
                                        onChange={(e) => setFormData({ ...formData, includeInactive: e.target.checked })}
                                        className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                                    />
                                    Incluir Inactivos
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-1">
                                Selecciona al menos un estado. Se enviará a los usuarios que coincidan con el plan Y el estado seleccionado.
                            </p>
                        </div>

                        {/* 2. CONTENIDO */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Título del Aviso</label>
                                <input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    type="text"
                                    placeholder="Ej: Mantenimiento programado..."
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none"
                                >
                                    <option value="info">ℹ️ Info (Azul)</option>
                                    <option value="success">✅ Éxito (Verde)</option>
                                    <option value="warning">⚠️ Alerta (Amarillo)</option>
                                    <option value="action_required">🔥 Urgente (Rojo)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje Detallado</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={4}
                                placeholder="Escribe aquí el cuerpo de la notificación..."
                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none transition-all"
                            ></textarea>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-900/10 disabled:opacity-70">
                                <Send size={16} /> Enviar Comunicado
                            </button>
                        </div>
                    </form>
                </div>

                {/* HISTORIAL */}
                <div className="mt-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Clock size={14} /> Enviados Recientemente
                    </h3>

                    {history.length === 0 ? (
                        <p className="text-sm text-gray-400 italic text-center py-4">No hay historial de envíos.</p>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:border-orange-300 transition-all group shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-50 text-gray-600 rounded-lg mt-1">
                                            <span className="text-lg">{getTypeIcon(item.type)}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1 mb-1">{item.message}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                                                <span>{new Date(item.created_at).toLocaleDateString('es-ES')}</span>
                                                <span>•</span>
                                                <span>{getTargetLabel(item.target_segment)}</span>
                                                <span>•</span>
                                                <span>{item.recipients_count} Usuarios</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleReuse(item)}
                                        className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                        title="Reutilizar contenido"
                                    >
                                        <RefreshCw size={12} /> Reutilizar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
