import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import MainLayout from '../components/layout/MainLayout';
import AppointmentForm from '../components/appointments/AppointmentForm';
import { getAppointment } from '../services/appointmentService';
import { Appointment } from '../interfaces/Appointment';

const AppointmentEdit: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const nav = useNavigate();

    const [data, setData] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const appt = await getAppointment(uuid!);
                setData(appt);
            } catch {
                setError('Appointment not found');
            } finally {
                setLoading(false);
            }
        })();
    }, [uuid]);

    return (
        <MainLayout>
            {loading ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : error || !data ? (
                <Box sx={{ p: 6 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : (
                <AppointmentForm
                    mode="edit"
                    initial={data}
                    onSuccess={(saved) => nav(`/appointments/${saved.uuid}`)}
                />
            )}
        </MainLayout>
    );
};

export default AppointmentEdit;
