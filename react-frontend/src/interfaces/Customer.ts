export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    createdAt: string;
    status: 'Active' | 'Inactive' | 'Prospect';
    totalSpent: number;
    avatarUrl?: string;
}
