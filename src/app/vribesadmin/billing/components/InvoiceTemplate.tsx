import { InvoiceData } from "@/types/billing";
import { BillingSettings } from "@/types/billing";
/* eslint-disable @next/next/no-img-element */

export default function InvoiceTemplate({ data, settings }: { data: InvoiceData, settings: BillingSettings | null }) {
    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    const discountAmount = data.discount_rate ? (subtotal * data.discount_rate) / 100 : 0;
    const taxableBase = subtotal - discountAmount;
    const taxAmount = (taxableBase * data.tax_rate) / 100;
    const total = taxableBase + taxAmount;

    // Formatting
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const day = d.getDate();
        const month = d.toLocaleDateString('es-ES', { month: 'long' });
        const year = d.getFullYear();
        return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    return (
        <div id="invoice-preview" className="bg-white text-black w-full min-h-[297mm] p-16 md:p-20 relative font-sans flex flex-col justify-between selection:bg-orange-100 selection:text-orange-900">

            {/* TOP SECTION */}
            <div>
                {/* Header */}
                <header className="flex justify-between items-start mb-16">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2 text-black">Factura</h1>
                        <p className="text-xl text-gray-500 font-mono tracking-tight uppercase mb-8">{data.number}</p>

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wide mb-1 text-black">Fecha de emisión:</h3>
                            <p className="font-medium text-sm capitalize text-gray-800">
                                {formatDate(data.date)}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        {settings?.logo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={settings.logo_url} alt="Logo" className="w-32 h-auto object-contain" />
                        ) : (
                            <div className="w-32 h-32 bg-black flex items-center justify-center text-white font-bold text-2xl tracking-tighter ml-auto">
                                DAS
                            </div>
                        )}
                    </div>
                </header>

                {/* Date / Period */}
                {/* Period (Optional) */}
                {(data.period_start && data.period_end) && (
                    <div className="mb-16">
                        <h3 className="text-xs font-bold uppercase tracking-wide mb-1">Periodo de Facturación:</h3>
                        <p className="font-medium text-sm capitalize text-gray-800">
                            {formatDate(data.period_start)} - {formatDate(data.period_end)}
                        </p>
                    </div>
                )}

                {/* Addresses: Two Columns */}
                <div className="grid grid-cols-2 gap-12 mb-20">
                    {/* Issuer (Left) */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Emisor</h4>
                        <div className="font-bold text-sm uppercase mb-1">{settings?.org_name || 'DIGITAL ATELIER SOLUTIONS'}</div>
                        <div className="text-xs font-mono mb-4 text-gray-500">{settings?.org_tax_id}</div>

                        <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                            {settings?.org_address}
                        </div>
                    </div>

                    {/* Client (Right) */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Cliente</h4>
                        {data.client ? (
                            <>
                                <div className="font-bold text-sm uppercase mb-1">{data.client.company_name || data.client.name}</div>
                                <div className="text-xs font-mono mb-4 text-gray-500">{data.client.tax_id}</div>
                                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                    {data.client.address}
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-300 italic">Seleccione cliente...</div>
                        )}
                    </div>
                </div>

                {/* Services Table (Minimalist) */}
                <div className="mb-12">
                    <div className="bg-gray-50 px-4 py-2 mb-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest">Servicios</h3>
                    </div>

                    <div className="space-y-4">
                        {data.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                                <div className="text-sm text-gray-800 max-w-[70%]">
                                    {item.description}
                                    {item.quantity > 1 && <span className="text-gray-400 text-xs ml-2">(x{item.quantity})</span>}
                                </div>
                                <div className="font-mono text-sm font-medium">
                                    {formatCurrency(item.quantity * item.unit_price)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-end mt-12 mb-20 border-t border-gray-200 pt-6">
                    <div className="text-right">
                        {data.discount_rate && data.discount_rate > 0 ? (
                            <>
                                <div className="flex items-center gap-12 justify-end mb-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-mono text-gray-500">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex items-center gap-12 justify-end mb-4 border-b border-gray-100 pb-2">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Descuento ({data.discount_rate}%)</span>
                                    <span className="text-sm font-mono text-red-500">-{formatCurrency(discountAmount)}</span>
                                </div>
                            </>
                        ) : null}

                        <div className="flex items-center gap-12 justify-end mb-2">
                            <span className="font-bold text-sm text-black">Total</span>
                            <span className="font-bold text-2xl font-mono tracking-tight">{formatCurrency(total)}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-sm ml-auto">Operación no sujeta a IVA. Prestación de servicios B2B. Art. 44 Directiva 2006/112/CE.</p>
                    </div>
                </div>

                <div className="text-center mb-12">
                    {data.notes && (
                        <p className="text-red-800 font-bold text-lg uppercase tracking-wide">{data.notes}</p>
                    )}
                </div>

                {/* BOTTOM SECTION: Footer Info */}
                <div className="grid grid-cols-3 gap-8 text-xs pt-8 border-t border-gray-100">

                    {/* Bank Details */}
                    <div>
                        <h5 className="font-bold text-black mb-2">Detalles Bancarios:</h5>
                        <div className="text-gray-600 space-y-1">
                            {settings?.payment_details?.bank_name && <p>{settings.payment_details.bank_name}</p>}
                            {settings?.payment_details?.iban && <p>Cuenta: {settings.payment_details.iban}</p>}
                            {settings?.payment_details?.swift && <p>Routing Number (ABA): {settings.payment_details.swift}</p>}
                        </div>
                    </div>

                    {/* Crypto Details (Specific Request) */}
                    <div>
                        <h5 className="font-bold text-black mb-2">Detalles Cripto:</h5>
                        <div className="text-gray-600 space-y-1">
                            {(settings?.payment_details?.crypto_token || settings?.payment_details?.crypto_network) ? (
                                <p>{settings?.payment_details?.crypto_token} / {settings?.payment_details?.crypto_network}:</p>
                            ) : (
                                <p>ETH / USDC (No configurado):</p>
                            )}
                            <p className="font-mono text-[10px] break-all">{settings?.payment_details?.wallet_address || '0x...'}</p>
                            <p className="text-[10px] text-gray-400 mt-1 leading-tight">*Solo enviar fondos mediante la red especificada.</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h5 className="font-bold text-black mb-2">Datos de Contacto:</h5>
                        <div className="text-gray-600 space-y-1">
                            <p>vribes@digitalateliersolutions.agency</p>
                            <p>+1 307 254 9137</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
