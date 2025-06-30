export interface CreateCompanyVariablePayload {
    key: string;
    value: string | File;
    friendly_name: string;
    type: string | null;
    meta: Record<string, any>;
}

export interface UpdateCompanyVariablePayload {
    value?: string | File;
    friendly_name?: string;
    type?: string | null;
    meta?: Record<string, any>;
}

/* Unchanged: shape coming back from the API */
export interface CompanyVariable {
    uuid: string;
    company_id: number;
    key: string;
    value: string;
    friendly_name: string;
    type: string | null;
    meta: Record<string, any> | null;
    can_be_deleted: boolean;
}
