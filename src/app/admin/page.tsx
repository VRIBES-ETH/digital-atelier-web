import { Clock, Filter, Users, FileText, DollarSign, TrendingUp } from "lucide-react";
import { getAdminStats, getReviewQueue } from "./actions";
import Link from "next/link";

export default async function AdminDashboard() {
    const { stats } = await getAdminStats();
    const { data: reviewQueue } = await getReviewQueue();

    const pendingCount = reviewQueue?.length || 0;

    return (
        <div className="space-y-8">

            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Cola de Revisión */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><Clock size={18} /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Cola de Revisión</p>
                </div>

                {/* Clientes Activos */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users size={18} /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.activeClients || 0}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Clientes Activos</p>
                </div>

                {/* Posts Publicados */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-green-50 text-green-600"><FileText size={18} /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.postsPublished || 0}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Posts Publicados</p>
                </div>

                {/* MRR */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><DollarSign size={18} /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${(stats?.mrr || 0).toLocaleString()}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">MRR Actual</p>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Cola de Revisión Global</h2>
                    <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={14} /> Filtros
                    </button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4 w-1/3">Post / Contexto</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Entrega</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reviewQueue?.map((post: any) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <div className="flex items-center gap-3">
                                        {post.profiles?.linkedin_picture_url ? (
                                            <img src={post.profiles.linkedin_picture_url} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {post.profiles?.full_name?.substring(0, 2).toUpperCase() || 'CL'}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold">{post.profiles?.full_name || 'Desconocido'}</div>
                                            <div className="text-xs text-gray-400 font-normal">{post.profiles?.company_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-700 font-medium line-clamp-2">{post.content}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide bg-purple-50 text-purple-700 border-purple-100">
                                        {post.profiles?.plan_tier || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pendiente
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString() : 'Sin fecha'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <Link
                                            href={`/admin/content?postId=${post.id}`}
                                            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                                        >
                                            Revisar
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!reviewQueue || reviewQueue.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Clock size={32} className="opacity-20" />
                                        <p>No hay posts pendientes de revisión</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

