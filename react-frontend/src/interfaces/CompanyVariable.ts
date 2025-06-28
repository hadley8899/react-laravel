export interface CompanyVariable {
    uuid: string;
    company_id: number;
    friendly_name?: string | null;
    key: string;
    value: string;
    type?: string | null;
    meta?: Record<string, any> | null;
    can_be_deleted: boolean;
    created_at: string;
    updated_at: string;
}

/* ----------------------------------------------------------
   Convenience payload types for create / update operations
---------------------------------------------------------- */
export type CreateCompanyVariablePayload = Pick<
    CompanyVariable,
    'key' | 'value'
> & {
    friendly_name?: string | null;
    type?: string | null;
    meta?: Record<string, any> | null;
};

export type UpdateCompanyVariablePayload = Partial<
    Omit<CompanyVariable, 'uuid' | 'company_id' | 'created_at' | 'updated_at'>
>;
