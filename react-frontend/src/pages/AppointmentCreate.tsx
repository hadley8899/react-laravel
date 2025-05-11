import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { AppointmentStatus, AppointmentType } from '../interfaces/Appointment';
import {getCustomers} from "../services/CustomerService.ts";
import {getVehicles} from "../services/VehicleService.ts";
import {createAppointment} from "../services/appointmentService.ts";
import MainLayout from "../components/layout/MainLayout.tsx";

const STATUS: AppointmentStatus[] = [
    'Scheduled',
    'Confirmed',
    'In Progress',
    'Completed',
    'Cancelled',
    'No Show',
];
const TYPES: AppointmentType[] = [
    'MOT',
    'Service',
    'Repair',
    'Tire Change',
    'Diagnostic',
    'Check-up',
];

const AppointmentCreate: React.FC = () => {
    const nav = useNavigate();

    const [customers, setCustomers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);

    const [customer, setCustomer] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [serviceType, setServiceType] = useState<AppointmentType>('Service');
    const [status, setStatus] = useState<AppointmentStatus>('Scheduled');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());
    const [duration, setDuration] = useState(60);
    const [mechanic, setMechanic] = useState('');
    const [notes, setNotes] = useState('');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ---------- load customers ---------- */
    useEffect(() => {
        (async () => {
            const res = await getCustomers(1, 1000);
            setCustomers(res.data);
        })();
    }, []);

    /* ---------- load vehicles when customer changes ---------- */
    useEffect(() => {
        if (!customer) {
            setVehicles([]);
            setVehicle('');
            return;
        }
        (async () => {
            const res = await getVehicles(1, 1000, customer);
            setVehicles(res.data);
            setVehicle('');
        })();
    }, [customer]);

    /* ---------- submit ---------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) return;

        const dt = date
            .hour(time.hour())
            .minute(time.minute())
            .second(0)
            .millisecond(0)
            .toISOString();

        try {
            setSaving(true);
            await createAppointment({
                customer_uuid: customer,
                vehicle_uuid: vehicle,
                service_type: serviceType,
                date_time: dt,
                duration_minutes: duration,
                status,
                mechanic_assigned: mechanic || undefined,
                notes: notes || undefined,
            });
            nav('/appointments');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error while saving');
        } finally {
            setSaving(false);
        }
    };

    return (
        <MainLayout>
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" mb={3} fontWeight="bold">
                        New Appointment
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* customer */}
                            <Grid size={12}>
                                <TextField
                                    select
                                    label="Customer"
                                    fullWidth
                                    required
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                >
                                    {customers.map((c) => (
                                        <MenuItem key={c.uuid} value={c.uuid}>
                                            {c.first_name} {c.last_name} ({c.email})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* vehicle */}
                            <Grid size={12}>
                                <TextField
                                    select
                                    label="Vehicle"
                                    fullWidth
                                    required
                                    disabled={!customer}
                                    value={vehicle}
                                    onChange={(e) => setVehicle(e.target.value)}
                                >
                                    {vehicles.map((v) => (
                                        <MenuItem key={v.uuid} value={v.uuid}>
                                            {v.make} {v.model} – {v.registration}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* type / status */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    label="Service Type"
                                    fullWidth
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value as any)}
                                >
                                    {TYPES.map((t) => (
                                        <MenuItem key={t} value={t}>
                                            {t}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    label="Status"
                                    fullWidth
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                >
                                    {STATUS.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* date / time */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={(d) => setDate(d)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TimePicker
                                    label="Time"
                                    value={time}
                                    onChange={(t) => setTime(t)}
                                />
                            </Grid>

                            {/* duration */}
                            <Grid size={12}>
                                <TextField
                                    label="Duration (minutes)"
                                    type="number"
                                    fullWidth
                                    value={duration}
                                    onChange={(e) => setDuration(+e.target.value)}
                                    slotProps={{
                                        htmlInput: { min: 15 }
                                    }}
                                />
                            </Grid>

                            {/* mechanic */}
                            <Grid size={12}>
                                <TextField
                                    label="Mechanic Assigned"
                                    fullWidth
                                    value={mechanic}
                                    onChange={(e) => setMechanic(e.target.value)}
                                />
                            </Grid>

                            {/* notes */}
                            <Grid size={12}>
                                <TextField
                                    label="Notes"
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </Grid>

                            {/* submit */}
                            <Grid size={12}>
                                <Box textAlign="right">
                                    <Button type="submit" variant="contained" disabled={saving}>
                                        {saving ? 'Saving…' : 'Create Appointment'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default AppointmentCreate;
