import React, { useState } from 'react';
import {
    Box, Button, TextField, Alert, Stack, Typography,
    InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, KeyboardBackspace, Lock } from '@mui/icons-material';
import { changePassword } from '../../services/UserService';

interface ProfileChangePasswordProps {
    userUuid: string;
    onBack: () => void;
}

const ProfileChangePassword: React.FC<ProfileChangePasswordProps> = ({ userUuid, onBack }) => {
    // Form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    
    // Validation
    const isValid = 
        currentPassword.length > 0 && 
        newPassword.length >= 8 && 
        newPassword === confirmPassword;
    
    const passwordsMatch = newPassword === confirmPassword;
    const passwordLongEnough = newPassword.length >= 8;
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await changePassword(userUuid, {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword
            });
            
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Box>
            <Button 
                startIcon={<KeyboardBackspace />} 
                onClick={onBack}
                sx={{ mb: 3 }}
                variant="text"
            >
                Back to Profile
            </Button>
            <Typography variant="h5" gutterBottom>
                Change Password
            </Typography>
            {success && (
                <Alert severity="success" sx={{ my: 2 }}>
                    Password changed successfully!
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                        >
                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    
                    <TextField
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        required
                        error={newPassword.length > 0 && !passwordLongEnough}
                        helperText={
                            newPassword.length > 0 && !passwordLongEnough
                                ? 'Password must be at least 8 characters'
                                : ''
                        }
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        required
                        error={confirmPassword.length > 0 && !passwordsMatch}
                        helperText={
                            confirmPassword.length > 0 && !passwordsMatch
                                ? 'Passwords do not match'
                                : ''
                        }
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!isValid || loading}
                        sx={{ alignSelf: 'flex-start', mt: 2 }}
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default ProfileChangePassword;
