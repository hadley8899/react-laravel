import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Checkbox, CircularProgress, Alert, TablePagination,
    Box, IconButton, Tooltip, Paper, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Link as RouterLink} from 'react-router-dom';
import {Vehicle} from '../../interfaces/Vehicle';

interface VehiclesTableProps {
    vehicles: Vehicle[];
    selected: string[];
    loading: boolean;
    error: string | null;
    page?: number;
    rowsPerPage?: number;
    total?: number;
    onRowClick: (uuid: string) => void;
    onEdit?: ((vehicle: Vehicle) => void) | null;
    onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPageChange?: (event: unknown, newPage: number) => void;
    onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showSelectBoxes?: boolean | null;
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
                                                         onRowsPerPageChange,
                                                         showSelectBoxes = true,
                                                     }) => {
    const isSelected = (uuid: string) => selected.includes(uuid);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const showEditIcon = typeof onEdit === 'function';

    // Determine if pagination should be shown
    const showPagination = typeof onPageChange === 'function' && typeof onRowsPerPageChange === 'function' && typeof page === 'number' && typeof rowsPerPage === 'number' && typeof total === 'number';

    // If no pagination, show all vehicles (up to 1000)
    const displayVehicles = showPagination ? vehicles : vehicles.slice(0, 1000);

    return (
        <>
            {/* Desktop Table */}
            <TableContainer sx={{display: {xs: 'none', md: 'block'}}}>
                <Table>
                    <TableHead sx={{backgroundColor: t => t.palette.action.hover}}>
                        <TableRow>
                            {showSelectBoxes && (
                                <TableCell padding="checkbox">
                                    {onSelectAll && (
                                        <Checkbox
                                            indeterminate={
                                                selected.length > 0 && selected.length < displayVehicles.length
                                            }
                                            checked={
                                                displayVehicles.length > 0 && selected.length === displayVehicles.length
                                            }
                                            onChange={onSelectAll}
                                        />
                                    )}
                                </TableCell>
                            )}
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
                        {displayVehicles.map(vehicle => {
                            const isItemSelected = isSelected(vehicle.uuid);
                            return (
                                <TableRow
                                    hover
                                    key={vehicle.uuid}
                                    selected={isItemSelected}
                                    sx={{cursor: 'pointer'}}
                                >
                                    {showSelectBoxes && (
                                        <TableCell padding="checkbox" onClick={() => onRowClick(vehicle.uuid)}>
                                            <Checkbox checked={isItemSelected}/>
                                        </TableCell>
                                    )}
                                    <TableCell sx={{fontWeight: 500}} onClick={() => onRowClick(vehicle.uuid)}>
                                        {vehicle.make} {vehicle.model}
                                    </TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.year}</TableCell>
                                    <TableCell
                                        onClick={() => onRowClick(vehicle.uuid)}>{vehicle.registration}</TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>
                                        {vehicle.customer?.first_name} {vehicle.customer?.last_name}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => onRowClick(vehicle.uuid)}>{vehicle.last_service}</TableCell>
                                    <TableCell
                                        onClick={() => onRowClick(vehicle.uuid)}>{vehicle.next_service_due}</TableCell>
                                    <TableCell onClick={() => onRowClick(vehicle.uuid)}>{vehicle.type}</TableCell>
                                    <TableCell>
                                        {showEditIcon && (
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit?.(vehicle);
                                                    }}
                                                    size="small"
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="View">
                                            <IconButton
                                                color="primary"
                                                component={RouterLink}
                                                to={`/vehicles/${vehicle.uuid}`}
                                                onClick={e => e.stopPropagation()}
                                                size="small"
                                            >
                                                <VisibilityIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {/* Pagination only if handlers and values are provided */}
                {showPagination && (
                    <Box sx={{px: 2, pb: 2}}>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={total!}
                            rowsPerPage={rowsPerPage!}
                            page={page!}
                            onPageChange={onPageChange!}
                            onRowsPerPageChange={onRowsPerPageChange!}
                        />
                    </Box>
                )}
            </TableContainer>

            {/* Mobile Cards */}
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                {displayVehicles.length === 0 ? (
                    <Box sx={{py: 4, textAlign: 'center'}}>
                        <Typography color="text.secondary">
                            No vehicles found.
                        </Typography>
                    </Box>
                ) : (
                    displayVehicles.map(vehicle => {
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
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    {showSelectBoxes && (
                                        <Checkbox
                                            checked={isItemSelected}
                                            onChange={() => onRowClick(vehicle.uuid)}
                                            sx={{mr: 1}}
                                        />
                                    )}
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {vehicle.make} {vehicle.model} ({vehicle.year})
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                    <strong>Registration:</strong> {vehicle.registration}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                    <strong>Owner:</strong> {vehicle.customer?.first_name} {vehicle.customer?.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                    <strong>Last Service:</strong> {vehicle.last_service}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                    <strong>Next Due:</strong> {vehicle.next_service_due}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                    <strong>Type:</strong> {vehicle.type}
                                </Typography>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    {showEditIcon && (
                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    onEdit?.(vehicle);
                                                }}
                                                size="small"
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="View">
                                        <IconButton
                                            color="primary"
                                            component={RouterLink}
                                            to={`/vehicles/${vehicle.uuid}`}
                                            onClick={e => e.stopPropagation()}
                                            size="small"
                                        >
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        );
                    })
                )}

                {showPagination && (
                    <Box
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            zIndex: 10,
                            borderTop: 1,
                            borderColor: 'divider',
                            px: 1,
                            py: 1,
                        }}
                    >
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={total!}
                            rowsPerPage={rowsPerPage!}
                            page={page!}
                            onPageChange={onPageChange!}
                            onRowsPerPageChange={onRowsPerPageChange!}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default VehiclesTable;
