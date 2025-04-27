import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Checkbox, CircularProgress, Alert, TablePagination,
    Box, IconButton, Tooltip
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
            <TableContainer>
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

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </>
    );
};

export default VehiclesTable;
