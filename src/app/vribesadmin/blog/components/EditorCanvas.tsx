import { useEffect, useRef } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import EditorBubbleMenu from './EditorBubbleMenu';

interface EditorCanvasProps {
    editor: Editor | null;
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    deviceMode: 'desktop' | 'mobile';
}

export default function EditorCanvas({ editor, formData, handleChange, deviceMode }: EditorCanvasProps) {
    const widthClass = deviceMode === 'mobile' ? 'max-w-[400px]' : 'max-w-4xl';
    const titleRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div 
            className={`mx-auto transition-all duration-300 ease-in-out ${widthClass} pb-24 px-8 md:px-0 relative`}
            style={{ paddingTop: '120px' }}
        >

            {/* Optional Cover Image (Notion style) */}
            {formData.featured_image && (
                <div className="mb-12 h-40 md:h-64 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group relative">
                    <img 
                        src={formData.featured_image} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                        alt="Header Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            )}

            {editor && <EditorBubbleMenu editor={editor} />}

            {/* Document Header (Title) */}
            <div className="mb-12 group relative grid">
                <div
                    className="invisible pointer-events-none whitespace-pre-wrap break-words text-3xl md:text-5xl font-bold font-inter leading-tight px-0 min-h-[1.2em]"
                    style={{ gridArea: '1 / 1 / 2 / 2' }}
                    aria-hidden="true"
                >
                    {formData.title || 'Título del Artículo...'}
                </div>

                <textarea
                    ref={titleRef}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    rows={1}
                    className="w-full bg-transparent border-none outline-none text-3xl md:text-5xl font-bold text-white placeholder-zinc-800 font-inter leading-tight resize-none overflow-hidden break-words whitespace-pre-wrap px-0 absolute inset-0 h-full"
                    style={{ gridArea: '1 / 1 / 2 / 2' }}
                    placeholder="Título del Artículo..."
                    autoComplete="off"
                />
            </div>

            {/* Editor Area */}
            <div className="prose prose-lg prose-invert max-w-none 
                selection:bg-orange-500/60 selection:text-white
                prose-headings:font-inter prose-headings:font-bold prose-headings:text-white
                prose-h2:!text-3xl prose-h2:!mt-12 prose-h2:!mb-4 prose-h2:!font-bold prose-h2:!leading-tight
                prose-h3:!text-2xl prose-h3:!mt-8 prose-h3:!mb-3 prose-h3:!font-semibold prose-strong:text-white prose-strong:font-bold
                prose-p:text-[#D4D4D4] prose-p:leading-8 prose-p:font-normal
                prose-a:text-orange-500 prose-a:font-bold prose-a:underline prose-a:underline-offset-4 prose-a:decoration-2
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                focus:outline-none"
            >
                <EditorContent editor={editor} />
            </div>

            <div className="h-32"></div>
        </div>
    );
}
