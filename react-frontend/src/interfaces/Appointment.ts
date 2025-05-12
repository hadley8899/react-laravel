import {Customer} from "./Customer.ts";
import {Vehicle} from "./Vehicle.ts";

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
    date_time: string;
    duration_minutes: number;
    status: AppointmentStatus;
    mechanic_assigned?: string | null;
    notes?: string | null;
    customer: Customer,
    vehicle: Vehicle,
}
