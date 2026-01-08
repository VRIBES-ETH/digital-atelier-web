import { getClients, getBillingSettings } from '@/app/actions/billing';
import InvoiceForm from '../components/InvoiceForm';

export default async function CreateInvoicePage() {
    const clients = await getClients();
    const settings = await getBillingSettings();

    return (
        <div className="p-6 h-screen font-sans text-gray-200 overflow-hidden print:p-0 print:h-auto print:overflow-visible bg-zinc-950">
            <InvoiceForm clients={clients} settings={settings} />
        </div>
    );
}
