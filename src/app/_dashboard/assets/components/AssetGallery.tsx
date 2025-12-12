"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, File, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import FileDetailsDialog from './FileDetailsDialog';

interface Asset {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: any;
    signedUrl?: string;
}

export default function AssetGallery({ userId, isAdmin = false }: { userId: string, isAdmin?: boolean }) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const supabase = createClient();

    const fetchAssets = useCallback(async () => {
        setIsLoading(true);
        const { data: files, error } = await supabase
            .storage
            .from('client_assets')
            .list(userId, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error('Error loading assets:', error);
            setAssets([]);
        } else {
            // Generate signed URLs for all assets
            if (files && files.length > 0) {
                const paths = files.map(f => `${userId}/${f.name}`);
                const { data: signedUrls, error: urlError } = await supabase.storage
                    .from('client_assets')
                    .createSignedUrls(paths, 3600); // 1 hour expiry

                if (signedUrls) {
                    const assetsWithUrls = files.map((file, index) => ({
                        ...file,
                        signedUrl: signedUrls[index].signedUrl,
                    }));
                    setAssets(assetsWithUrls);
                } else {
                    console.error('Error generating signed URLs:', urlError);
                    setAssets(files);
                }
            } else {
                setAssets([]);
            }
        }
        setIsLoading(false);
    }, [userId, supabase]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setIsUploading(true);

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
            .from('client_assets')
            .upload(filePath, file);

        if (error) {
            alert('Error uploading file: ' + error.message);
        } else {
            fetchAssets();
        }
        setIsUploading(false);
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;

        const { error } = await supabase.storage
            .from('client_assets')
            .remove([`${userId}/${fileName}`]);

        if (error) {
            alert('Error deleting file: ' + error.message);
        } else {
            setSelectedAsset(null); // Close modal if open
            fetchAssets();
        }
    };

    const handleRename = async (oldName: string, newName: string) => {
        try {
            const { error } = await supabase.storage
                .from('client_assets')
                .move(`${userId}/${oldName}`, `${userId}/${newName}`);

            if (error) throw error;

            await fetchAssets();

            // Update selected asset to reflect new name immediately in modal
            // We also need to update the signed URL because the path changed!
            // For simplicity, we'll just close the modal or let fetchAssets handle it.
            // But to keep the modal open with correct info, we should ideally re-fetch the signed URL for the new name.
            // For now, let's just update the name. The signed URL might still work if it was by ID? No, it's by path.
            // So the old signed URL is invalid for the new path.
            // Let's re-fetch assets and find the new asset to update selectedAsset.

            // A simple hack: close the modal to force user to re-open (and thus get new URL)
            // Or better: fetchAssets is already called. We can find the new asset in the new list?
            // But fetchAssets is async and we don't return the data.

            // Let's just close the modal for now to avoid broken image.
            setSelectedAsset(null);
            return true;
        } catch (error: any) {
            alert('Error renaming file: ' + error.message);
            return false;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
            {isAdmin && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider z-10">
                    Modo Admin
                </div>
            )}

            {/* Header Actions */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={fetchAssets}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-das-dark transition-colors"
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    Actualizar
                </button>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                        ) : (
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept="image/*" />
                </label>
            </div>

            {/* Gallery Grid */}
            {isLoading && assets.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : assets.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p>No hay archivos en tu bóveda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden aspect-square flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors"
                            onClick={() => setSelectedAsset(asset)}
                        >
                            {/* Preview */}
                            <img
                                src={asset.signedUrl}
                                alt={asset.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback for non-images
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                                <File className="w-8 h-8 text-gray-400" />
                            </div>

                            {/* Overlay Info & Actions */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between gap-2">
                                <p className="text-white text-xs font-medium truncate flex-1">{asset.name}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(asset.name);
                                    }}
                                    className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-md transition-colors backdrop-blur-sm"
                                    title="Eliminar"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            <FileDetailsDialog
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                asset={selectedAsset}
                publicUrl={selectedAsset?.signedUrl || ''}
                onRename={handleRename}
                onDelete={async (name) => {
                    await handleDelete(name);
                    // Modal closes inside handleDelete if successful via setSelectedAsset(null) call there? 
                    // Actually handleDelete calls fetchAssets, but we need to close modal too.
                    // Let's make sure handleDelete closes it or we do it here.
                    // Updated handleDelete to close it.
                }}
            />
        </div>
    );
}
