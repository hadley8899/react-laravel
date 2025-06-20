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

    default_appointment_duration: number;
    enable_online_booking: boolean;
    send_appointment_reminders: boolean;
    appointment_reminder_timing: string | null; // '1h', '24h', etc., or null
    appointment_buffer_time: number;
    min_booking_notice_hours: number;

    invoice_prefix: string;
    next_invoice_number: number;
    default_payment_terms: 'DueOnReceipt' | 'Net7' | 'Net15' | 'Net30';
    invoice_footer_notes: string | null;
    invoice_footer_notes_html: string | null;
    invoice_footer_notes_markdown: string | null;

    setup_complete: boolean;
    created_at: string;
    updated_at: string;
}
