export interface Tag {
    uuid: string;
    name: string;
    color: string | null;  // e.g. "#F87171" or null
    created_at: string;
}