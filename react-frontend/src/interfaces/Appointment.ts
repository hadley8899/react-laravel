export type AppointmentType =
    | 'MOT'
    | 'Service'
    | 'Repair'
    | 'Tire Change'
    | 'Diagnostic'
    | 'Check-up';

export type AppointmentStatus =
    | 'Scheduled'
    | 'Confirmed'
    | 'In Progress'
    | 'Completed'
    | 'Cancelled'
    | 'No Show';

export interface Appointment {
    uuid: string;
    service_type: AppointmentType;
    date_time: string;          // ISO string
    duration_minutes: number;
    status: AppointmentStatus;
    mechanic_assigned?: string | null;
    notes?: string | null;

    // relations (included by AppointmentResource)
    customer: {
        uuid: string;
        first_name: string;
        last_name: string;
        email?: string | null;
    };
    vehicle: {
        uuid: string;
        make: string;
        model: string;
        registration: string;
    };
}
