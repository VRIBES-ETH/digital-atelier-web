import { Calendar } from "lucide-react";
import Link from "next/link";

interface ScheduledPostsWidgetProps {
    userId: string;
    scheduledPosts: any[]; // Or define proper type
}

export default function ScheduledPostsWidget({ userId, scheduledPosts }: ScheduledPostsWidgetProps) {
    const hasPosts = scheduledPosts && scheduledPosts.length > 0;

    if (!hasPosts) {
        // Option B: Show empty state (preferred for "Agenda de Salida" context)
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Agenda de Salida</h4>
                </div>
                <div className="text-center py-4">
                    <p className="text-xs text-gray-400 italic">No hay posts en cola de salida</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Agenda de Salida</h4>
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 font-bold">PRÓXIMOS</span>
            </div>

            <div className="space-y-5 relative pl-2">
                {/* Línea vertical decorativa */}
                <div className="absolute left-[4px] top-2 bottom-4 w-[1px] bg-gray-100"></div>

                {scheduledPosts.map((post) => (
                    <div key={post.id} className="flex gap-3 relative z-10 bg-white">
                        <div className="flex flex-col items-center pt-1">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm bg-green-500"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between">
                                <p className="text-xs text-gray-500 font-medium">
                                    {new Date(post.scheduled_for).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-[10px] font-bold text-gray-900 bg-gray-100 px-1.5 rounded">
                                    {new Date(post.scheduled_for).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
                                {post.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <Link href="/dashboard/calendar" className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-wide transition-colors">
                    Ver Calendario Completo
                </Link>
            </div>
        </div>
    );
}
