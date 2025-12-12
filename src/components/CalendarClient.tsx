"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, X, Globe, MessageSquare, Check, Linkedin, Plus } from "lucide-react";
import { approvePost, requestChanges, rescheduleClientPost } from "@/app/_dashboard/actions";
import { publishToLinkedIn } from "@/app/_admin/actions";
import ClientPostCreateModal from "./ClientPostCreateModal";

export default function CalendarClient({ posts, linkedinProfile }: { posts: any[], linkedinProfile: any }) {
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [draggedPost, setDraggedPost] = useState<any>(null);

    // Create Post Modal State
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createModalDate, setCreateModalDate] = useState<Date | null>(null);

    // Helper to get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const daysArray = [];
        // Add empty slots for previous month
        for (let i = 0; i < adjustedFirstDay; i++) {
            daysArray.push(null);
        }
        // Add days
        for (let i = 1; i <= days; i++) {
            daysArray.push(new Date(year, month, i));
        }
        return daysArray;
    };

    // Helper to get days in week
    const getDaysInWeek = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(date.setDate(diff));

        const daysArray = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            daysArray.push(nextDay);
        }
        return daysArray;
    };

    const daysToDisplay = viewMode === 'month' ? getDaysInMonth(currentDate) : getDaysInWeek(currentDate);
    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

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

    // Helper Functions for Modal
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border-green-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending_approval': return 'bg-das-accent/10 text-das-accent border-das-accent/20';
            case 'changes_requested': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return 'Publicado';
            case 'scheduled': return 'Programado';
            case 'pending_approval': return 'Pendiente de Revisión';
            case 'changes_requested': return 'Cambios Solicitados';
            case 'draft': return 'Borrador';
            default: return status;
        }
    };

    const handleApprove = async () => {
        setIsLoading(true);
        await approvePost(selectedPost.id);
        setIsLoading(false);
        setSelectedPost(null);
        window.location.reload();
    };

    const handleRequestChanges = async () => {
        setIsLoading(true);
        await requestChanges(selectedPost.id, feedback);
        setIsLoading(false);
        setSelectedPost(null);
        setIsRejecting(false);
        setFeedback("");
        window.location.reload();
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, post: any) => {
        setDraggedPost(post);
        e.dataTransfer.effectAllowed = "move";
        // Set a transparent drag image or custom one if needed, default is usually fine
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
        e.preventDefault();
        if (!draggedPost) return;

        // Prevent dropping on the same day (optimization)
        const currentPostDate = draggedPost.scheduled_for ? new Date(draggedPost.scheduled_for) : null;
        if (currentPostDate && isSameDay(currentPostDate, targetDate)) {
            setDraggedPost(null);
            return;
        }

        // Prevent dragging published posts
        if (draggedPost.status === 'published') {
            alert("No puedes reprogramar un post ya publicado.");
            setDraggedPost(null);
            return;
        }

        // Calculate new date preserving time
        const newDate = new Date(targetDate);
        if (currentPostDate) {
            newDate.setHours(currentPostDate.getHours());
            newDate.setMinutes(currentPostDate.getMinutes());
        } else {
            // Default to 10:00 AM if no previous time
            newDate.setHours(10, 0, 0, 0);
        }

        // Optimistic update (optional, for now we rely on reload)
        // Call server action
        const result = await rescheduleClientPost(draggedPost.id, newDate.toISOString());

        if (result.success) {
            window.location.reload();
        } else {
            alert(result.message);
        }
        setDraggedPost(null);
    };

    const handleOpenCreateModal = (date: Date) => {
        setCreateModalDate(date);
        setCreateModalOpen(true);
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="font-poppins font-bold text-xl capitalize text-das-dark">
                        {viewMode === 'month' ? getMonthName(currentDate) : `Semana del ${daysToDisplay[0]?.getDate()} de ${getMonthName(daysToDisplay[0] || currentDate)}`}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={prevPeriod} className="p-1 hover:bg-gray-100 rounded-sm"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
                        <button onClick={nextPeriod} className="p-1 hover:bg-gray-100 rounded-sm"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-sm">Hoy</button>
                    <div className="flex bg-gray-100 p-1 rounded-sm">
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-das-dark' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <CalendarIcon className="w-3 h-3" /> Mes
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-das-dark' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Clock className="w-3 h-3" /> Semana
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {weekDays.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className={`grid grid-cols-7 divide-x divide-gray-100 bg-gray-50/50 ${viewMode === 'month' ? 'auto-rows-[140px]' : 'auto-rows-[500px]'}`}>
                    {daysToDisplay.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} className="bg-gray-50/30"></div>;

                        const dayPosts = posts.filter(post => {
                            const postDate = post.published_at ? new Date(post.published_at) : (post.scheduled_for ? new Date(post.scheduled_for) : null);
                            return postDate && isSameDay(postDate, date);
                        });

                        const isToday = isSameDay(date, new Date());
                        const isFuture = date > new Date();

                        return (
                            <div
                                key={date.toISOString()}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, date)}
                                className={`bg-white p-2 relative group hover:bg-gray-50 transition-colors ${isToday ? 'bg-orange-50' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-medium ${isToday ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                                        {date.getDate()}
                                    </span>
                                    {/* Hover Add Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenCreateModal(date); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-das-dark"
                                        title="Crear post este día"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className={`mt-2 space-y-1 overflow-y-auto no-scrollbar ${viewMode === 'month' ? 'max-h-[100px]' : 'max-h-[460px]'}`}>
                                    {dayPosts.map(post => {
                                        const postDate = post.scheduled_for ? new Date(post.scheduled_for) : (post.published_at ? new Date(post.published_at) : null);
                                        const timeString = postDate ? postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';

                                        // Status border color
                                        let statusBorder = 'border-l-4 border-l-gray-300';
                                        if (post.status === 'published') statusBorder = 'border-l-4 border-l-green-500';
                                        else if (post.status === 'scheduled') statusBorder = 'border-l-4 border-l-blue-500';
                                        else if (post.status === 'pending_approval') statusBorder = 'border-l-4 border-l-orange-400';
                                        else if (post.status === 'changes_requested') statusBorder = 'border-l-4 border-l-red-500';

                                        return (
                                            <div
                                                key={post.id}
                                                draggable={post.status !== 'published'}
                                                onDragStart={(e) => handleDragStart(e, post)}
                                                onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                                                className={`group flex items-center gap-2 p-1.5 mb-1 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:border-orange-300 cursor-grab active:cursor-grabbing transition-all ${statusBorder}`}
                                            >
                                                <span
                                                    suppressHydrationWarning
                                                    className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1 rounded shrink-0"
                                                >
                                                    {timeString}
                                                </span>
                                                <span className="text-xs text-gray-700 font-medium truncate">
                                                    {post.content}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ClientPostCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                initialDate={createModalDate}
            />

            {/* Detail Modal */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[85vh] max-h-[800px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white shrink-0 z-10">
                            <div className="flex items-center gap-3">
                                <h3 className="font-poppins font-bold text-lg text-das-dark">Detalle del Post</h3>
                                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(selectedPost.status)}`}>
                                    {getStatusLabel(selectedPost.status)}
                                </span>
                            </div>
                            <button
                                onClick={() => { setSelectedPost(null); setIsRejecting(false); }}
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
                                        {linkedinProfile?.picture ? (
                                            <img src={linkedinProfile.picture} alt={linkedinProfile.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                                        )}
                                        <div>
                                            <div className="font-bold text-sm text-gray-900 leading-tight">{linkedinProfile?.name || "Usuario de LinkedIn"}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                Ahora • <Globe className="w-3 h-3" />
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
                        {selectedPost.status === 'pending_approval' && (
                            <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                                {!isRejecting ? (
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => setIsRejecting(true)}
                                            className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Solicitar Cambios
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            disabled={isLoading}
                                            className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
                                        >
                                            {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Aprobar Post
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in slide-in-from-bottom-2">
                                        <label className="block text-xs font-bold uppercase text-red-500">Motivo de la revisión</label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Explica qué cambios necesitas..."
                                            className="w-full border border-red-200 focus:border-red-500 rounded-sm p-3 text-sm outline-none bg-red-50/50 min-h-[80px]"
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
                                                onClick={handleRequestChanges}
                                                disabled={!feedback.trim() || isLoading}
                                                className="bg-red-500 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                                                Enviar Cambios
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedPost.status === 'changes_requested' && (
                            <div className="p-4 border-t border-gray-200 bg-amber-50 shrink-0">
                                <div className="flex items-center gap-3 text-amber-800">
                                    <Clock className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-bold">Esperando revisión del administrador...</p>
                                        <p className="text-xs opacity-80">Has solicitado cambios en este post. Te notificaremos cuando esté actualizado.</p>
                                    </div>
                                </div>
                                {selectedPost.feedback && (
                                    <div className="mt-3 p-3 bg-white/50 rounded border border-amber-100 text-xs italic text-amber-900">
                                        "{selectedPost.feedback}"
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Publish Action for Approved/Scheduled Posts */}
                        {(selectedPost.status === 'scheduled' || selectedPost.status === 'approved') && (
                            <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex justify-end">
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

