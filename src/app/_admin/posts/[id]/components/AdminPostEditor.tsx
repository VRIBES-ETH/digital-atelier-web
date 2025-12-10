"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Save, Send, User, MessageSquare, AlertCircle, CheckCircle, Image as ImageIcon, XCircle } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePost, approvePost, adminRequestChanges, rejectPost, clearPostFeedback } from "@/app/admin/actions";

interface AdminPostEditorProps {
    post: any;
}

export default function AdminPostEditor({ post }: AdminPostEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [content, setContent] = useState(post.content || "");
    const [internalNotes, setInternalNotes] = useState(post.internal_notes || "");
    const [status, setStatus] = useState(post.status);

    const handleSave = async () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("postId", post.id);
            formData.append("content", content);
            formData.append("internalNotes", internalNotes);
            formData.append("status", status); // Keep current status
            // Add other fields if needed, e.g. scheduledFor, referenceLink
            // For now we just save content and notes

            const result = await updatePost(formData);
            if (result.success) {
                alert("Guardado correctamente");
                router.refresh();
            } else {
                alert("Error al guardar: " + result.message);
            }
        });
    };

    const handleApprove = async () => {
        if (!confirm("¿Estás seguro de aprobar y PUBLICAR este post en LinkedIn?")) return;

        startTransition(async () => {
            try {
                // 1. Call API to publish
                const response = await fetch("/api/posts/publish", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId: post.id }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error desconocido al publicar");
                }

                // 2. Success
                alert("¡Post publicado en LinkedIn correctamente! 🚀");
                router.push("/admin");
                router.refresh();

            } catch (error: any) {
                alert("Error al publicar: " + error.message);
            }
        });
    };

    const handleRequestChanges = async () => {
        const feedback = prompt("Escribe tu feedback para el cliente:");
        if (!feedback) return;

        startTransition(async () => {
            const result = await adminRequestChanges(post.id, feedback);
            if (result.success) {
                alert("Feedback enviado al cliente");
                router.push("/admin");
            } else {
                alert("Error: " + result.message);
            }
        });
    };

    const handleReject = async () => {
        const feedback = prompt("Razón del rechazo:");
        if (!feedback) return;

        startTransition(async () => {
            const result = await rejectPost(post.id, feedback);
            if (result.success) {
                alert("Post rechazado");
                router.push("/admin");
            } else {
                alert("Error: " + result.message);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_approval':
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-pulse"></span>
                        Revisión Pendiente
                    </span>
                );
            case 'approved':
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1">
                        Aprobado
                    </span>
                );
            case 'published':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                        Publicado
                    </span>
                );
            case 'changes_requested':
                return (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full border border-orange-200 flex items-center gap-1">
                        Cambios Solicitados
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full border border-gray-200 flex items-center gap-1">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans flex flex-col">

            {/* 1. TOPBAR DE NAVEGACIÓN */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Editando Post de</h1>
                        <div className="flex items-center gap-2">
                            {post.profiles?.linkedin_picture_url ? (
                                <img src={post.profiles.linkedin_picture_url} className="w-5 h-5 rounded-full" alt="" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                    {post.profiles?.full_name?.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <span className="font-semibold text-gray-900">{post.profiles?.full_name}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {getStatusBadge(post.status)}
                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm font-medium disabled:opacity-50"
                    >
                        {isPending ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={isPending}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <CheckCircle size={16} /> Aprobar y Programar
                    </button>
                </div>
            </header>

            {/* 2. AREA DE TRABAJO (2 COLUMNAS) */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: EDITOR DE CONTENIDO */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 min-h-[500px] flex flex-col">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Contenido del Post</label>
                        <textarea
                            className="w-full flex-1 min-h-[400px] bg-transparent border-none focus:ring-0 text-gray-900 text-lg leading-relaxed resize-none placeholder-gray-300"
                            placeholder="Escribe aquí el contenido..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        {/* Footer del Editor */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                            <span>{content.length} / 3000 Caracteres</span>
                            <span>Markdown Soportado</span>
                        </div>
                    </div>

                    {/* Preview de Imagen/Media */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Recursos Multimedia</label>
                            <button className="text-orange-600 text-xs font-bold hover:underline">Cambiar Archivo</button>
                        </div>
                        {post.image_url ? (
                            <div className="w-full h-auto rounded-lg overflow-hidden border border-gray-200">
                                <img src={post.image_url} alt="Post media" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                <ImageIcon size={32} className="mb-2 opacity-50" />
                                <span className="text-sm">Ninguna imagen seleccionada</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: CONTEXTO Y CONTROL */}
                <div className="space-y-6">

                    {/* Widget: Notas del Cliente (Read Only) */}
                    {/* Widget: Notas del Cliente (Read Only) */}
                    {post.feedback_notes && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 relative group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                                    <MessageSquare size={16} /> Feedback Activo
                                </div>
                                <button
                                    onClick={() => startTransition(async () => {
                                        if (confirm("¿Borrar feedback?")) {
                                            await clearPostFeedback(post.id);
                                            router.refresh();
                                        }
                                    })}
                                    className="text-blue-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Borrar Feedback"
                                >
                                    <XCircle size={16} />
                                </button>
                            </div>
                            <p className="text-sm text-blue-700 italic">"{post.feedback_notes}"</p>
                        </div>
                    )}

                    {/* Widget: Notas Privadas (Internal Notes) */}
                    <div className="bg-[#FFF8F0] border border-orange-100 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm">
                            <AlertCircle size={16} /> Notas Internas (Privado)
                        </div>
                        <textarea
                            className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            rows={4}
                            placeholder="Apuntes solo para ti (ej: 'Este cliente prefiere frases cortas')..."
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Widget: Acciones de Estado */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Cambiar Estado</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleRequestChanges}
                                disabled={isPending}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 hover:border-orange-300 rounded-lg text-sm font-medium transition-all group disabled:opacity-50"
                            >
                                <span className="text-gray-700 group-hover:text-orange-600">Enviar Feedback</span>
                                <Send size={14} className="text-gray-400 group-hover:text-orange-600" />
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isPending}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 hover:border-red-300 rounded-lg text-sm font-medium transition-all group disabled:opacity-50"
                            >
                                <span className="text-gray-700 group-hover:text-red-600">Rechazar / Archivar</span>
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </button>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="text-xs text-gray-400 px-2">
                        <p>Creado: {new Date(post.created_at).toLocaleDateString()}</p>
                        <p>Plan: {post.profiles?.plan_tier || 'N/A'}</p>
                    </div>

                </div>
            </main>
        </div>
    );
}
