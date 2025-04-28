import React, {useState} from 'react';
import {TextField, Button, Typography} from '@mui/material';
import AuthLayout from '../components/layout/AuthLayout';
import {registerUser} from '../services/authService';
import {useNotifier} from "../contexts/NotificationContext.tsx";

const Register: React.FC = () => {
    const {showNotification} = useNotifier();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic front-end validation
        const newErrors: Record<string, string> = {};

        if (!name) {
            newErrors.name = 'Name is required';
        } else if (name.length > 255) {
            newErrors.name = 'Name cannot exceed 255 characters';
        }

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Invalid email address';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm Password
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await registerUser({
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });

            showNotification('Registration successful!', 'success');

            clearForm();

        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;
                const msg = data.message || 'Registration failed';
                showNotification(msg, 'error');
            } else {
                showNotification('An error occurred. Please try again.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
    }

    return (
        <AuthLayout>
            <Typography variant="h5" gutterBottom>
                Register
            </Typography>

            {/* Show inline errors for the form fields */}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />

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

                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                />

                <Button variant="contained" type="submit" fullWidth sx={{mt: 2}} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Register;
