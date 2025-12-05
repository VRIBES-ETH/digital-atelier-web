"use client";

import { useState, useEffect } from 'react';
import { X, Download, Trash2, Edit2, Save, File, Loader2 } from 'lucide-react';

interface Asset {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: any;
}

interface FileDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    asset: Asset | null;
    publicUrl: string;
    onRename: (oldName: string, newName: string) => Promise<boolean>;
    onDelete: (name: string) => Promise<void>;
}

export default function FileDetailsDialog({ isOpen, onClose, asset, publicUrl, onRename, onDelete }: FileDetailsDialogProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (asset) {
            setNewName(asset.name);
            setIsRenaming(false);
        }
    }, [asset]);

    if (!isOpen || !asset) return null;

    const handleSaveRename = async () => {
        if (!newName.trim() || newName === asset.name) {
            setIsRenaming(false);
            return;
        }

        setIsSaving(true);
        const success = await onRename(asset.name, newName);
        setIsSaving(false);

        if (success) {
            setIsRenaming(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">

                {/* Image Preview Section */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 relative min-h-[300px]">
                    <img
                        src={publicUrl}
                        alt={asset.name}
                        className="max-w-full max-h-[70vh] object-contain shadow-lg rounded-lg"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <div className="hidden flex flex-col items-center text-gray-400">
                        <File size={64} />
                        <span className="mt-4 text-sm font-medium">Vista previa no disponible</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Details Sidebar */}
                <div className="w-full md:w-96 bg-white p-6 flex flex-col border-l border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Detalles del Archivo</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onDelete(asset.name)}
                                className="text-gray-400 hover:text-red-500 transition-colors hidden md:block"
                                title="Eliminar"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hidden md:block">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        {/* Filename & Rename */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre</label>
                            {isRenaming ? (
                                <div className="flex gap-2">
                                    <input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="flex-1 border border-orange-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveRename}
                                        disabled={isSaving}
                                        className="p-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2 group">
                                    <p className="text-lg font-medium text-gray-900 break-all leading-tight">{asset.name}</p>
                                    <button
                                        onClick={() => setIsRenaming(true)}
                                        className="text-gray-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase">Tamaño</span>
                                <span className="text-sm font-medium text-gray-700">{formatSize(asset.metadata?.size || 0)}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase">Tipo</span>
                                <span className="text-sm font-medium text-gray-700">{asset.metadata?.mimetype || 'Desconocido'}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase">Subido</span>
                                <span className="text-sm font-medium text-gray-700">{new Date(asset.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-auto pt-6 space-y-3">
                        <a
                            href={publicUrl}
                            download={asset.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                        >
                            <Download size={16} /> Descargar
                        </a>
                        <button
                            onClick={() => onDelete(asset.name)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
