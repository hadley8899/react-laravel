import {api} from './api';
import {Appointment} from "../interfaces/Appointment.ts";
import {PaginatedResponse} from "../interfaces/PaginatedResponse.ts";

/* ---------- payloads ---------- */
export type CreateAppointmentPayload = {
    customer_uuid: string;
    vehicle_uuid: string;
    service_type: Appointment['service_type'];
    date_time: string;             // ISO
    duration_minutes: number;
    status: Appointment['status'];
    mechanic_assigned?: string | null;
    notes?: string | null;
};

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>;

/* ---------- calls ---------- */
export async function getAppointments(params: {
    date_from: string;
    date_to: string;
    service_type?: Appointment['service_type'] | 'All';
    status?: Appointment['status'] | 'All';
}) {
    const {data} = await api.get<PaginatedResponse<Appointment>>('/appointments', {
        params: {
            date_from: params.date_from,
            date_to: params.date_to,
            service_type: params.service_type === 'All' ? undefined : params.service_type,
            status: params.status === 'All' ? undefined : params.status,
            per_page: 2000,
        },
    });
    return data;
}

export async function getAppointment(uuid: string) {
    const {data} = await api.get<{ data: Appointment }>(`/appointments/${uuid}`);
    return data.data;
}

export async function createAppointment(p: CreateAppointmentPayload) {
    const {data} = await api.post<{ data: Appointment }>('/appointments', p);
    return data.data;
}

export async function updateAppointment(uuid: string, p: UpdateAppointmentPayload) {
    const {data} = await api.put<{ data: Appointment }>(`/appointments/${uuid}`, p);
    return data.data;
}

export async function deleteAppointment(uuid: string) {
    await api.delete(`/appointments/${uuid}`);
}
