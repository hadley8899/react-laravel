// src/services/companyService.ts
import {api} from './api'; // Axios
import {Company} from '../interfaces/Company.ts';

export type UpdateCompanyPayload = {
    name?: string;
    address?: string | null;
    phone?: string | null;
    email?: string;
    website?: string | null;
    logo?: File | null; // Allow null for clearing
    tax_id?: string | null;
    registration_number?: string | null;
    industry?: string | null;
};

// Define the type for the settings update payload
export type UpdateCompanySettingsPayload = {
    default_appointment_duration?: number;
    enable_online_booking?: boolean;
    send_appointment_reminders?: boolean;
    appointment_reminder_timing?: string | null; // '1h', '24h', etc., or null
    appointment_buffer_time?: number;
    min_booking_notice_hours?: number;
};

export const getMyCompany = async (): Promise<Company> => {
    const userJson = localStorage.getItem('user');
    let localCompany: Company | null = null;

    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (user.company) {
                localCompany = user.company;
                // Ensure localCompany matches the Company interface structure
                // Potentially add default values for settings if missing locally

                if (localCompany) {
                    localCompany.default_appointment_duration = localCompany.default_appointment_duration ?? 60;
                    localCompany.enable_online_booking = localCompany.enable_online_booking ?? true;
                    localCompany.send_appointment_reminders = localCompany.send_appointment_reminders ?? true;
                    localCompany.appointment_reminder_timing = localCompany.appointment_reminder_timing ?? '24h';
                    localCompany.appointment_buffer_time = localCompany.appointment_buffer_time ?? 0;
                    localCompany.min_booking_notice_hours = localCompany.min_booking_notice_hours ?? 24;
                }
            }
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
        }
    }

    try {
        const {data} = await api.get<{ data: Company }>('/current-company');

        // Update localStorage with fresh data
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                user.company = data.data; // Replace entire company object
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.error('Error updating localStorage', e);
            }
        }

        return data.data;
    } catch (e) {
        console.error('Failed to fetch company from server:', e);
        if (localCompany) {
            console.warn('Using potentially stale company data from localStorage.');
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

    // Remove logo from payload if it's null before creating FormData
    const hasLogo = payload.logo instanceof File;
    const payloadWithoutLogo = {...payload};
    if (!hasLogo) {
        delete payloadWithoutLogo.logo;
    }


    if (hasLogo && payload.logo) {
        const form = new FormData();
        Object.entries(payloadWithoutLogo).forEach(([k, v]) => {
            if (v !== undefined && v !== null) { // Check for undefined as well
                form.append(k, String(v));
            }
        });

        form.append('logo', payload.logo); // Add the logo file

        const {data} = await api.post<{ data: Company }>(
            `/companies/${uuid}?_method=PUT`, // Check if your backend handles this route for general updates
            form,
            {headers: {'Content-Type': 'multipart/form-data'}},
        );
        updatedCompany = data.data;
    } else {
        const cleanPayload = Object.fromEntries(
            Object.entries(payloadWithoutLogo).filter(([, v]) => v !== undefined) // Keep 'null' values if intended, filter undefined
        );

        const {data} = await api.put<{ data: Company }>(`/companies/${uuid}`, cleanPayload);
        updatedCompany = data.data;
    }

    // Update the company in localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            // Only update if the company object exists
            if (user.company && user.company.id === uuid) {
                // Merge updated fields into existing company data in localStorage
                // This preserves fields not returned by the specific update operation
                user.company = {...user.company, ...updatedCompany};
                localStorage.setItem('user', JSON.stringify(user));
            } else if (!user.company) {
                // If no company existed before, set it (less likely case here)
                user.company = updatedCompany;
                localStorage.setItem('user', JSON.stringify(user));
            }

        } catch (e) {
            console.error('Error updating localStorage after company update', e);
        }
    }

    return updatedCompany;
};

// --- NEW Function for Updating Settings ---
export const updateCompanySettings = async (
    uuid: string,
    payload: UpdateCompanySettingsPayload,
): Promise<Company> => { // Return the full updated Company object
    try {
        const {data} = await api.put<{ data: Company }>(
            `/companies/${uuid}/settings`, // Use the specific settings endpoint
            payload // Send only the settings fields as JSON
        );

        // Update the company settings in localStorage
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                // Ensure user.company exists and IDs match before updating
                if (user.company && user.company.id === uuid) {
                    // Merge the updated settings into the existing company data
                    user.company = {...user.company, ...data.data};
                    localStorage.setItem('user', JSON.stringify(user));
                } else if (!user.company) {
                    user.company = data.data;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } catch (e) {
                console.error('Error updating localStorage after settings update', e);
            }
        }

        return data.data; // Return the updated company data from the API response
    } catch (error) {
        console.error("Failed to update company settings:", error);
        throw error;
    }
};

// src/services/companyService.ts
export type UpdateCompanyBillingPayload = {
    invoice_prefix?: string;
    default_payment_terms?: 'DueOnReceipt' | 'Net7' | 'Net15' | 'Net30';
    invoice_footer_notes?: string;
};

export const updateCompanyBilling = async (
    uuid: string,
    payload: UpdateCompanyBillingPayload
): Promise<Company> => {
    const {data} = await api.put<{ data: Company }>(
        `/companies/${uuid}/billing`,   // new endpoint below
        payload
    );
    // Update the company settings in localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            // Ensure user.company exists and IDs match before updating
            if (user.company && user.company.id === uuid) {
                // Merge the updated settings into the existing company data
                user.company = {...user.company, ...data.data};
                localStorage.setItem('user', JSON.stringify(user));
            } else if (!user.company) {
                user.company = data.data;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (e) {
            console.error('Error updating localStorage after settings update', e);
        }
    }
    return data.data;
};
