import { api } from './api';
import {
    CompanyVariable,
    CreateCompanyVariablePayload,
    UpdateCompanyVariablePayload,
} from '../interfaces/CompanyVariable.ts';

const endpoint = '/company-variables';

const toFormData = (payload: Record<string, any>): FormData => {
    const fd = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === 'value' && value instanceof File) {
            fd.append('value', value); // binary
        } else if (typeof value === 'object') {
            // If the object has no values, we skip it
            if (Object.keys(value).length === 0) return;
            fd.append(key, JSON.stringify(value)); // arrays / objects
        } else {
            fd.append(key, value as string | Blob);
        }
    });

    return fd;
};

/* --------------------------------------------------------------- */
/* API calls                                                       */
/* --------------------------------------------------------------- */

/** GET /company-variables – collection for the current company */
export async function getCompanyVariables(): Promise<CompanyVariable[]> {
    const { data } = await api.get<{ data: CompanyVariable[] }>(endpoint);
    return data.data;
}

/** GET /company-variables/{uuid} */
export async function getCompanyVariable(uuid: string): Promise<CompanyVariable> {
    const { data } = await api.get<{ data: CompanyVariable }>(`${endpoint}/${uuid}`);
    return data.data;
}

/** POST /company-variables */
export async function createCompanyVariable(
    payload: CreateCompanyVariablePayload,
): Promise<CompanyVariable> {
    const body =
        payload.type === 'image' && payload.value instanceof File
            ? toFormData(payload)
            : payload;

    const config =
        body instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;

    const { data } = await api.post<{ data: CompanyVariable }>(endpoint, body, config);
    return data.data;
}

export async function updateCompanyVariable(
    uuid: string,
    payload: UpdateCompanyVariablePayload,
): Promise<CompanyVariable> {
    const body =
        (payload.type ?? '') === 'image' && payload.value instanceof File
            ? toFormData(payload)
            : payload;

    const config =
        body instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;

    const { data } = await api.post<{ data: CompanyVariable }>(`${endpoint}/${uuid}`, body, config);
    return data.data;
}

/** DELETE /company-variables/{uuid} */
export async function deleteCompanyVariable(uuid: string): Promise<void> {
    await api.delete(`${endpoint}/${uuid}`);
}
