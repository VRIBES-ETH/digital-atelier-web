export interface BillingClient {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    company_name?: string | null;
    tax_id: string | null;
    address: string | null;
    email: string | null;
    notes: string | null;
}

export interface BillingSettings {
    id: string;
    org_name: string;
    org_address: string | null;
    org_tax_id: string | null;
    logo_url: string | null;
    payment_details: PaymentDetails | null;
}

export interface PaymentDetails {
    bank_name?: string;
    iban?: string;
    swift?: string;
    paypal_email?: string;
    crypto_token?: string;
    crypto_network?: string;
    wallet_address?: string;
    [key: string]: any;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
}

export interface InvoiceData {
    client: BillingClient | null;
    items: InvoiceItem[];
    currency: 'EUR' | 'USD' | 'GBP'; // Restrict to valid currencies for safety, or just string.
    tax_rate: number; // Percentage (e.g. 21 for 21%)
    discount_rate?: number; // New: Percentage discount
    number: string; // "2024-001"
    date: string; // Issue Date
    period_start?: string;
    period_end?: string;
    due_date?: string;
    notes?: string;
}

export interface BillingInvoice {
    id: string;
    created_at: string;
    updated_at: string;
    number: string;
    date: string;
    due_date?: string | null;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    client_id: string | null;
    client_snapshot: BillingClient | null;
    items: InvoiceItem[];
    currency: string;
    tax_rate: number;
    discount_rate: number;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    notes: string | null;
}
