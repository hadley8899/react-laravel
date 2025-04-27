import {api} from './api';
import {Customer} from '../interfaces/Customer';
import {PaginatedResponse} from "../interfaces/PaginatedResponse.ts";

export type CreateCustomerPayload = Omit<Customer, 'uuid' | 'created_at' | 'total_spent'> & {};

export type UpdateCustomerPayload = Partial<Omit<Customer, 'uuid' | 'created_at'>>;

/**
 * Fetches a paginated list of customers with optional search.
 * @param page - The page number (1-based for API usually)
 * @param perPage - Number of items per page
 * @param searchTerm - Optional search string
 * @param showInactive - Load inactive customers
 * @returns Promise<PaginatedResponse<Customer>>
 */
export async function getCustomers(
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = '',
    showInactive: boolean = false
): Promise<PaginatedResponse<Customer>> {
    console.log(showInactive);
    const response = await api.get<PaginatedResponse<Customer>>('/customers', {
        params: {
            page: page,
            per_page: perPage,
            search: searchTerm || undefined,
            show_inactive: showInactive,
        }
    });
    return response.data;
}

/**
 * Fetches a single customer by UUID.
 * @param uuid - The UUID of the customer
 * @returns Promise<Customer>
 */
export async function getCustomer(uuid: string): Promise<Customer> {
    const response = await api.get<{ data: Customer }>(`/customers/${uuid}`);
    return response.data.data;
}

/**
 * Creates a new customer.
 * @param payload - Data for the new customer
 * @returns Promise<Customer> - The created customer data
 */
export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
    const response = await api.post<{ data: Customer }>('/customers', payload);
    return response.data.data;
}

/**
 * Updates an existing customer.
 * @param uuid - UUID of the customer to update
 * @param payload - Data to update
 * @returns Promise<Customer> - The updated customer data
 */
export async function updateCustomer(uuid: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const response = await api.put<{ data: Customer }>(`/customers/${uuid}`, payload);
    return response.data.data;
}

/**
 * Deletes a customer.
 * @param uuid - UUID of the customer to delete
 * @returns Promise<void>
 */
export async function deleteCustomer(uuid: string): Promise<void> {
    await api.delete(`/customers/${uuid}`);
}
