import { api } from './api';
import { Vehicle } from '../interfaces/Vehicle';
import { PaginatedResponse } from '../interfaces/PaginatedResponse';

/* --------------------------------------------------------
   Payload types
-------------------------------------------------------- */

export type CreateVehiclePayload = {
    make: string;
    model: string;
    year: number;
    registration: string;          // UK “reg”
    status: Vehicle['status'];
    owner: string;
    last_service?: string | null;  // ISO yyyy‑mm‑dd or null
    next_service_due?: string | null;
    type?: string | null;
};

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

/* --------------------------------------------------------
   CRUD helpers
-------------------------------------------------------- */

/**
 * Fetch a paginated list of vehicles.
 */
export async function getVehicles(
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = ''
): Promise<PaginatedResponse<Vehicle>> {
    const { data } = await api.get<PaginatedResponse<Vehicle>>('/vehicles', {
        params: {
            page,
            per_page: perPage,
            search: searchTerm || undefined,
        },
    });
    return data;
}

/**
 * Fetch a single vehicle by ID.
 */
export async function getVehicle(id: number): Promise<Vehicle> {
    const { data } = await api.get<{ data: Vehicle }>(`/vehicles/${id}`);
    return data.data;
}

/**
 * Create a new vehicle.
 */
export async function createVehicle(
    payload: CreateVehiclePayload
): Promise<Vehicle> {
    const { data } = await api.post<{ data: Vehicle }>('/vehicles', payload);
    return data.data;
}

/**
 * Update an existing vehicle.
 */
export async function updateVehicle(
    id: number,
    payload: UpdateVehiclePayload
): Promise<Vehicle> {
    const { data } = await api.put<{ data: Vehicle }>(
        `/vehicles/${id}`,
        payload
    );
    return data.data;
}

/**
 * Delete a vehicle.
 */
export async function deleteVehicle(id: number): Promise<void> {
    await api.delete(`/vehicles/${id}`);
}
