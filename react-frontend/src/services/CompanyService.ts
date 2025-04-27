import {api} from './api';
import {Company} from '../interfaces/Company.ts'

export type UpdateCompanyPayload = {
    name?: string;
    address?: string | null;
    phone?: string | null;
    email?: string;
    website?: string | null;
    logo?: File;
    tax_id?: string | null;
    registration_number?: string | null;
    industry?: string | null;
};

// Get company from localStorage first, then sync with server
export const getMyCompany = async (): Promise<Company> => {
    // Try to get from localStorage first
    const userJson = localStorage.getItem('user');
    let localCompany: Company | null = null;
    
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (user.company) {
                localCompany = user.company;
            }
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
        }
    }
    
    // Always fetch fresh data from server
    try {
        const {data} = await api.get<{data: Company}>('/current-company');
        
        // Update localStorage with fresh data
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                user.company = data.data;
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.error('Error updating localStorage', e);
            }
        }
        
        return data.data;
    } catch (e) {
        // If server fetch fails but we have local data, use that
        if (localCompany) {
            return localCompany;
        }
        throw e;
    }
};

export const updateCompany = async (
    uuid: string,
    payload: UpdateCompanyPayload,
): Promise<Company> => {
    let updatedCompany: Company;

    if (payload.logo) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
            if (v !== undefined && v !== null && k !== 'logo') {
                form.append(k, String(v));
            }
        });
        
        // Explicitly add the logo
        form.append('logo', payload.logo);
        
        console.log('Sending form data with logo', Array.from(form.entries()));
        
        const {data} = await api.post<{ data: Company }>(
            `/companies/${uuid}?_method=PUT`,
            form,
            {headers: {'Content-Type': 'multipart/form-data'}},
        );
        updatedCompany = data.data;
    } else {
        /* plain JSON */
        // Filter out null values
        const cleanPayload = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(payload).filter(([_nothing, v]) => v !== null && v !== undefined)
        );
        
        const {data} = await api.put<{ data: Company }>(`/companies/${uuid}`, cleanPayload);
        updatedCompany = data.data;
    }
    
    // Update the company in localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            user.company = updatedCompany;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
            console.error('Error updating localStorage after company update', e);
        }
    }
    
    return updatedCompany;
};
