import { api } from './api';
import { Vehicle } from '../interfaces/Vehicle';
import { PaginatedResponse } from '../interfaces/PaginatedResponse';

/* ---------- payloads ---------- */
export type CreateVehiclePayload = {
    customer_id: string;           // REQUIRED
    make: string;
    model: string;
    year: number | null;
    registration: string;
    last_service?: string | null;
    next_service_due?: string | null;
    type?: string | null;
};

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

/* ---------- CRUD ---------- */
export const getVehicles = async (
    page = 1,
    perPage = 10,
    search = ''
): Promise<PaginatedResponse<Vehicle>> => {
    const { data } = await api.get<PaginatedResponse<Vehicle>>('/vehicles', {
        params: { page, per_page: perPage, search: search || undefined }
    });
    return data;
};

export const createVehicle = async (
    payload: CreateVehiclePayload
): Promise<Vehicle> => {
    const { data } = await api.post<{ data: Vehicle }>('/vehicles', payload);
    return data.data;
};

export const updateVehicle = async (
    uuid: string,
    payload: UpdateVehiclePayload
): Promise<Vehicle> => {
    const { data } = await api.put<{ data: Vehicle }>(`/vehicles/${uuid}`, payload);
    return data.data;
};

export const deleteVehicle = async (uuid: string): Promise<void> => {
    await api.delete(`/vehicles/${uuid}`);
};
