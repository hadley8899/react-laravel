import React, {useCallback, useEffect, useState} from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Container,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import {Vehicle} from '../interfaces/Vehicle';
import {
    getVehicles,
    deleteVehicle
} from '../services/VehicleService';
import VehicleFormDialog from '../components/vehicles/VehicleFormDialog';
import VehiclesTopBar from '../components/vehicles/VehiclesTopBar';
import VehiclesTable from '../components/vehicles/VehiclesTable';

function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    /* ---------- form & delete dialogs ---------- */
    const [formOpen, setFormOpen] = useState(false);
    const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    /* ---------- fetch list ---------- */
    const fetchVehicles = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const res = await getVehicles(page + 1, rowsPerPage, debouncedSearch);
            setVehicles(res.data);
            setTotal(res.meta.total);
        } catch (err: any) {
            setError(err.message || 'Failed to load vehicles');
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearch]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    /* ---------- helpers ---------- */
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSelected(e.target.checked ? vehicles.map(v => v.uuid) : []);

    const handleRowClick = (uuid: string) =>
        setSelected(prev =>
            prev.includes(uuid) ? prev.filter(x => x !== uuid) : [...prev, uuid]
        );

    const handleEditVehicle = (vehicle: Vehicle) => {
        setVehicleToEdit(vehicle);
        setFormOpen(true);
    };

    /* ---------- top-bar actions ---------- */
    const handleOpenAdd = () => {
        setVehicleToEdit(null);
        setFormOpen(true);
    };

    const handleDeleteSelected = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await Promise.all(selected.map(uuid => deleteVehicle(uuid)));
            setSelected([]);
            await fetchVehicles(false);
        } catch (err: any) {
            setError('Failed to delete vehicles');
            console.error(err);
        } finally {
            setDeleteDialogOpen(false);
            setIsDeleting(false);
        }
    };

    /* ---------- render ---------- */
    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                    <VehiclesTopBar
                        searchInput={search}
                        onSearchChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        selectedCount={selected.length}
                        onAdd={handleOpenAdd}
                        onDeleteSelected={handleDeleteSelected}
                        onRefresh={() => fetchVehicles()}
                    />

                    <VehiclesTable
                        vehicles={vehicles}
                        selected={selected}
                        loading={loading}
                        error={error}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        total={total}
                        onRowClick={handleRowClick}
                        onEdit={handleEditVehicle}
                        onSelectAll={handleSelectAll}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            </Container>

            {/*  Add / Edit dialog  */}
            <VehicleFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                vehicleToEdit={vehicleToEdit}
                onSaveSuccess={() => fetchVehicles(false)}
            />

            {/*  Delete confirmation  */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Delete {selected.length} vehicle{selected.length === 1 ? '' : 's'}?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? <CircularProgress size={24}/> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default Vehicles;
