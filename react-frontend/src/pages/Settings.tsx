import React, {useEffect, useState} from "react";
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
import {Company} from "../interfaces/Company.ts";
import {getMyCompany} from "../services/CompanyService.ts";
import UserManagementLink from "../components/settings/UserManagementLink.tsx";
import {hasPermission} from "../services/AuthService.ts";
import CompanyVariablesSettings from "../components/settings/CompanyVariablesSettings.tsx";
// import Integrations from "../components/settings/Integrations.tsx";

const Settings: React.FC = () => {

    const [company, setCompany] = useState<Company | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const c = await getMyCompany();
                if (c) {
                    setCompany(c);
                }
            } catch (e: any) {
                console.error(e);
            }
        })();
    }, []);

    return (
        <MainLayout title="Settings">
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        <SettingsIcon sx={{mr: 1, verticalAlign: 'middle', fontSize: '2rem'}}/>
                        Application Settings
                    </Typography>
                </Box>

                {/* First accordion expanded by default */}
                {hasPermission('update_company') && (
                    <CompanyInfo company={company} setCompany={setCompany}/>
                )}
                {hasPermission('update_appointment_settings') && (
                    <AppointmentSettings company={company} setCompany={setCompany}/>
                )}
                {hasPermission('update_invoice_settings') && (
                    <InvoiceAndPaymentSettings company={company} setCompany={setCompany}/>
                )}
                <CompanyVariablesSettings/>
                {hasPermission('manage_users') && (<UserManagementLink/>)}
                <NotificationPreferences/>
                <SettingsThemeSwitcher/>
                {/*<Integrations/>*/}
            </Container>ß
        </MainLayout>
    );
};

export default Settings;
