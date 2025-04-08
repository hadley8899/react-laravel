export interface Customer {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address: string;
    created_at: string;
    status: 'Active' | 'Inactive';
    total_spent: number;
    avatar_url?: string;
}
