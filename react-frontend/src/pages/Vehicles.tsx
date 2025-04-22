import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Typography,
    Container,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    TextField,
    InputAdornment,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VehiclesTopBar from '../components/vehicles/VehiclesTopBar';
import { Vehicle } from '../interfaces/Vehicle';
import { getVehicles } from '../services/VehicleService';

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
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const debounced = useDebounce(search);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---------- Fetch list ---------- */
    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getVehicles(page + 1, rowsPerPage, debounced);
            setVehicles(res.data);
            setTotal(res.meta.total);
        } catch (err: any) {
            setError(err.message || 'Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, debounced]);

    useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

    /* ---------- table helpers ---------- */
    const isSelected = (uuid: string) => selected.includes(uuid);
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSelected(e.target.checked ? vehicles.map(v => v.uuid) : []);

    const handleRowClick = (uuid: string) =>
        setSelected(prev =>
            prev.includes(uuid) ? prev.filter(x => x !== uuid) : [...prev, uuid]
        );

    const getStatusStyle = (status: Vehicle['status']) => {
        const map: Record<Vehicle['status'], { bg: string; color: string }> = {
            'In Service': { bg: '#e3f2fd', color: '#1976d2' },
            'Ready for Pickup': { bg: '#e8f5e9', color: '#2e7d32' },
            'Awaiting Parts': { bg: '#fff3e0', color: '#e65100' },
            Scheduled: { bg: '#e8eaf6', color: '#3f51b5' },
            Diagnostic: { bg: '#f3e5f5', color: '#7b1fa2' },
            Complete: { bg: '#e0f2f1', color: '#00796b' }
        };
        return map[status] ?? { bg: '#eeeeee', color: '#616161' };
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
                    {/* header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            <DirectionsCarIcon sx={{ mr: 1 }} />
                            Vehicle Management
                        </Typography>

                        <TextField
                            size="small"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    <VehiclesTopBar selectedVehicles={selected} onRefresh={fetchVehicles} />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: t => t.palette.action.hover }}>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={
                                                        selected.length > 0 && selected.length < vehicles.length
                                                    }
                                                    checked={
                                                        vehicles.length > 0 && selected.length === vehicles.length
                                                    }
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell><strong>Make / Model</strong></TableCell>
                                            <TableCell><strong>Year</strong></TableCell>
                                            <TableCell><strong>Registration</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Owner</strong></TableCell>
                                            <TableCell><strong>Last Service</strong></TableCell>
                                            <TableCell><strong>Next Due</strong></TableCell>
                                            <TableCell><strong>Type</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vehicles.map(v => {
                                            const sel = isSelected(v.uuid);
                                            const st = getStatusStyle(v.status);
                                            return (
                                                <TableRow
                                                    hover
                                                    key={v.uuid}
                                                    selected={sel}
                                                    onClick={() => handleRowClick(v.uuid)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={sel} />
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>
                                                        {v.make} {v.model}
                                                    </TableCell>
                                                    <TableCell>{v.year}</TableCell>
                                                    <TableCell>{v.registration}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={v.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: st.bg,
                                                                color: st.color,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{v.owner}</TableCell>
                                                    <TableCell>{v.lastService}</TableCell>
                                                    <TableCell>{v.nextServiceDue}</TableCell>
                                                    <TableCell>{v.type}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(_, p) => setPage(p)}
                                onRowsPerPageChange={e => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Vehicles;
