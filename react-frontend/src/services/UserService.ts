import {api} from './api';
import User from '../interfaces/User';

export type UpdateUserPayload = {
    name?: string;
    email?: string;
    avatar?: File;
};

export type ChangePasswordPayload = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export const getCurrentUser = async (): Promise<{ data: User }> => {
    const response = await api.get<{ data: User }>('/user');
    return response.data;
};

export const getCurrentUserLocal = (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
        }
    }
    return null;
}

export type UpdateUserPreferencesPayload = {
    notify_new_booking?: boolean;
    notify_job_complete?: boolean;
    preferred_theme?: 'light' | 'dark' | 'system';
};

export const updateUser = async (
    uuid: string,
    payload: UpdateUserPayload
): Promise<User> => {
    if (payload.avatar) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
            if (v && k !== 'avatar') form.append(k, v as string);
        });
        form.append('avatar', payload.avatar);

        const {data} = await api.post<{ data: User }>(
            `/users/${uuid}?_method=PUT`,
            form,
            {headers: {'Content-Type': 'multipart/form-data'}}
        );
        return storeUser(data.data);
    }

    const {data} = await api.put<{ data: User }>(`/users/${uuid}`, payload);
    return storeUser(data.data);
};

/* ------------------------------------------------------------------ */
/* localStorage helper                                                */

/* ------------------------------------------------------------------ */
function storeUser(u: User): User {
    localStorage.setItem('user', JSON.stringify(u));
    return u;
}

export const updateUserPreferences = async (
    uuid: string,
    payload: UpdateUserPreferencesPayload
): Promise<User> => {
    const {data} = await api.put<{ data: User }>(
        `/users/${uuid}/preferences`,
        payload
    );
    return storeUser(data.data);
};

export const changePassword = async (
    uuid: string,
    payload: ChangePasswordPayload
): Promise<void> => {
    await api.post(`/users/${uuid}/change-password`, payload);
};
