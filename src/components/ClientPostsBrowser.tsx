"use client";

import { useState } from "react";
import { Search, Filter, LayoutGrid, Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, MoreVertical, Trash2, Edit, ExternalLink, Linkedin } from "lucide-react";
import { approvePost, requestChanges, rescheduleClientPost, deletePost, publishClientPost } from "@/app/_dashboard/actions";
import { publishToLinkedIn } from "@/app/_admin/actions";
import ClientPostEditModal from "./ClientPostEditModal";

export default function ClientPostsBrowser({ posts, linkedinProfile, userRole = 'client' }: { posts: any[], linkedinProfile: any, userRole?: 'admin' | 'client' }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border-green-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending_approval': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'changes_requested': return 'bg-red-100 text-red-700 border-red-200';
            case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return 'Publicado';
            case 'scheduled': return 'Programado';
            case 'pending_approval': return 'En Revisión';
            case 'changes_requested': return 'Cambios Solicitados';
            case 'draft': return 'Borrador';
            default: return status;
        }
    };

    const handleEditClick = (post: any) => {
        setSelectedPost(post);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (postId: string) => {
        if (!confirm("¿Estás seguro de eliminar este post?")) return;
        setIsLoading(true);
        const res = await deletePost(postId);
        setIsLoading(false);
        if (res.success) {
            // Toast or reload? ideally revalidatePath handles reload
            // But we might need manual reload if state doesn't sync fast enough locally
        } else {
            alert(res.message);
        }
    };

    const handlePublishNow = async (postId: string) => {
        if (!confirm("¿Publicar inmediatamente en LinkedIn?")) return;
        setIsLoading(true);
        // If client, we might use a client-specific action that checks generic permissions
        // But logic is reused.
        const res = await publishClientPost(postId);
        setIsLoading(false);
        if (res.success) {
            alert(res.message);
        } else {
            alert(res.message);
        }
    }

    return (
        <div>
            {/* Controls Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-das-dark text-white shadow-sm' : 'text-gray-400 hover:text-das-dark'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    {/* List view disabled for now as Grid is priority */}
                    {/* <button onClick={() => setViewMode('list')} ... ><List ... /></button> */}
                </div>

                <div className="flex flex-wrap gap-2">
                    {['all', 'draft', 'pending_approval', 'scheduled', 'published', 'changes_requested'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${statusFilter === status
                                ? 'bg-das-dark text-white border-das-dark'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {getStatusLabel(status === 'all' ? 'Todos' : status)}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar en posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-das-dark transition-colors w-full md:w-64"
                    />
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                    <div key={post.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                        {/* Actions Overlay (visible on hover) */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                            {post.status !== 'published' && (
                                <>
                                    <button
                                        onClick={() => handleEditClick(post)}
                                        className="p-2 bg-white text-gray-600 rounded-full shadow-sm hover:text-das-accent border border-gray-100"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(post.id)}
                                        className="p-2 bg-white text-gray-600 rounded-full shadow-sm hover:text-red-500 border border-gray-100"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="px-4 pt-4 flex justify-between items-start">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(post.status)}`}>
                                {getStatusLabel(post.status)}
                            </span>
                            {post.scheduled_for && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                    <CalendarIcon className="w-3 h-3" />
                                    {new Date(post.scheduled_for).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        {/* Content Preview */}
                        <div className="p-4">
                            <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-4 font-normal">
                                {post.content}
                            </p>
                            {post.image_url && (
                                <div className="rounded-lg overflow-hidden h-32 w-full bg-gray-50 border border-gray-100 mb-4">
                                    <img src={post.image_url} alt="Post asset" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>


                        {/* Footer Info */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                            <span>Actualizado: {new Date(post.updated_at || post.created_at).toLocaleDateString()}</span>
                            {post.status === 'published' && (
                                <a
                                    href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`} // assuming we store this, or generic link
                                    target="_blank"
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                    Ver en LinkedIn <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                            {(post.status === 'scheduled' || post.status === 'approved') && userRole === 'client' && (
                                <button
                                    onClick={() => handlePublishNow(post.id)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 text-das-dark font-bold hover:text-das-accent transition-colors disabled:opacity-50"
                                >
                                    <Linkedin className="w-3 h-3" /> Publicar Ahora
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredPosts.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-gray-900 font-bold mb-1">No se encontraron posts</h3>
                        <p className="text-gray-500 text-sm">Prueba ajustando los filtros de búsqueda.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedPost && (
                <ClientPostEditModal
                    post={selectedPost}
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setSelectedPost(null); }}
                />
            )}
        </div>
    );
}
