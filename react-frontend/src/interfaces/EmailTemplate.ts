import User from './User';

/** Matches the JSON returned by the templates endpoints */
export interface EmailTemplate {
    uuid: string;
    name: string;
    subject: string | null;
    preview_text: string | null;
    layout_json: Record<string, unknown>[]; // Array of section blocks
    html_cached: string | null;
    text_cached: string | null;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
    creator?: User;
}
