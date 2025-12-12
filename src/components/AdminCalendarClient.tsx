"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, X, Globe, MessageSquare, Linkedin, Search, Filter, LayoutGrid } from "lucide-react";
import { publishToLinkedIn, adminRequestChanges } from "@/app/_admin/actions";

export default function AdminCalendarClient({ posts, clients }: { posts: any[], clients: any[] }) {
    const [viewMode, setViewMode] = useState<'month' | 'week'>('week');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesClient = selectedClient ? post.user_id === selectedClient : true;
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClient && matchesSearch;
    });

    // Helper to get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const daysArray = [];
        for (let i = 0; i < adjustedFirstDay; i++) daysArray.push(null);
        for (let i = 1; i <= days; i++) daysArray.push(new Date(year, month, i));
        return daysArray;
    };

    // Helper to get days in week
    const getDaysInWeek = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(date);
        monday.setDate(diff);

        const daysArray = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            daysArray.push(nextDay);
        }
        return daysArray;
    };

    const daysToDisplay = viewMode === 'month' ? getDaysInMonth(currentDate) : getDaysInWeek(currentDate);
    const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    const nextPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else {
            const nextWeek = new Date(currentDate);
            nextWeek.setDate(currentDate.getDate() + 7);
            setCurrentDate(nextWeek);
        }
    };

    const prevPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            const prevWeek = new Date(currentDate);
            prevWeek.setDate(currentDate.getDate() - 7);
            setCurrentDate(prevWeek);
        }
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border-green-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending_approval': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'changes_requested': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return 'Publicado';
            case 'scheduled': return 'Programado';
            case 'pending_approval': return 'Revisión';
            case 'changes_requested': return 'Cambios';
            case 'draft': return 'Borrador';
            default: return status;
        }
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??';
    };

    const handleRequestChanges = async () => {
        setIsLoading(true);
        await adminRequestChanges(selectedPost.id, feedback);
        setIsLoading(false);
        setSelectedPost(null);
        setIsRejecting(false);
        setFeedback("");
        window.location.reload();
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Sidebar - Client Filter */}
            <div className="w-64 shrink-0 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-gray-400 shadow-sm"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                    <button
                        onClick={() => setSelectedClient(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3
                        ${!selectedClient ? 'bg-das-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!selectedClient ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                            <LayoutGrid className="w-4 h-4" />
                        </div>
                        Todos los Clientes
                    </button>

                    {clients.map(client => (
                        <button
                            key={client.id}
                            onClick={() => setSelectedClient(client.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3
                            ${selectedClient === client.id ? 'bg-das-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {client.linkedin_picture_url ? (
                                <img src={client.linkedin_picture_url} alt={client.full_name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedClient === client.id ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                                    {getInitials(client.full_name)}
                                </div>
                            )}
                            <span className="truncate">{client.full_name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-4">
                        <h2 className="font-poppins font-bold text-lg text-das-dark capitalize">
                            {viewMode === 'month' ? getMonthName(currentDate) :
                                `${daysToDisplay[0]?.getDate()} - ${daysToDisplay[6]?.getDate()} ${getMonthName(daysToDisplay[0] || currentDate)}`}
                        </h2>
                        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                            <button onClick={prevPeriod} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-das-dark transition-colors">Hoy</button>
                            <button onClick={nextPeriod} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${viewMode === 'month' ? 'bg-white text-das-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <CalendarIcon className="w-3 h-3" /> Mes
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${viewMode === 'week' ? 'bg-white text-das-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Clock className="w-3 h-3" /> Semana
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className={`grid grid-cols-7 divide-x divide-gray-100 bg-white min-h-full ${viewMode === 'month' ? 'auto-rows-[140px]' : 'auto-rows-fr'}`}>
                        {daysToDisplay.map((date, index) => {
                            if (!date) return <div key={`empty-${index}`} className="bg-gray-50/50"></div>;

                            const dayPosts = filteredPosts.filter(post => {
                                const postDate = post.published_at ? new Date(post.published_at) : (post.scheduled_for ? new Date(post.scheduled_for) : null);
                                return postDate && isSameDay(postDate, date);
                            });

                            const isToday = isSameDay(date, new Date());

                            return (
                                <div key={date.toISOString()} className={`p-3 relative group hover:bg-gray-50 transition-colors min-h-[200px] ${isToday ? 'bg-blue-50/30' : ''}`}>
                                    <span className={`text-sm font-medium mb-3 block ${isToday ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                                        {date.getDate()} {isToday && <span className="text-[10px] uppercase ml-1">Hoy</span>}
                                    </span>

                                    <div className="space-y-2">
                                        {dayPosts.map(post => {
                                            const postTime = post.scheduled_for ? new Date(post.scheduled_for).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--';

                                            return (
                                                <div
                                                    key={post.id}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedPost(post); setIsRejecting(false); }}
                                                    className="bg-white border border-gray-100 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group/card"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {post.profiles?.linkedin_picture_url ? (
                                                            <img src={post.profiles.linkedin_picture_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[8px] font-bold text-gray-500">
                                                                {getInitials(post.profiles?.full_name)}
                                                            </div>
                                                        )}
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{post.profiles?.full_name?.split(' ')[0]}</span>
                                                        {post.status === 'published' && <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />}
                                                        {post.status === 'scheduled' && <Clock className="w-3 h-3 text-blue-500 ml-auto" />}
                                                        {post.status === 'pending_approval' && <AlertCircle className="w-3 h-3 text-amber-500 ml-auto" />}
                                                    </div>

                                                    <div className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {postTime}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {post.image_url && (
                                                            <img src={post.image_url} alt="" className="w-10 h-10 rounded object-cover bg-gray-100 border border-gray-100 shrink-0" />
                                                        )}
                                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                            {post.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Detail Modal (Reused Logic, Updated Styles) */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[85vh] max-h-[800px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white shrink-0 z-10">
                            <div className="flex items-center gap-3">
                                {selectedPost.profiles?.linkedin_picture_url ? (
                                    <img src={selectedPost.profiles.linkedin_picture_url} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                ) : (
                                    <div className="w-10 h-10 bg-das-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {getInitials(selectedPost.profiles?.full_name)}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-poppins font-bold text-sm text-das-dark">{selectedPost.profiles?.full_name}</h3>
                                        {selectedPost.author_role === 'client' && (
                                            <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide border border-purple-200">
                                                Escrito por Cliente
                                            </span>
                                        )}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(selectedPost.status)}`}>
                                        {getStatusLabel(selectedPost.status)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                            <div className="max-w-xl mx-auto space-y-6">
                                {/* LinkedIn Preview Card */}
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    {/* LinkedIn Header */}
                                    <div className="p-4 flex gap-3 border-b border-gray-100 items-center">
                                        {selectedPost.profiles?.linkedin_picture_url ? (
                                            <img src={selectedPost.profiles.linkedin_picture_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0 flex items-center justify-center font-bold text-gray-500">
                                                {getInitials(selectedPost.profiles?.full_name)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-sm text-gray-900 leading-tight">{selectedPost.profiles?.full_name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                {selectedPost.profiles?.company_name} • <Globe className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <p className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                                            {selectedPost.content}
                                        </p>
                                    </div>

                                    {/* Image */}
                                    {selectedPost.image_url && (
                                        <div className="w-full">
                                            <img src={selectedPost.image_url} alt="Post content" className="w-full h-auto object-cover" />
                                        </div>
                                    )}

                                    {/* Link Preview */}
                                    {selectedPost.reference_link && (
                                        <div className="bg-gray-50 p-3 border-t border-gray-100">
                                            <p className="text-xs text-blue-600 truncate">{selectedPost.reference_link}</p>
                                        </div>
                                    )}

                                    {/* LinkedIn Footer */}
                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex gap-1">
                                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                            <div className="w-4 h-4 rounded-full bg-red-500 -ml-1"></div>
                                            <div className="w-4 h-4 rounded-full bg-green-500 -ml-1"></div>
                                        </div>
                                        <div className="text-xs text-gray-500">0 comentarios • 0 veces compartido</div>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                    <div className="bg-white p-3 rounded-sm border border-gray-200">
                                        <span className="block font-bold text-gray-700 mb-1 uppercase tracking-wider">Programación</span>
                                        {selectedPost.scheduled_for ? new Date(selectedPost.scheduled_for).toLocaleString() : 'Sin fecha'}
                                    </div>
                                    <div className="bg-white p-3 rounded-sm border border-gray-200">
                                        <span className="block font-bold text-gray-700 mb-1 uppercase tracking-wider">ID Referencia</span>
                                        <span className="font-mono">{selectedPost.id.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Actions) */}
                        <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex justify-end gap-3">
                            {/* Feedback Flow for Client Posts */}
                            {selectedPost.author_role === 'client' && ['draft', 'scheduled', 'pending_approval'].includes(selectedPost.status) && (
                                !isRejecting ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setIsRejecting(true); setFeedback(""); }}
                                            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-100 transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Rechazar / Descartar
                                        </button>
                                        <button
                                            onClick={() => { setIsRejecting(true); setFeedback(""); }}
                                            className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-amber-100 transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Solicitar Cambios
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-3 animate-in slide-in-from-bottom-2">
                                        <label className="block text-xs font-bold uppercase text-gray-500">Feedback para el cliente</label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Explica el motivo..."
                                            className="w-full border border-gray-200 focus:border-gray-400 rounded-sm p-3 text-sm outline-none bg-gray-50 min-h-[80px]"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setIsRejecting(false)}
                                                className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setIsLoading(true);
                                                    // If rejecting (discarding), use rejectPost. If requesting changes, use adminRequestChanges.
                                                    // For simplicity, let's add a toggle or separate buttons in this view?
                                                    // Actually, let's just have two submit buttons here.
                                                }}
                                                className="hidden" // Hidden default submit
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (!feedback.trim()) return;
                                                    setIsLoading(true);
                                                    const { rejectPost } = await import("@/app/admin/actions");
                                                    await rejectPost(selectedPost.id, feedback);
                                                    setIsLoading(false);
                                                    setSelectedPost(null);
                                                    window.location.reload();
                                                }}
                                                disabled={!feedback.trim() || isLoading}
                                                className="bg-red-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                                Rechazar (Borrador)
                                            </button>
                                            <button
                                                onClick={handleRequestChanges}
                                                disabled={!feedback.trim() || isLoading}
                                                className="bg-amber-500 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Solicitar Cambios
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}

                            {(selectedPost.status === 'scheduled' || selectedPost.status === 'approved') && (
                                <button
                                    onClick={async () => {
                                        if (!confirm("¿Estás seguro de que quieres publicar esto en LinkedIn AHORA?")) return;
                                        setIsLoading(true);
                                        const res = await publishToLinkedIn(selectedPost.id);
                                        setIsLoading(false);
                                        if (res.success) {
                                            alert(res.message);
                                            setSelectedPost(null);
                                            window.location.reload();
                                        } else {
                                            alert(res.message);
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Linkedin className="w-4 h-4" />}
                                    Publicar Ahora
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
