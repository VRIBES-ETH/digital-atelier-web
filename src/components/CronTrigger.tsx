"use client";

import { useState } from "react";
import { runScheduledPublishing } from "@/app/admin/actions";
import { Play, Loader2 } from "lucide-react";

export default function CronTrigger() {
    const [isLoading, setIsLoading] = useState(false);

    const handleRun = async () => {
        if (!confirm("¿Ejecutar publicación programada ahora? Esto buscará posts programados vencidos y los publicará.")) return;

        setIsLoading(true);
        const result = await runScheduledPublishing();
        setIsLoading(false);

        alert(result.message);
        if (result.success) {
            window.location.reload();
        }
    };

    return (
        <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-700 transition-colors"
            title="Ejecutar Cron Job manualmente"
        >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            Forzar Publicación
        </button>
    );
}
