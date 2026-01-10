'use client';

import { useState, useRef, useEffect } from 'react';
import { BillingClient, BillingSettings, InvoiceData, InvoiceItem } from '@/types/billing';
import InvoiceTemplate from './InvoiceTemplate';
import { Printer, Download, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

/*
  IMPORTANT: Since I cannot install 'react-to-print' without user permission/npm run, 
  I will assume the user has to install it OR I will implement a raw window.print() approach.
  However, the goal is simplicity. 'react-to-print' is standard.
  I'll verify 'package.json' again. It was NOT there.
  I will implement standard window.print() with a CSS trick:
  @media print { body * { visibility: hidden; } #invoice-preview, #invoice-preview * { visibility: visible; } #invoice-preview { position: absolute; left: 0; top: 0; } }
  
  Actually, creating an iframe or a new window is safer to avoid messing up the UI.
  Or simpler: Use a "Print Mode" route?
  
  Let's use the CSS class "print:block" vs "print:hidden" on the layout. 
  It requires wrapping the entire ADMIN LAYOUT with print:hidden, which is hard from here.
  
  Better approach: A dedicated "Preview/Print" button that opens the invoice in a new clean window for printing.
  OR: Just simple styles.
  I will stick to the implementation plan: "Navegador nativo". 
  
  I will add a `style` tag for print media query inject.
*/

export default function InvoiceForm({
    clients,
    settings,
    initialData
}: {
    clients: BillingClient[],
    settings: BillingSettings | null,
    initialData?: InvoiceData | null
}) {
    const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData || {
        client: null,
        items: [{ id: '1', description: 'Servicios de Consultoría', quantity: 1, unit_price: 1500 }],
        currency: 'EUR',
        tax_rate: 0,
        discount_rate: 0,
        number: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`.padStart(8, '0'), // Simple auto-number
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    // Handle Client Change
    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        const client = clients.find(c => c.id === clientId) || null;
        setInvoiceData(prev => ({ ...prev, client }));
    };

    // Handle Items
    const addItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { id: Math.random().toString(), description: '', quantity: 1, unit_price: 0 }]
        }));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setInvoiceData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeItem = (id: string) => {
        setInvoiceData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    // Print Handler
    const handlePrint = () => {
        window.print();
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { saveInvoice } = await import('@/app/actions/billing');
            await saveInvoice(invoiceData);
            alert('Factura guardada correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al guardar la factura');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body > *:not(.print-only-container) {
                        display: none !important;
                    }
                    .print-only-container {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>

            {/* LEFT: Editor Form */}
            <div className="w-full lg:w-1/3 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden h-full print:hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-500" />
                        Editar Datos
                    </h2>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded text-xs font-bold transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'GUARDANDO...' : 'GUARDAR BORRADOR'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Nº Factura</label>
                            <input
                                value={invoiceData.number}
                                onChange={e => setInvoiceData({ ...invoiceData, number: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-white text-sm"
                            />
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Fecha de Emisión</label>
                                <input
                                    type="date"
                                    value={invoiceData.date}
                                    onChange={e => setInvoiceData({ ...invoiceData, date: e.target.value })}
                                    className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-white text-sm"
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs uppercase font-bold text-gray-500 mb-2 block border-t border-zinc-800 pt-4 mt-2">Periodo de Facturación (Opcional)</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-600 mb-1 block">Inicio</label>
                                    <input
                                        type="date"
                                        value={invoiceData.period_start || ''}
                                        onChange={e => setInvoiceData({ ...invoiceData, period_start: e.target.value })}
                                        className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-600 mb-1 block">Fin</label>
                                    <input
                                        type="date"
                                        value={invoiceData.period_end || ''}
                                        onChange={e => setInvoiceData({ ...invoiceData, period_end: e.target.value })}
                                        className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Selector */}
                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">Cliente</label>
                        <select
                            className="w-full bg-black/40 border border-zinc-700 rounded p-3 text-white"
                            onChange={handleClientChange}
                            value={invoiceData.client?.id || ''}
                        >
                            <option value="">-- Seleccionar Cliente --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="mt-2 text-xs text-right">
                            <a href="/vribesadmin/billing/clients/create" className="text-orange-500 hover:text-orange-400 font-bold">+ Nuevo Cliente</a>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-3 block flex justify-between">
                            <span>Conceptos</span>
                            <span className="text-gray-600 font-normal">({invoiceData.currency})</span>
                        </label>
                        <div className="space-y-4">
                            {invoiceData.items.map((item, index) => (
                                <div key={item.id} className="bg-black/20 p-3 rounded border border-zinc-800 group hover:border-zinc-700 transition-colors">
                                    <div className="flex justify-between mb-2">
                                        <input
                                            placeholder="Descripción..."
                                            value={item.description}
                                            onChange={e => updateItem(item.id, 'description', e.target.value)}
                                            className="bg-transparent text-white w-full border-b border-transparent focus:border-zinc-600 outline-none text-sm font-medium"
                                        />
                                        <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-20">
                                            <input
                                                type="number"
                                                placeholder="Cant"
                                                value={item.quantity}
                                                onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                                                className="w-full bg-black/40 border border-zinc-800 rounded p-1 text-white text-xs text-center"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                placeholder="Precio Unitario"
                                                value={item.unit_price}
                                                onChange={e => updateItem(item.id, 'unit_price', Number(e.target.value))}
                                                className="w-full bg-black/40 border border-zinc-800 rounded p-1 text-white text-xs text-right"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addItem} className="w-full py-2 border border-dashed border-zinc-700 text-gray-500 hover:text-white hover:border-gray-500 rounded text-sm flex items-center justify-center gap-2 transition-all">
                                <Plus className="w-4 h-4" /> Añadir Concepto
                            </button>
                        </div>
                    </div>

                    {/* Totals Config */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Moneda</label>
                            <select
                                value={invoiceData.currency}
                                onChange={e => setInvoiceData({ ...invoiceData, currency: e.target.value as any })}
                                className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-white text-sm"
                            >
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Descuento (%)</label>
                            <input
                                type="number"
                                value={invoiceData.discount_rate || 0}
                                onChange={e => setInvoiceData({ ...invoiceData, discount_rate: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-white text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">Notas Adicionales</label>
                        <textarea
                            value={invoiceData.notes}
                            onChange={e => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                            placeholder="Términos de pago, agradecimientos..."
                            className="w-full bg-black/40 border border-zinc-700 rounded p-3 text-white text-sm h-20 resize-none"
                        />
                    </div>

                </div>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="mb-4 flex justify-between items-center print:hidden">
                    <h2 className="text-gray-400 font-display font-medium text-sm uppercase tracking-widest pl-2">Vista Previa (A4)</h2>
                    <button
                        onClick={handlePrint}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <Printer className="w-4 h-4" />
                        IMPRIMIR / PDF
                    </button>
                </div>

                {/* Scrollable Preview Area */}
                <div className="flex-1 overflow-y-auto bg-gray-900/50 rounded-xl p-8 flex justify-center print:hidden">
                    {/* Scaled Invoice Container */}
                    <div className="w-[210mm] shadow-2xl origin-top transform scale-75 md:scale-90 lg:scale-[0.8] xl:scale-100 transition-transform duration-300">
                        <InvoiceTemplate data={invoiceData} settings={settings} />
                    </div>
                </div>

                {/* Print Only Container */}
                <div className="print-only-container hidden">
                    <InvoiceTemplate data={invoiceData} settings={settings} />
                </div>
            </div>
        </div>
    );
}
