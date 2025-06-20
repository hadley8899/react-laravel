import {api} from './api';
import User from "../interfaces/User.ts";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    company_code: string;
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
    const res = await api.post('/login', credentials);

    console.log(res);

    const {token, user} = res.data;

    if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('user-updated'));
    }

    return res.data;
}

export async function forgotPassword(email: string) {
    const response = await api.post('/forgot-password', {email});
    return response.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
    const response = await api.post('/reset-password', payload);
    return response.data;
}

export async function getAuthUser(): Promise<User> {
    if (!localStorage.getItem('token')) {
        throw new Error('Not authenticated');
    }

    const response = await api.get('/user');
    return response.data.data;
}

export async function setAuthUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function hasPermission(permission: string | string[]): boolean {
    const user = getAuthUserLocal();
    if (!user || !user.permissions) return false;

    if (Array.isArray(permission)) {
        // Check if user has any of the permissions in the array
        return permission.some(perm => user.permissions.includes(perm));
    }

    // Handle single permission case
    return user.permissions.includes(permission);
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

export function getAuthUserLocal(): User | null {
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

export const acceptInvitation = (token: string, password: string, password_confirmation: string) => {
    return api.post('/accept-invitation', {
        token,
        password,
        password_confirmation
    });
}

