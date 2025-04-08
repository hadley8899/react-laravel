import React, {useState, useEffect, useCallback} from 'react';
import MainLayout from "../components/layout/MainLayout";
import {
    Container,
    Paper,
    Box,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
// Import interface and service
import {Customer} from "../interfaces/Customer";
import {deleteCustomer, getCustomers} from "../services/CustomerService";

// Import components
import CustomerTable from "../components/customer/CustomerTable";
import CustomerFormDialog from '../components/customer/CustomerFormDialog';
import CustomerPageFilterBar from "../components/customer/CustomerPageFilterBar.tsx";

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
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showInactive, setShowInactive] = useState(false);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTermInput, setSearchTermInput] = useState("");
    const debouncedSearchTerm = useDebounce(searchTermInput, 500);

    // --- State for Modal ---
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

    // --- State for Delete Confirmation Dialog ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const fetchCustomers = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setLoading(true)
        }

        setError(null);
        try {
            const response = await getCustomers(page + 1, rowsPerPage, debouncedSearchTerm, showInactive);
            setCustomers(response.data);
            setTotalCustomers(response.meta.total);
        } catch (err: any) {
            console.error("Failed to fetch customers:", err);
            setError(err.message || "Failed to load customers. Please try again.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearchTerm, showInactive]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermInput(event.target.value);
        setPage(0);
    };

    const handleOpenDeleteDialog = (customer: Customer) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    const handleDeleteCustomer = async () => {
        if (!customerToDelete) return;

        try {
            await deleteCustomer(customerToDelete.uuid);
            fetchCustomers(false);
            handleCloseDeleteDialog();
        } catch (error) {
            console.error("Error deleting customer:", error);
            setError("Failed to delete customer. Please try again.");
        }
    };

    const handleOpenAddModal = () => {
        setCustomerToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (customer: Customer) => {
        setCustomerToEdit(customer);
        setIsFormModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        setCustomerToEdit(null);
    };

    const handleSaveSuccess = () => {
        fetchCustomers(false);
    };

    const handleShowInactiveChange = (checked: boolean) => {
        setShowInactive(checked);
        setPage(0);
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: {xs: 2, sm: 3}, borderRadius: 3, overflow: 'hidden'}} elevation={2}>
                    <CustomerPageFilterBar
                        showInactive={showInactive}
                        searchTermInput={searchTermInput}
                        handleShowInactiveChange={handleShowInactiveChange}
                        handleSearchChange={handleSearchChange}
                        handleOpenAddModal={handleOpenAddModal}
                    />

                    {loading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px'}}>
                            <CircularProgress/>
                        </Box>
                    )}
                    {error && !loading && (
                        <Alert severity="error" sx={{my: 2, mx: 'auto', maxWidth: '600px'}}>{error}</Alert>
                    )}

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
                                onDeleteCustomer={handleOpenDeleteDialog}
                            />
                        </>
                    )}
                </Paper>
            </Container>

            <CustomerFormDialog
                open={isFormModalOpen}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
                customerToEdit={customerToEdit}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete {customerToDelete?.first_name || "this customer"}?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteCustomer} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
}

export default Customers;