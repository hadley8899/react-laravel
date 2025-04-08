export interface Customer {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    createdAt: string;
    status: 'Active' | 'Inactive';
    totalSpent: number;
    avatarUrl?: string;
}
