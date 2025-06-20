import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AppointmentForm from '../components/appointments/AppointmentForm';

const AppointmentCreate: React.FC = () => {
    const nav = useNavigate();

    return (
        <MainLayout title="Create Appointment">
            <AppointmentForm
                mode="create"
                onSuccess={() => nav('/appointments')}
            />
        </MainLayout>
    );
};

export default AppointmentCreate;
