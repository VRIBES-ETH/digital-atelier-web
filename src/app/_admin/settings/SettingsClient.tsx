"use client";

import { useState } from "react";
import { CreditCard, Wallet, Copy, ExternalLink, Settings, Save, Loader2, CheckCircle } from 'lucide-react';
import { updateAppSettings } from "../actions";

interface SettingsClientProps {
    initialSettings: {
        usdc_erc20_wallet: string;
        usdc_polygon_wallet: string;
        usdc_solana_wallet: string;
        stripe_product_copilot: string;
        stripe_product_seed: string;
        stripe_product_growth: string;
        stripe_product_authority: string;
    };
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const result = await updateAppSettings(formData);

        setIsLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <form action={handleSubmit} className="space-y-8 relative">
            {/* Global Message Toast */}
            {message && (
                <div className={`fixed top-20 right-8 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <Settings size={20} />}
                    <span className="font-bold text-sm">{message.text}</span>
                </div>
            )}

            {/* 1. SECCIÓN FACTURACIÓN FIAT (STRIPE) */}
            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Planes y Facturación (Stripe)</h2>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Guardar
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <ProductCard
                        name="Co-Pilot ($25)"
                        type="entry"
                        fieldName="stripeCopilot"
                        defaultValue={initialSettings.stripe_product_copilot}
                        placeholder="prod_..."
                    />
                    <ProductCard
                        name="Seed ($500)"
                        type="core"
                        fieldName="stripeSeed"
                        defaultValue={initialSettings.stripe_product_seed}
                        placeholder="prod_..."
                    />
                    <ProductCard
                        name="Growth ($900)"
                        type="core"
                        fieldName="stripeGrowth"
                        defaultValue={initialSettings.stripe_product_growth}
                        placeholder="prod_..."
                    />
                    <ProductCard
                        name="Authority ($1500)"
                        type="core"
                        fieldName="stripeAuthority"
                        defaultValue={initialSettings.stripe_product_authority}
                        placeholder="prod_..."
                    />
                </div>
                <div className="mt-4 flex gap-3">
                    <a href="https://dashboard.stripe.com/products" target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-600 hover:text-orange-600 flex items-center gap-1">
                        <ExternalLink size={12} /> Ir al Dashboard de Stripe
                    </a>
                </div>
            </section>

            {/* 2. SECCIÓN BILLETERAS CRYPTO */}
            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={20} /></div>
                        <div>
                            <h3 className="font-bold text-gray-900">Billeteras Corporativas (Cobros USDC)</h3>
                            <p className="text-xs text-gray-500">Direcciones públicas para compartir con clientes.</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Guardar
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <WalletInput
                        label="USDC (Ethereum / ERC-20)"
                        name="usdcErc20"
                        defaultValue={initialSettings.usdc_erc20_wallet}
                        onCopy={() => copyToClipboard(initialSettings.usdc_erc20_wallet)}
                    />
                    <WalletInput
                        label="USDC (Polygon)"
                        name="usdcPolygon"
                        defaultValue={initialSettings.usdc_polygon_wallet}
                        onCopy={() => copyToClipboard(initialSettings.usdc_polygon_wallet)}
                    />
                    <WalletInput
                        label="USDC (Solana)"
                        name="usdcSolana"
                        defaultValue={initialSettings.usdc_solana_wallet}
                        onCopy={() => copyToClipboard(initialSettings.usdc_solana_wallet)}
                    />
                </div>
            </section>

            {/* 3. ESTADO DE INTEGRACIONES */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> LinkedIn API
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">App ID</span>
                            <span className="font-mono text-gray-900">8675...a2b</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Operativo</span>
                        </div>
                    </div>
                </div>
            </section>
        </form>
    );
}

// Componentes Helper
const ProductCard = ({ name, type, fieldName, defaultValue, placeholder }: { name: string, type: 'entry' | 'core', fieldName: string, defaultValue: string, placeholder: string }) => (
    <div className="bg-white border border-gray-200 p-4 rounded-lg hover:border-orange-300 transition-all group relative">
        <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${type === 'entry' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                {type === 'entry' ? 'Entry Level' : 'Core'}
            </span>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-orange-600" />
        </div>
        <p className="font-bold text-gray-900 mb-2">{name}</p>
        <input
            type="text"
            name={fieldName}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full text-xs text-gray-600 font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
        />
    </div>
);

const WalletInput = ({ label, name, defaultValue, onCopy }: { label: string, name: string, defaultValue: string, onCopy: () => void }) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
        <div className="flex gap-2">
            <input
                type="text"
                name={name}
                defaultValue={defaultValue}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:ring-1 focus:ring-orange-500 outline-none"
            />
            <button
                type="button"
                onClick={onCopy}
                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-orange-600 hover:border-orange-300"
                title="Copiar"
            >
                <Copy size={16} />
            </button>
        </div>
    </div>
);
