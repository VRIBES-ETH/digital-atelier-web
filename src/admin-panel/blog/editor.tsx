'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/app/actions/blog';
import {
    Loader2, Save, ArrowLeft, Image as ImageIcon, X, UploadCloud,
    Bold, Italic, Heading1, Heading2, Heading3, Minus, Link2, List, Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PostEditor({ post }: { post?: BlogPost }) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

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

    // --- Helper: Slug Sanitization ---
    const sanitizeSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9]+/g, '-') // Replace special chars with dashes
            .replace(/(^-|-$)+/g, ''); // Trim edges
    };

    // --- Helper: Insert Markdown Format ---
    const insertFormat = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = formData.content;

        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newContent = before + prefix + selection + suffix + after;

        setFormData(prev => ({ ...prev, content: newContent }));

        // Restore cursor/selection
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(
                    start + prefix.length,
                    end + prefix.length
                );
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
            e.preventDefault();
            insertFormat('**', '**');
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
            e.preventDefault();
            insertFormat('*', '*');
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            insertFormat('[', '](url)');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'slug') {
            // Live sanitization for slug input (allow typing dashes, but force lowercase/clean)
            const cleanValue = value.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9-]/g, ''); // Allow dashes while typing
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'title' && !post && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: sanitizeSlug(value)
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
            const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, featured_image: data.publicUrl }));
        } catch (error) {
            alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final slug check before submit
        if (!formData.slug) {
            alert('Por favor, escribe un Slug.');
            return;
        }

        setIsSaving(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (post) { data.append('_action', 'update'); data.append('id', post.id); }
        else { data.append('_action', 'create'); }

        try {
            const response = await fetch('/api/admin/blog', { method: 'POST', body: data });
            const result = await response.json();
            if (!response.ok || !result.success) { alert('Error: ' + (result.message || 'Unknown')); return; }
            router.push('/vribesadmin/blog');
            router.refresh();
        } catch (error) { alert('Connection error: ' + error); }
        finally { setIsSaving(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-8 font-poppins text-gray-200">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/vribesadmin/blog" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <h1 className="text-2xl font-bold">{post ? 'Editar Artículo' : 'Nuevo Artículo'}</h1>
                </div>
                <button
                    type="submit" disabled={isSaving}
                    className="btn bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50 font-bold tracking-wide"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {post ? 'Guardar Cambios' : 'Publicar'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Título</label>
                            <input
                                type="text" name="title" value={formData.title} onChange={handleChange}
                                className="w-full p-4 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-orange-600 outline-none text-xl font-medium text-white placeholder-zinc-700"
                                placeholder="Escribe el título aquí..." required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Slug (URL Amigable)</label>
                            <div className="flex">
                                <span className="bg-zinc-800 text-gray-400 border border-r-0 border-zinc-700 rounded-l-lg px-3 py-3 text-sm font-mono flex items-center">/blog/</span>
                                <input
                                    type="text" name="slug" value={formData.slug} onChange={handleChange}
                                    onBlur={() => setFormData(prev => ({ ...prev, slug: sanitizeSlug(prev.slug) }))}
                                    className="w-full p-3 bg-black border border-zinc-700 rounded-r-lg text-sm text-gray-300 font-mono focus:ring-1 focus:ring-orange-600 outline-none" required
                                />
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-1">Sin mayúsculas ni acentos. Se corrige automáticamente al salir.</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                                    {previewMode ? 'Vista Previa (Como quedará en la web)' : 'Contenido (Markdown)'}
                                </label>
                                {/* Toolbar */}
                                <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                                    {!previewMode && (
                                        <>
                                            <button type="button" onClick={() => insertFormat('**', '**')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Negrita (Cmd+B)">
                                                <Bold className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => insertFormat('*', '*')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Cursiva (Cmd+I)">
                                                <Italic className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-600 mx-1"></div>
                                            <button type="button" onClick={() => insertFormat('\n# ', '\n')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Título 1">
                                                <Heading1 className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => insertFormat('\n## ', '\n')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Título 2">
                                                <Heading2 className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => insertFormat('\n### ', '\n')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Título 3">
                                                <Heading3 className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-600 mx-1"></div>
                                            <button type="button" onClick={() => insertFormat('- ')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Lista">
                                                <List className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => insertFormat('[', '](url)')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Enlace (Cmd+K)">
                                                <Link2 className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => insertFormat('\n---\n')} className="p-1.5 hover:bg-zinc-700 text-gray-400 hover:text-white rounded" title="Divisor">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-600 mx-1"></div>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode(!previewMode)}
                                        className={`p-1.5 rounded flex items-center gap-2 transition-colors ${previewMode ? 'bg-orange-600 text-white' : 'hover:bg-zinc-700 text-gray-400 hover:text-white'}`}
                                        title={previewMode ? "Volver a Editar" : "Ver Vista Previa"}
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-xs font-bold px-1">{previewMode ? 'Editar' : 'Previsualizar'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                {isUploading && (
                                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded animate-pulse z-20">Subiendo imagen...</div>
                                )}

                                {previewMode ? (
                                    <div className="w-full p-8 bg-white border border-zinc-800 rounded-lg min-h-[600px] overflow-y-auto">
                                        <div className="prose prose-lg max-w-none font-raleway text-gray-800 leading-loose 
                                            prose-headings:font-playfair prose-headings:font-bold prose-headings:text-das-dark
                                            prose-p:mb-8 prose-p:leading-8 prose-p:text-lg
                                            prose-li:marker:text-das-accent
                                            prose-img:rounded-sm prose-img:w-full prose-img:my-12 prose-img:shadow-sm
                                            prose-a:text-das-accent prose-a:no-underline prose-a:border-b prose-a:border-das-accent/30 hover:prose-a:border-das-accent hover:prose-a:text-das-accent/80 transition-all
                                            prose-blockquote:border-l-4 prose-blockquote:border-das-accent prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:font-playfair prose-blockquote:text-2xl prose-blockquote:text-das-dark
                                            first-letter:float-left first-letter:text-6xl first-letter:pr-4 first-letter:font-playfair first-letter:font-bold first-letter:text-das-dark first-letter:-mt-2
                                        ">
                                            <ReactMarkdown
                                                components={{
                                                    h2: ({ node, ...props }) => <h2 className="text-3xl mt-16 mb-8 tracking-tight font-playfair" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-2xl mt-12 mb-6 font-playfair" {...props} />,
                                                    p: ({ node, ...props }) => <div className="mb-8 leading-8 text-lg" {...props} />,
                                                    img: ({ node, ...props }) => (
                                                        <figure className="my-12">
                                                            <img className="w-full rounded-sm shadow-sm" {...props} />
                                                            {props.alt && <figcaption className="text-center text-sm text-gray-500 mt-4 font-barlow uppercase tracking-widest">{props.alt}</figcaption>}
                                                        </figure>
                                                    ),
                                                }}
                                            >
                                                {formData.content || '_Nada para previsualizar..._'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        ref={textareaRef}
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        onPaste={async (e) => {
                                            const items = e.clipboardData.items;
                                            const html = e.clipboardData.getData('text/html');

                                            // 1. Handle Images
                                            for (const item of items) {
                                                if (item.type.indexOf('image') === 0) {
                                                    e.preventDefault();
                                                    const file = item.getAsFile();
                                                    if (!file) return;

                                                    try {
                                                        setIsUploading(true);
                                                        const cursorPos = e.currentTarget.selectionStart;
                                                        const textBefore = formData.content.substring(0, cursorPos);
                                                        const textAfter = formData.content.substring(cursorPos);

                                                        const placeholder = `\n![Subiendo imagen...]()...\n`;
                                                        const newContent = textBefore + placeholder + textAfter;
                                                        setFormData(prev => ({ ...prev, content: newContent }));

                                                        const fileExt = file.name.split('.').pop() || 'png';
                                                        const fileName = `paste-${Math.random().toString(36).substring(2)}.${fileExt}`;
                                                        const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
                                                        if (error) throw error;
                                                        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);

                                                        setFormData(prev => ({ ...prev, content: prev.content.replace(placeholder, `\n![Imagen](${data.publicUrl})\n`) }));
                                                    } catch (err) { alert('Error: ' + err); }
                                                    finally { setIsUploading(false); }
                                                    return;
                                                }
                                            }

                                            // 2. HTML to Markdown
                                            if (html) {
                                                e.preventDefault();
                                                const turndown = (node: ChildNode): string => {
                                                    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
                                                    if (node.nodeType !== Node.ELEMENT_NODE) return '';
                                                    const el = node as HTMLElement;
                                                    let content = '';
                                                    el.childNodes.forEach(child => content += turndown(child));
                                                    switch (el.tagName.toLowerCase()) {
                                                        case 'h1': return `\n# ${content}\n\n`;
                                                        case 'h2': return `\n## ${content}\n\n`;
                                                        case 'h3': return `\n### ${content}\n\n`;
                                                        case 'p': return `${content}\n\n`;
                                                        case 'strong': case 'b': return `**${content}**`;
                                                        case 'em': case 'i': return `*${content}*`;
                                                        case 'li': return `- ${content.trim()}\n`;
                                                        case 'a': return `[${content}](${(el as HTMLAnchorElement).href})`;
                                                        case 'br': return '\n';
                                                        default: return content;
                                                    }
                                                };
                                                const doc = new DOMParser().parseFromString(html, 'text/html');
                                                const markdown = turndown(doc.body).trim();
                                                const start = e.currentTarget.selectionStart;
                                                const before = formData.content.substring(0, start);
                                                const after = formData.content.substring(start);
                                                setFormData(prev => ({ ...prev, content: before + markdown + after }));
                                            }
                                        }}
                                        className="w-full p-6 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-orange-600 focus:border-orange-600 outline-none min-h-[600px] font-mono text-sm leading-relaxed text-gray-300 resize-none"
                                        placeholder="# Escribe aquí..." required
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Extracto</label>
                        <textarea
                            name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3}
                            className="w-full p-3 bg-black border border-zinc-700 rounded-lg focus:ring-1 focus:ring-orange-600 outline-none text-gray-300"
                            placeholder="Resumen SEO..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Settings Panel (Status, Image, SEO) - Kept same logic */}
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600">Publicación</h3>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Estado</label>
                            <div className="relative">
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-black border border-zinc-700 rounded-lg appearance-none text-gray-300 outline-none">
                                    <option value="draft">🟡 Borrador</option>
                                    <option value="published">🟢 Publicado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl space-y-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600">Imagen</h3>
                        {formData.featured_image ? (
                            <div className="relative group rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-black">
                                <img src={formData.featured_image} className="w-full h-full object-cover" />
                                <button onClick={() => setFormData(p => ({ ...p, featured_image: '' }))} type="button" className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white"><X className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${dragActive ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700'}`}
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => document.getElementById('img-up')?.click()}>
                                <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                <span className="text-xs text-gray-400">Click o Arrastrar</span>
                                <input id="img-up" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                            </div>
                        )}
                        <input type="text" name="featured_image" value={formData.featured_image} onChange={handleChange} className="w-full p-2 bg-black border border-zinc-700 rounded text-xs text-gray-300" placeholder="https://..." />
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600 mb-4">SEO</h3>
                        <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="w-full p-3 bg-black border border-zinc-700 rounded mb-4 text-xs text-white" placeholder="Título SEO" />
                        <textarea name="seo_description" value={formData.seo_description} onChange={handleChange} className="w-full p-3 bg-black border border-zinc-700 rounded text-xs text-white" placeholder="Meta Descripción" />
                    </div>
                </div>
            </div>
        </form>
    );
}
