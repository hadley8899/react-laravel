export interface Campaign {
    uuid: string;
    subject: string;
    preheader_text?: string;
    status: string;
    scheduled_at?: string | null;
    sent_at?: string | null;
    total_contacts: number;
    template?: {
        uuid: string | null;
        name: string | null;
    };
    from_address?: string;
    reply_to?: string | null;
    created_at: string;
}
