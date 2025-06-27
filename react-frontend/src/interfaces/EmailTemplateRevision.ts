import User from './User';

export interface EmailTemplateRevision {
    id: number;
    template_id: number;
    layout_json: Record<string, unknown>[];
    html_cached: string | null;
    text_cached: string | null;
    created_by: number;
    created_at: string;

    creator?: User;
}
