import React, {useContext, useState} from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Link as MuiLink,
    CircularProgress
} from '@mui/material';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import {loginUser, getAuthUser} from "../services/AuthService.ts";
import {AuthContext} from "../context/AuthContext.tsx";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string; company?: string }>(
        {}
    );
    const navigate = useNavigate();
    const {setUser} = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            // First, login to establish the session
            await loginUser({email, password});

            // Next, fetch the user data to confirm authentication
            const userData = await getAuthUser();

            // Store user in local storage or context
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            console.log(userData);
            if (!userData.company.setup_complete) {
                navigate('/company-setup');
            } else {
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    data?: {
                        errors?: Record<string, string[] | string>,
                        message?: string
                    }
                }
            };

            // Collect all error messages
            const newErrors: { email?: string; password?: string; general?: string; company?: string } = {};

            if (err.response?.data?.errors) {
                // Flatten errors (Laravel returns arrays)
                Object.entries(err.response.data.errors).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        newErrors[key as keyof typeof newErrors] = value.join(' ');
                    } else {
                        newErrors[key as keyof typeof newErrors] = value;
                    }
                });
            }
            if (err.response?.data?.message) {
                // If message is not already included, add as general
                if (!Object.values(newErrors).includes(err.response.data.message)) {
                    newErrors.general = err.response.data.message;
                }
            }
            if (Object.keys(newErrors).length === 0) {
                newErrors.general = 'Login failed. Please try again.';
            }
            setErrors(newErrors);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Typography variant="h5" textAlign="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                {/* Show all error messages */}
                {(errors.general || errors.company) && (
                    <Box sx={{mb: 2}}>
                        {errors.general && (
                            <Typography color="error" variant="body2">
                                {errors.general}
                            </Typography>
                        )}
                        {errors.company && (
                            <Typography color="error" variant="body2">
                                {errors.company}
                            </Typography>
                        )}
                    </Box>
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

                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{mt: 2}}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24}/> : 'Login'}
                </Button>
            </form>

            <hr style={{width: '100%', marginTop: '1rem', marginBottom: '1rem'}}/>

            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <MuiLink
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                    underline="hover"
                >
                    Don&apos;t have an account? Register
                </MuiLink>
                <MuiLink
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    underline="hover"
                >
                    Forgot password?
                </MuiLink>
            </Box>
        </AuthLayout>
    );
};

export default Login;

