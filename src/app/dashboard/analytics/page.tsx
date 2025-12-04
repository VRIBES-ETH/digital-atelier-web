import { getAnalyticsData } from "../actions";
import { BarChart3, ThumbsUp, MessageSquare, Share2, TrendingUp, Calendar } from "lucide-react";

export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const userId = searchParams?.userId as string | undefined;
    const { success, data } = await getAnalyticsData(userId);

    if (!success || !data) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>No se pudieron cargar los datos de analítica.</p>
            </div>
        );
    }

    const { overview, topPosts, recentPosts } = data;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-poppins text-das-dark">Rendimiento de Contenido</h1>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Últimos 30 días
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-sm"><BarChart3 className="w-5 h-5" /></div>
                    </div>
                    <p className="text-3xl font-bold font-poppins text-das-dark">{overview.totalPosts}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Posts Publicados</p>
                </div>
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-pink-50 text-pink-600 rounded-sm"><ThumbsUp className="w-5 h-5" /></div>
                    </div>
                    <p className="text-3xl font-bold font-poppins text-das-dark">{overview.totalLikes}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Total Reacciones</p>
                </div>
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-sm"><MessageSquare className="w-5 h-5" /></div>
                    </div>
                    <p className="text-3xl font-bold font-poppins text-das-dark">{overview.totalComments}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Total Comentarios</p>
                </div>
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-sm"><TrendingUp className="w-5 h-5" /></div>
                    </div>
                    <p className="text-3xl font-bold font-poppins text-das-dark">{overview.engagementRate}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Engagement Promedio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Performing Posts */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="font-bold text-lg font-poppins text-das-dark">Top Posts</h3>
                    <div className="space-y-4">
                        {topPosts.map((post: any, index: number) => (
                            <div key={post.id} className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-2xl font-bold text-gray-200">#{index + 1}</span>
                                    <p className="text-sm text-gray-600 line-clamp-2 flex-1">{post.content}</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider border-t border-gray-50 pt-3">
                                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes_count}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments_count}</span>
                                    <span className="ml-auto text-[10px] font-normal text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {topPosts.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No hay suficientes datos aún.</p>
                        )}
                    </div>
                </div>

                {/* Recent Performance Table */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg font-poppins text-das-dark">Rendimiento Reciente</h3>
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">Post</th>
                                    <th className="px-6 py-4 text-center">Likes</th>
                                    <th className="px-6 py-4 text-center">Comentarios</th>
                                    <th className="px-6 py-4 text-right">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPosts.map((post: any) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                                            {post.content}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-das-dark">{post.likes_count}</td>
                                        <td className="px-6 py-4 text-center font-bold text-das-dark">{post.comments_count}</td>
                                        <td className="px-6 py-4 text-right text-gray-400 text-xs">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {recentPosts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No hay actividad reciente.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
