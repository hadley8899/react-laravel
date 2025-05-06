import {api} from './api';
import {Invoice} from '../interfaces/Invoice';
import {PaginatedResponse} from "../interfaces/PaginatedResponse";

export type CreateInvoicePayload = {
    customer_id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    tax_rate?: number;
    status: 'Draft' | 'Pending' | 'Paid' | 'Overdue';
    notes?: string;
    items: Array<{
        description: string;
        quantity: number;
        unit?: string;
        unit_price: number;
    }>;
};

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>;

/**
 * Fetches a paginated list of invoices with optional search.
 */
export async function getInvoices(
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = '',
): Promise<PaginatedResponse<Invoice>> {
    const response = await api.get<PaginatedResponse<Invoice>>('/invoices', {
        params: {
            page,
            per_page: perPage,
            search: searchTerm || undefined,
        }
    });
    return response.data;
}

/**
 * Fetches a single invoice by UUID.
 */
export async function getInvoice(uuid: string): Promise<Invoice> {
    const response = await api.get<{ data: Invoice }>(`/invoices/${uuid}`);
    return response.data.data;
}

/**
 * Creates a new invoice.
 */
export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
    const response = await api.post<{ data: Invoice }>('/invoices', payload);
    return response.data.data;
}

/**
 * Updates an existing invoice.
 */
export async function updateInvoice(uuid: string, payload: UpdateInvoicePayload): Promise<Invoice> {
    const response = await api.put<{ data: Invoice }>(`/invoices/${uuid}`, payload);
    return response.data.data;
}

/**
 * Deletes an invoice.
 */
export async function deleteInvoice(uuid: string): Promise<void> {
    await api.delete(`/invoices/${uuid}`);
}

/**
 * Download invoice as PDF
 */
export async function downloadInvoicePdf(uuid: string): Promise<Blob> {
    const response = await api.get(`/invoices/${uuid}/pdf`, {
        responseType: 'blob',
    });
    return response.data;
}
