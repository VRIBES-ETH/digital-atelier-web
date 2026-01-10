import { getBillingSettings, getClients, getInvoiceById } from '@/app/actions/billing';
import InvoiceForm from '../../components/InvoiceForm';
import { InvoiceData } from '@/types/billing';

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const settings = await getBillingSettings();
    const clients = await getClients();
    const invoice = await getInvoiceById(id);

    if (!invoice) {
        return <div className="p-10 text-white">Factura no encontrada</div>;
    }

    // Adapt DB invoice to InvoiceData type if needed (mostly compatible)
    // We saved it as a flat structure but InvoiceForm expects structured InvoiceData
    // Ideally we align types. Let's cast for now as the shapes are very close.
    // The main difference might be client_snapshot handling.
    // InvoiceForm expects `client` object. `invoice` has `client_snapshot` (jsonb) or we can use `invoice.client` (join).

    // Let's reconstruct InvoiceData from invoice
    const initialData: InvoiceData = {
        number: invoice.number,
        date: invoice.date,
        due_date: invoice.due_date || undefined,
        client: invoice.client_snapshot || (invoice.client as any), // Prefer snapshot
        items: invoice.items,
        currency: invoice.currency as any,
        tax_rate: invoice.tax_rate,
        discount_rate: invoice.discount_rate,
        notes: invoice.notes || '',
        period_start: undefined, // Not typically saved in basic rows yet? Check schema.
        period_end: undefined
    };

    return (
        <div className="p-6 h-screen bg-zinc-950 overflow-hidden">
            <h1 className="text-xl font-bold font-display text-white tracking-tight mb-6 flex items-center gap-2">
                <span className="text-gray-500 font-normal">Editar Factura /</span>
                {invoice.number}
            </h1>
            <InvoiceForm clients={clients} settings={settings} initialData={initialData} />
        </div>
    );
}
