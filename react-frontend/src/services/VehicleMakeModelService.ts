import { api } from './api';

export interface VehicleMake {
    uuid: string;
    name: string;
}

export interface VehicleModel {
    uuid: string;
    vehicle_make_uuid: string;
    name: string;
}

/**
 * Get all vehicle makes with optional search
 */
export const getVehicleMakes = async (search?: string): Promise<VehicleMake[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<{ data: VehicleMake[] }>('/vehicle-makes', { params });
    return data.data;
};

/**
 * Get all models for a specific make with optional search
 */
export const getVehicleModels = async (makeUuId: string, search?: string): Promise<VehicleModel[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get<{ data: VehicleModel[] }>(
        `/vehicle-makes/${makeUuId}/models`,
        { params }
    );
    return data.data;
};
