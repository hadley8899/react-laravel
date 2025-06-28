import { api } from './api';
import {
    CompanyVariable,
    CreateCompanyVariablePayload,
    UpdateCompanyVariablePayload,
} from '../interfaces/CompanyVariable.ts';

/**
 * GET /company-variables
 * Returns a collection (not paginated) of variables for the authenticated user’s company.
 */
export async function getCompanyVariables(): Promise<CompanyVariable[]> {
    const { data } = await api.get<{ data: CompanyVariable[] }>('/company-variables');
    return data.data;
}

/**
 * GET /company-variables/{uuid}
 */
export async function getCompanyVariable(uuid: string): Promise<CompanyVariable> {
    const { data } = await api.get<{ data: CompanyVariable }>(`/company-variables/${uuid}`);
    return data.data;
}

/**
 * POST /company-variables
 */
export async function createCompanyVariable(
    payload: CreateCompanyVariablePayload,
): Promise<CompanyVariable> {
    const { data } = await api.post<{ data: CompanyVariable }>('/company-variables', payload);
    return data.data;
}

/**
 * PUT /company-variables/{uuid}
 */
export async function updateCompanyVariable(
    uuid: string,
    payload: UpdateCompanyVariablePayload,
): Promise<CompanyVariable> {
    const { data } = await api.put<{ data: CompanyVariable }>(`/company-variables/${uuid}`, payload);
    return data.data;
}

/**
 * DELETE /company-variables/{uuid}
 */
export async function deleteCompanyVariable(uuid: string): Promise<void> {
    await api.delete(`/company-variables/${uuid}`);
}
