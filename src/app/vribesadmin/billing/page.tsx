import Link from 'next/link';
import { Plus, Users, Settings, FileText, Trash2 } from 'lucide-react';

import { getInvoices, deleteInvoice } from '@/app/actions/billing';

export default async function BillingDashboardPage() {
    const invoices = await getInvoices();

    return (
        <div className="p-10 font-sans text-gray-200 min-h-screen bg-zinc-950">
            <h1 className="text-3xl font-bold font-display text-white tracking-tight mb-2">Facturación</h1>
            <p className="text-gray-500 mb-10 text-sm uppercase tracking-widest">Generador de facturas y gestión de clientes</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Main Action: New Invoice */}
                <Link href="/vribesadmin/billing/create" className="group relative bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-8 shadow-xl hover:shadow-orange-900/30 transition-all flex flex-col justify-between h-48 overflow-hidden">
                    <div className="relative z-10">
                        <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">Nueva Factura</h2>
                        <p className="text-orange-100 text-sm opacity-90">Generar PDF al instante</p>
                    </div>
                    <div className="absolute right-0 bottom-0 text-white/10 transform translate-x-4 translate-y-4">
                        <FileText className="w-32 h-32" />
                    </div>
                </Link>

                {/* Clients */}
                <Link href="/vribesadmin/billing/clients" className="group bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:bg-zinc-800 transition-all flex flex-col justify-between h-48">
                    <div>
                        <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-gray-300 group-hover:text-white transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors mb-1">Clientes</h2>
                        <p className="text-gray-500 text-sm">Gestionar base de datos</p>
                    </div>
                </Link>

                {/* Settings */}
                <Link href="/vribesadmin/billing/settings" className="group bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:bg-zinc-800 transition-all flex flex-col justify-between h-48">
                    <div>
                        <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-gray-300 group-hover:text-white transition-colors">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors mb-1">Configuración</h2>
                        <p className="text-gray-500 text-sm">Mis datos y pagos</p>
                    </div>
                </Link>

            </div>

            {/* Invoices List */}
            <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        Facturas Guardadas
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-zinc-950/50 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="p-4">Número</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-zinc-800/50 transition-colors group">
                                    <td className="p-4 font-mono text-white">{invoice.number}</td>
                                    <td className="p-4">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-white font-medium">
                                        {invoice.client_snapshot?.name || (invoice.client as any)?.name || 'Cliente desconocido'}
                                    </td>
                                    <td className="p-4 text-right font-mono text-white font-bold">
                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: invoice.currency }).format(invoice.total_amount)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${invoice.status === 'paid' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                                            invoice.status === 'sent' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                                                'bg-zinc-800 text-gray-400 border border-zinc-700'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/vribesadmin/billing/edit/${invoice.id}`} className="text-gray-600 hover:text-white transition-colors p-2">
                                                <FileText className="w-4 h-4" />
                                            </Link>

                                            {/* Delete Action Form */}
                                            <form action={async () => {
                                                'use server';
                                                await deleteInvoice(invoice.id);
                                            }}>
                                                <button className="text-gray-600 hover:text-red-500 transition-colors p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
