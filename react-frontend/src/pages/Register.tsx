import React, { useState } from 'react';
import {
    TextField, Button, Typography,
    FormControlLabel, Checkbox, Tooltip, Box, Paper
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import AuthLayout from '../components/layout/AuthLayout';
import { registerUser } from '../services/AuthService.ts';
import { useNotifier } from '../context/NotificationContext.tsx';
import { Turnstile } from '@marsidev/react-turnstile';

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

type Step = 'form' | 'success';

const Register: React.FC = () => {
    const { showNotification } = useNotifier();
    const [step, setStep] = useState<Step>('form');

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyCode: '',
        companyName: '',
        createCompany: false,
        cfToken: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /* -------------------------------------------------- handlers */

    const handleChange =
        (field: string) =>
            (e: React.ChangeEvent<HTMLInputElement>) =>
                setState({ ...state, [field]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};

        // basic validation
        if (!state.name) errs.name = 'Name is required';
        if (!state.email) errs.email = 'Email is required';
        if (state.password.length < 6) errs.password = 'Min 6 chars';
        if (state.password !== state.confirmPassword)
            errs.confirmPassword = 'Passwords differ';
        if (state.createCompany) {
            if (!state.companyName) errs.companyName = 'Company name required';
        } else {
            if (!state.companyCode) errs.companyCode = 'Company code required';
        }
        if (!state.cfToken) errs.captcha = 'Please verify you are human';

        if (Object.keys(errs).length) return setErrors(errs);
        setErrors({});
        setLoading(true);

        try {
            await registerUser({
                name: state.name,
                email: state.email,
                password: state.password,
                password_confirmation: state.confirmPassword,
                company_code: state.createCompany ? undefined : state.companyCode,
                company_name: state.createCompany ? state.companyName : undefined,
                cf_turnstile_response: state.cfToken,
            });

            // Toast (optional) + swap UI
            showNotification('Registration successful!', 'success');
            setStep('success');
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ?? 'Registration failed – try again.';
            showNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <AuthLayout title="Almost there!">
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <MarkEmailReadIcon fontSize="large" sx={{ mb: 1 }} />
                    <Typography variant="h5" gutterBottom>
                        Check your inbox
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        We’ve sent you a confirmation email. Click the link inside to finish
                        setting up your account.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Didn’t get it? Look in Junk/Spam or&nbsp;
                        <Button size="small" onClick={() => window.location.reload()}>
                            register again
                        </Button>
                        &nbsp;with a different address.
                    </Typography>
                </Paper>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Register">
            <Typography variant="h5" gutterBottom>Register</Typography>

            {/* real form – Turnstile kept out */}
            <form id="register-form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={state.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={state.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={state.password}
                    onChange={handleChange('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={state.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />

                {/* explanation block */}
                <Box sx={{ mt: 2, mb: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={state.createCompany}
                                onChange={(e) =>
                                    setState({ ...state, createCompany: e.target.checked })
                                }
                            />
                        }
                        label="I’m creating a new company"
                    />
                    <Typography variant="body2" color="textSecondary">
                        {state.createCompany
                            ? 'Choose this if you’re the first person from your company. We’ll generate a shareable code you can give your team later.'
                            : 'Already have teammates on the platform? Enter the code they shared with you to join their workspace.'}
                    </Typography>
                </Box>

                {state.createCompany ? (
                    <TextField
                        label="Company Name"
                        placeholder="e.g. Stark Industries"
                        fullWidth
                        margin="normal"
                        value={state.companyName}
                        onChange={handleChange('companyName')}
                        error={!!errors.companyName}
                        helperText={errors.companyName}
                    />
                ) : (
                    <TextField
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Company Code
                                <Tooltip title="Usually 6–10 characters your admin gave you.">
                                    <InfoOutlinedIcon fontSize="small" />
                                </Tooltip>
                            </Box>
                        }
                        placeholder="e.g. ACME-42"
                        fullWidth
                        margin="normal"
                        value={state.companyCode}
                        onChange={handleChange('companyCode')}
                        error={!!errors.companyCode}
                        helperText={errors.companyCode}
                    />
                )}

                {errors.captcha && (
                    <Typography variant="caption" color="error">
                        {errors.captcha}
                    </Typography>
                )}

                {/* Add Turnstile inside the form, before the submit button */}
                <Box sx={{ mt: 3, mb: 3 }}>
                    <Turnstile
                        siteKey={siteKey}
                        onSuccess={(token) => {
                            // Update token without resetting other form fields
                            setState(prevState => ({
                                ...prevState,
                                cfToken: token
                            }));
                        }}
                        onExpire={() => {
                            setState(prevState => ({
                                ...prevState,
                                cfToken: ''
                            }));
                        }}
                        options={{
                            theme: 'light',
                            // Prevent any action that might reset the form
                            action: 'register_verification'
                        }}
                    />
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    form="register-form"
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? 'Registering…' : 'Register'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Register;
