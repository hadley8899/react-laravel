import React, {useContext} from 'react';
import {
    Container,
    Typography,
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

import {AuthContext} from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import StatsOverview from "../components/dashbaord/StatsOverview.tsx";
import DashboardCharts from "../components/dashbaord/DashboardCharts.tsx";
import DashboardRecords from "../components/dashbaord/DashboardRecords.tsx";

const Dashboard: React.FC = () => {
    const {user} = useContext(AuthContext);

    return (
        <MainLayout>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{mb: 4}}>
                    Welcome back, {user?.name || 'User'}!
                </Typography>
                <StatsOverview/>

                <DashboardCharts/>
                <DashboardRecords/>
            </Container>
        </MainLayout>
    );
};

export default Dashboard;
