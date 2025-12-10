import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { createPortalSession } from "../actions";

export default async function SubscriptionPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const profile = profileData as any;

    if (!profile) {
        return <div>Error cargando perfil</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="font-poppins font-bold text-xl text-das-dark uppercase tracking-wider">
                    Suscripción y Pagos
                </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Current Plan Card */}
                <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-1">Plan Actual</h3>
                            <p className="text-2xl font-bold text-das-dark capitalize">{profile.plan_tier || 'Sin Plan'}</p>
                        </div>
                        {profile.subscription_status === 'active' ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Activo
                            </span>
                        ) : profile.subscription_status === 'past_due' ? (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Impago
                            </span>
                        ) : (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                                {profile.subscription_status || 'Inactivo'}
                            </span>
                        )}
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Renovación</span>
                            <span className="font-medium">
                                {profile.current_period_end
                                    ? new Date(profile.current_period_end).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Método de Pago</span>
                            <span className="font-medium flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" /> •••• 4242
                            </span>
                        </div>
                    </div>

                    <form action={createPortalSession}>
                        <button
                            type="submit"
                            className="w-full bg-das-dark text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-sm flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-4 h-4" /> Gestionar Suscripción
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-3">
                            Serás redirigido al portal seguro de Stripe
                        </p>
                    </form>
                </div>

                {/* Invoices / History Placeholder */}
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-bold uppercase text-gray-600 mb-2">Historial de Facturación</h3>
                    <p className="text-xs text-gray-500 max-w-xs">
                        Puedes descargar todas tus facturas y ver el historial completo desde el portal de gestión.
                    </p>
                </div>
            </div>
        </div>
    );
}
