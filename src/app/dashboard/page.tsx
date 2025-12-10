"use client";

import { ArrowUpRight, Clock, CheckCircle, AlertCircle, Linkedin, Zap, Calendar, FileText, BarChart3, Plus } from "lucide-react";
import { getDashboardSummary } from "./actions";
import Link from "next/link";
import ScheduledPostsWidget from "./components/ScheduledPostsWidget";
import ActionCard from "./components/ActionCard";
import IdeasWidget from "./components/IdeasWidget";
import IdeaModalWrapper from "./components/IdeaModalWrapper";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardHome() {
    const searchParams = useSearchParams();
    const userIdParam = searchParams.get("userId");

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await getDashboardSummary(userIdParam || undefined);
                if (res && !res.error) {
                    setData(res);
                }
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [userIdParam]);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-64 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { profile, postsStats, pendingPosts, scheduledPosts, ideas, targetUserId } = data;
    const firstName = profile?.full_name?.split(' ')[0] || 'Usuario';

    return (
        <div className="space-y-8">
            {/* Welcome & Context */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Buenos días, {firstName}.</h2>
                <p className="text-gray-500">
                    Tienes <strong className="text-orange-600">{postsStats.pending} posts</strong> esperando tu aprobación para mantener tu racha.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI 1: Pending */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <Clock size={20} />
                        </div>
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Prioridad Alta</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{postsStats.pending}</h3>
                    <p className="text-sm text-gray-500 font-medium">Pendientes de Revisión</p>
                </div>

                {/* KPI 2: Published */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% vs mes pasado</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{postsStats.published}</h3>
                    <p className="text-sm text-gray-500 font-medium">Posts Publicados</p>
                </div>

                {/* KPI 3: Engagement */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">LinkedIn Avg</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">--%</h3>
                    <p className="text-sm text-gray-500 font-medium">Engagement Rate</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Action Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Zap size={18} className="text-orange-500" fill="currentColor" />
                            Requiere tu Atención
                        </h3>
                        <Link href="/dashboard/posts" className="text-sm text-orange-600 font-medium hover:underline">Ver todo</Link>
                    </div>

                    <div className="space-y-3">
                        {pendingPosts.length > 0 ? (
                            pendingPosts.map((post: any) => (
                                <ActionCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.content}
                                    date={new Date(post.updated_at).toLocaleDateString()}
                                    status={post.status}
                                    hasFeedback={!!post.feedback_notes}
                                />
                            ))
                        ) : (
                            <div className="mt-8">
                                <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                        <Calendar size={20} />
                                    </div>
                                    <p className="text-gray-900 font-medium">Todo limpio por aquí</p>
                                    <p className="text-sm text-gray-500 mb-4">Tus próximos borradores aparecerán aquí cuando estén listos.</p>
                                    <IdeaModalWrapper />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Context & Admin */}
                <div className="space-y-6">
                    {/* Account Status Widget */}
                    <div className="bg-[#1A1D21] rounded-xl p-5 text-white border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-8 -mt-8 blur-xl"></div>

                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Tu Nivel</p>
                                <p className="text-xl font-bold text-white tracking-tight">{profile?.plan_tier || 'AUTHORITY'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                                <Zap size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Scheduled Posts Widget */}
                    <ScheduledPostsWidget userId={targetUserId} scheduledPosts={scheduledPosts} />

                    {/* Ideation Bucket / Upcoming Topics */}
                    <IdeasWidget ideas={ideas} />

                </div>
            </div>
        </div>
    );
}
