'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditorTopBar from './components/EditorTopBar';
import EditorCanvas from './components/EditorCanvas';
import EditorSidebar from './components/EditorSidebar';
import CustomShortcuts from './components/CustomShortcuts';
import EditorBubbleMenu from './components/EditorBubbleMenu';
import SlashMenu, { SlashCommandItem } from './components/SlashMenu';
import { uploadToSupabase } from '@/lib/supabase-client';

export default function BlogEditor({ post }: { post?: any }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
    const [slashQuery, setSlashQuery] = useState('');

    const [formData, setFormData] = useState({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        featured_image: post?.featured_image || '',
        category: post?.category || 'Market Intelligence',
        status: post?.status || 'draft',
        seo_title: post?.seo_title || '',
        seo_description: post?.seo_description || '',
        tags: post?.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '',
        contributor_name: post?.contributor_name || '',
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                codeBlock: false,
                heading: { levels: [2, 3] }
            }),
            BulletList.configure({
                HTMLAttributes: { class: 'list-disc ml-6 space-y-2' },
            }),
            ListItem,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-das-accent underline cursor-pointer' }
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full h-auto my-8 shadow-lg border border-zinc-800' },
            }),
            Placeholder.configure({ placeholder: 'Escribe algo increíble...' }),
            Markdown,
            CustomShortcuts,
        ],
        content: formData.content,
        editorProps: {
            attributes: {
                class: 'outline-none h-full min-h-[500px] prose prose-lg prose-invert max-w-none selection:bg-orange-500 selection:text-white',
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItem = items.find(item => item.type.startsWith('image'));

                if (imageItem) {
                    const file = imageItem.getAsFile();
                    if (file) {
                        event.preventDefault();
                        uploadToSupabase(file).then(url => {
                            view.dispatch(view.state.tr.replaceSelectionWith(
                                view.state.schema.nodes.image.create({ src: url })
                            ));
                        }).catch(err => alert("Error al subir imagen: " + err.message));
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image')) {
                        event.preventDefault();
                        uploadToSupabase(file).then(url => {
                            const { schema } = view.state;
                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                            const node = schema.nodes.image.create({ src: url });
                            const transaction = view.state.tr.insert(coordinates?.pos || view.state.selection.from, node);
                            view.dispatch(transaction);
                        }).catch(err => alert("Error al subir imagen: " + err.message));
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            const { selection } = editor.state;
            const { $from } = selection;
            const parentText = $from.parent.textContent;

            if (parentText.startsWith('/') && $from.parent.type.name === 'paragraph') {
                const start = editor.view.coordsAtPos($from.pos);
                setSlashMenuPos({ top: start.top + 24, left: start.left });
                setSlashQuery(parentText.slice(1).toLowerCase());
                setShowSlashMenu(true);
            } else {
                if (showSlashMenu) setShowSlashMenu(false);
            }
        },
        immediatelyRender: false,
    });

    const sanitizeSlug = (text: string) => {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'slug') { setFormData(prev => ({ ...prev, slug: value })); return; }
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'title' && !post && !formData.slug) {
            setFormData(prev => ({ ...prev, slug: sanitizeSlug(value) }));
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const url = await uploadToSupabase(file);
            setFormData(prev => ({ ...prev, featured_image: url }));
        } catch (error) { alert('Upload Error: ' + error); }
        finally { setIsUploading(false); }
    };

    const handleSlashSelect = (item: SlashCommandItem) => {
        if (!editor) return;
        const { $from } = editor.state.selection;
        const textBefore = $from.parent.textContent;
        const slashPos = $from.pos - textBefore.length;

        editor.chain().focus().command(({ tr, dispatch }) => {
            if (dispatch) {
                tr.delete(slashPos, $from.pos);
            }
            return true;
        }).run();

        item.command(editor);
        setShowSlashMenu(false);
    };

    const handleSubmit = async (forcedStatus?: 'draft' | 'ready' | 'published') => {
        if (!formData.slug) { alert('Slug requerido'); return; }
        setIsSaving(true);

        let content = formData.content;
        if (editor && (editor.storage as any).markdown) {
            content = (editor.storage as any).markdown.getMarkdown();
        }

        // IMPROVED STATUS LOGIC: 
        // If article is 'published', clicking Save (forcedStatus='draft') preserves 'published'.
        // This ensures the article doesn't disappear from the site while editing.
        let currentStatus = forcedStatus || formData.status;
        if (formData.status === 'published' && forcedStatus === 'draft') {
            currentStatus = 'published';
        }

        const data = new FormData();
        const { tags, status, ...rest } = formData;
        const tagArray = tags.split(',').map((t: string) => t.trim()).filter(Boolean);

        Object.entries({
            ...rest,
            content,
            status: currentStatus,
            tags: JSON.stringify(tagArray)
        }).forEach(([key, val]) => data.append(key, val as string));

        if (post) {
            data.append('_action', 'update');
            data.append('id', post.id);
        } else {
            data.append('_action', 'create');
        }

        try {
            const res = await fetch('/api/admin/blog', { method: 'POST', body: data });
            const result = await res.json();
            if (result.success) {
                if (currentStatus === 'ready' && formData.status !== 'published') {
                    alert('¡Artículo guardado como LISTO!\nAhora puedes pulsar "Publicar en Vivo" en el panel principal para que el artículo pase a PUBLICADO y se vea en la web.');
                }
                router.push('/vribesadmin/blog');
                router.refresh();
            }
            else { alert(result.message); }
        } catch (e) { alert('Error: ' + e); }
        finally { setIsSaving(false); }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 overflow-x-hidden">
            <EditorTopBar
                isSaving={isSaving}
                onSave={() => handleSubmit('draft')}
                onPublish={() => handleSubmit('ready')}
                status={formData.status}
                isNew={!post}
                showSidebar={showSidebar}
                toggleSidebar={() => setShowSidebar(!showSidebar)}
                deviceMode={deviceMode}
                toggleDeviceMode={() => setDeviceMode(deviceMode === 'desktop' ? 'mobile' : 'desktop')}
            />

            <main className={`transition-all duration-300 pt-16 min-h-screen ${showSidebar ? 'pr-[300px]' : 'pr-0'}`}>
                <div className="max-w-5xl mx-auto">
                    <EditorCanvas
                        editor={editor}
                        formData={formData}
                        handleChange={handleChange}
                        deviceMode={deviceMode}
                    />
                </div>
                <SlashMenu
                    show={showSlashMenu}
                    position={slashMenuPos}
                    query={slashQuery}
                    onSelect={handleSlashSelect}
                    onClose={() => setShowSlashMenu(false)}
                />
            </main>

            <aside
                className={`fixed right-0 bottom-0 bg-zinc-950 border-l border-zinc-800 z-40 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
                style={{
                    width: '300px',
                    minWidth: '300px',
                    maxWidth: '300px',
                    top: '64px'
                }}
            >
                <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                    <EditorSidebar
                        formData={formData}
                        handleChange={handleChange}
                        handleImageUpload={handleImageUpload}
                        isUploading={isUploading}
                        setFormData={setFormData}
                    />
                </div>
            </aside>
        </div>
    );
}
