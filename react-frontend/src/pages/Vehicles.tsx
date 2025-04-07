import React, {useState} from "react";
import MainLayout from "../components/layout/MainLayout";
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
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VehiclesTopBar from "../components/vehicles/VehiclesTopBar.tsx";
import {Vehicle} from "../interfaces/Vehicle.ts";
import vehicles from "../example-data/vehicles.tsx"

// Sample vehicle data
const sampleVehicles: Vehicle[] = vehicles;

const Vehicles: React.FC = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter vehicles based on search term
    const filteredVehicles = sampleVehicles.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = filteredVehicles.map(vehicle => vehicle.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Service':
                return {bg: '#e3f2fd', color: '#1976d2'};
            case 'Ready for Pickup':
                return {bg: '#e8f5e9', color: '#2e7d32'};
            case 'Awaiting Parts':
                return {bg: '#fff3e0', color: '#e65100'};
            case 'Scheduled':
                return {bg: '#e8eaf6', color: '#3f51b5'};
            case 'Diagnostic':
                return {bg: '#f3e5f5', color: '#7b1fa2'};
            case 'Complete':
                return {bg: '#e0f2f1', color: '#00796b'};
            default:
                return {bg: '#eeeeee', color: '#616161'};
        }
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                    {/* Header with title and search */}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            <DirectionsCarIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                            Vehicle Management
                        </Typography>

                        <TextField
                            variant="outlined"
                            placeholder="Search vehicles..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <VehiclesTopBar selectedVehicles={selected} />

                    {/* Vehicles table */}
                    <TableContainer>
                        <Table sx={{minWidth: 750}}>
                            <TableHead sx={{backgroundColor: (theme) => theme.palette.action.hover}}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < filteredVehicles.length}
                                            checked={filteredVehicles.length > 0 && selected.length === filteredVehicles.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell><strong>Make/Model</strong></TableCell>
                                    <TableCell><strong>Year</strong></TableCell>
                                    <TableCell><strong>License Plate</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Owner</strong></TableCell>
                                    <TableCell><strong>Last Service</strong></TableCell>
                                    <TableCell><strong>Next Due</strong></TableCell>
                                    <TableCell><strong>Type</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredVehicles
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(vehicle => {
                                        const isItemSelected = isSelected(vehicle.id);
                                        const statusStyle = getStatusColor(vehicle.status);

                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => handleClick(vehicle.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={vehicle.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isItemSelected}/>
                                                </TableCell>
                                                <TableCell sx={{fontWeight: 500}}>
                                                    {vehicle.make} {vehicle.model}
                                                </TableCell>
                                                <TableCell>{vehicle.year}</TableCell>
                                                <TableCell>{vehicle.licensePlate}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={vehicle.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: statusStyle.bg,
                                                            color: statusStyle.color,
                                                            fontWeight: 'medium'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{vehicle.owner}</TableCell>
                                                <TableCell>{vehicle.lastService}</TableCell>
                                                <TableCell>{vehicle.nextServiceDue}</TableCell>
                                                <TableCell>{vehicle.type}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredVehicles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Vehicles;
