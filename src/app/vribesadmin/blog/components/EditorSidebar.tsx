import { X, UploadCloud, ChevronRight } from 'lucide-react';

interface EditorSidebarProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleImageUpload: (file: File) => void;
    isUploading: boolean;
    setFormData: any;
}

export default function EditorSidebar({
    formData,
    handleChange,
    handleImageUpload,
    isUploading,
    setFormData
}: EditorSidebarProps) {
    return (
        <div className="w-full h-full p-5 space-y-4 flex flex-col bg-zinc-950">

            {/* Status */}
            <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Estado</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-800 rounded outline-none text-xs font-medium text-zinc-300 focus:border-zinc-700 transition-colors"
                >
                    <option value="draft">🟡 Borrador</option>
                    <option value="published">🟢 Publicado</option>
                </select>
            </div>

            {/* Cover Image */}
            <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Portada</label>
                {formData.featured_image ? (
                    <div className="relative group rounded border border-zinc-800 aspect-video bg-black overflow-hidden">
                        <img 
                            src={formData.featured_image} 
                            className="w-full h-full object-cover opacity-80" 
                            style={{ display: 'block' }}
                        />
                        <button
                            onClick={() => setFormData((p: any) => ({ ...p, featured_image: '' }))}
                            type="button"
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600/80 p-1 rounded-full text-white transition-all"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div className="border border-dashed border-zinc-800 rounded p-4 text-center cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group"
                        onClick={() => document.getElementById('sidebar-img-up')?.click()}>
                        <UploadCloud className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 mx-auto mb-1 transition-colors" />
                        <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 font-medium font-inter">Subir Portada</span>
                        <input id="sidebar-img-up" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                    </div>
                )}
            </div>

            {/* Excerpt */}
            <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Extracto</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded outline-none text-xs text-zinc-400 placeholder-zinc-700 resize-none focus:border-zinc-700"
                    placeholder="Descripción..."
                />
            </div>

            {/* URL Slug */}
            <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Slug</label>
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-800 rounded outline-none text-[10px] font-mono text-zinc-500 focus:border-zinc-700"
                />
            </div>

            <div className="pt-2 border-t border-zinc-800/50">
                <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 py-1">
                        <span>Avanzado</span>
                        <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="pt-2 space-y-2">
                        <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-400 outline-none" placeholder="SEO Title" />
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-400 outline-none" placeholder="Tags" />
                    </div>
                </details>
            </div>

        </div>
    );
}
