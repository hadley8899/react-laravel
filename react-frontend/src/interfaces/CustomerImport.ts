export interface CustomerImport {
    uuid: string;
    filename: string;
    status: 'draft' | 'processing' | 'finished' | 'failed';
    total_rows: number;
    imported_rows: number;
    failed_rows: number;
    created_at: string;
    started_at: string | null;
    finished_at: string | null;
    meta: Record<string, any> | null;
}