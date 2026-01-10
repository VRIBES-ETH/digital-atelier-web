import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Link2, Heading2, Heading3, List, Check, X, Unlink } from 'lucide-react';

interface EditorBubbleMenuProps {
    editor: Editor;
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateBubble = () => {
            if (isEditingLink) return;

            const { selection } = editor.state;
            const { empty, from, to } = selection;

            if (empty || !editor.isEditable) {
                setShow(false);
                return;
            }

            try {
                const { view } = editor;
                const start = view.coordsAtPos(from);
                const end = view.coordsAtPos(to);
                const left = (start.left + end.left) / 2;
                const top = start.top - 10;

                setCoords({ top, left });
                setShow(true);
            } catch (e) {
                setShow(false);
            }
        };

        const handleOpenLink = () => {
            setLinkUrl(editor.getAttributes('link').href || '');
            setIsEditingLink(true);
        };

        editor.on('selectionUpdate', updateBubble);
        editor.on('transaction', updateBubble);
        // @ts-ignore
        editor.on('openLinkUi', handleOpenLink);

        const handleBlur = (e: any) => {
            setTimeout(() => {
                if (menuRef.current && menuRef.current.contains(document.activeElement)) return;
                if (!isEditingLink) setShow(false);
            }, 150);
        };

        editor.on('blur', handleBlur);

        return () => {
            editor.off('selectionUpdate', updateBubble);
            editor.off('transaction', updateBubble);
            // @ts-ignore
            editor.off('openLinkUi', handleOpenLink);
            editor.off('blur', handleBlur);
        };
    }, [editor, isEditingLink]);

    useEffect(() => {
        if (isEditingLink && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditingLink]);

    const handleSetLink = () => {
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            let url = linkUrl;
            if (!/^https?:\/\//i.test(url) && !/^#/.test(url) && !/^mailto:/.test(url)) {
                url = 'https://' + url;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        setIsEditingLink(false);
        setShow(false);
    };

    const handleUnlink = () => {
        editor.chain().focus().unsetLink().run();
        setIsEditingLink(false);
        setShow(false);
    };

    if (!show) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-[100] flex items-center gap-0.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-150"
            style={{
                top: coords.top,
                left: coords.left,
                transform: 'translate(-50%, -100%)',
                marginTop: '-8px'
            }}
            onMouseDown={(e) => {
                if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault();
            }}
        >
            {!isEditingLink ? (
                <>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive('bold') ? 'bg-zinc-800 text-white' : ''}`}
                        title="Negrita"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive('italic') ? 'bg-zinc-800 text-white' : ''}`}
                        title="Cursiva"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-800 text-white' : ''}`}
                        title="Título 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-zinc-800 text-white' : ''}`}
                        title="Título 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-800 text-white' : ''}`}
                        title="Lista de Viñetas"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    <button
                        onClick={() => {
                            setLinkUrl(editor.getAttributes('link').href || '');
                            setIsEditingLink(true);
                        }}
                        className={`p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive('link') ? 'bg-zinc-800 text-white' : ''}`}
                        title="Enlace"
                    >
                        <Link2 className="w-4 h-4" />
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-1 px-1">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Pegar enlace..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSetLink();
                            if (e.key === 'Escape') {
                                setIsEditingLink(false);
                                editor.commands.focus();
                            }
                        }}
                        className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 w-44 px-1 py-1"
                    />
                    <button
                        onClick={handleSetLink}
                        className="p-1 hover:bg-zinc-800 rounded text-green-500 transition-colors"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </button>
                    {editor.isActive('link') && (
                        <button
                            onClick={handleUnlink}
                            className="p-1 hover:bg-zinc-800 rounded text-red-500 transition-colors"
                        >
                            <Unlink className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsEditingLink(false);
                            editor.commands.focus();
                        }}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-500 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
