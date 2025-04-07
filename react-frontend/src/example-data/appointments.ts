import { Appointment } from "../interfaces/Appointment";

// Helper to create ISO date strings relative to today (April 7, 2025) at specific times
// dayOffset: 0=today (Mon), 1=Tue, 2=Wed, ...
// time: "HH:MM"
const createDateTime = (dayOffset: number, time: string): string => {
    const baseDate = new Date('2025-04-07T00:00:00.000Z'); // Start of the week (Monday, April 7th)
    const [hours, minutes] = time.split(':').map(Number);
    const targetDate = new Date(baseDate);
    targetDate.setUTCDate(baseDate.getUTCDate() + dayOffset);
    targetDate.setUTCHours(hours, minutes, 0, 0);
    return targetDate.toISOString();
};

const appointments: Appointment[] = [
    // Monday, April 7th
    {
        id: 201, customerName: "Alice Smith", vehicleMake: "Toyota", vehicleModel: "Camry", vehicleLicensePlate: "ABC-123",
        serviceType: "Service", dateTime: createDateTime(0, "09:00"), durationMinutes: 90, mechanicAssigned: "Dave Lee", status: "Confirmed"
    },
    {
        id: 202, customerName: "Charlie Brown", vehicleMake: "Ford", vehicleModel: "F-150", vehicleLicensePlate: "DEF-901",
        serviceType: "Repair", dateTime: createDateTime(0, "11:00"), durationMinutes: 120, notes: "Engine making strange noise", status: "Scheduled"
    },
    {
        id: 203, customerName: "Fiona Miller", vehicleMake: "Mercedes", vehicleModel: "E-Class", vehicleLicensePlate: "MNO-123",
        serviceType: "Diagnostic", dateTime: createDateTime(0, "14:30"), durationMinutes: 60, mechanicAssigned: "Sarah Chen", status: "Scheduled"
    },

    // Tuesday, April 8th
    {
        id: 204, customerName: "Bob Johnson", vehicleMake: "Honda", vehicleModel: "CR-V", vehicleLicensePlate: "XYZ-567",
        serviceType: "MOT", dateTime: createDateTime(1, "08:30"), durationMinutes: 60, mechanicAssigned: "Dave Lee", status: "Confirmed"
    },
    {
        id: 205, customerName: "Ethan Davis", vehicleMake: "BMW", vehicleModel: "X5", vehicleLicensePlate: "JKL-789",
        serviceType: "Tire Change", dateTime: createDateTime(1, "10:00"), durationMinutes: 45, status: "Scheduled"
    },

    // Wednesday, April 9th - No appointments scheduled

    // Thursday, April 10th
    {
        id: 206, customerName: "Alice Smith", vehicleMake: "Toyota", vehicleModel: "Camry", vehicleLicensePlate: "ABC-123",
        serviceType: "Check-up", dateTime: createDateTime(3, "13:00"), durationMinutes: 30, status: "Scheduled", mechanicAssigned:"Sarah Chen"
    },
    {
        id: 207, customerName: "George Wilson", vehicleMake: "Audi", vehicleModel: "Q7", vehicleLicensePlate: "PQR-567",
        serviceType: "Service", dateTime: createDateTime(3, "15:00"), durationMinutes: 120, status: "Confirmed", mechanicAssigned:"Dave Lee"
    },


    // Friday, April 11th
    {
        id: 208, customerName: "Bob Johnson", vehicleMake: "Honda", vehicleModel: "CR-V", vehicleLicensePlate: "XYZ-567",
        serviceType: "Repair", dateTime: createDateTime(4, "09:30"), durationMinutes: 180, notes: "Brake inspection and replacement", status: "Confirmed", mechanicAssigned:"Dave Lee"
    },
    {
        id: 209, customerName: "Fiona Miller", vehicleMake: "Mercedes", vehicleModel: "E-Class", vehicleLicensePlate: "MNO-123",
        serviceType: "MOT", dateTime: createDateTime(4, "14:00"), durationMinutes: 60, status: "Scheduled"
    },

    // Saturday, April 12th - Example completed/cancelled
    {
        id: 210, customerName: "Ethan Davis", vehicleMake: "BMW", vehicleModel: "X5", vehicleLicensePlate: "JKL-789",
        serviceType: "Diagnostic", dateTime: createDateTime(5, "10:00"), durationMinutes: 60, status: "Completed" // Was on Saturday
    },
    // Sunday, April 13th - Example cancelled
    {
        id: 211, customerName: "Alice Smith", vehicleMake: "Toyota", vehicleModel: "Camry", vehicleLicensePlate: "ABC-123",
        serviceType: "Tire Change", dateTime: createDateTime(6, "11:00"), durationMinutes: 45, status: "Cancelled" // Was on Sunday
    },

    // Example for next week (for testing navigation)
    {
        id: 212, customerName: "Charlie Brown", vehicleMake: "Ford", vehicleModel: "F-150", vehicleLicensePlate: "DEF-901",
        serviceType: "Service", dateTime: createDateTime(7, "10:30"), durationMinutes: 90, status: "Scheduled"
    },
];

export default appointments;
