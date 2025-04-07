import { Invoice } from "../interfaces/Invoice";

// Helper function to generate dates relative to today
const getDateString = (offsetDays: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const invoices: Invoice[] = [
    {
        id: "INV-001",
        customerId: 101,
        customerName: "Alice Smith",
        issueDate: getDateString(-40),
        dueDate: getDateString(-10), // Due 10 days ago
        amount: 350.00,
        status: "Overdue",
    },
    {
        id: "INV-002",
        customerId: 102,
        customerName: "Bob Johnson",
        issueDate: getDateString(-30),
        dueDate: getDateString(0), // Due today
        amount: 875.00,
        status: "Pending",
    },
    {
        id: "INV-003",
        customerId: 105,
        customerName: "Ethan Davis",
        issueDate: getDateString(-25),
        dueDate: getDateString(-5), // Paid 5 days ago (relative to issue)
        amount: 150.50,
        status: "Paid",
    },
    {
        id: "INV-004",
        customerId: 106,
        customerName: "Fiona Miller",
        issueDate: getDateString(-15),
        dueDate: getDateString(15), // Due in 15 days
        amount: 550.25,
        status: "Pending",
    },
    {
        id: "INV-005",
        customerId: 101,
        customerName: "Alice Smith",
        issueDate: getDateString(-10),
        dueDate: getDateString(20), // Due in 20 days
        amount: 900.75,
        status: "Pending",
    },
    {
        id: "INV-006",
        customerId: 103,
        customerName: "Charlie Brown",
        issueDate: getDateString(-60),
        dueDate: getDateString(-30), // Overdue
        amount: 100.00,
        status: "Overdue",
    },
    {
        id: "INV-007",
        customerId: 105,
        customerName: "Ethan Davis",
        issueDate: getDateString(-5),
        dueDate: getDateString(25), // Due in 25 days
        amount: 1950.00,
        status: "Draft",
    },
    {
        id: "INV-008",
        customerId: 102,
        customerName: "Bob Johnson",
        issueDate: getDateString(-45),
        dueDate: getDateString(-15), // Paid late
        amount: 25.00,
        status: "Paid",
    },
];

export default invoices;
