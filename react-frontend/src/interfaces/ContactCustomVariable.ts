export interface ContactCustomVariable {
    uuid: string;
    friendly_name: string;
    key: string;          // already prefixed with CUSTOMER.
    type: 'text' | 'image';
    meta?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}
