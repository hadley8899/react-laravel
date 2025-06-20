import React, {useContext} from 'react';
import {Container, Typography} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import {AuthContext} from '../context/AuthContext';
import StatsOverview from '../components/dashboard/StatsOverview';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import DashboardRecords from '../components/dashboard/DashboardRecords';
import QuickLinks from '../components/dashboard/QuickLinks';

const Dashboard: React.FC = () => {
    const {user} = useContext(AuthContext);

    return (
        <MainLayout title="Dashboard">
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{mb: 4}}>
                    Welcome back, {user?.name ?? 'User'}!
                </Typography>

                <StatsOverview/>
                <QuickLinks />
                <DashboardCharts />
                <DashboardRecords />
            </Container>
        </MainLayout>
    );
};

export default Dashboard;
