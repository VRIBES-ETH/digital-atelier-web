import Link from 'next/link';
import { getAllPostsAdmin, deletePost } from '@/app/actions/blog';
import { Plus, Edit2, Trash2, ExternalLink, FileText, Clock, CheckCircle } from 'lucide-react';
import DeployButton from './DeployButton';

export default async function AdminBlogPage() {
    const posts = await getAllPostsAdmin();

    return (
        <div className="p-10 font-sans text-gray-200">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white tracking-tight">Gestión del Blog</h1>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Crea, edita y gestiona tus artículos</p>
                </div>
                <div className="flex gap-4">
                    <DeployButton />
                    <Link
                        href="/vribesadmin/blog/create"
                        className="btn bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-900/20 font-bold tracking-wide text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        NUEVO ARTÍCULO
                    </Link>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 border-b border-zinc-800">
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest">Título</th>
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest">Estado</th>
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest">Fecha</th>
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center text-gray-600 flex flex-col items-center justify-center gap-4">
                                        <FileText className="w-12 h-12 opacity-20" />
                                        <p>No hay artículos todavía. ¡Crea el primero!</p>
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-black/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="font-bold text-white text-lg">{post.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 font-mono">/{post.slug}</div>
                                        </td>
                                        <td className="p-6">
                                            {post.status === 'published' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                                    <CheckCircle className="w-3 h-3" /> Publicado
                                                </span>
                                            )}
                                            {post.status === 'ready' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse-slow">
                                                    <Clock className="w-3 h-3" /> Listo para publicar
                                                </span>
                                            )}
                                            {post.status === 'draft' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-gray-400 border border-zinc-700">
                                                    Borrador
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6 text-sm text-gray-400 font-mono">
                                            {new Date(post.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {post.status === 'published' && (
                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                        title="Ver en vivo"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/vribesadmin/blog/${post.id}`}
                                                    className="p-2 hover:bg-zinc-800 text-blue-400 hover:text-blue-300 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <form action={async () => {
                                                    'use server';
                                                    await deletePost(post.id);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 hover:bg-red-900/20 text-red-500 hover:text-red-400 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
