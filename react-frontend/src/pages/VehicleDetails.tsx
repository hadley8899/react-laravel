import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link as RouterLink} from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Chip,
    Container,
    Divider,
    Link,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import {Vehicle} from '../interfaces/Vehicle';
import {getVehicle} from '../services/VehicleService';
import MainLayout from "../components/layout/MainLayout.tsx";

const formatUKRegistration = (reg: string) => {
    if (!reg) return '';
    const cleaned = reg.replace(/\s+/g, '').toUpperCase();
    if (cleaned.length === 7) {
        return cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
    }
    return cleaned;
};

const VehicleDetails: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uuid) return;
        setLoading(true);
        setError(null);
        getVehicle(uuid)
            .then(setVehicle)
            .catch(() => setError('Failed to load vehicle details.'))
            .finally(() => setLoading(false));
    }, [uuid]);

    return (
        <MainLayout title="Vehicle Details">
            <Container>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={() => navigate(-1)}
                    sx={{mb: 2}}
                >
                    Back
                </Button>
                <Paper elevation={3} sx={{p: {xs: 2, sm: 4}, borderRadius: 3}}>
                    {loading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200}}>
                            <CircularProgress/>
                        </Box>
                    )}
                    {error && !loading && (
                        <Alert severity="error">{error}</Alert>
                    )}
                    {vehicle && !loading && !error && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                <DirectionsCarIcon color="primary" sx={{ fontSize: 36 }} />
                                <Typography variant="h5" fontWeight={700}>
                                    {vehicle.make} {vehicle.model} <Typography component="span" color="text.secondary" fontWeight={400}>({vehicle.year})</Typography>
                                </Typography>
                            </Stack>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Chip
                                    label={formatUKRegistration(vehicle.registration)}
                                    color="primary"
                                    sx={{
                                        fontSize: 28,
                                        fontWeight: 700,
                                        letterSpacing: 2,
                                        bgcolor: '#ffeb3b',
                                        color: '#222',
                                        border: '2px solid #222',
                                        borderRadius: '4px',
                                        px: 3,
                                        py: 1,
                                        fontFamily: 'monospace',
                                        boxShadow: 2,
                                    }}
                                />
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <PersonIcon color="action" />
                                        <Typography variant="subtitle2" color="text.secondary">Owner</Typography>
                                    </Stack>
                                    {vehicle.customer ? (
                                        <Link
                                            component={RouterLink}
                                            to={`/customers/${vehicle.customer.uuid}`}
                                            underline="hover"
                                            fontWeight={500}
                                            color="primary"
                                            sx={{ fontSize: 18 }}
                                        >
                                            {vehicle.customer.first_name} {vehicle.customer.last_name}
                                        </Link>
                                    ) : (
                                        <Typography>N/A</Typography>
                                    )}
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <BuildIcon color="action" />
                                        <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: 18 }}>{vehicle.type || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <CalendarMonthIcon color="action" />
                                        <Typography variant="subtitle2" color="text.secondary">Last Service</Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: 18 }}>{vehicle.last_service || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <CalendarMonthIcon color="action" />
                                        <Typography variant="subtitle2" color="text.secondary">Next Service Due</Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: 18 }}>{vehicle.next_service_due || 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default VehicleDetails;
