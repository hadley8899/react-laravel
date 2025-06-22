import React, {useState} from 'react';
import {useSearchParams, Link as RouterLink, useNavigate} from 'react-router-dom';
import {
    Box, Button, CircularProgress, TextField, Typography, Alert, Link as MuiLink,
} from '@mui/material';
import AuthLayout from '../components/layout/AuthLayout';
import {acceptInvitation} from '../services/AuthService.ts';

const AcceptInvitation: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token') || '';

    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; password_confirmation?: string; general?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await acceptInvitation(token, password, passwordConf);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({general: err.response.data.message});
            } else {
                setErrors({general: 'Something went wrong, please try again.'});
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <AuthLayout>
                <Alert severity="error">Invitation token missing – double-check the link.</Alert>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <Typography variant="h5" textAlign="center" gutterBottom>
                Set your password
            </Typography>

            {success ? (
                <Alert severity="success">Password saved – redirecting to login…</Alert>
            ) : (
                <form onSubmit={handleSubmit}>
                    {errors.general && (
                        <Typography color="error" variant="body2" mb={2}>{errors.general}</Typography>
                    )}

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={passwordConf}
                        onChange={(e) => setPasswordConf(e.target.value)}
                        error={Boolean(errors.password_confirmation)}
                        helperText={errors.password_confirmation}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{mt: 2}}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : 'Save Password'}
                    </Button>
                </form>
            )}

            <Box mt={3} display="flex" justifyContent="center">
                <MuiLink component={RouterLink} to="/login" variant="body2" underline="hover">
                    Back to Login
                </MuiLink>
            </Box>
        </AuthLayout>
    );
};

export default AcceptInvitation;
