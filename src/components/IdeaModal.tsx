"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, Loader2, Trash2, Link as LinkIcon } from "lucide-react";
import { createIdea, updateIdea, deletePost } from "@/app/_dashboard/actions";

interface Idea {
    id: string;
    content: string;
    internal_notes?: string;
    reference_link?: string;
}

interface IdeaModalProps {
    isOpen: boolean;
    onClose: () => void;
    ideaToEdit?: Idea | null; // If provided, we are in Edit Mode
}

export default function IdeaModal({ isOpen, onClose, ideaToEdit }: IdeaModalProps) {
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [link, setLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset or populate form when modal opens/changes
    useEffect(() => {
        if (isOpen) {
            if (ideaToEdit) {
                setTitle(ideaToEdit.content || "");
                setNotes(ideaToEdit.internal_notes || "");
                setLink(ideaToEdit.reference_link || "");
            } else {
                setTitle("");
                setNotes("");
                setLink("");
            }
            setError(null);
        }
    }, [isOpen, ideaToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("internalNotes", notes);
        formData.append("referenceLink", link);

        let result;
        if (ideaToEdit) {
            formData.append("ideaId", ideaToEdit.id);
            result = await updateIdea(formData);
        } else {
            result = await createIdea(formData);
        }

        if (result.success) {
            onClose();
        } else {
            setError(result.message || "Error al guardar la idea");
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (!ideaToEdit || !confirm("¿Estás seguro de que quieres eliminar esta idea?")) return;

        setIsLoading(true);
        const result = await deletePost(ideaToEdit.id);
        if (result.success) {
            onClose();
        } else {
            setError(result.message || "Error al eliminar");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Lightbulb size={18} />
                        </div>
                        {ideaToEdit ? "Editar Idea" : "Captura Rápida"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            ¿Sobre qué quieres escribir? <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            placeholder="Ej: Reflexión sobre el liderazgo..."
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Detalles o notas rápidas
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all min-h-[100px] resize-none"
                            placeholder="Puntos clave, referencias, o ideas sueltas..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                            <LinkIcon size={12} /> Link de Referencia
                        </label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        {ideaToEdit ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar idea"
                            >
                                <Trash2 size={18} />
                            </button>
                        ) : (
                            <div></div> // Spacer
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !title.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar en el Bucket"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
