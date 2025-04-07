import {Vehicle} from "../interfaces/Vehicle.ts";

const vehicles :Vehicle[] = [
    {
        id: 1,
        make: "Toyota",
        model: "Camry",
        year: 2019,
        licensePlate: "ABC-1234",
        status: "In Service",
        owner: "John Smith",
        lastService: "2023-05-15",
        nextServiceDue: "2023-11-15",
        type: "Sedan"
    },
    {
        id: 2,
        make: "Honda",
        model: "CR-V",
        year: 2020,
        licensePlate: "XYZ-5678",
        status: "Ready for Pickup",
        owner: "Emma Johnson",
        lastService: "2023-06-20",
        nextServiceDue: "2023-12-20",
        type: "SUV"
    },
    {
        id: 3,
        make: "Ford",
        model: "F-150",
        year: 2018,
        licensePlate: "DEF-9012",
        status: "Awaiting Parts",
        owner: "Michael Brown",
        lastService: "2023-04-10",
        nextServiceDue: "2023-10-10",
        type: "Truck"
    },
    {
        id: 4,
        make: "Chevrolet",
        model: "Malibu",
        year: 2021,
        licensePlate: "GHI-3456",
        status: "Scheduled",
        owner: "Sarah Davis",
        lastService: "2023-07-05",
        nextServiceDue: "2024-01-05",
        type: "Sedan"
    },
    {
        id: 5,
        make: "BMW",
        model: "X5",
        year: 2022,
        licensePlate: "JKL-7890",
        status: "Diagnostic",
        owner: "James Wilson",
        lastService: "2023-07-30",
        nextServiceDue: "2024-01-30",
        type: "SUV"
    },
    {
        id: 6,
        make: "Mercedes",
        model: "E-Class",
        year: 2020,
        licensePlate: "MNO-1234",
        status: "Complete",
        owner: "Patricia Moore",
        lastService: "2023-06-10",
        nextServiceDue: "2023-12-10",
        type: "Sedan"
    },
    {
        id: 7,
        make: "Audi",
        model: "Q7",
        year: 2019,
        licensePlate: "PQR-5678",
        status: "In Service",
        owner: "Robert Taylor",
        lastService: "2023-05-25",
        nextServiceDue: "2023-11-25",
        type: "SUV"
    },
    {
        id: 8,
        make: "Nissan",
        model: "Altima",
        year: 2021,
        licensePlate: "STU-9012",
        status: "Ready for Pickup",
        owner: "Jennifer Anderson",
        lastService: "2023-07-15",
        nextServiceDue: "2024-01-15",
        type: "Sedan"
    },
    {
        id: 9,
        make: "Jeep",
        model: "Grand Cherokee",
        year: 2018,
        licensePlate: "VWX-3456",
        status: "Awaiting Parts",
        owner: "David Thomas",
        lastService: "2023-04-20",
        nextServiceDue: "2023-10-20",
        type: "SUV"
    },
    {
        id: 10,
        make: "Hyundai",
        model: "Tucson",
        year: 2022,
        licensePlate: "YZA-7890",
        status: "Scheduled",
        owner: "Lisa Jackson",
        lastService: "2023-08-01",
        nextServiceDue: "2024-02-01",
        type: "SUV"
    },
];

export default vehicles;
