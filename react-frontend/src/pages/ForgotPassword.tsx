import React, {useState} from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Link as MuiLink,
    CircularProgress,
    Alert
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import {forgotPassword} from "../services/authService";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        // Validation
        const newErrors: { email?: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Invalid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            await forgotPassword(email);
            setSuccess(true);
            setEmail(''); // Clear the form after successful submission
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    data?: {
                        errors?: Record<string, string>,
                        message?: string
                    }
                }
            };

            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({general: err.response.data.message});
            } else {
                setErrors({general: 'Request failed. Please try again.'});
            }
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Typography variant="h5" textAlign="center" gutterBottom>
                Forgot Password
            </Typography>

            {success ? (
                <Alert severity="success" sx={{width: '100%', mb: 2}}>
                    Password reset link has been sent to your email address.
                </Alert>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Typography variant="body2" sx={{mb: 2}}>
                        Enter your email address below and we'll send you a link to reset your password.
                    </Typography>

                    {errors.general && (
                        <Typography color="error" variant="body2" sx={{mb: 2}}>
                            {errors.general}
                        </Typography>
                    )}

                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{mt: 2}}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : 'Send Reset Link'}
                    </Button>
                </form>
            )}

            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <MuiLink
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    underline="hover"
                >
                    Back to Login
                </MuiLink>
            </Box>
        </AuthLayout>
    );
};

export default ForgotPassword;