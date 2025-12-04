"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Loader2, Send, Image as ImageIcon, Calendar, Clock, FileCheck } from "lucide-react";
import { createClientPost } from "@/app/dashboard/actions";

interface ClientPostCreateModalProps {
    userRole?: 'admin' | 'client';
    isOpen?: boolean;
    onClose?: () => void;
    initialDate?: Date | null;
}

export default function ClientPostCreateModal({ userRole = 'client', isOpen: isOpenProp, onClose: onCloseProp, initialDate }: ClientPostCreateModalProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [scheduledFor, setScheduledFor] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const isControlled = isOpenProp !== undefined;
    const isOpen = isControlled ? isOpenProp : internalIsOpen;
    const onClose = isControlled ? onCloseProp : () => setInternalIsOpen(false);

    const isAdmin = userRole === 'admin';

    // Effect to set initial date when opening
    useEffect(() => {
        if (isOpen && initialDate) {
            // Format date to local datetime-local string (YYYY-MM-DDTHH:mm)
            // We'll default to 10:00 AM if only date provided
            const date = new Date(initialDate);
            date.setHours(10, 0, 0, 0);

            // Adjust for timezone offset to show correct local time in input
            const offset = date.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);

            setScheduledFor(localISOTime);
        } else if (isOpen && !initialDate) {
            setScheduledFor("");
        }
    }, [isOpen, initialDate]);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await createClientPost(formData);
        setIsLoading(false);

        if (result.success) {
            if (onClose) onClose();
            setPreviewUrl(null);
            setScheduledFor("");
            window.location.reload();
        } else {
            alert(result.message);
        }
    }

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

    const submitForm = (action: 'draft' | 'schedule' | 'pending_approval') => {
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            formData.append("actionType", action);

            // Convert local datetime to UTC ISO string
            const scheduledFor = formData.get("scheduledFor") as string;
            if (scheduledFor) {
                const date = new Date(scheduledFor);
                formData.set("scheduledFor", date.toISOString());
            }

            handleSubmit(formData);
        }
    };

    return (
        <>
            {!isControlled && (
                <button
                    onClick={() => setInternalIsOpen(true)}
                    className="bg-das-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Crear Post
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-das-dark p-4 flex justify-between items-center text-white shrink-0">
                            <h3 className="font-poppins font-bold text-sm uppercase tracking-wider">Nuevo Post</h3>
                            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-sm transition-colors"><X className="w-4 h-4" /></button>
                        </div>

                        <form ref={formRef} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contenido del Post</label>
                                <textarea
                                    name="content"
                                    required
                                    placeholder="Escribe aquí tu idea o contenido..."
                                    className="w-full border border-gray-200 p-3 text-sm rounded-sm focus:border-das-dark outline-none min-h-[120px]"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imagen (Opcional)</label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />

                                {!previewUrl ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-gray-200 rounded-sm p-6 flex flex-col items-center justify-center text-gray-400 hover:border-das-dark hover:text-das-dark transition-colors"
                                    >
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold uppercase">Subir Imagen</span>
                                    </button>
                                ) : (
                                    <div className="relative w-full h-48 bg-gray-100 rounded-sm overflow-hidden group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enlace (Opcional)</label>
                                    <input
                                        name="referenceLink"
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Programar (Opcional)</label>
                                    <input
                                        name="scheduledFor"
                                        type="datetime-local"
                                        value={scheduledFor}
                                        onChange={(e) => setScheduledFor(e.target.value)}
                                        className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:border-das-dark outline-none"
                                    />
                                </div>
                            </div>
                        </form>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={() => submitForm('draft')}
                                disabled={isLoading}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                Guardar Borrador
                            </button>

                            <button
                                type="button"
                                onClick={() => submitForm(isAdmin ? 'schedule' : 'pending_approval')}
                                disabled={isLoading || (isAdmin && !scheduledFor)}
                                className={`px-4 py-2 text-white rounded-sm shadow-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${isAdmin
                                    ? 'bg-das-dark hover:bg-gray-800'
                                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                                    }`}
                            >
                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (isAdmin ? <Calendar className="w-3 h-3" /> : <FileCheck className="w-3 h-3" />)}
                                {isAdmin ? 'Programar' : 'Solicitar Revisión'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
