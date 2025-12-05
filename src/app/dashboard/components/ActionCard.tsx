import { FileText, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ActionCardProps {
    title: string;
    date: string;
    status: string;
    id: string;
    hasFeedback?: boolean;
}

export default function ActionCard({ title, date, status, id, hasFeedback }: ActionCardProps) {
    return (
        <Link href={`/dashboard/posts?edit=${id}`} className="block">
            <div className={`group relative bg-white border rounded-xl p-5 transition-all shadow-sm hover:shadow-md cursor-pointer mb-3 ${hasFeedback ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 hover:border-orange-300'}`}>
                {/* Indicador lateral naranja al hover */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-opacity ${hasFeedback ? 'bg-amber-500 opacity-100' : 'bg-orange-500 opacity-0 group-hover:opacity-100'}`}></div>

                <div className="flex justify-between items-center">
                    <div className="flex items-start gap-4">
                        {/* Icono */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${hasFeedback ? 'bg-amber-100 text-amber-600' : 'bg-orange-50 text-orange-600'}`}>
                            <FileText size={18} />
                        </div>

                        {/* Contenido */}
                        <div>
                            <h4 className="font-bold text-gray-900 text-md group-hover:text-orange-600 transition-colors line-clamp-1">
                                {title || "Borrador sin título"}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${status === 'changes_requested' ? 'bg-amber-100 text-amber-800 border-amber-200' : hasFeedback ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                                    {(status === 'changes_requested' || hasFeedback) ? 'Tienes Feedback' : 'Revisión Pendiente'}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar size={12} /> {date}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botón de Acción (Call to Action) */}
                    <div className="hidden sm:block">
                        <button className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2">
                            Revisar <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
