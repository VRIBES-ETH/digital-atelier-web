'use client';

import { upsertClient } from '@/app/actions/billing';
import { BillingClient } from '@/types/billing';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ClientForm({ client }: { client?: BillingClient }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data: Partial<BillingClient> = {
            id: client?.id,
            name: formData.get('name') as string,
            company_name: formData.get('company_name') as string,
            tax_id: formData.get('tax_id') as string,
            address: formData.get('address') as string,
            email: formData.get('email') as string,
            notes: formData.get('notes') as string,
        };

        if (client?.id) {
            data.id = client.id;
        }

        try {
            await upsertClient(data);
            router.push('/vribesadmin/billing/clients');
            router.refresh();
        } catch (error) {
            alert('Error saving client');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 p-10 font-sans text-gray-200">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/vribesadmin/billing/clients" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-display text-white tracking-tight">
                            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">
                            {client ? `Editando: ${client.name}` : 'Añadir a la base de datos'}
                        </p>
                    </div>
                </div>

                <form action={handleSubmit} className="space-y-8">

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre del Cliente (Contacto) *</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={client?.name}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Empresa (Razón Social)</label>
                                <input
                                    name="company_name"
                                    defaultValue={client?.company_name || ''}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Dirección Fiscal Completa</label>
                                <textarea
                                    name="address"
                                    defaultValue={client?.address || ''}
                                    rows={3}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">NIF / CIF / VAT ID</label>
                                <input
                                    name="tax_id"
                                    defaultValue={client?.tax_id || ''}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email (Facturación)</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={client?.email || ''}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Notas Internas (Privado)</label>
                                <textarea
                                    name="notes"
                                    defaultValue={client?.notes || ''}
                                    placeholder="Notas sobre pagos, contacto, etc."
                                    rows={2}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold tracking-wide flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-900/20 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'GUARDANDO...' : 'GUARDAR CLIENTE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
