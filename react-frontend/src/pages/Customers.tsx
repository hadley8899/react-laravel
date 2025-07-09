import React, {useState, useEffect, useCallback} from 'react';
import MainLayout from "../components/layout/MainLayout";
import {
    Container, Paper, Box, Button, CircularProgress, Alert,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import {Customer} from "../interfaces/Customer";
import {deleteCustomer, getCustomers} from "../services/CustomerService";
import CustomerTable from "../components/customer/CustomerTable";
import CustomerFormDialog from '../components/customer/CustomerFormDialog';
import CustomerPageFilterBar from "../components/customer/CustomerPageFilterBar.tsx";
import {Tag} from "../interfaces/Tag.ts";
import ImportCustomersDialog from '../components/customer/ImportCustomersDialog';
import {useNavigate} from 'react-router-dom';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const h = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(h);
    }, [value, delay]);
    return debouncedValue;
}

const Customers: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [showInactive, setShowInactive] = useState(false);
    const [totalCustomers, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRpp] = useState(20);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);

    /* ───────── modals ───────── */
    const [formOpen, setFormOpen] = useState(false);
    const [editCustomer, setEdit] = useState<Customer | null>(null);
    const [delOpen, setDelOpen] = useState(false);
    const [delCust, setDelCust] = useState<Customer | null>(null);
    const [importOpen, setImportOpen] = useState(false);

    /* ───────── fetch ───────── */
    const fetchCustomers = useCallback(async (shLoading = true) => {
        if (shLoading) setLoading(true);
        setError(null);
        try {
            const res = await getCustomers(
                page + 1, rowsPerPage, debouncedSearch,
                showInactive, selectedTags.map(t => t.uuid),
            );
            setCustomers(res.data);
            setTotal(res.meta.total);
        } catch (err: any) {
            setError(err.message ?? 'Failed to load customers');
        } finally {
            if (shLoading) setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearch, showInactive, selectedTags]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    /* ───────── table handlers ───────── */
    const changePage = (_: unknown, p: number) => setPage(p);
    const changeRpp = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRpp(parseInt(e.target.value, 10));
        setPage(0);
    };

    /* ───────── search / filters ───────── */
    const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        setPage(0);
    };
    const inactiveChange = (c: boolean) => {
        setShowInactive(c);
        setPage(0);
    };
    const tagFilterChange = (t: Tag[]) => {
        setSelectedTags(t);
        setPage(0);
    };

    /* ───────── delete ───────── */
    const askDelete = (c: Customer) => {
        setDelCust(c);
        setDelOpen(true);
    };
    const closeDel = () => {
        setDelOpen(false);
        setDelCust(null);
    };
    const doDelete = async () => {
        if (!delCust) return;
        try {
            await deleteCustomer(delCust.uuid);
            fetchCustomers(false);
            closeDel();
        } catch {
            setError('Failed to delete customer');
        }
    };

    /* ───────── form modal ───────── */
    const openAdd = () => {
        setEdit(null);
        setFormOpen(true);
    };
    const openEdit = (c: Customer) => {
        setEdit(c);
        setFormOpen(true);
    };
    const closeForm = () => {
        setFormOpen(false);
        setEdit(null);
    };
    const saveOk = () => fetchCustomers(false);

    /* ───────── import modal ───────── */
    const openImport = () => setImportOpen(true);
    const closeImport = () => setImportOpen(false);

    /* ───────── import-jobs nav ───────── */   // ★ NEW
    const openImportJobs = () => navigate('/imports');

    return (
        <MainLayout title="Customers">
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: {xs: 2, sm: 3}, borderRadius: 3, overflow: 'hidden'}} elevation={2}>

                    <CustomerPageFilterBar
                        showInactive={showInactive}
                        searchTermInput={searchInput}
                        handleShowInactiveChange={inactiveChange}
                        handleSearchChange={searchChange}
                        handleOpenAddModal={openAdd}
                        handleOpenImportModal={openImport}
                        handleOpenImportJobs={openImportJobs}     /* ★ NEW */
                        selectedTags={selectedTags}
                        onTagFilterChange={tagFilterChange}
                    />

                    {loading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {error && !loading && (
                        <Alert severity="error" sx={{my: 2, mx: 'auto', maxWidth: 600}}>{error}</Alert>
                    )}

                    {!loading && !error && (
                        <CustomerTable
                            customers={customers}
                            totalCustomers={totalCustomers}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            handleChangePage={changePage}
                            handleChangeRowsPerPage={changeRpp}
                            onEditCustomer={openEdit}
                            debouncedSearchTerm={debouncedSearch}
                            onDeleteCustomer={askDelete}
                        />
                    )}
                </Paper>
            </Container>

            {/* ───────── dialogs ───────── */}
            <CustomerFormDialog
                open={formOpen} onClose={closeForm}
                onSaveSuccess={saveOk} customerToEdit={editCustomer}
            />

            <ImportCustomersDialog open={importOpen} onClose={closeImport}/>

            <Dialog open={delOpen} onClose={closeDel}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {delCust?.first_name || 'this customer'}?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDel}>Cancel</Button>
                    <Button onClick={doDelete} color="error" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default Customers;
