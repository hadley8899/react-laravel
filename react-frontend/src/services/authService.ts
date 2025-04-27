import {api} from './api';

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ResetPasswordPayload {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export async function registerUser(payload: RegisterPayload) {
    const response = await api.post('/register', payload);
    return response.data;
}

export async function loginUser(credentials: LoginPayload) {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
}

export async function forgotPassword(email: string) {
    const response = await api.post('/forgot-password', { email });
    return response.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
    const response = await api.post('/reset-password', payload);
    return response.data;
}

export async function getAuthUser() {
    if (!localStorage.getItem('token')) {
        throw new Error('Not authenticated');
    }

    const response = await api.get('/user');
    return response.data.data;
}

export async function logout() {
    try {
        return await api.post('/logout');
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    }
}