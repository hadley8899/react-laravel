import React, { useEffect, useState } from 'react';
import {
    Container, Paper, CircularProgress, Alert, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileChangePassword from '../components/profile/ProfileChangePassword';
import { logout } from '../services/authService';
import { getCurrentUser, updateUser } from '../services/UserService';
import User from '../interfaces/User';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    /* state */
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoad] = useState(true);
    const [error, setErr] = useState<string | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    /* fetch on mount */
    useEffect(() => {
        (async () => {
            try {
                const u = await getCurrentUser();
                setUser(u);
            } catch (e: any) {
                setErr('Could not load profile – please log in again.');
                console.error(e);
            } finally {
                setLoad(false);
            }
        })();
    }, []);

    /* logout */
    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate('/login');
        }
    };

    /* save */
    const handleSave = async (name: string, email: string, avatarFile: File | null) => {
        if (!user) return;
        try {
            setLoad(true);
            const updated = await updateUser(user.uuid, {
                name,
                email,
                avatar: avatarFile ?? undefined
            });
            /* keep state & storage in sync */
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
        } catch (e: any) {
            setErr(e.message ?? 'Update failed');
            console.error(e);
        } finally {
            setLoad(false);
        }
    };

    /* toggle password form */
    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    if (loading)
        return (
            <MainLayout>
                <Container maxWidth="sm" sx={{py: 6, textAlign: 'center'}}>
                    <CircularProgress/>
                </Container>
            </MainLayout>
        );

    if (error)
        return (
            <MainLayout>
                <Container maxWidth="sm" sx={{py: 6}}>
                    <Alert severity="error" sx={{mb: 3}}>{error}</Alert>
                    <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
                </Container>
            </MainLayout>
        );

    if (!user) return null;

    return (
        <MainLayout>
            <Container maxWidth="md" sx={{py: 4}}>
                <Paper sx={{p: {xs: 2, sm: 4}, borderRadius: 2}}>
                    {showPasswordForm ? (
                        <ProfileChangePassword 
                            userUuid={user.uuid}
                            onBack={() => setShowPasswordForm(false)}
                        />
                    ) : (
                        <ProfileForm 
                            user={user}
                            onSave={handleSave}
                            onLogout={handleLogout}
                            onChangePassword={togglePasswordForm}
                            loading={loading}
                        />
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Profile;
