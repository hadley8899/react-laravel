import {api} from './api';
import {Customer} from '../interfaces/Customer';
import {PaginatedResponse} from '../interfaces/PaginatedResponse';

export type CreateCustomerPayload = Omit<Customer, 'uuid' | 'created_at' | 'total_spent'>;
export type UpdateCustomerPayload = Partial<Omit<Customer, 'uuid' | 'created_at'>>;

/* ---------- helpers ---------- */
function buildCsv(ids: string[] | undefined) {
    return ids && ids.length ? ids.join(',') : undefined;
}

/* ---------- API ---------- */
export async function getCustomers(
    page = 1,
    perPage = 10,
    searchTerm = '',
    showInactive = false,
    tagIds: string[] = [],
): Promise<PaginatedResponse<Customer>> {
    const {data} = await api.get<PaginatedResponse<Customer>>('/customers', {
        params: {
            page,
            per_page: perPage,
            search: searchTerm || undefined,
            show_inactive: showInactive,
            tag_ids: buildCsv(tagIds),          // ★ new
        },
    });
    return data;
}

export async function getCustomer(uuid: string): Promise<Customer> {
    const {data} = await api.get<{ data: Customer }>(`/customers/${uuid}`);
    return data.data;
}

export async function createCustomer(payload: CreateCustomerPayload, customVars: Record<string, string>) {
    const {data} = await api.post<{ data: Customer }>('/customers', {...payload, custom_variables: customVars});
    return data.data;
}

export async function updateCustomer(uuid: string, payload: UpdateCustomerPayload, customVars: Record<string, string>) {
    const {data} = await api.put<{ data: Customer }>(`/customers/${uuid}`, {...payload, custom_variables: customVars});
    return data.data;
}

export async function deleteCustomer(uuid: string) {
    await api.delete(`/customers/${uuid}`);
}
