import { getClients } from '@/app/actions/billing';
import ClientForm from '../components/ClientForm';
import { notFound } from 'next/navigation';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // In a real app we would have getClientById action, 
    // but for MVP we can reuse getClients and find (or make a new action).
    // Let's rely on cached getClients for simplicity or good practice: make a specific query.
    // I'll skip making a new action just for this and fetch all, assuming list is small. 
    // Or better: I'll use Supabase directly here for speed as it is a server component?
    // No, I should respect patterns. 
    // I will use getClients() and find.

    // Wait, refetching all clients? It's fine for < 100 clients.
    const clients = await getClients();
    const client = clients.find(c => c.id === id);

    if (!client) {
        notFound();
    }

    return <ClientForm client={client} />;
}
