"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { syncPostMetrics } from "../actions";

export default function SyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);

    async function handleSyncMetrics() {
        setIsSyncing(true);
        const result = await syncPostMetrics();
        setIsSyncing(false);
        if (result.success) {
            alert(result.message);
        } else {
            alert("Error: " + result.message);
        }
    }

    return (
        <button
            onClick={handleSyncMetrics}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Métricas'}
        </button>
    );
}
