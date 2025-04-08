import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Avatar,
    Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { alpha } from '@mui/material/styles';

import MainLayout from '../components/layout/MainLayout';
import { Customer } from '../interfaces/Customer';
import { getCustomer } from '../services/CustomerService';  // We'll define this in CustomerService

const CustomerDetails: React.FC = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uuid) return;
        const fetchCustomer = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getCustomer(uuid);
                setCustomer(response);
            } catch (err: any) {
                console.error('Failed to fetch customer:', err);
                setError(err.message || 'Failed to load this customer. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [uuid]);

    const getStatusChip = (status: Customer['status']) => {
        let color: "success" | "error" = "error";
        let variant: "filled" | "outlined" = "outlined";
        if (status === 'Active') {
            color = 'success';
            variant = 'filled';
        }
        return <Chip label={status} color={color} size="small" variant={variant} />;
    };

    const formatCurrency = (value: number, currencyCode = 'GBP') => {
        const formatter = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currencyCode,
        });
        return formatter.format(value);
    };

    const handleBackToList = () => {
        navigate('/customers');
    };

    return (
        <MainLayout>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToList}
                    sx={{ mb: 2 }}
                >
                    Back to Customers
                </Button>

                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
                    {loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '300px'
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    {error && !loading && (
                        <Alert severity="error">{error}</Alert>
                    )}
                    {customer && !loading && !error && (
                        <Grid container spacing={3}>
                            {/* Left Column: Avatar and Status */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Avatar
                                        src={customer.avatar_url}
                                        alt={`${customer.first_name} ${customer.last_name}`}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mb: 2,
                                            bgcolor: alpha('#1976d2', 0.15),
                                            color: 'primary.main',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {customer.first_name?.charAt(0)}
                                        {customer.last_name?.charAt(0)}
                                    </Avatar>
                                    {getStatusChip(customer.status)}
                                </Box>
                            </Grid>

                            {/* Right Column: Customer Info */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h5" component="div" fontWeight="500">
                                        {customer.first_name} {customer.last_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Joined on {new Date(customer.created_at).toLocaleDateString('en-GB')}
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    {/* Email */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon color="action" />
                                            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                                {customer.email}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {/* Phone */}
                                    {customer.phone && (
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneIcon color="action" />
                                                <Typography variant="body1">
                                                    {customer.phone}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    {/* Address */}
                                    {customer.address && (
                                        <Grid size={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <LocationOnIcon color="action" />
                                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                                    {customer.address}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    {/* Total Spent */}
                                    <Grid size={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                            <MonetizationOnIcon color="action" />
                                            <Typography variant="body1" fontWeight="500">
                                                Total Spent: {formatCurrency(customer.total_spent)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default CustomerDetails;
