import {Customer} from "./Customer.ts";

export type VehicleType =
    | 'Car'
    | 'Truck'
    | 'Van'
    | 'SUV'
    | 'Motorcycle'
    | 'Bus'
    | 'Trailer'
    | 'Other';

/* Shape coming back from the API */
export interface Vehicle {
    uuid: string;
    customer_id: string;
    customer?: Customer;
    make: string;
    model: string;
    year: number | null;
    registration: string;
    last_service: string | null;
    next_service_due: string | null;
    type: VehicleType | null;
}
