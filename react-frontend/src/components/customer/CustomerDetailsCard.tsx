import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { Customer } from '../../interfaces/Customer';
import TagChip from '../TagChip';

interface CustomerDetailsCardProps {
    customer: Customer;
}

const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({
                                                                     customer,
                                                                 }) => {
    const getStatusChip = (status: Customer['status']) => {
        let color: 'success' | 'error' = 'error';
        let variant: 'filled' | 'outlined' = 'outlined';
        if (status === 'Active') {
            color = 'success';
            variant = 'filled';
        }
        return <Chip label={status} color={color} size="small" variant={variant} />;
    };

    const formatCurrency = (value: number, currencyCode = 'GBP') => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currencyCode,
        }).format(value);
    };

    return (
        <Grid container spacing={3}>
            {/* Left column */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    {getStatusChip(customer.status)}
                    {customer.tags && customer.tags.length > 0 && (
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.75,
                                justifyContent: 'center',
                            }}
                        >
                            {customer.tags.map((tag) => (
                                <TagChip key={tag.uuid} tag={tag} />
                            ))}
                        </Box>
                    )}
                </Box>
            </Grid>

            {/* Right column */}
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
                                <Typography variant="body1">{customer.phone}</Typography>
                            </Box>
                        </Grid>
                    )}

                    {/* Address */}
                    {customer.address && (
                        <Grid size={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 1,
                                }}
                            >
                                <LocationOnIcon color="action" />
                                <Typography
                                    variant="body1"
                                    sx={{ whiteSpace: 'pre-line' }}
                                >
                                    {customer.address}
                                </Typography>
                            </Box>
                        </Grid>
                    )}

                    {/* Total spent */}
                    <Grid size={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mt: 2,
                            }}
                        >
                            <MonetizationOnIcon color="action" />
                            <Typography variant="body1" fontWeight="500">
                                Total Spent: {formatCurrency(customer.total_spent)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CustomerDetailsCard;
