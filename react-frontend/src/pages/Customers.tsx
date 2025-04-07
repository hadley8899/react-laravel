import React, {useState} from 'react';
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    TextField,
    InputAdornment,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Avatar,
    Chip,
    TablePagination, // Re-using pagination component
    IconButton,
    Tooltip,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from "@mui/icons-material/Add";

// Import data and interface
import {Customer} from "../interfaces/Customer";
import customersData from "../example-data/customers"; // Default import

const Customers: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6); // Adjust rows per page for card layout
    const [searchTerm, setSearchTerm] = useState("");

    // Filter customers based on search term (checking name and email)
    const filteredCustomers = customersData.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get status color for Chips
    const getStatusChip = (status: Customer['status']) => {
        switch (status) {
            case 'Active':
                return <Chip label={status} color="success" size="small" variant="outlined"/>;
            case 'Inactive':
                return <Chip label={status} color="error" size="small" variant="outlined"/>;
            case 'Prospect':
                return <Chip label={status} color="info" size="small" variant="outlined"/>;
            default:
                return <Chip label={status} size="small" variant="outlined"/>;
        }
    };

    // Calculate customers for the current page
    const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: 3, borderRadius: 2, overflow: 'hidden'}} elevation={3}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap', // Allow wrapping on small screens
                            gap: 2, // Add space between items if they wrap
                            mb: 3
                        }}
                    >
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            <PeopleIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                            Customer Management
                        </Typography>

                        <Box sx={{display: 'flex', gap: 1, flexWrap: 'nowrap'}}>
                            <TextField
                                variant="outlined"
                                placeholder="Search customers..."
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
                                sx={{minWidth: '250px'}} // Give search some minimum space
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                size="medium" // Match text field size better
                            >
                                Add Customer
                            </Button>
                        </Box>
                    </Box>

                    {/* Customer Grid */}
                    <Grid container spacing={3}>
                        {paginatedCustomers.length > 0 ? (
                            paginatedCustomers.map(customer => (
                                <Grid key={customer.id}>
                                    <Card sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                        <CardContent sx={{flexGrow: 1}}>
                                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                                <Avatar
                                                    src={customer.avatarUrl}
                                                    alt={`${customer.firstName} ${customer.lastName}`}
                                                    sx={{width: 56, height: 56, mr: 2}}
                                                >
                                                    {/* Fallback initials */}
                                                    {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" component="div" noWrap>
                                                        {customer.firstName} {customer.lastName}
                                                    </Typography>
                                                    {getStatusChip(customer.status)}
                                                </Box>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                                <EmailIcon color="action" sx={{mr: 1, fontSize: '1rem'}}/>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {customer.email}
                                                </Typography>
                                            </Box>
                                            {customer.phone && (
                                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                                    <PhoneIcon color="action" sx={{mr: 1, fontSize: '1rem'}}/>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {customer.phone}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                                Registered: {new Date(customer.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Spent: ${customer.totalSpent.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{justifyContent: 'flex-end', pt: 0}}>
                                            <Tooltip title="View Details">
                                                <IconButton size="small">
                                                    <VisibilityIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Customer">
                                                <IconButton size="small">
                                                    <EditIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid>
                                <Typography align="center" color="text.secondary" sx={{mt: 4}}>
                                    No customers found matching your search criteria.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[6, 12, 24]} // Adjusted options for grid
                        component="div"
                        count={filteredCustomers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{mt: 3, borderTop: 1, borderColor: 'divider'}} // Add separator
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
}

export default Customers;
