import axios from 'axios';

// This could come from a Vite environment variable, for example:
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // If the request type is PUT then add _method override header
    if (config.method?.toUpperCase() === 'PUT') {
        config.headers['_method'] = 'PUT';
    }

    return config;
});