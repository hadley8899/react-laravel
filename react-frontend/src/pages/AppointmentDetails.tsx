import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {useNavigate, useParams} from 'react-router-dom';
import {Appointment} from "../interfaces/Appointment.ts";
import {deleteAppointment, getAppointment} from "../services/AppointmentService.ts";
import MainLayout from '../components/layout/MainLayout.tsx';
import {hasPermission} from "../services/AuthService.ts";

const statusChip = (s: Appointment['status']) => {
    const map = {
        Completed: 'success',
        Confirmed: 'info',
        'In Progress': 'warning',
        Scheduled: 'secondary',
        Cancelled: 'error',
        'No Show': 'error',
    } as const;
    return <Chip label={s} size="small" color={map[s] ?? 'default'} onClick={() => {
    }}/>;
};

const AppointmentDetails: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const nav = useNavigate();

    const [appt, setAppt] = useState<Appointment | null>(null);
    const [load, setLoad] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [delLoading, setDelLoading] = useState(false);

    /* fetch once */
    useEffect(() => {
        (async () => {
            try {
                const a = await getAppointment(uuid!);
                setAppt(a);
            } catch {
                setErr('Appointment not found');
            } finally {
                setLoad(false);
            }
        })();
    }, [uuid]);

    const handleDelete = async () => {
        if (!uuid) return;
        setDelLoading(true);
        try {
            await deleteAppointment(uuid);
            nav('/appointments');
        } catch {
            setErr('Could not delete');
        } finally {
            setDelLoading(false);
            setConfirmOpen(false);
        }
    };

    if (load) return (
        <MainLayout title="Loading Appointment">
            <Box sx={{p: 6, textAlign: 'center'}}><CircularProgress/></Box>
        </MainLayout>
    );

    if (err || !appt) return (
        <MainLayout title="Appointment Not Found">
            <Container maxWidth="sm" sx={{py: 6}}>
                <Alert severity="error">{err}</Alert>
            </Container>
        </MainLayout>
    );

    return (
        <MainLayout title="Appointment Details">
            <Container maxWidth="md" sx={{py: 4}}>
                <Box sx={{mb: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                    <Button startIcon={<ArrowBackIcon/>} onClick={() => nav('/appointments')}>
                        Back
                    </Button>

                    <Typography variant="h5" fontWeight="bold" sx={{flexGrow: 1, minWidth: 220}}>
                        {dayjs(appt.date_time).format('DD MMM YYYY • HH:mm')}
                    </Typography>

                    {statusChip(appt.status)}

                    <IconButton size="small" onClick={() => nav(`/appointments/${uuid}/edit`)}>
                        <EditIcon fontSize="small"/>
                    </IconButton>

                    {hasPermission('delete_appointment') &&
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => setConfirmOpen(true)}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    }
                </Box>

                <Paper sx={{p: 3}}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                            <Typography>{appt.customer.first_name} {appt.customer.last_name}</Typography>
                            {appt.customer.email && <Typography variant="body2">{appt.customer.email}</Typography>}
                            {appt.customer.phone && <Typography variant="body2">{appt.customer.phone}</Typography>}
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2" color="text.secondary">Vehicle</Typography>
                            <Typography>{appt.vehicle.make} {appt.vehicle.model}</Typography>
                            <Typography variant="body2">{appt.vehicle.registration}</Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2" color="text.secondary"
                                        sx={{mt: 2}}>Date &amp; Time</Typography>
                            <Typography>{dayjs(appt.date_time).format('dddd, DD MMM YYYY • HH:mm')}</Typography>
                            <Typography variant="body2">Duration: {appt.duration_minutes} minutes</Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{mt: 2}}>Service</Typography>
                            <Typography>{appt.service_type}</Typography>
                            {appt.mechanic_assigned &&
                                <Typography variant="body2">Mechanic: {appt.mechanic_assigned}</Typography>}
                        </Grid>
                    </Grid>

                    {/* notes */}
                    {appt.notes && (
                        <>
                            <Divider sx={{my: 3}}/>
                            <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                            <Typography whiteSpace="pre-line">{appt.notes}</Typography>
                        </>
                    )}
                </Paper>
            </Container>

            {/* ---------- confirm dialog ---------- */}
            <Dialog
                open={confirmOpen}
                onClose={() => !delLoading && setConfirmOpen(false)}
                aria-labelledby="confirm-del-title"
            >
                <DialogTitle id="confirm-del-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Delete this appointment on&nbsp;
                        {dayjs(appt.date_time).format('DD MMM YYYY • HH:mm')}?
                        <br/>This action can’t be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={delLoading}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={handleDelete}
                        disabled={delLoading}
                        autoFocus
                    >
                        {delLoading ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default AppointmentDetails;
