export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface Invoice {
    id: string; // e.g., "INV-001"
    customerId: number; // Link back to customer ID
    customerName: string; // Denormalized for easy display
    issueDate: string; // Format: YYYY-MM-DD
    dueDate: string; // Format: YYYY-MM-DD
    amount: number;
    status: InvoiceStatus;
}
