import {api} from './api';
import {PaginatedResponse} from '../interfaces/PaginatedResponse';
import {CustomerImport} from "../interfaces/CustomerImport";

/* ---------- list ---------- */
export async function getCustomerImports(
    page = 1,
    perPage = 25,
): Promise<PaginatedResponse<CustomerImport>> {
    const {data} = await api.get<PaginatedResponse<CustomerImport>>(
        '/customer-imports',
        {params: {page, per_page: perPage}},
    );
    return data;
}

/* ---------- single ---------- */
export async function getCustomerImport(uuid: string): Promise<CustomerImport> {
    const {data} = await api.get<CustomerImport>(`/customer-imports/${uuid}`);
    return data;
}

/* ---------- upload ---------- */
export async function uploadCustomerImport(file: File): Promise<CustomerImport> {
    const form = new FormData();
    form.append('file', file);
    const {data} = await api.post<CustomerImport>(
        '/customer-imports',
        form,
        {headers: {'Content-Type': 'multipart/form-data'}},
    );
    return data;
}

/* ---------- start ---------- */
export async function startCustomerImport(
    uuid: string,
    payload: {
        mapping: Record<string, string>;
        bulk_tag_ids: string[];
        read_tags_column: boolean;
    },
): Promise<void> {
    await api.patch(`/customer-imports/${uuid}`, payload);
}

/* ---------- failures ---------- */
export async function downloadImportFailures(uuid: string): Promise<Blob> {
    const {data} = await api.get(`/customer-imports/${uuid}/failures`, {
        responseType: 'blob',
    });
    return data;
}

/* ---------- template ---------- */
export async function downloadCustomerImportTemplate(): Promise<Blob> {
    const {data} = await api.get('/customer-imports/template', {
        responseType: 'blob',
    });
    return data;
}
