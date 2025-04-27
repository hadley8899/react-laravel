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

export const updateUser = async (
    uuid: string,
    payload: UpdateUserPayload
): Promise<User> => {
    /* If there's a file we must use multipart/form-data */
    if (payload.avatar) {
        const form = new FormData();
        if (payload.name) form.append('name', payload.name);
        if (payload.email) form.append('email', payload.email);
        form.append('avatar', payload.avatar);
        /* POST with _method trick because Laravel won't parse multipart on PUT */
        const {data} = await api.post<{ data: User }>(
            `/users/${uuid}?_method=PUT`,
            form,
            {headers: {'Content-Type': 'multipart/form-data'}}
        );
        return data.data;
    }

    const {data} = await api.put<{ data: User }>(`/users/${uuid}`, payload);
    return data.data;
};

export const changePassword = async (
    uuid: string,
    payload: ChangePasswordPayload
): Promise<void> => {
    await api.post(`/users/${uuid}/change-password`, payload);
};
