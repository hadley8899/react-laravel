export type AppointmentType = 'MOT' | 'Service' | 'Repair' | 'Tire Change' | 'Diagnostic' | 'Check-up';
export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
    id: number;
    customerName: string;
    vehicleMake: string; // e.g., Toyota
    vehicleModel: string; // e.g., Camry
    vehicleLicensePlate: string; // e.g., ABC-123
    serviceType: AppointmentType;
    dateTime: string; // ISO 8601 format string (e.g., "2025-04-07T09:00:00.000Z")
    durationMinutes: number; // Duration in minutes
    mechanicAssigned?: string; // Optional assigned mechanic
    notes?: string; // Optional notes
    status: AppointmentStatus;
}
