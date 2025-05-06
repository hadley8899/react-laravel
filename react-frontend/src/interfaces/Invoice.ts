export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
}

export interface Invoice {
    uuid: string;
    invoice_number: string;
    customer_id: number;
    company_id: number;
    customer?: Customer;
    issue_date: string;
    due_date: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
    status: InvoiceStatus;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface InvoiceListResponse {
    data: Invoice[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    }
}
