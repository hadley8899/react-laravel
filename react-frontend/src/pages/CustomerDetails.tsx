import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../components/layout/MainLayout';
import {Customer} from '../interfaces/Customer';
import {getCustomer} from '../services/CustomerService';
import CustomerDetailsCard from '../components/customer/CustomerDetailsCard.tsx';
import {getVehicles} from '../services/VehicleService';
import VehiclesTable from '../components/vehicles/VehiclesTable';
import {Vehicle} from "../interfaces/Vehicle.ts";


const CustomerDetails: React.FC = () => {
    const {uuid} = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Vehicles state for this customer
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(false);
    const [vehiclesError, setVehiclesError] = useState<string | null>(null);

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
        fetchCustomer().then();
    }, [uuid]);

    useEffect(() => {
        if (!uuid) return;
        setVehiclesLoading(true);
        setVehiclesError(null);
        getVehicles(1, 1000, '', uuid)
            .then(res => setVehicles(res.data))
            .catch(err => setVehiclesError(err.message || 'Failed to load vehicles for this customer.'))
            .finally(() => setVehiclesLoading(false));
    }, [uuid]);

    const handleBackToList = () => {
        navigate('/customers');
    };

    return (
        <MainLayout title="Customer Details">
            <Container>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBackToList}
                    sx={{mb: 2}}
                >
                    Back to Customers
                </Button>

                <Paper elevation={3} sx={{p: {xs: 2, sm: 3}, borderRadius: 3, mb: 4}}>
                    {loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '300px'
                            }}
                        >
                            <CircularProgress/>
                        </Box>
                    )}
                    {error && !loading && (
                        <Alert severity="error">{error}</Alert>
                    )}
                    {customer && !loading && !error && (
                        <CustomerDetailsCard customer={customer}/>
                    )}
                </Paper>

                <Paper elevation={3} sx={{p: {xs: 2, sm: 3}, borderRadius: 3}}>
                    <Box sx={{mb: 2}}>
                        <strong>Vehicles</strong>
                    </Box>
                    <VehiclesTable
                        vehicles={vehicles}
                        selected={[]}
                        loading={vehiclesLoading}
                        error={vehiclesError}
                        showSelectBoxes={false}
                        onRowClick={() => {}}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default CustomerDetails;
