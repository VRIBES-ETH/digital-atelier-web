"use client";

import { useState } from "react";
import { Search, Filter, FileText, ChevronRight, X, Check, MessageSquare, Clock, Calendar, Globe, Linkedin, Trash2 } from "lucide-react";
import { approvePost, requestChanges, rescheduleClientPost, deletePost } from "@/app/dashboard/actions";
import { publishToLinkedIn } from "@/app/admin/actions";
import ClientPostEditModal from "./ClientPostEditModal";

export default function ClientPostsBrowser({ posts, linkedinProfile, userRole = 'client' }: { posts: any[], linkedinProfile: any, userRole?: 'admin' | 'client' }) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isRejecting, setIsRejecting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesStatus = filterStatus === "all" || post.status === filterStatus;
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Helper Functions
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

    // Actions
    const handleApprove = async () => {
        setIsLoading(true);
        const result = await approvePost(selectedPost.id);
        setIsLoading(false);

        if (result.success) {
            setSelectedPost(null);
            window.location.reload();
        } else {
            alert(result.message);
        }
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

    const handleReschedule = async () => {
        if (!newDate) return;
        setIsLoading(true);
        // Convert local datetime-local value to UTC ISO string
        const isoDate = new Date(newDate).toISOString();
        const result = await rescheduleClientPost(selectedPost.id, isoDate);
        setIsLoading(false);

        if (result.success) {
            setSelectedPost(null);
            setIsRescheduling(false);
            setNewDate("");
            window.location.reload();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar en mis posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-das-dark"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 focus:outline-none focus:border-das-dark bg-white"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="pending_approval">Pendiente de Revisión</option>
                        <option value="changes_requested">Cambios Solicitados</option>
                        <option value="scheduled">Programado</option>
                        <option value="published">Publicado</option>
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider items-center hidden sm:grid">
                    <div className="col-span-6">Contenido</div>
                    <div className="col-span-3">Estado</div>
                    <div className="col-span-3">Fecha</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer transition-colors group"
                            >
                                <div className="col-span-1 sm:col-span-6 font-medium text-gray-800 flex items-start gap-3 overflow-hidden">
                                    <div className="p-2 bg-gray-100 rounded-sm shrink-0">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm truncate font-medium text-gray-900">{post.content}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {post.image_url ? 'Incluye imagen' : 'Solo texto'} • {post.content.length} carácteres
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-1 sm:col-span-3 flex items-center">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(post.status)}`}>
                                        {getStatusLabel(post.status)}
                                    </span>
                                </div>
                                <div className="col-span-1 sm:col-span-3 text-gray-500 text-xs flex justify-between items-center">
                                    <span className="flex items-center gap-1.5">
                                        {post.status === 'published' ? (
                                            <>
                                                <Check className="w-3 h-3 text-green-500" />
                                                {post.published_at ? new Date(post.published_at).toLocaleDateString('es-ES') : '-'}
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-3 h-3" />
                                                {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Sin fecha'}
                                            </>
                                        )}
                                    </span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No se encontraron posts.</p>
                        </div>
                    )}
                </div>
            </div>

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
                                        {selectedPost.scheduled_for ? new Date(selectedPost.scheduled_for).toLocaleString('es-ES') : 'Sin fecha'}
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
                                    <div className="flex justify-between items-center gap-3">
                                        <button
                                            onClick={async () => {
                                                if (!confirm("¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.")) return;
                                                setIsLoading(true);
                                                const res = await deletePost(selectedPost.id);
                                                setIsLoading(false);
                                                if (res.success) {
                                                    setSelectedPost(null);
                                                    window.location.reload();
                                                } else {
                                                    alert(res.message);
                                                }
                                            }}
                                            disabled={isLoading}
                                            className="text-red-500 hover:bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                        <div className="flex gap-3">
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
                                <div className="flex items-center gap-3 text-amber-800 mb-3">
                                    <MessageSquare className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-bold">Se requieren cambios</p>
                                        <p className="text-xs opacity-80">El administrador ha solicitado cambios en este post.</p>
                                    </div>
                                </div>
                                {selectedPost.feedback && (
                                    <div className="mb-4 p-3 bg-white/50 rounded border border-amber-100 text-sm italic text-amber-900">
                                        "{selectedPost.feedback}"
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={async () => {
                                            if (!confirm("¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.")) return;
                                            setIsLoading(true);
                                            const res = await deletePost(selectedPost.id);
                                            setIsLoading(false);
                                            if (res.success) {
                                                setSelectedPost(null);
                                                window.location.reload();
                                            } else {
                                                alert(res.message);
                                            }
                                        }}
                                        disabled={isLoading}
                                        className="text-red-500 hover:bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="bg-gray-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-black transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Editar y Resolver
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Advice/Comment Display for non-blocking states */}
                        {selectedPost.feedback && selectedPost.status !== 'changes_requested' && (
                            <div className="p-4 border-t border-gray-200 bg-blue-50 shrink-0">
                                <div className="flex items-center gap-3 text-blue-800 mb-3">
                                    <MessageSquare className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-bold">Consejo del Administrador</p>
                                        <p className="text-xs opacity-80">El administrador ha dejado un comentario sobre este post.</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/50 rounded border border-blue-100 text-sm italic text-blue-900">
                                    "{selectedPost.feedback}"
                                </div>
                            </div>
                        )}

                        {/* Actions for Draft Posts */}
                        {selectedPost.status === 'draft' && (
                            <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex justify-between items-center gap-3">
                                <button
                                    onClick={async () => {
                                        if (!confirm("¿Estás seguro de que quieres eliminar este borrador? Esta acción no se puede deshacer.")) return;
                                        setIsLoading(true);
                                        const res = await deletePost(selectedPost.id);
                                        setIsLoading(false);
                                        if (res.success) {
                                            setSelectedPost(null);
                                            window.location.reload();
                                        } else {
                                            alert(res.message);
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="text-red-500 hover:bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    Editar / Programar
                                </button>
                            </div>
                        )}

                        {/* Actions for Scheduled/Approved Posts */}
                        {(selectedPost.status === 'scheduled' || selectedPost.status === 'approved') && (
                            <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                                {!isRescheduling ? (
                                    <div className="flex justify-between items-center gap-3">
                                        <button
                                            onClick={async () => {
                                                if (!confirm("¿Estás seguro de que quieres eliminar este post programado? Esta acción no se puede deshacer.")) return;
                                                setIsLoading(true);
                                                const res = await deletePost(selectedPost.id);
                                                setIsLoading(false);
                                                if (res.success) {
                                                    setSelectedPost(null);
                                                    window.location.reload();
                                                } else {
                                                    alert(res.message);
                                                }
                                            }}
                                            disabled={isLoading}
                                            className="text-red-500 hover:bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                        <div className="flex gap-3">
                                            {selectedPost.status === 'scheduled' && (
                                                <button
                                                    onClick={() => {
                                                        setIsRescheduling(true);
                                                        // Set initial value to current scheduled date formatted for input
                                                        if (selectedPost.scheduled_for) {
                                                            const date = new Date(selectedPost.scheduled_for);
                                                            // Format: YYYY-MM-DDThh:mm
                                                            const formatted = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                                                            setNewDate(formatted);
                                                        }
                                                    }}
                                                    className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors flex items-center gap-2"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                    Reprogramar
                                                </button>
                                            )}

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
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in slide-in-from-bottom-2">
                                        <label className="block text-xs font-bold uppercase text-das-dark">Nueva fecha de publicación</label>
                                        <input
                                            type="datetime-local"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="w-full border border-gray-200 focus:border-das-dark rounded-sm p-3 text-sm outline-none"
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setIsRescheduling(false)}
                                                className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleReschedule}
                                                disabled={!newDate || isLoading}
                                                className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                                                Guardar Nueva Fecha
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {selectedPost && isEditModalOpen && (
                <ClientPostEditModal
                    post={selectedPost}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userRole={userRole}
                />
            )}
        </div>
    );
}
