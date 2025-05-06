import React, {useEffect, useState} from 'react';
import {
    Box,
    Paper,
    Grid,
    Switch,
    FormControlLabel,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SaveIcon from '@mui/icons-material/Save';
import SettingsAccordionItem from '../layout/SettingsAccordionItem';

import {
    getCurrentUser,
    updateUserPreferences,
} from '../../services/UserService';
import {useNotifier} from '../../contexts/NotificationContext';

const NotificationPreferences: React.FC = () => {
    const {showNotification} = useNotifier();

    /* state */
    const [uuid, setUuid] = useState('');
    const [notifyBooking, setNotifyBooking] = useState(true);
    const [notifyJobDone, setNotifyJobDone] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* fetch on mount */
    useEffect(() => {
        (async () => {
            try {
                const userData = await getCurrentUser();
                const u = userData.data;
                setUuid(u.uuid);
                setNotifyBooking(u.notify_new_booking ?? true);
                setNotifyJobDone(u.notify_job_complete ?? false);
            } catch (e: any) {
                setError(e.message ?? 'Failed to load preferences.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* save */
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await updateUserPreferences(uuid, {
                notify_new_booking: notifyBooking,
                notify_job_complete: notifyJobDone,
            });
            showNotification('Notification preferences saved!', 'success');
        } catch (e: any) {
            setError(e.message ?? 'Save failed.');
        } finally {
            setSaving(false);
        }
    };

    return (

        <SettingsAccordionItem
            title="Notification Preferences"
            icon={<NotificationsActiveIcon/>}
            isLoading={loading}
            error={error}
        >

            <Box mb={6}>
                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifyBooking}
                                        onChange={(e) => setNotifyBooking(e.target.checked)}
                                    />
                                }
                                label="Email me for new online bookings"
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifyJobDone}
                                        onChange={(e) => setNotifyJobDone(e.target.checked)}
                                    />
                                }
                                label="Email me when a job is marked completed"
                            />
                        </Grid>
                        <Grid size={12} sx={{textAlign: 'right', mt: 1}}>
                            <Button
                                variant="contained"
                                startIcon={
                                    saving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon/>
                                }
                                disabled={saving}
                                onClick={handleSave}
                            >
                                {saving ? 'Saving…' : 'Save Preferences'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </SettingsAccordionItem>
    );
};

export default NotificationPreferences;
