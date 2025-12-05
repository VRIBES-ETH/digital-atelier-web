import { Lock, Diamond } from 'lucide-react';
import { createClient } from "@/lib/supabase/server";
import AssetGallery from "./components/AssetGallery";

export default async function AssetsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Inicia sesión para ver esta página</div>;
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("plan_tier")
        .eq("id", user.id)
        .single();

    // A. SI ES PLAN CO-PILOT -> MOSTRAR PAYWALL
    if (profile?.plan_tier === 'copilot') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
                    <Diamond size={48} className="text-gray-400" />
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full border-4 border-white">
                        <Lock size={16} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Desbloquea tu Bóveda de Activos</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    Almacena logos, brand books y recursos visuales para agilizar la creación de tus posts.
                    Disponible exclusivamente en planes Seed y superiores.
                </p>
                <button className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/10">
                    Mejorar mi Plan
                </button>
            </div>
        );
    }

    // B. SI ES PREMIUM -> MOSTRAR GALERÍA
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bóveda de Activos</h1>
                <p className="text-gray-500">Gestiona tus recursos visuales y documentos de marca.</p>
            </div>
            <AssetGallery userId={user.id} />
        </div>
    );
}
