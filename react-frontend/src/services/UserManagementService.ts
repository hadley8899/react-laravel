import User from '../interfaces/User';
import {api} from './api';


export interface CompanyUser extends User {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    created_at: string;
}

export type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
    permissions?: string[];
    status?: 'active' | 'inactive';
};

export type UpdateCompanyUserPayload = {
    name?: string;
    email?: string;
    role?: string;
    permissions?: string[];
    status?: 'active' | 'inactive';
};

// Get all users in the company
export const getCompanyUsers = async (): Promise<CompanyUser[]> => {
    const response = await api.get<{ data: CompanyUser[] }>('/company/users');
    return response.data.data;
};

// Get a specific user's details
export const getCompanyUser = async (uuid: string): Promise<CompanyUser> => {
    const response = await api.get<{ data: CompanyUser }>(`/company/users/${uuid}`);
    return response.data.data;
};

// Create a new user in the company
export const createCompanyUser = async (payload: CreateUserPayload): Promise<CompanyUser> => {
    const response = await api.post<{ data: CompanyUser }>('/company/users', payload);
    return response.data.data;
};

// Update a user in the company
export const updateCompanyUser = async (
    uuid: string,
    payload: UpdateCompanyUserPayload
): Promise<CompanyUser> => {
    const response = await api.put<{ data: CompanyUser }>(`/company/users/${uuid}`, payload);
    return response.data.data;
};

// Delete a user from the company
export const deleteCompanyUser = async (uuid: string): Promise<void> => {
    await api.delete(`/company/users/${uuid}`);
};

// Change user status (activate/deactivate)
export const updateUserStatus = async (
    uuid: string,
    status: 'active' | 'inactive'
): Promise<CompanyUser> => {
    const response = await api.put<{ data: CompanyUser }>(`/company/users/${uuid}/status`, {status});
    return response.data.data;
};

// Get available roles
export const getAvailableRoles = async (): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>('/company/roles');
    return response.data.data;
};

// Get available permissions
export const getAvailablePermissions = async (): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>('/company/permissions');
    return response.data.data;
};

// Assign roles to a user
export const assignUserRoles = async (uuid: string, roles: string[]): Promise<CompanyUser> => {
    const response = await api.put<{ data: CompanyUser }>(`/company/users/${uuid}/roles`, {roles});
    return response.data.data;
};

// Assign direct permissions to a user
export const assignUserPermissions = async (
    uuid: string,
    permissions: string[]
): Promise<CompanyUser> => {
    const response = await api.put<{ data: CompanyUser }>(
        `/company/users/${uuid}/permissions`,
        {permissions}
    );
    return response.data.data;
};
