import { Customer } from "../interfaces/Customer";

const customers: Customer[] = [
    {
        id: 101,
        firstName: "Alice",
        lastName: "Smith",
        email: "alice.smith@example.com",
        phone: "555-0101",
        address: "123 Maple Street, Anytown, AT 12345",
        createdAt: "2023-01-15",
        status: "Active",
        totalSpent: 1250.75,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` // Random placeholder avatar
    },
    {
        id: 102,
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob.j@example.net",
        address: "456 Oak Avenue, Sometown, ST 67890",
        createdAt: "2022-11-30",
        status: "Active",
        totalSpent: 875.00,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    },
    {
        id: 103,
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.b@example.com",
        phone: "555-0103",
        address: "789 Pine Road, Villagetown, VT 10112",
        createdAt: "2023-03-10",
        status: "Inactive",
        totalSpent: 250.50,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    },
    {
        id: 104,
        firstName: "Diana",
        lastName: "Williams",
        email: "diana.w@example.org",
        address: "101 Birch Lane, Cityville, CV 13141",
        createdAt: "2024-05-20",
        status: "Prospect",
        totalSpent: 0.00,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    },
    {
        id: 105,
        firstName: "Ethan",
        lastName: "Davis",
        email: "ethan.davis@sample.com",
        phone: "555-0105",
        address: "222 Cedar Blvd, Metrotown, MT 15161",
        createdAt: "2023-08-01",
        status: "Active",
        totalSpent: 2100.00,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    },
    {
        id: 106,
        firstName: "Fiona",
        lastName: "Miller",
        email: "f.miller@sample.net",
        address: "333 Willow Way, Suburbia, SB 17181",
        createdAt: "2024-01-05",
        status: "Active",
        totalSpent: 550.25,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    },
    {
        id: 107,
        firstName: "George",
        lastName: "Wilson",
        email: "george.wilson@example.com",
        phone: "555-0107",
        address: "444 Elm Street, Hightown, HT 19202",
        createdAt: "2023-10-12",
        status: "Inactive",
        totalSpent: 150.00,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    },
    {
        id: 108,
        firstName: "Hannah",
        lastName: "Moore",
        email: "hannah.m@sample.org",
        address: "555 Spruce Drive, Lowtown, LT 21222",
        createdAt: "2024-06-01",
        status: "Prospect",
        totalSpent: 0.00,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    }
];

export default customers;
