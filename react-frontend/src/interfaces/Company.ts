export interface Company {
    uuid: string;
    name: string;
    slug: string;
    address?: string | null;
    phone?: string | null;
    email: string;
    website?: string | null;
    status: 'Active' | 'Inactive' | 'Pending';
    logo_url?: string | null;
    logo_path?: string;
    country?: string | null;
    timezone?: string | null;
    currency?: string | null;
    tax_id?: string | null;
    registration_number?: string | null;
    industry?: string | null;
    plan?: string | null;
    trial_ends_at?: string | null;
    active_until?: string | null;
    locale?: string | null;
    default_units?: 'metric' | 'imperial' | null;
    billing_address?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}
