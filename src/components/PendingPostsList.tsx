"use client";

import { useState } from "react";
import { Clock, ChevronRight, X, Check, MessageSquare } from "lucide-react";
import { updateClientPost, approvePost, requestChanges } from "@/app/_dashboard/actions";

export default function PendingPostsList({ posts }: { posts: any[] }) {
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isRejecting, setIsRejecting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        await approvePost(selectedPost.id);
        setIsLoading(false);
        setSelectedPost(null);
    };

    const handleRequestChanges = async () => {
        setIsLoading(true);
        await requestChanges(selectedPost.id, feedback);
        setIsLoading(false);
        setSelectedPost(null);
        setIsRejecting(false);
        setFeedback("");
    };

    if (posts.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400 text-sm">
                No tienes posts pendientes de aprobación. ¡Todo al día! 🎉
            </div>
        );
    }

    return (
        <>
            <div className="divide-y divide-gray-100">
                {posts.map((post) => {
                    const isChangesRequested = post.status === 'changes_requested';
                    return (
                        <div
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group ${isChangesRequested ? 'opacity-75' : ''}`}
                        >
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-10 h-10 bg-gray-100 rounded-md shrink-0 overflow-hidden border border-gray-200 relative">
                                    {post.image_url ? (
                                        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                    )}
                                    {isChangesRequested && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4
                                        className="font-bold text-das-dark text-sm break-words"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {post.content}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isChangesRequested ? (
                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm uppercase">Cambios Solicitados</span>
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                Programado: {post.scheduled_for ? new Date(post.scheduled_for).toLocaleDateString() : 'Sin fecha'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-das-dark transition-colors" />
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                            <h3 className="font-bold text-lg text-das-dark">Revisar Post</h3>
                            <button onClick={() => setSelectedPost(null)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content - Scrollable Area */}
                        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                {selectedPost.status === 'changes_requested' ? (
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-sm uppercase">Cambios Solicitados</span>
                                ) : (
                                    <span className="text-[10px] font-bold bg-das-accent/10 text-das-accent px-2 py-0.5 rounded-sm uppercase">Pendiente de Revisión</span>
                                )}
                                <span className="text-xs text-gray-400">
                                    {selectedPost.scheduled_for ? `Programado para: ${new Date(selectedPost.scheduled_for).toLocaleDateString()}` : 'Sin fecha programada'}
                                </span>
                            </div>

                            {/* Post Text */}
                            <div className="text-gray-800 whitespace-pre-wrap font-medium text-base">
                                {selectedPost.content}
                            </div>

                            {/* Media */}
                            {(selectedPost.image_url || selectedPost.reference_link) && (
                                <div className="space-y-3">
                                    {selectedPost.image_url && (
                                        <div className="rounded-lg overflow-hidden border border-gray-200">
                                            <img src={selectedPost.image_url} alt="Post media" className="w-full h-auto" />
                                        </div>
                                    )}
                                    {selectedPost.reference_link && (
                                        <a href={selectedPost.reference_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-2 rounded-md border border-blue-100 w-fit">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                                            {selectedPost.reference_link}
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Rejection Form */}
                            {isRejecting && (
                                <div className="bg-red-50 p-4 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-xs font-bold text-red-800 mb-2 uppercase">Motivo de la revisión</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Explica qué cambios necesitas..."
                                        className="w-full p-3 text-sm border border-red-200 rounded-sm focus:outline-none focus:border-red-400 min-h-[100px] bg-white"
                                    />
                                </div>
                            )}

                            {/* Feedback History if changes requested */}
                            {selectedPost.status === 'changes_requested' && selectedPost.feedback && (
                                <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                                    <label className="block text-xs font-bold text-amber-800 mb-2 uppercase">Tu comentario de revisión</label>
                                    <p className="text-sm text-amber-900 italic">"{selectedPost.feedback}"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                            {selectedPost.status === 'changes_requested' ? (
                                <div className="text-xs text-gray-500 italic flex items-center">
                                    Esperando revisión del administrador...
                                </div>
                            ) : isRejecting ? (
                                <>
                                    <button
                                        onClick={() => setIsRejecting(false)}
                                        className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-700"
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleRequestChanges}
                                        disabled={!feedback.trim() || isLoading}
                                        className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors rounded-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Enviando...' : 'Enviar Cambios'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsRejecting(true)}
                                        className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider hover:bg-white hover:border-gray-300 transition-colors rounded-sm flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        <MessageSquare className="w-4 h-4" /> Revisar
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-das-dark text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-sm shadow-md flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        <Check className="w-4 h-4" /> Aprobar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
