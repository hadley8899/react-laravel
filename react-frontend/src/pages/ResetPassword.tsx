import React, {useState, useEffect} from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Link as MuiLink,
    CircularProgress,
    Alert
} from '@mui/material';
import {Link as RouterLink, useNavigate, useSearchParams} from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import {resetPassword} from "../services/authService";

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        password?: string;
        password_confirmation?: string;
        general?: string;
        token?: string;
    }>({});
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setErrors({general: 'Invalid or expired reset link'});
        }
    }, [token, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !email) return;

        setLoading(true);
        setSuccess(false);

        // Validation
        const newErrors: { password?: string; password_confirmation?: string } = {};
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!passwordConfirmation) {
            newErrors.password_confirmation = 'Please confirm your password';
        } else if (password !== passwordConfirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            await resetPassword({
                email: email,
                token: token,
                password: password,
                password_confirmation: passwordConfirmation
            });

            setSuccess(true);
            // Redirect to login after successful password reset
            setTimeout(() => navigate('/login'), 3000);
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
                setErrors({general: 'Password reset failed. Please try again.'});
            }
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Typography variant="h5" textAlign="center" gutterBottom>
                Reset Password
            </Typography>

            {success ? (
                <Alert severity="success" sx={{width: '100%', mb: 2}}>
                    Your password has been reset successfully! You'll be redirected to the login page.
                </Alert>
            ) : (
                <>
                    {(!token || !email) ? (
                        <Alert severity="error" sx={{width: '100%', mb: 2}}>
                            Invalid or expired reset link. Please request a new password reset.
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {errors.general && (
                                <Typography color="error" variant="body2" sx={{mb: 2}}>
                                    {errors.general}
                                </Typography>
                            )}
                            {errors.token && (
                                <Typography color="error" variant="body2" sx={{mb: 2}}>
                                    {errors.token}
                                </Typography>
                            )}

                            <TextField
                                label="New Password"
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
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                                {loading ? <CircularProgress size={24}/> : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </>
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

export default ResetPassword;