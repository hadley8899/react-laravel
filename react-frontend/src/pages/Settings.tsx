import React from "react";
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Box,
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import CompanyInfo from "../components/settings/CompanyInfo.tsx";
import AppointmentSettings from "../components/settings/AppointmentSettings.tsx";
import InvoiceAndPaymentSettings from "../components/settings/InvoiceAndPaymentSettings.tsx";
import NotificationPreferences from "../components/settings/NotificationPreferences.tsx";
import SettingsThemeSwitcher from "../components/settings/SettingsThemeSwitcher.tsx";
import Integrations from "../components/settings/Integrations.tsx";

const Settings: React.FC = () => {
    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        <SettingsIcon sx={{mr: 1, verticalAlign: 'middle', fontSize: '2rem'}}/>
                        Application Settings
                    </Typography>
                </Box>

                <CompanyInfo/>
                <AppointmentSettings/>
                <InvoiceAndPaymentSettings/>
                <NotificationPreferences/>
                <SettingsThemeSwitcher/>
                <Integrations/>

            </Container>
        </MainLayout>
    );
};

export default Settings;
