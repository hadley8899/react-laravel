import React from "react";
import {
    alpha,
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent, Chip,
    Grid,
    IconButton, TablePagination,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import {Customer} from "../../interfaces/Customer.ts";

interface CustomerTableProps {
    customers: Customer[],
    debouncedSearchTerm: string,
    totalCustomers: number,
    rowsPerPage: number,
    page: number,
    handleChangePage: (_event: unknown, newPage: number) => void,
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onEditCustomer: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
                                                         customers,
                                                         debouncedSearchTerm,
                                                         totalCustomers,
                                                         rowsPerPage,
                                                         page,
                                                         handleChangePage,
                                                         handleChangeRowsPerPage,
                                                     }) => {
    const theme = useTheme();

    const getStatusChip = (status: Customer['status']) => {
        let color: "success" | "error" | "info" | "default" = "default";
        let variant: "filled" | "outlined" = "outlined"; // Default to outlined
        switch (status) {
            case 'Active':
                color = "success";
                variant = "filled";
                break; // Make Active filled
            case 'Inactive':
                color = "error";
                break;
        }
        return <Chip label={status} color={color} size="small" variant={variant} sx={{height: '24px'}}/>; // Ensure consistent height
    };

    const formatCurrency = (value: number, currencyCode = 'GBP') => {
        // Get currency symbol based on the currency code
        const formatter = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currencyCode,
        });

        // Format the number with the currency symbol
        return formatter.format(value);
    };

    return (
        <>

            <Grid container spacing={{xs: 2, md: 3}} alignItems="stretch">
                {customers.length > 0 ? (
                    customers.map(customer => (
                        <Grid key={customer.uuid} size={{xs: 12, sm: 6, lg: 3}}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: 3,
                                    transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
                                    '&:hover': {
                                        boxShadow: theme.shadows[6],
                                    }
                                }}
                                variant="outlined"
                            >
                                <CardContent
                                    sx={{flexGrow: 1, p: 2.5}}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        mb: 2.5
                                    }}>
                                        <Avatar
                                            src={customer.avatarUrl}
                                            alt={`${customer.firstName} ${customer.lastName}`}
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                mr: 2,
                                                bgcolor: alpha(theme.palette.primary.light, 0.2),
                                                color: 'primary.main'
                                            }}
                                        >
                                            {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                                        </Avatar>
                                        <Box sx={{flexGrow: 1}}>
                                            <Typography variant="h6" component="div" fontWeight="500"
                                                        noWrap gutterBottom>
                                                {customer.firstName} {customer.lastName}
                                            </Typography>
                                            {getStatusChip(customer.status)}
                                        </Box>
                                    </Box>
                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.2}}>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <EmailIcon color="action"
                                                       sx={{mr: 1.5, fontSize: '1.1rem'}}/>
                                            <Typography variant="body2" color="text.secondary" noWrap
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                {customer.email}
                                            </Typography>
                                        </Box>
                                        {customer.phone && (
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <PhoneIcon color="action"
                                                           sx={{mr: 1.5, fontSize: '1.1rem'}}/>
                                                <Typography variant="body2" color="text.secondary">
                                                    {customer.phone}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <EventIcon color="action"
                                                       sx={{mr: 1.5, fontSize: '1.1rem'}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                Joined: {new Date(customer.createdAt).toLocaleDateString('en-GB')} {/* UK format */}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary"
                                                    sx={{mt: 1, fontWeight: '500'}}>
                                            Total Spent: {formatCurrency(customer.totalSpent)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{justifyContent: 'flex-end', pt: 0, pb: 1.5, px: 1.5}}>
                                    <Tooltip title="View Details">
                                        <IconButton size="small"
                                                    onClick={() => alert(`View details for ${customer.firstName} (not implemented)`)}>
                                            <VisibilityIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Customer">
                                        <IconButton size="small"
                                                    onClick={() => alert(`Edit customer ${customer.firstName} (not implemented)`)}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid size={12}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 6,
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            <PeopleIcon sx={{fontSize: 40, color: 'text.secondary'}}/>
                            <Typography align="center" color="text.secondary">
                                {debouncedSearchTerm ? 'No customers found matching your search.' : 'No customers available.'}
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
            <TablePagination
                rowsPerPageOptions={[20, 60, 120, 240]}
                component="div"
                count={totalCustomers}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{mt: 4, borderTop: 1, borderColor: 'divider', pt: 2}}
            />
        </>
    )
}

export default CustomerTable;
