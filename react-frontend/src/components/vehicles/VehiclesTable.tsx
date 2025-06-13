import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Checkbox, CircularProgress, Alert, TablePagination,
    Box, IconButton, Tooltip, Paper, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Vehicle } from '../../interfaces/Vehicle';

interface VehiclesTableProps {
    vehicles: Vehicle[];
    selected: string[];
    loading: boolean;
    error: string | null;
    page: number;
    rowsPerPage: number;
    total: number;
    onRowClick: (uuid: string) => void;
    onEdit: (vehicle: Vehicle) => void;
    onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VehiclesTable: React.FC<VehiclesTableProps> = ({
    vehicles,
    selected,
    loading,
    error,
    page,
    rowsPerPage,
    total,
    onRowClick,
    onEdit,
    onSelectAll,
    onPageChange,
    onRowsPerPageChange
}) => {
    const isSelected = (uuid: string) => selected.includes(uuid);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <>
            {/* Desktop Table */}
            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                <Table>
                    <TableHead sx={{backgroundColor: t => t.palette.action.hover}}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 && selected.length < vehicles.length
                                    }
                                    checked={
                                        vehicles.length > 0 && selected.length === vehicles.length
                                    }
                                    onChange={onSelectAll}
                                />
                            </TableCell>
                            <TableCell><strong>Make / Model</strong></TableCell>
                            <TableCell><strong>Year</strong></TableCell>
                            <TableCell><strong>Registration</strong></TableCell>
                            <TableCell><strong>Owner</strong></TableCell>
                            <TableCell><strong>Last Service</strong></TableCell>
                            <TableCell><strong>Next Due</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.map(vehicle => {
                            const isItemSelected = isSelected(vehicle.uuid);
                            return (
                                <TableRow
                                    hover
                                    key={vehicle.uuid}
                                    selected={isItemSelected}
                                    sx={{cursor: 'pointer'}}
                                >
                                    <TableCell padding="checkbox" onClick={() => onRowClick(vehicle.uuid)}>
                                        <Checkbox checked={isItemSelected} />
                                    </TableCell>
                                    <TableCell sx={{fontWeight: 500}} onClick={() => onRowClick(vehicle.uuid)}>
                                        {vehicle.make} {vehicle.model}
                                    </TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.year}</TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.registration}</TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>
                                        {vehicle.customer?.first_name} {vehicle.customer?.last_name}
                                    </TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.last_service}</TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.next_service_due}</TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.type}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton 
                                                color="primary" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(vehicle);
                                                }}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Mobile Cards */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {vehicles.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No vehicles found.
                        </Typography>
                    </Box>
                ) : (
                    vehicles.map(vehicle => {
                        const isItemSelected = isSelected(vehicle.uuid);
                        return (
                            <Paper
                                key={vehicle.uuid}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderLeft: t => isItemSelected ? `4px solid ${t.palette.primary.main}` : `4px solid transparent`,
                                    bgcolor: isItemSelected ? t => t.palette.action.selected : 'background.paper',
                                    boxShadow: 0,
                                    cursor: 'pointer',
                                }}
                                onClick={() => onRowClick(vehicle.uuid)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Checkbox
                                        checked={isItemSelected}
                                        onChange={() => onRowClick(vehicle.uuid)}
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {vehicle.make} {vehicle.model} ({vehicle.year})
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <strong>Registration:</strong> {vehicle.registration}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <strong>Owner:</strong> {vehicle.customer?.first_name} {vehicle.customer?.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <strong>Last Service:</strong> {vehicle.last_service}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <strong>Next Due:</strong> {vehicle.next_service_due}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Type:</strong> {vehicle.type}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onEdit(vehicle);
                                            }}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        );
                    })
                )}
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </Box>
        </>
    );
};

export default VehiclesTable;
