import React, {useEffect, useState} from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Typography,
    Container,
    Box,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CompanyInfo from '../components/settings/CompanyInfo';
import AppointmentSettings from '../components/settings/AppointmentSettings';
import InvoiceAndPaymentSettings from '../components/settings/InvoiceAndPaymentSettings';
import NotificationPreferences from '../components/settings/NotificationPreferences';
import SettingsThemeSwitcher from '../components/settings/SettingsThemeSwitcher';
import {Company} from '../interfaces/Company';
import {getMyCompany} from '../services/CompanyService';
import UserManagementLink from '../components/settings/UserManagementLink';
import {hasPermission} from '../services/AuthService';
import CompanyVariablesSettings from '../components/settings/CompanyVariablesSettings';
import SendingDomainsSettings from '../components/settings/SendingDomainsSettings';

const Settings: React.FC = () => {
    const [company, setCompany] = useState<Company | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const c = await getMyCompany();
                if (c) setCompany(c);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    return (
        <MainLayout title="Settings">
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        <SettingsIcon sx={{mr: 1, verticalAlign: 'middle', fontSize: '2rem'}}/>
                        Application Settings
                    </Typography>
                </Box>

                {hasPermission('update_company') && (
                    <CompanyInfo company={company} setCompany={setCompany}/>
                )}
                {hasPermission('update_appointment_settings') && (
                    <AppointmentSettings company={company} setCompany={setCompany}/>
                )}
                {hasPermission('update_invoice_settings') && (
                    <InvoiceAndPaymentSettings company={company} setCompany={setCompany}/>
                )}

                <SendingDomainsSettings/>

                <CompanyVariablesSettings/>
                {hasPermission('manage_users') && <UserManagementLink/>}
                <NotificationPreferences/>
                <SettingsThemeSwitcher/>
            </Container>
        </MainLayout>
    );
};

export default Settings;
