import { getClients, deleteClient } from '@/app/actions/billing';
import { Plus, Edit2, Trash2, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function BillingClientsPage() {
    const clients = await getClients();

    return (
        <div className="w-full min-h-screen bg-zinc-950 p-10 font-sans text-gray-200">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <Link href="/vribesadmin/billing" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-display text-white tracking-tight">Cartera de Clientes</h1>
                        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Gestiona tus clientes para facturación rápida</p>
                    </div>
                </div>

                <Link
                    href="/vribesadmin/billing/clients/create"
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-900/20 font-bold tracking-wide text-sm"
                >
                    <Plus className="w-4 h-4" />
                    NUEVO CLIENTE
                </Link>
            </div>

            <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 border-b border-zinc-800">
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest">Nombre / Razón Social</th>
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest">ID Fiscal</th>
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest">Email</th>
                                <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center text-gray-600 flex flex-col items-center justify-center gap-4">
                                        <Users className="w-12 h-12 opacity-20" />
                                        <p>No hay clientes registrados.</p>
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-black/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="font-bold text-white text-lg">{client.name}</div>
                                            {client.address && <div className="text-xs text-gray-500 mt-1 line-clamp-1">{client.address}</div>}
                                        </td>
                                        <td className="p-6 text-gray-400 font-mono text-sm">
                                            {client.tax_id || '-'}
                                        </td>
                                        <td className="p-6 text-gray-400 text-sm">
                                            {client.email || '-'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/vribesadmin/billing/clients/${client.id}`}
                                                    className="p-2 hover:bg-zinc-800 text-blue-400 hover:text-blue-300 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteClient(client.id);
                                                    revalidatePath('/vribesadmin/billing/clients');
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 hover:bg-red-900/20 text-red-500 hover:text-red-400 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    // Add confirm check in real app, simplistic for now
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
