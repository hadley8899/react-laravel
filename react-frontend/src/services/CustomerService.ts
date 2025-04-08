import {api} from './api'; // Your configured Axios instance
import {Customer} from '../interfaces/Customer'; // Adjust path if needed
import {PaginatedResponse} from "../interfaces/PaginatedResponse.ts";

export type CreateCustomerPayload = Omit<Customer, 'uuid' | 'createdAt' | 'totalSpent' | 'avatarUrl'> & {
};

// Type for the payload when updating (allow partial updates)
export type UpdateCustomerPayload = Partial<Omit<Customer, 'uuid' | 'createdAt'>>;

/**
 * Fetches a paginated list of customers with optional search.
 * @param page - The page number (1-based for API usually)
 * @param perPage - Number of items per page
 * @param searchTerm - Optional search string
 * @returns Promise<PaginatedResponse<Customer>>
 */
export async function getCustomers(
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = ''
): Promise<PaginatedResponse<Customer>> {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', {
        params: {
            page: page,
            per_page: perPage, // Ensure backend expects 'per_page' or adjust param name
            search: searchTerm || undefined, // Send search only if it has a value
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
    return response.data.data; // Adjust if API doesn't wrap in 'data'
}

/**
 * Creates a new customer.
 * @param payload - Data for the new customer
 * @returns Promise<Customer> - The created customer data
 */
export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
    const response = await api.post<{ data: Customer }>('/customers', payload);
    return response.data.data; // Adjust if API doesn't wrap in 'data'
}

/**
 * Updates an existing customer.
 * @param uuid - UUID of the customer to update
 * @param payload - Data to update
 * @returns Promise<Customer> - The updated customer data
 */
export async function updateCustomer(uuid: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const response = await api.put<{ data: Customer }>(`/customers/${uuid}`, payload);
    return response.data.data; // Adjust if API doesn't wrap in 'data'
}

/**
 * Deletes a customer.
 * @param uuid - UUID of the customer to delete
 * @returns Promise<void>
 */
export async function deleteCustomer(uuid: string): Promise<void> {
    await api.delete(`/customers/${uuid}`);
}
