"use client";

import { useState, useRef, useEffect } from "react";
import { X, Loader2, Image as ImageIcon, Calendar, Trash2, FileCheck, Save } from "lucide-react";
import { updateClientPost, deletePost } from "@/app/dashboard/actions";

interface ClientPostEditModalProps {
    post: any;
    isOpen: boolean;
    onClose: () => void;
    userRole?: 'admin' | 'client';
}

export default function ClientPostEditModal({ post, isOpen, onClose, userRole = 'client' }: ClientPostEditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(post.image_url || null);
    const [scheduledFor, setScheduledFor] = useState(post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : "");
    const [content, setContent] = useState(post.content || "");
    const [internalNotes, setInternalNotes] = useState(post.internal_notes || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const isAdmin = userRole === 'admin';
    const charCount = content.length;
    const isOverLimit = charCount > 210;

    useEffect(() => {
        if (isOpen) {
            setContent(post.content || "");
            setInternalNotes(post.internal_notes || "");
            setPreviewUrl(post.image_url || null);
            setScheduledFor(post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : "");
        }
    }, [isOpen, post]);

    if (!isOpen) return null;

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        // Append ID manually
        formData.append("postId", post.id);

        // Convert local datetime to UTC ISO string if present
        const scheduledForVal = formData.get("scheduledFor") as string;
        if (scheduledForVal) {
            const date = new Date(scheduledForVal);
            formData.set("scheduledFor", date.toISOString());
        }

        const result = await updateClientPost(formData);
        setIsLoading(false);

        if (result.success) {
            onClose();
            window.location.reload();
        } else {
            alert(result.message);
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.")) return;
        setIsLoading(true);
        const result = await deletePost(post.id);
        setIsLoading(false);

        if (result.success) {
            onClose();
            window.location.reload();
        } else {
            alert(result.message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removeImage = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submitForm = (action: 'draft' | 'schedule' | 'pending_approval' | 'publish_now' | 'review_requested') => {
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            formData.append("actionType", action);
            handleSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-das-dark p-4 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-poppins font-bold text-sm uppercase tracking-wider">Editar Post</h3>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-sm transition-colors"><X className="w-4 h-4" /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {post.feedback_notes && (
                        <div className="mb-6 bg-amber-50 p-4 rounded-sm border border-amber-100">
                            <h4 className="text-xs font-bold text-amber-800 uppercase mb-1">Feedback del Editor</h4>
                            <p className="text-sm text-amber-900 italic">"{post.feedback_notes}"</p>
                        </div>
                    )}

                    <form ref={formRef} className="space-y-6">
                        <div className="relative">
                            <textarea
                                name="content"
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                className="w-full border border-gray-200 p-4 text-sm rounded-sm focus:border-das-dark outline-none resize-none font-medium text-gray-700 placeholder:text-gray-300"
                                placeholder="¿Qué quieres compartir hoy?"
                            ></textarea>
                            <div className={`absolute bottom-2 right-2 text-[10px] font-bold ${isOverLimit ? 'text-orange-500' : 'text-gray-400'}`}>
                                {charCount} caracteres
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Notas o Instrucciones (Opcional)</label>
                            <input
                                name="internalNotes"
                                value={internalNotes}
                                onChange={(e) => setInternalNotes(e.target.value)}
                                placeholder="Ej: Revisar el tono del segundo párrafo..."
                                className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Link de Referencia (Opcional)</label>
                            <input
                                name="referenceLink"
                                type="url"
                                defaultValue={post.reference_link || ""}
                                placeholder="https://..."
                                className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Imagen (Opcional)</label>

                            {!previewUrl ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer hover:border-das-dark hover:bg-gray-50 transition-colors group"
                                >
                                    <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-das-dark mb-2 transition-colors" />
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-das-dark uppercase tracking-wider transition-colors">Subir Imagen</span>
                                </div>
                            ) : (
                                <div className="relative group rounded-sm overflow-hidden border border-gray-200">
                                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Programar (Opcional)
                            </label>
                            <input
                                name="scheduledFor"
                                type="datetime-local"
                                value={scheduledFor}
                                onChange={(e) => setScheduledFor(e.target.value)}
                                className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                    {/* ZONA IZQUIERDA: Eliminar (Solo si es borrador o cambios solicitados) */}
                    <div>
                        {(post.status === 'draft' || post.status === 'changes_requested') && (
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
                            >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Eliminar</span>
                            </button>
                        )}
                    </div>

                    {/* ZONA DERECHA: Acciones Principales */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider"
                        >
                            Cancelar
                        </button>

                        {/* CASO A: CLIENTE */}
                        {!isAdmin && (
                            <>
                                {/* Draft: Guardar Borrador & Solicitar Revisión */}
                                {post.status === 'draft' && (
                                    <>
                                        <button
                                            onClick={() => submitForm('draft')}
                                            disabled={isLoading}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <Save size={16} />
                                            <span className="hidden sm:inline">Guardar Borrador</span>
                                        </button>
                                        <button
                                            onClick={() => submitForm('review_requested')}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-orange-600 text-white rounded-sm hover:bg-orange-700 shadow-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                                        >
                                            <FileCheck size={16} />
                                            <span>Solicitar Revisión</span>
                                        </button>
                                    </>
                                )}

                                {/* Review Requested: Solo Lectura */}
                                {post.status === 'review_requested' && (
                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-sm border border-orange-100">
                                        Esperando revisión de Víctor
                                    </span>
                                )}

                                {/* Changes Requested: Guardar Cambios & Enviar Correcciones */}
                                {post.status === 'changes_requested' && (
                                    <>
                                        <button
                                            onClick={() => submitForm('draft')} // Save as draft/changes but don't change status yet
                                            disabled={isLoading}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <Save size={16} />
                                            <span className="hidden sm:inline">Guardar Cambios</span>
                                        </button>
                                        <button
                                            onClick={() => submitForm('review_requested')}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-orange-600 text-white rounded-sm hover:bg-orange-700 shadow-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                                        >
                                            <FileCheck size={16} />
                                            <span>Enviar Correcciones</span>
                                        </button>
                                    </>
                                )}

                                {/* Review Client: Solicitar Cambios & Aprobar */}
                                {post.status === 'review_client' && (
                                    <>
                                        <button
                                            onClick={() => submitForm('changes_requested')} // Logic to request changes needs feedback input, assuming modal handles it or this button opens feedback
                                            // For simplicity in this modal, we might need a way to input feedback if requesting changes.
                                            // But the prompt says "Solicitar Cambios (Pasa a changes_requested)".
                                            // Let's assume for now it just changes status, or we might need a feedback field.
                                            // Given the UI, let's use 'review_requested' as "Request Changes" equivalent if we don't have a feedback field ready here?
                                            // Wait, 'review_client' means Admin wrote it. Client can 'Request Changes'.
                                            // We'll map 'changes_requested' action to a status update.
                                            disabled={isLoading}
                                            className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <FileCheck size={16} />
                                            <span>Solicitar Cambios</span>
                                        </button>
                                        <button
                                            onClick={() => submitForm(scheduledFor ? 'schedule' : 'publish_now')}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 shadow-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                                        >
                                            <Calendar size={16} />
                                            <span>{scheduledFor ? 'Aprobar y Programar' : 'Aprobar y Publicar'}</span>
                                        </button>
                                    </>
                                )}

                                {/* Scheduled: Solo Lectura + Desprogramar */}
                                {post.status === 'scheduled' && (
                                    <>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-sm border border-blue-100 mr-2">
                                            Programado para {new Date(post.scheduled_for).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => submitForm('draft')}
                                            disabled={isLoading}
                                            className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm text-xs font-bold uppercase tracking-wider"
                                        >
                                            Desprogramar
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {/* CASO B: ADMIN (Fallback simple logic as this modal is primarily for clients, but admin can view it) */}
                        {isAdmin && (
                            <button
                                onClick={() => submitForm(scheduledFor ? 'schedule' : 'publish_now')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-black shadow-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                            >
                                <Calendar size={16} />
                                <span>{scheduledFor ? 'Programar' : 'Publicar'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
