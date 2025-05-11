export interface InvoiceItem {
    uuid?: string;
    invoice_id?: number;
    invoice_uuid?: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    amount: number;
    created_at?: string;
    updated_at?: string;
}
