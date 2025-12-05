"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, FileText, MoreVertical, X, Loader2, User, Eye, Edit, Trash2, ChevronRight, MessageSquare } from "lucide-react";
import { getClients, createPost, updatePost, getPosts, publishToLinkedIn, clearPostFeedback, adminRequestChanges, adminSendComment } from "../actions";
import LinkedInPostPreview from "@/components/LinkedInPostPreview";

export default function ContentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [clients, setClients] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Filters
    const [filterClient, setFilterClient] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsFetching(true);
        const [clientsRes, postsRes] = await Promise.all([
            getClients(),
            getPosts()
        ]);

        if (clientsRes.success) setClients(clientsRes.data || []);
        if (postsRes.success) setPosts(postsRes.data || []);
        setIsFetching(false);
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const result = await createPost(formData);

        setIsLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            loadData(); // Refresh list
            setTimeout(() => {
                setIsModalOpen(false);
                setMessage(null);
            }, 2000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border-green-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending_approval': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'changes_requested': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    }

    function getStatusLabel(status: string) {
        switch (status) {
            case 'published': return 'Publicado';
            case 'scheduled': return 'Programado';
            case 'pending_approval': return 'Pendiente de Revisión';
            case 'changes_requested': return 'Cambios Solicitados';
            case 'draft': return 'Borrador';
            default: return status;
        }
    }

    const openPostDetail = (post: any) => {
        setSelectedPost(post);
    };

    const filteredPosts = posts.filter(post => {
        const matchesClient = filterClient === "all" || post.user_id === filterClient;
        const matchesStatus = filterStatus === "all" || post.status === filterStatus;
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClient && matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 relative h-[calc(100vh-140px)] flex flex-col">
            {/* Header Actions */}
            <div className="flex justify-between items-center shrink-0 gap-4">
                <div className="flex gap-4 flex-1">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar post..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-das-dark"
                        />
                    </div>

                    <select
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 focus:outline-none focus:border-das-dark bg-white"
                    >
                        <option value="all">Todos los Clientes</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 focus:outline-none focus:border-das-dark bg-white"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="draft">Borrador</option>
                        <option value="pending_approval">Pendiente</option>
                        <option value="changes_requested">Cambios Solicitados</option>
                        <option value="scheduled">Programado</option>
                        <option value="published">Publicado</option>
                    </select>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shrink-0"
                >
                    <Plus className="w-4 h-4" /> Nuevo Post
                </button>
            </div>

            {/* Posts Table (Notion Style) */}
            <div className="bg-white border border-gray-200 rounded-sm flex-1 overflow-hidden flex flex-col shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider items-center">
                    <div className="col-span-5">Contenido</div>
                    <div className="col-span-3">Cliente</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2">Fecha</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                    {isFetching ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => openPostDetail(post)}
                                className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-gray-50 cursor-pointer transition-colors text-sm group"
                            >
                                <div className="col-span-5 font-medium text-gray-800 pr-4 overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="truncate block w-full">{post.content}</span>
                                    </div>
                                </div>
                                <div className="col-span-3 flex items-center gap-2 overflow-hidden">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                                        {post.profiles?.full_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="truncate text-gray-600">{post.profiles?.full_name}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(post.status)} flex items-center gap-1 w-fit`}>
                                        {post.feedback_notes && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Revisado / Con Feedback"></span>
                                        )}
                                        {getStatusLabel(post.status)}
                                    </span>
                                </div>
                                <div className="col-span-2 text-gray-500 text-xs flex justify-between items-center">
                                    <span>{post.scheduled_for ? new Date(post.scheduled_for).toLocaleDateString() : '-'}</span>
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

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-das-dark p-4 flex justify-between items-center text-white">
                            <h3 className="font-poppins font-bold text-sm uppercase tracking-wider">Redactar Nuevo Post</h3>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-sm transition-colors"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={`mb-4 p-3 rounded-sm text-xs border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form action={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cliente</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select name="clientId" required className="w-full border border-gray-200 pl-10 pr-4 py-2 text-sm rounded-sm focus:border-das-dark outline-none bg-white appearance-none">
                                                <option value="">Seleccionar Cliente...</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>{client.full_name} ({client.company_name})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Programación (Opcional)</label>
                                        <input name="scheduledFor" type="datetime-local" className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imagen (Opcional)</label>
                                        <input
                                            name="imageFile"
                                            type="file"
                                            accept="image/*"
                                            className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                        <input type="hidden" name="imageUrl" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Link Referencia (Opcional)</label>
                                        <input name="referenceLink" type="url" placeholder="https://notion.so/..." className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contenido del Post</label>
                                    <textarea
                                        name="content"
                                        required
                                        rows={8}
                                        className="w-full border border-gray-200 p-4 text-sm rounded-sm focus:border-das-dark outline-none resize-none font-medium text-gray-700"
                                        placeholder="Escribe aquí el contenido del post..."
                                    ></textarea>
                                    <p className="text-right text-xs text-gray-400 mt-1">Carácteres: 0/3000</p>
                                </div>

                                <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="status" value="draft" defaultChecked className="text-das-dark focus:ring-das-dark" />
                                            <span className="text-sm text-gray-600">Guardar Borrador</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="status" value="pending_approval" className="text-das-dark focus:ring-das-dark" />
                                            <span className="text-sm text-gray-600">Enviar a Aprobación</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors">Cancelar</button>
                                        <button type="submit" disabled={isLoading} className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70">
                                            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                            Guardar Post
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Detail / Edit Modal */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[85vh] max-h-[800px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white shrink-0 z-10">
                            <div className="flex items-center gap-4">
                                <h3 className="font-poppins font-bold text-lg text-das-dark">Editar Post</h3>
                                <span className={`px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-wide border ${getStatusColor(selectedPost.status)}`}>
                                    {getStatusLabel(selectedPost.status)}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto bg-white p-6">
                            <PostEditForm post={selectedPost} onSuccess={() => {
                                loadData();
                                setSelectedPost(null);
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PostEditForm({ post, onSuccess }: { post: any, onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Local state for controlled inputs
    const [content, setContent] = useState(post.content || "");
    const [scheduledFor, setScheduledFor] = useState(post.scheduled_for || "");
    const [status, setStatus] = useState(post.status || "draft");
    const [imageUrl, setImageUrl] = useState(post.image_url || "");
    const [referenceLink, setReferenceLink] = useState(post.reference_link || "");
    const [feedback, setFeedback] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [confirmAction, setConfirmAction] = useState<'comment' | 'changes' | null>(null);

    async function handleRequestChanges() {
        if (!feedback.trim()) return;
        // Confirmation is now handled in the UI
        setIsLoading(true);
        const result = await adminRequestChanges(post.id, feedback);
        setIsLoading(false);
        setConfirmAction(null);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    async function handleUpdate(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        // Append ID manually since it's not in the form
        formData.append("postId", post.id);

        const result = await updatePost(formData);

        setIsLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    async function handleClearFeedback() {
        if (!confirm("¿Estás seguro de que quieres borrar el feedback?")) return;
        setIsLoading(true);
        const result = await clearPostFeedback(post.id);
        setIsLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    return (
        <form action={handleUpdate} className="space-y-6">
            {message && (
                <div className={`p-3 rounded-sm text-xs border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Cliente</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {post.profiles?.full_name?.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700">{post.profiles?.full_name}</span>
                </div>
            </div>

            {/* Feedback Display */}
            {post.feedback_notes && (
                <div className="bg-amber-50 p-4 rounded-md border border-amber-100 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-start mb-2">
                        <label className="block text-xs font-bold text-amber-800 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            Feedback / Notas
                        </label>
                        <button
                            type="button"
                            onClick={handleClearFeedback}
                            className="text-[10px] font-bold uppercase text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" /> Resolver
                        </button>
                    </div>
                    <p className="text-sm text-amber-900 italic">"{post.feedback_notes}"</p>
                </div>
            )}

            {/* Read Only Message for Waiting States */}
            {post.status === 'review_client' && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                        <h4 className="text-sm font-bold text-blue-800">Esperando al Cliente</h4>
                        <p className="text-xs text-blue-600">El post ha sido enviado al cliente para su revisión.</p>
                    </div>
                </div>
            )}

            {post.status === 'changes_requested' && (
                <div className="bg-red-50 p-4 rounded-md border border-red-100 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-600" />
                    <div>
                        <h4 className="text-sm font-bold text-red-800">Esperando Correcciones</h4>
                        <p className="text-xs text-red-600">Se han solicitado cambios al cliente. Esperando su actualización.</p>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contenido del Post</label>
                <textarea
                    name="content"
                    required
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-gray-200 p-4 text-sm rounded-sm focus:border-das-dark outline-none resize-none font-mono text-gray-700 leading-relaxed"
                    placeholder="Escribe aquí el contenido del post..."
                    // Read only if waiting for client
                    readOnly={post.status === 'review_client'}
                ></textarea>
                <p className="text-right text-xs text-gray-400 mt-1">Carácteres: {content.length}/3000</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Programación</label>
                    <input
                        name="scheduledFor"
                        type="datetime-local"
                        value={scheduledFor ? new Date(scheduledFor).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setScheduledFor(e.target.value)}
                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Estado</label>
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none bg-white"
                        disabled={post.status === 'review_client'} // Lock status if waiting
                    >
                        <option value="draft">Borrador</option>
                        <option value="review_client">En Revisión (Cliente)</option>
                        <option value="pending_approval">Pendiente de Aprobación</option>
                        <option value="changes_requested">Cambios Solicitados</option>
                        <option value="scheduled">Programado</option>
                        <option value="published">Publicado</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imagen</label>
                    {imageUrl && (
                        <div className="mb-2 relative group">
                            <img src={imageUrl} alt="Preview" className="h-20 w-auto object-cover rounded-md border border-gray-200" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <span className="text-white text-xs font-bold">Cambiar</span>
                            </div>
                        </div>
                    )}
                    <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Link Referencia</label>
                    <input
                        name="referenceLink"
                        type="url"
                        value={referenceLink}
                        onChange={(e) => setReferenceLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                    />
                </div>
            </div>

            {/* ACTION AREA BASED ON STATUS */}
            <div className="pt-6 border-t border-gray-100">
                {/* DRAFT: Save, Send to Client, Publish Direct */}
                {post.status === 'draft' && (
                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            onClick={() => setStatus('draft')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 text-xs font-bold uppercase tracking-wider"
                        >
                            Guardar Borrador
                        </button>
                        <button
                            type="submit"
                            onClick={() => setStatus('review_client')}
                            className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-blue-700 transition-colors"
                        >
                            Enviar a Aprobación
                        </button>
                        <button
                            type="submit"
                            onClick={() => setStatus('scheduled')}
                            className="bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
                        >
                            Publicación Directa
                        </button>
                    </div>
                )}

                {/* REVIEW REQUESTED (From Client): Request Changes, Approve */}
                {(post.status === 'pending_approval' || post.status === 'review_requested') && (
                    <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-sm border border-amber-100">
                            <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Solicitar Cambios al Cliente
                            </h4>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Describe los cambios necesarios..."
                                className="w-full border border-amber-200 focus:border-amber-500 rounded-sm p-3 text-sm outline-none bg-white min-h-[80px] mb-3"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleRequestChanges}
                                    disabled={!feedback.trim() || isLoading}
                                    className="bg-amber-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-amber-700 transition-colors disabled:opacity-70"
                                >
                                    Pedir Cambios
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                onClick={() => setStatus('scheduled')}
                                className="bg-green-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Aprobar y Programar
                            </button>
                        </div>
                    </div>
                )}

                {/* WAITING STATES: Read Only / Force Edit */}
                {(post.status === 'review_client' || post.status === 'changes_requested') && (
                    <div className="flex justify-end gap-3">
                        <span className="text-xs text-gray-500 self-center italic mr-2">
                            El post está en manos del cliente.
                        </span>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 text-xs font-bold uppercase tracking-wider"
                        >
                            Forzar Guardado (Editar)
                        </button>
                    </div>
                )}

                {/* SCHEDULED: Edit, Force Publish */}
                {post.status === 'scheduled' && (
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-sm">
                            Programado para {new Date(post.scheduled_for).toLocaleString()}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 text-xs font-bold uppercase tracking-wider"
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!confirm("¿Publicar AHORA en LinkedIn?")) return;
                                    setIsLoading(true);
                                    const res = await publishToLinkedIn(post.id);
                                    setIsLoading(false);
                                    if (res.success) {
                                        setMessage({ type: 'success', text: res.message });
                                        setTimeout(onSuccess, 2000);
                                    } else {
                                        setMessage({ type: 'error', text: res.message });
                                    }
                                }}
                                className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                Publicar Ahora
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
