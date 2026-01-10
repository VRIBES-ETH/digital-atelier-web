import { ArrowLeft, Loader2, Save, Eye, Smartphone, Monitor, Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface EditorTopBarProps {
    isSaving: boolean;
    onSave: () => void;
    onPublish: () => void;
    status: string;
    isNew: boolean;
    showSidebar: boolean;
    toggleSidebar: () => void;
    deviceMode: 'desktop' | 'mobile';
    toggleDeviceMode: () => void;
}

export default function EditorTopBar({
    isSaving,
    onSave,
    onPublish,
    status,
    isNew,
    showSidebar,
    toggleSidebar,
    deviceMode,
    toggleDeviceMode
}: EditorTopBarProps) {
    const isPublished = status === 'published';
    const isReady = status === 'ready';

    return (
        <div className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
            {/* Left: Back & Branding */}
            <div className="flex items-center gap-4">
                <Link href="/vribesadmin/blog" className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-px bg-zinc-800"></div>
                <span className="text-sm font-bold text-gray-300 tracking-wide uppercase">
                    {isNew ? 'Nuevo Post' : 'Editando'}
                    {isPublished && <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px]">PUBLICADO</span>}
                    {isReady && <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px]">LISTO (PENDIENTE PUSH)</span>}
                </span>
            </div>

            {/* Center: Device Switcher */}
            <div className="flex items-center bg-zinc-900 rounded-full p-1 border border-zinc-800">
                <button
                    onClick={() => deviceMode !== 'desktop' && toggleDeviceMode()}
                    className={`p-2 rounded-full transition-colors ${deviceMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <button
                    onClick={() => deviceMode !== 'mobile' && toggleDeviceMode()}
                    className={`p-2 rounded-full transition-colors ${deviceMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Smartphone className="w-4 h-4" />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors border ${showSidebar ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-500 hover:bg-zinc-900'}`}
                >
                    {showSidebar ? 'Ocultar Panel' : 'Ajustes'}
                </button>

                {!isPublished ? (
                    <>
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="text-gray-400 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Borrador'}
                        </button>
                        <button
                            onClick={onPublish}
                            disabled={isSaving}
                            className={`${isReady ? 'bg-zinc-800 border-blue-500/50 text-blue-400' : 'bg-orange-600 text-white'} px-6 py-2 rounded-full flex items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-50 font-bold text-sm tracking-wide shadow-lg border`}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isReady ? <CheckCircle className="w-4 h-4" /> : <Rocket className="w-4 h-4" />)}
                            {isReady ? 'FIJADO COMO LISTO' : 'LISTO PARA PUBLICAR'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="bg-zinc-800 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-zinc-700 transition-colors disabled:opacity-50 font-bold text-sm tracking-wide border border-zinc-700"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        GUARDAR CAMBIOS
                    </button>
                )}
            </div>
        </div>
    );
}
