import {api} from './api';
import {Invoice} from '../interfaces/Invoice';
import {PaginatedResponse} from '../interfaces/PaginatedResponse';

/* ---------- types ---------- */
export interface InvoiceItemInput {
    description: string;
    quantity: number;
    unit?: string | null;
    unit_price: number;
    amount: number;
}

export type CreateInvoicePayload = {
    customer_uuid: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    tax_rate: number;
    subtotal: number;
    tax_amount: number;
    total: number;
    status: 'Draft' | 'Pending' | 'Paid' | 'Overdue';
    notes?: string;
    items: InvoiceItemInput[];
};

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>;

/* ---------- API calls ---------- */
export async function getInvoices(
    page = 1,
    perPage = 10,
    searchTerm = '',
    sortBy = 'created_at',
    sortDirection: 'asc' | 'desc' = 'desc',
) {
    const {data} = await api.get<PaginatedResponse<Invoice>>('/invoices', {
        params: {
            page,
            per_page: perPage,
            search: searchTerm || undefined,
            sort_by: sortBy,
            sort_direction: sortDirection,
        },
    });
    return data;
}

export async function getInvoice(uuid: string) {
    const {data} = await api.get<{ data: Invoice }>(`/invoices/${uuid}`);
    return data.data;
}

export async function createInvoice(payload: CreateInvoicePayload) {
    const {data} = await api.post<{ data: Invoice }>('/invoices', payload);
    return data.data;
}

export async function updateInvoice(uuid: string, payload: UpdateInvoicePayload) {
    const {data} = await api.put<{ data: Invoice }>(`/invoices/${uuid}`, payload);
    return data.data;
}

export async function deleteInvoice(uuid: string) {
    await api.delete(`/invoices/${uuid}`);
}

export async function downloadInvoicePdf(uuid: string) {
    const {data} = await api.get(`/invoices/${uuid}/pdf`, {responseType: 'blob'});
    return data;
}
