'use server';

import { supabase } from '@/lib/supabase';
import { BillingClient, BillingSettings } from '@/types/billing';
import { revalidatePath } from 'next/cache';

// --- Clients ---

export async function getClients(): Promise<BillingClient[]> {
    const { data, error } = await supabase
        .from('billing_clients')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        // Silent return to avoid console noise on empty tables
        return [];
    }

    return data as BillingClient[];
}

export async function upsertClient(client: Partial<BillingClient>) {
    const { data, error } = await supabase
        .from('billing_clients')
        .upsert(client)
        .select()
        .single();

    if (error) {
        console.error('Error upserting client:', error);
        throw new Error('Failed to save client');
    }

    revalidatePath('/vribesadmin/billing');
    return data as BillingClient;
}

export async function deleteClient(id: string) {
    const { error } = await supabase
        .from('billing_clients')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting client:', error);
        throw new Error('Failed to delete client');
    }

    revalidatePath('/vribesadmin/billing');
}

// --- Settings ---

export async function getBillingSettings(): Promise<BillingSettings | null> {
    const { data, error } = await supabase
        .from('billing_settings')
        .select('*')
        .maybeSingle();

    if (error) {
        // Silent failure for now to avoid console noise if table is missing/empty
        return null;
    }

    // Auto-initialize if missing
    if (!data) {
        const { data: newData, error: insertError } = await supabase
            .from('billing_settings')
            .insert({ org_name: 'Digital Atelier Solutions' })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating default settings:', insertError);
            return null;
        }
        return newData as BillingSettings;
    }

    return data as BillingSettings;
}

export async function updateBillingSettings(settings: Partial<BillingSettings>) {
    // If id exists update, else insert (though migration ensures one row usually)
    // We assume single row logic

    // First get existing ID if any
    const existing = await getBillingSettings();

    let result;
    if (existing) {
        result = await supabase
            .from('billing_settings')
            .update(settings)
            .eq('id', existing.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from('billing_settings')
            .insert(settings)
            .select()
            .single();
    }

    if (result.error) {
        console.error('Error updating settings:', result.error);
        throw new Error('Failed to save settings');
    }

    revalidatePath('/vribesadmin/billing');
    return result.data as BillingSettings;
}

// --- Invoices ---

export async function saveInvoice(data: import('@/types/billing').InvoiceData) {
    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    const discountAmount = data.discount_rate ? (subtotal * data.discount_rate) / 100 : 0;
    const taxableBase = subtotal - discountAmount;
    const taxAmount = (taxableBase * data.tax_rate) / 100;
    const total = taxableBase + taxAmount;

    const payload = {
        number: data.number,
        date: data.date,
        due_date: data.due_date,
        client_id: data.client?.id,
        client_snapshot: data.client, // Save snapshot of client data
        items: data.items,
        currency: data.currency,
        tax_rate: data.tax_rate,
        discount_rate: data.discount_rate || 0,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: total,
        notes: data.notes,
        status: 'draft'
    };

    const { data: invoice, error } = await supabase
        .from('billing_invoices')
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error('Error saving invoice:', error);
        throw new Error('Failed to save invoice');
    }

    revalidatePath('/vribesadmin/billing');
    return invoice;
}

export async function getInvoices() {
    const { data, error } = await supabase
        .from('billing_invoices')
        .select(`
            *,
            client:billing_clients(name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }

    return data;
}

export async function deleteInvoice(id: string) {
    const { error } = await supabase
        .from('billing_invoices')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error('Failed to delete invoice');
    }

    revalidatePath('/vribesadmin/billing');
}

export async function getInvoiceById(id: string) {
    const { data, error } = await supabase
        .from('billing_invoices')
        .select(`
            *,
            client:billing_clients(*)
        `)
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching invoice by id:', JSON.stringify(error, null, 2));
        return null;
    }

    return data;
}
