export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string; // Optional phone number
    address: string;
    registeredDate: string; // Format: YYYY-MM-DD
    status: 'Active' | 'Inactive' | 'Prospect'; // Example statuses
    totalSpent: number; // Example metric
    avatarUrl?: string; // Optional avatar image URL
}
