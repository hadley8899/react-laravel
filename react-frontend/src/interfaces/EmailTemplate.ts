import User from './User';

export interface EmailTemplate {
    uuid: string;
    name: string;
    type: 'builder' | 'html';
    subject: string | null;
    preview_text: string | null;
    layout_json: Record<string, unknown>[];
    html_source: string | null;
    html_cached: string | null;
    text_cached: string | null;
    created_at: string;
    updated_at: string;
    creator?: User;
}
