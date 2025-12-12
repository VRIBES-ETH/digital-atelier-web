"use server";

import { getPosts, getClients } from "../actions";
import AdminCalendarClient from "@/components/AdminCalendarClient";

export default async function AdminCalendarPage() {
    const { data: posts } = await getPosts();
    const { data: clients } = await getClients();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-poppins font-bold text-2xl text-das-dark">Calendario Global</h2>
                    <p className="text-gray-500 text-sm mt-1">Vista unificada de todos los contenidos de clientes.</p>
                </div>
            </div>

            <AdminCalendarClient posts={posts || []} clients={clients || []} />
        </div>
    );
}
