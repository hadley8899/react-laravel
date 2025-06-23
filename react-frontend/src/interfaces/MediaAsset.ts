export interface MediaAsset {
    uuid: string;
    directory_uuid: string | null;
    url: string;
    original_name: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    alt: string | null;
    created_at: string;
    updated_at: string;
}