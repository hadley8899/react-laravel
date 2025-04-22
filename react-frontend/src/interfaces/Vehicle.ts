export type VehicleStatus =
    | 'In Service'
    | 'Ready for Pickup'
    | 'Awaiting Parts'
    | 'Scheduled'
    | 'Diagnostic'
    | 'Complete';

export interface Vehicle {
    uuid: string;
    make: string;
    model: string;
    year: number;
    registration: string;
    status: VehicleStatus;
    owner: string;
    lastService: string;
    nextServiceDue: string;
    type: string;
}
