// src/pages/Customers.tsx
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from "@mui/icons-material/Add";

// Import interface and service
import { Customer } from "../interfaces/Customer"; // Adjust path if needed
import { getCustomers } from "../services/CustomerService"; // Adjust path if needed

// Import components
import CustomerTable from "../components/customer/CustomerTable"; // Adjust path if needed
import CustomerFormDialog from '../components/customer/CustomerFormDialog'; // Updated import

// Debounce hook... (keep as is)
function useDebounce(value: string, delay: number): string {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}


const Customers: React.FC = () => {
    // ... other state remains the same ...
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTermInput, setSearchTermInput] = useState("");
    const debouncedSearchTerm = useDebounce(searchTermInput, 500);

    // --- State for Modal ---
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Renamed state variable
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null); // State to hold customer data for editing

    // Fetching function - unchanged
    const fetchCustomers = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const response = await getCustomers(page + 1, rowsPerPage, debouncedSearchTerm);
            setCustomers(response.data);
            setTotalCustomers(response.meta.total);
        } catch (err: any) {
            console.error("Failed to fetch customers:", err);
            setError(err.message || "Failed to load customers. Please try again.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // --- Event Handlers ---
    // ... (handleChangePage, handleChangeRowsPerPage, handleSearchChange remain the same) ...
    const handleChangePage = (_event: unknown, newPage: number) => { setPage(newPage); };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermInput(event.target.value);
        setPage(0);
    };

    // --- Modal Handlers ---
    const handleOpenAddModal = () => {
        setCustomerToEdit(null); // Ensure we are in "add" mode
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (customer: Customer) => {
        setCustomerToEdit(customer); // Set the customer to edit
        setIsFormModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        setCustomerToEdit(null); // Clear customer data on close
    };

    const handleSaveSuccess = () => {
        // Renamed callback function
        fetchCustomers(false); // Re-fetch without main loading indicator
        // Optionally show a success Snackbar here
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, overflow: 'hidden' }} elevation={2}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 3
                        }}
                    >
                        <Typography variant="h5" component="h1" fontWeight="600"
                                    sx={{display: 'flex', alignItems: 'center'}}>
                            <PeopleIcon sx={{mr: 1.5, color: 'primary.main'}}/>
                            Customers
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'nowrap' }}>
                            {/* Search Field */}
                            <TextField /* ... props ... */
                                variant="outlined"
                                placeholder="Search name or email..."
                                size="small"
                                value={searchTermInput}
                                onChange={handleSearchChange}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                                sx={{ minWidth: '250px', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            {/* Add Customer Button */}
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="medium"
                                onClick={handleOpenAddModal} // Opens modal in "add" mode
                                sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
                            >
                                Add Customer
                            </Button>
                        </Box>
                    </Box>

                    {/* Loading / Error Display */}
                    {/* ... (loading and error display logic remains the same) ... */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {error && !loading && (
                        <Alert severity="error" sx={{ my: 2, mx: 'auto', maxWidth: '600px' }}>{error}</Alert>
                    )}

                    {/* Customer Table */}
                    {!loading && !error && customers && (
                        <>
                            <CustomerTable
                                customers={customers}
                                totalCustomers={totalCustomers}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                onEditCustomer={handleOpenEditModal}
                                debouncedSearchTerm={debouncedSearchTerm}
                            />
                        </>
                    )}
                </Paper>
            </Container>

            {/* Render the Universal Customer Form Dialog */}
            <CustomerFormDialog
                open={isFormModalOpen}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess} // Pass the success handler
                customerToEdit={customerToEdit} // Pass customer data for editing (or null for adding)
            />
        </MainLayout>
    );
}

export default Customers;
