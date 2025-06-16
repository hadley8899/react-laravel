import {Company} from "./Company.ts";

export default interface User {
    uuid: string;
    name: string;
    email: string;
    avatar_url: string;
    phone: string | null;
    status: 'active' | 'inactive' | 'pending' | 'invited' | 'rejected';
    company: Company;
    notify_new_booking: boolean;
    notify_job_complete: boolean;
    preferred_theme: 'light' | 'dark' | 'system';
    role: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
}
