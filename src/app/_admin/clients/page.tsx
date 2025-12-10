"use client";

import { useState, useEffect } from "react";
import AssetGallery from "@/app/dashboard/assets/components/AssetGallery";
import { Search, Filter, MoreHorizontal, User, Shield, CreditCard, LogIn, Plus, Mail, X, Loader2, Linkedin, MessageSquare, Globe, Edit2, Save, Trash2, ArrowUpRight, ExternalLink } from "lucide-react";
import { createClientUser, getClients, adminUpdateProfile } from "../actions";
import Link from "next/link";

interface ClientProfile {
    id: string;
    full_name: string;
    company_name: string;
    email: string;
    plan_tier: string;
    role: string;
    linkedin_profile?: string;
    headline?: string;
    key_experience?: string;
    main_language?: string;
    tone_of_voice?: string;
    content_pillars?: { title: string; description: string }[];
    upcoming_topics?: string[];
    stripe_customer_id?: string;
    subscription_status?: string;
    linkedin_picture_url?: string;
}

export default function AdminClients() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<ClientProfile | null>(null);

    useEffect(() => {
        fetchClients(filterStatus);
    }, [filterStatus]);

    async function fetchClients(status: string = 'all') {
        setIsFetching(true);
        const result = await getClients(status);

        if (result.success && result.data) {
            setClients(result.data as any);
        }
        setIsFetching(false);
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const result = await createClientUser(formData);

        setIsLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            fetchClients(filterStatus); // Refresh list
            setTimeout(() => {
                setIsModalOpen(false);
                setMessage(null);
            }, 2000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!editForm) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("userId", editForm.id);
        formData.append("headline", editForm.headline || "");
        formData.append("keyExperience", editForm.key_experience || "");
        formData.append("mainLanguage", editForm.main_language || "");
        formData.append("toneOfVoice", editForm.tone_of_voice || "");
        formData.append("contentPillars", JSON.stringify(editForm.content_pillars || []));
        formData.append("upcomingTopics", JSON.stringify(editForm.upcoming_topics || []));
        formData.append("stripeCustomerId", editForm.stripe_customer_id || "");

        const result = await adminUpdateProfile(formData);

        setIsLoading(false);
        if (result.success) {
            // Update local state
            setClients(clients.map(c => c.id === editForm.id ? { ...c, ...editForm } : c));
            setSelectedClient(editForm);
            setIsEditing(false);
            alert("Perfil actualizado correctamente");
        } else {
            alert("Error al actualizar: " + result.message);
        }
    }

    function getInitials(name: string) {
        return name
            ?.split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || '??';
    }

    // --- Helper Functions for UI ---

    const getPlanPrice = (tier: string) => {
        switch (tier?.toLowerCase()) {
            case 'authority': return '$1,500/mo';
            case 'growth': return '$900/mo';
            case 'seed': return '$500/mo';
            case 'copilot': return '$25/mo';
            default: return '-';
        }
    };

    const getPlanBadgeStyle = (tier: string) => {
        switch (tier?.toLowerCase()) {
            case 'authority': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'growth': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'seed': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'copilot': return 'bg-teal-50 text-teal-700 border-teal-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const filteredClients = clients.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Modal Logic Helpers ---
    const handlePillarChange = (index: number, field: 'title' | 'description', value: string) => {
        if (!editForm) return;
        const newPillars = [...(editForm.content_pillars || [])];
        newPillars[index] = { ...newPillars[index], [field]: value };
        setEditForm({ ...editForm, content_pillars: newPillars });
    };

    const addPillar = () => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            content_pillars: [...(editForm.content_pillars || []), { title: "", description: "" }]
        });
    };

    const removePillar = (index: number) => {
        if (!editForm) return;
        const newPillars = [...(editForm.content_pillars || [])];
        newPillars.splice(index, 1);
        setEditForm({ ...editForm, content_pillars: newPillars });
    };

    const addTopic = () => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            upcoming_topics: [...(editForm.upcoming_topics || []), ""]
        });
    };

    const updateTopic = (index: number, value: string) => {
        if (!editForm) return;
        const newTopics = [...(editForm.upcoming_topics || [])];
        newTopics[index] = value;
        setEditForm({ ...editForm, upcoming_topics: newTopics });
    };

    const removeTopic = (index: number) => {
        if (!editForm) return;
        const newTopics = [...(editForm.upcoming_topics || [])];
        newTopics.splice(index, 1);
        setEditForm({ ...editForm, upcoming_topics: newTopics });
    };


    return (
        <div className="flex flex-col h-full">

            {/* Page Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Directorio de Clientes</h1>
                    <p className="text-sm text-gray-500">Gestiona tu cartera de clientes y suscripciones</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus size={16} /> Invitar Cliente
                </button>
            </header>

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 outline-none cursor-pointer"
                    >
                        <option value="all">Estado: Todos</option>
                        <option value="active">Activos</option>
                        <option value="churned">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* Client Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Plan Actual</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">LinkedIn</th>
                                <th className="px-6 py-4">Ingreso (MRR)</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isFetching ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                        Cargando clientes...
                                    </td>
                                </tr>
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No se encontraron clientes.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {client.linkedin_picture_url ? (
                                                    <img src={client.linkedin_picture_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {getInitials(client.full_name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-gray-900">{client.full_name}</div>
                                                    <div className="text-xs text-gray-500">{client.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${getPlanBadgeStyle(client.plan_tier)}`}>
                                                {client.plan_tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.subscription_status === 'active' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Activo
                                                </span>
                                            ) : client.subscription_status === 'past_due' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Impago
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {client.subscription_status || 'Inactivo'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.linkedin_profile ? (
                                                <a href={client.linkedin_profile} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Conectado
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div> Pendiente
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-600">
                                            {getPlanPrice(client.plan_tier)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <a href={`mailto:${client.email}`} title="Enviar Email" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900">
                                                    <Mail size={16} />
                                                </a>
                                                <button
                                                    onClick={() => setSelectedClient(client)}
                                                    title="Ver Detalles"
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900"
                                                >
                                                    <CreditCard size={16} />
                                                </button>
                                                <Link
                                                    href={`/dashboard?userId=${client.id}`}
                                                    target="_blank"
                                                    className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
                                                    title="Impersonar (Ver como cliente)"
                                                >
                                                    <LogIn size={12} /> Acceder
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Client Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-das-dark p-4 flex justify-between items-center text-white">
                            <h3 className="font-poppins font-bold text-sm uppercase tracking-wider">Alta de Nuevo Cliente</h3>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-sm transition-colors"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={`mb-4 p-3 rounded-sm text-xs border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form action={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre Completo</label>
                                        <input name="fullName" required className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none" placeholder="Ej. Juan Pérez" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Empresa</label>
                                        <input name="companyName" required className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none" placeholder="Ej. Tech SL" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Corporativo</label>
                                    <input name="email" type="email" required className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none" placeholder="cliente@empresa.com" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Perfil de LinkedIn (Opcional)</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input name="linkedinProfile" type="url" className="w-full border border-gray-200 pl-10 pr-2 py-2 text-sm rounded-sm focus:border-das-dark outline-none" placeholder="https://linkedin.com/in/..." />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Plan Contratado</label>
                                    <div className="relative">
                                        <select
                                            name="planTier"
                                            className="w-full rounded-lg border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-sm appearance-none"
                                            defaultValue="copilot"
                                        >
                                            <option value="copilot">Co-Pilot ($25/mes) - Acompañamiento</option>
                                            <option value="seed">Seed ($500/mes) - Ghostwriting Base</option>
                                            <option value="growth">Growth ($900/mes) - Crecimiento</option>
                                            <option value="authority">Authority ($1500/mes) - Liderazgo</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors">Cancelar</button>
                                    <button type="submit" disabled={isLoading} className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70">
                                        {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                        Enviar Invitación
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            )
            }

            {/* Client Details Modal */}
            {
                selectedClient && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                            <div className="bg-das-dark p-4 flex justify-between items-center text-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">
                                        {getInitials(selectedClient.full_name)}
                                    </div>
                                    <div>
                                        <h3 className="font-poppins font-bold text-sm uppercase tracking-wider">{selectedClient.full_name}</h3>
                                        <p className="text-[10px] text-white/70">{selectedClient.company_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => {
                                                setEditForm(selectedClient);
                                                setIsEditing(true);
                                            }}
                                            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                                        >
                                            <Edit2 className="w-3 h-3" /> Editar Perfil
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleUpdateProfile}
                                                disabled={isLoading}
                                                className="bg-white text-das-dark px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                            >
                                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                Guardar
                                            </button>
                                        </div>
                                    )}
                                    <button onClick={() => { setSelectedClient(null); setIsEditing(false); }} className="hover:bg-white/10 p-1 rounded-sm transition-colors ml-2"><X className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6 flex-1">
                                {/* Identity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                                            <Mail className="w-3 h-3" /> <span className="text-[10px] font-bold uppercase">Email</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-800">{selectedClient.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                                            <Linkedin className="w-3 h-3" /> <span className="text-[10px] font-bold uppercase">LinkedIn</span>
                                        </div>
                                        {selectedClient.linkedin_profile ? (
                                            <a href={selectedClient.linkedin_profile} target="_blank" className="text-sm font-medium text-blue-600 hover:underline truncate block">
                                                {selectedClient.linkedin_profile}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No conectado</p>
                                        )}
                                    </div>
                                </div>

                                {/* Executive Profile Data */}
                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-das-dark mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-das-accent" /> Perfil Ejecutivo
                                    </h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Headline</label>
                                            {isEditing && editForm ? (
                                                <input
                                                    value={editForm.headline || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                                                    className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                                                    placeholder="Headline de LinkedIn"
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-sm border border-gray-100">
                                                    {selectedClient.headline || <span className="text-gray-400 italic">No definido</span>}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Experiencia Clave</label>
                                            {isEditing && editForm ? (
                                                <textarea
                                                    value={editForm.key_experience || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, key_experience: e.target.value })}
                                                    className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none min-h-[100px]"
                                                    placeholder="Resumen de experiencia..."
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-sm border border-gray-100 whitespace-pre-wrap">
                                                    {selectedClient.key_experience || <span className="text-gray-400 italic">No definido</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Settings & Pillars */}
                                <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-4">
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-das-dark mb-3 flex items-center gap-2">
                                            <Globe className="w-3 h-3 text-das-accent" /> Configuración
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Idioma Principal</label>
                                                {isEditing && editForm ? (
                                                    <select
                                                        value={editForm.main_language || "Español"}
                                                        onChange={(e) => setEditForm({ ...editForm, main_language: e.target.value })}
                                                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none bg-white"
                                                    >
                                                        <option value="Español">Español</option>
                                                        <option value="Inglés">Inglés</option>
                                                    </select>
                                                ) : (
                                                    <div className="text-sm border-b border-gray-50 pb-2">
                                                        <span className="font-medium">{selectedClient.main_language || 'Español'}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Tono de Voz</label>
                                                {isEditing && editForm ? (
                                                    <input
                                                        value={editForm.tone_of_voice || ""}
                                                        onChange={(e) => setEditForm({ ...editForm, tone_of_voice: e.target.value })}
                                                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                                                        placeholder="Ej. Profesional, Cercano..."
                                                    />
                                                ) : (
                                                    <div className="text-sm border-b border-gray-50 pb-2">
                                                        <span className="font-medium">{selectedClient.tone_of_voice || 'Default'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-das-dark flex items-center gap-2">
                                                <MessageSquare className="w-3 h-3 text-das-accent" /> Pilares ({selectedClient.content_pillars?.length || 0})
                                            </h4>
                                            {isEditing && (
                                                <button onClick={addPillar} className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                    <Plus className="w-3 h-3" /> Añadir
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {isEditing && editForm ? (
                                                (editForm.content_pillars || []).map((pillar, i) => (
                                                    <div key={i} className="bg-gray-50 p-3 rounded-sm border border-gray-200 relative group">
                                                        <button onClick={() => removePillar(i)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                        <input
                                                            value={pillar.title}
                                                            onChange={(e) => handlePillarChange(i, 'title', e.target.value)}
                                                            className="w-full bg-white border border-gray-200 p-1.5 text-xs font-bold mb-2 rounded-sm focus:border-das-dark outline-none"
                                                            placeholder="Título del Pilar"
                                                        />
                                                        <textarea
                                                            value={pillar.description}
                                                            onChange={(e) => handlePillarChange(i, 'description', e.target.value)}
                                                            className="w-full bg-white border border-gray-200 p-1.5 text-xs rounded-sm focus:border-das-dark outline-none min-h-[60px]"
                                                            placeholder="Descripción..."
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                selectedClient.content_pillars && selectedClient.content_pillars.length > 0 ? (
                                                    selectedClient.content_pillars.map((pillar, i) => (
                                                        <div key={i} className="text-xs bg-gray-50 p-3 rounded-sm border border-gray-100">
                                                            <span className="font-bold text-das-dark block mb-1">{pillar.title}</span>
                                                            <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">Sin pilares definidos</p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Upcoming Topics Section */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-das-dark flex items-center gap-2">
                                            <ArrowUpRight className="w-3 h-3 text-das-accent" /> Próximos Temas ({selectedClient.upcoming_topics?.length || 0})
                                        </h4>
                                        {isEditing && (
                                            <button onClick={addTopic} className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> Añadir
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {isEditing && editForm ? (
                                            (editForm.upcoming_topics || []).map((topic, i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <input
                                                        value={topic}
                                                        onChange={(e) => updateTopic(i, e.target.value)}
                                                        className="w-full bg-white border border-gray-200 p-2 text-xs rounded-sm focus:border-das-dark outline-none"
                                                        placeholder="Tema propuesto..."
                                                    />
                                                    <button onClick={() => removeTopic(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            selectedClient.upcoming_topics && selectedClient.upcoming_topics.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {selectedClient.upcoming_topics.map((topic, i) => (
                                                        <li key={i} className="flex gap-2 items-start text-xs text-gray-600">
                                                            <div className="w-1 h-1 bg-das-accent rounded-full mt-1.5 shrink-0"></div>
                                                            {topic}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Sin temas definidos</p>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Asset Vault Section */}
                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-das-dark mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-das-accent" /> Bóveda de Activos
                                        </h4>
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <AssetGallery userId={selectedClient.id} isAdmin={true} />
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Section */}
                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-das-dark mb-3 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-das-accent" /> Configuración de Pagos
                                        </h4>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Stripe Customer ID</label>
                                            {isEditing && editForm ? (
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">ID</span>
                                                        <input
                                                            value={editForm.stripe_customer_id || ""}
                                                            onChange={(e) => setEditForm({ ...editForm, stripe_customer_id: e.target.value })}
                                                            className="w-full border border-gray-200 pl-8 pr-3 py-2 text-sm rounded-sm focus:border-das-dark outline-none font-mono bg-white"
                                                            placeholder="cus_..."
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                        <ExternalLink className="w-3 h-3" />
                                                        Encuentra este ID en la ficha del cliente en <a href="https://dashboard.stripe.com/customers" target="_blank" rel="noopener noreferrer" className="underline hover:text-das-dark">Stripe Dashboard</a>
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between bg-white p-3 rounded-sm border border-gray-200">
                                                    <code className="text-sm text-das-dark font-mono bg-gray-100 px-2 py-0.5 rounded">
                                                        {selectedClient.stripe_customer_id || 'No vinculado'}
                                                    </code>
                                                    {selectedClient.stripe_customer_id && (
                                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-wider">
                                                            Sincronizado
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
