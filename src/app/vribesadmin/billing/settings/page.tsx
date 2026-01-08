import { getBillingSettings, updateBillingSettings } from '@/app/actions/billing';
import { supabase } from '@/lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BillingSettings } from '@/types/billing';

export default async function BillingSettingsPage() {
    const settings = await getBillingSettings();

    // Parse payment details if it's JSONB
    const paymentDetails = settings?.payment_details || { bank_name: '', iban: '', swift: '' };

    return (
        <div className="w-full min-h-screen bg-zinc-950 p-10 font-sans text-gray-200">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/vribesadmin/billing" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-display text-white tracking-tight">Configuración de Facturación</h1>
                        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Tus datos fiscales y métodos de cobro</p>
                    </div>
                </div>

                <form action={async (formData) => {
                    'use server';

                    const file = formData.get('logo') as File;
                    let logoUrl = undefined;

                    if (file && file.size > 0) {
                        const filename = `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('billing-assets')
                            .upload(filename, file, {
                                cacheControl: '3600',
                                upsert: false
                            });

                        if (uploadError) {
                            console.error('Error uploading logo:', uploadError);
                            // We don't throw here to allow saving other settings, but we log it.
                        } else {
                            const { data: { publicUrl } } = supabase.storage
                                .from('billing-assets')
                                .getPublicUrl(filename);
                            logoUrl = publicUrl;
                        }
                    }

                    const data: Partial<BillingSettings> = {
                        org_name: (formData.get('org_name') as string) || '',
                        org_address: (formData.get('org_address') as string) || '',
                        org_tax_id: (formData.get('org_tax_id') as string) || '',
                        ...(logoUrl && { logo_url: logoUrl }), // Only update if new logo uploaded
                        payment_details: {
                            bank_name: (formData.get('bank_name') as string) || undefined,
                            iban: (formData.get('iban') as string) || undefined,
                            swift: (formData.get('swift') as string) || undefined,
                            crypto_token: (formData.get('crypto_token') as string) || undefined,
                            crypto_network: (formData.get('crypto_network') as string) || undefined,
                            wallet_address: (formData.get('wallet_address') as string) || undefined,
                        }
                    };

                    await updateBillingSettings(data);
                }} className="space-y-8">

                    {/* Branding Section */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Branding de Factura
                        </h2>
                        <div className="flex items-center gap-8">
                            {settings?.logo_url ? (
                                <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center border border-zinc-700">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={settings.logo_url} alt="Logo Actual" className="max-w-full max-h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-black/40 rounded-lg flex items-center justify-center border border-zinc-800 text-gray-600 text-xs text-center p-2">
                                    Sin Logo
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subir Nuevo Logo</label>
                                <input
                                    type="file"
                                    name="logo"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-all cursor-pointer"
                                />
                                <p className="text-gray-500 text-xs mt-2">Recomendado: PNG o SVG transparente.</p>
                            </div>
                        </div>
                    </div>

                    {/* Organizational Info */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                            Datos del Emisor (Tú)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre / Razón Social</label>
                                <input
                                    name="org_name"
                                    defaultValue={settings?.org_name}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Dirección Completa</label>
                                <textarea
                                    name="org_address"
                                    defaultValue={settings?.org_address || ''}
                                    rows={3}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">NIF / CIF / VAT ID</label>
                                <input
                                    name="org_tax_id"
                                    defaultValue={settings?.org_tax_id || ''}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                            Tradicional (Fiat)
                            <span className="text-xs font-normal text-gray-500 ml-2">(Opcional)</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre Banco</label>
                                <input
                                    name="bank_name"
                                    defaultValue={paymentDetails.bank_name}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">IBAN / Cuenta</label>
                                <input
                                    name="iban"
                                    defaultValue={paymentDetails.iban}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">SWIFT / BIC / Routing</label>
                                <input
                                    name="swift"
                                    defaultValue={paymentDetails.swift}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-zinc-800 pt-8">
                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                            Cripto (Web3)
                            <span className="text-xs font-normal text-gray-500 ml-2">(Opcional)</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Token (Ej: USDC)</label>
                                <input
                                    name="crypto_token"
                                    defaultValue={paymentDetails.crypto_token}
                                    placeholder="USDC"
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Red (Ej: Polygon)</label>
                                <input
                                    name="crypto_network"
                                    defaultValue={paymentDetails.crypto_network}
                                    placeholder="Polygon PoS"
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Wallet Address</label>
                                <input
                                    name="wallet_address"
                                    defaultValue={paymentDetails.wallet_address}
                                    placeholder="0x..."
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold tracking-wide flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-900/20">
                            <Save className="w-5 h-5" />
                            GUARDAR CAMBIOS
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
