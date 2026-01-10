"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, CornerDownLeft } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string) => void;
};

export default function LinkDialog({ isOpen, onClose, onSubmit }: Props) {
    const [url, setUrl] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setUrl("");
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (url.trim()) {
            onSubmit(url.trim());
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            onClose();
        }
    };

    return (
        // Positioned FIXED relative to the viewport (like a command palette)
        // This prevents scroll jumping and ensures visibility
        <div className="fixed top-32 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            <div className="bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-full shadow-2xl p-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto min-w-[320px]">

                <div className="pl-3 text-zinc-500">
                    <Link2 className="w-4 h-4" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-600 text-sm h-8 w-64 font-sans"
                    placeholder="Pega tu enlace aquí..."
                    autoComplete="off"
                />

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-colors"
                >
                    <CornerDownLeft className="w-4 h-4" />
                </button>
            </div>

            {/* Invisible backdrop to close on click outside */}
            <div
                className="fixed inset-0 z-[-1] cursor-default pointer-events-auto"
                onClick={onClose}
            />
        </div>
    );
}
