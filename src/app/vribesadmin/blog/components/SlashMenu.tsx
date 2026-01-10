import { Heading1, Heading2, Heading3, List, ImageIcon, Code, Minus, Type, ShieldCheck } from 'lucide-react';
import { Editor } from '@tiptap/react';

export interface SlashCommandItem {
    label: string;
    icon: any;
    command: (editor: Editor) => void;
}

interface SlashMenuProps {
    show: boolean;
    position: { top: number; left: number };
    query?: string;
    onSelect: (item: SlashCommandItem) => void;
    onClose: () => void;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
    { label: 'Texto', icon: Type, command: (e) => e.chain().focus().setParagraph().run() },
    { label: 'Título 1', icon: Heading1, command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Título 2', icon: Heading2, command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Título 3', icon: Heading3, command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
    { 
        label: 'Resumen Ejecutivo', 
        icon: ShieldCheck, 
        command: (e) => {
            e.chain().focus()
                .insertContent({
                    type: 'blockquote',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: 'Resumen Ejecutivo: Claves Estratégicas',
                                    marks: [{ type: 'bold' }]
                                }
                            ]
                        },
                        {
                            type: 'paragraph'
                        }
                    ]
                })
                .run();
        }
    },
    { label: 'Lista de Viñetas', icon: List, command: (e) => e.chain().focus().toggleBulletList().run() },
    { label: 'Lista Numerada', icon: List, command: (e) => e.chain().focus().toggleOrderedList().run() },
    { label: 'Bloque de Código', icon: Code, command: (e) => e.chain().focus().toggleCodeBlock().run() },
    { label: 'Línea Divisoria', icon: Minus, command: (e) => e.chain().focus().setHorizontalRule().run() },
];

export default function SlashMenu({ show, position, query = '', onSelect, onClose }: SlashMenuProps) {
    if (!show) return null;

    const filteredItems = SLASH_COMMANDS.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredItems.length === 0) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="absolute z-50 bg-zinc-950/98 backdrop-blur-md border border-zinc-800 rounded-lg shadow-2xl overflow-hidden min-w-[220px] flex flex-col p-1 animate-in fade-in zoom-in-95 duration-100"
                style={{ top: position.top, left: position.left }}
            >
                <div className="text-[10px] uppercase font-bold text-zinc-500 px-3 py-2 border-b border-zinc-800/50 mb-1">
                    Comandos {query ? `- buscando "${query}"` : ''}
                </div>
                {filteredItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(item)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-orange-600 hover:text-white rounded transition-colors text-left group"
                    >
                        <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                        {item.label}
                    </button>
                ))}
            </div>
        </>
    );
}
