import React, {useState} from 'react';
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Typography,
    CircularProgress,
} from '@mui/material';

import CompanyInfoWizard from '../components/setup/CompanyInfoWizard';
import {completeCompanySetup} from '../services/CompanyService';
import {useNotifier} from '../contexts/NotificationContext';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.tsx';
import AppointmentSettingsWizard from "../components/setup/AppointmentSettingsWizard.tsx";
import InvoiceAndPaymentSettingsWizard from "../components/setup/InvoiceAndPaymentSettingsWizard.tsx";

const steps = ['Company', 'Appointments', 'Billing'];

const CompanySetupWizard: React.FC = () => {
    const {user, setUser} = useAuth();
    const {showNotification} = useNotifier();
    const nav = useNavigate();

    const [company, setCompany] = useState(user?.company ?? null);
    const [active, setActive] = useState(0);
    const [saving, setSaving] = useState(false);

    const next = () => setActive(p => p + 1);
    const back = () => setActive(p => p - 1);

    const finish = async () => {
        if (!company || !user) return;
        setSaving(true);
        try {
            const updated = await completeCompanySetup(company.uuid, company);
            setCompany(updated);
            setUser({...user, company: updated});
            showNotification('Setup complete – welcome!', 'success');
            nav('/dashboard');
        } catch (e: any) {
            showNotification(e.message ?? 'Setup failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (!company || !user) {
        return (
            <Paper sx={{p: 4, maxWidth: 600, mx: 'auto', mt: 6}}>
                <Typography variant="h5" gutterBottom>
                    Loading company data...
                </Typography>
                <CircularProgress/>
            </Paper>
        );
    }

    return (
        <Paper sx={{p: 4, maxWidth: 900, mx: 'auto', mt: 6}}>
            <Typography variant="h4" gutterBottom>
                First-time Company Setup
            </Typography>

            <Stepper activeStep={active} sx={{mb: 4}}>
                {steps.map(s => (
                    <Step key={s}>
                        <StepLabel>{s}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {active === 0 && <CompanyInfoWizard company={company} setCompany={setCompany}/>}
            {active === 1 && <AppointmentSettingsWizard company={company} setCompany={setCompany}/>}
            {active === 2 && <InvoiceAndPaymentSettingsWizard company={company} setCompany={setCompany}/>}

            <Box sx={{mt: 3, textAlign: 'right'}}>
                {active > 0 && (
                    <Button onClick={back} sx={{mr: 1}}>
                        Back
                    </Button>
                )}
                {active < steps.length - 1 ? (
                    <Button variant="contained" onClick={next}>
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={saving && <CircularProgress size={20}/>}
                        disabled={saving}
                        onClick={finish}
                    >
                        {saving ? 'Saving…' : 'Finish'}
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default CompanySetupWizard;
