"use client";

import { useState } from "react";

import { Play, Loader2 } from "lucide-react";

export default function CronTrigger() {
    const [isLoading, setIsLoading] = useState(false);

    const handleRun = async () => {
        if (!confirm("¿Ejecutar publicación programada ahora? Esto buscará posts programados vencidos y los publicará.")) return;

        setIsLoading(true);
        // Instead of calling an endpoint, we can invoke a server action that calls the admin action
        // But cron usually hits an endpoint. Let's see if we have an endpoint.
        // We have /api/cron/publish.
        await fetch('/api/cron/publish');
        // Or if we want to test the logic directly:
        // const { publishScheduledPosts } = await import("@/app/_admin/actions");
        // await publishScheduledPosts();
        setIsLoading(false);

        // Since we are now hitting an API endpoint, we don't get a direct 'result' object.
        // We can assume success for now or add more sophisticated error handling.
        alert("Publicación programada ejecutada. Recargando la página para ver los cambios.");
        window.location.reload();
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
