'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/app/actions/blog';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PostEditor({ post }: { post?: BlogPost }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const [formData, setFormData] = useState({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        status: post?.status || 'draft',
        featured_image: post?.featured_image || '',
        seo_title: post?.seo_title || '',
        seo_description: post?.seo_description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if slug is empty
        if (name === 'title' && !post && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, featured_image: data.publicUrl }));

        } catch (error) {
            alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        if (post) {
            data.append('_action', 'update');
            data.append('id', post.id);
        } else {
            data.append('_action', 'create');
        }

        try {
            const response = await fetch('/api/admin/blog', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                alert('Error del servidor: ' + (result.message || 'Error desconocido'));
                return;
            }

            // Success
            router.push('/vribesadmin/blog');
            router.refresh();
        } catch (error) {
            alert('Error de conexión: ' + error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-8 font-poppins text-gray-200">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/vribesadmin/blog" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <h1 className="text-2xl font-bold">
                        {post ? 'Editar Artículo' : 'Nuevo Artículo'}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="btn bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50 font-bold tracking-wide"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {post ? 'Guardar Cambios' : 'Publicar'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Título</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-4 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-orange-600 focus:border-orange-600 outline-none text-xl font-medium placeholder-zinc-700 transition-all text-white"
                                placeholder="Escribe el título aquí..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Slug (URL)</label>
                            <div className="flex">
                                <span className="bg-zinc-800 text-gray-400 border border-r-0 border-zinc-700 rounded-l-lg px-3 py-3 text-sm font-mono flex items-center">
                                    /blog/
                                </span>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-black border border-zinc-700 rounded-r-lg text-sm text-gray-300 font-mono focus:ring-1 focus:ring-orange-600 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contenido (Markdown)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full p-6 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-orange-600 focus:border-orange-600 outline-none min-h-[600px] font-mono text-sm leading-relaxed text-gray-300 resize-none selection:bg-orange-900 selection:text-white"
                                placeholder="# Empieza a escribir tu historia..."
                                required
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-zinc-600">Soporta Markdown, imágenes y HTML básico.</p>
                                <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" className="text-xs text-orange-600 hover:underline">Guía de Markdown</a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Extracto / Resumen</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 bg-black border border-zinc-700 rounded-lg focus:ring-1 focus:ring-orange-600 outline-none text-gray-300"
                            placeholder="Breve descripción para listados y SEO..."
                        />
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600">Publicación</h3>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Estado</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-black border border-zinc-700 rounded-lg appearance-none focus:ring-1 focus:ring-orange-600 outline-none text-gray-300 cursor-pointer"
                                >
                                    <option value="draft">🟡 Borrador</option>
                                    <option value="published">🟢 Publicado</option>
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">▼</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600">Imagen Destacada</h3>

                        {formData.featured_image ? (
                            <div className="relative group">
                                <div className="rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-black">
                                    <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <button
                                    onClick={() => setFormData(p => ({ ...p, featured_image: '' }))}
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-3" />
                                    ) : (
                                        <UploadCloud className="w-8 h-8 text-zinc-500 mb-3" />
                                    )}
                                    <span className="text-sm font-medium text-gray-400">
                                        {isUploading ? 'Subiendo...' : 'Click o arrastra imagen'}
                                    </span>
                                    <span className="text-xs text-zinc-600 mt-1">PNG, JPG hasta 5MB</span>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                                    disabled={isUploading}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">O pegar URL externa</label>
                            <div className="flex gap-2">
                                <div className="bg-zinc-800 p-3 rounded-l-lg border border-r-0 border-zinc-700 text-zinc-500">
                                    <ImageIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="featured_image"
                                    value={formData.featured_image}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-black border border-zinc-700 rounded-r-lg text-xs text-gray-300 focus:ring-1 focus:ring-orange-600 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600">SEO (Opcional)</h3>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Título SEO</label>
                            <input
                                type="text"
                                name="seo_title"
                                value={formData.seo_title}
                                onChange={handleChange}
                                className="w-full p-3 bg-black border border-zinc-700 rounded-lg text-sm text-gray-300 focus:ring-1 focus:ring-orange-600 outline-none"
                                placeholder={formData.title || "Igual al título"}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Descripción SEO</label>
                            <textarea
                                name="seo_description"
                                value={formData.seo_description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 bg-black border border-zinc-700 rounded-lg text-sm text-gray-300 focus:ring-1 focus:ring-orange-600 outline-none"
                                placeholder={formData.excerpt || "Igual al extracto"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
