import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import { getCustomers } from '../../services/CustomerService';
import { getVehicles } from '../../services/VehicleService';
import {
    createAppointment,
    updateAppointment,
    CreateAppointmentPayload,
    UpdateAppointmentPayload,
} from '../../services/appointmentService';
import { Appointment, AppointmentStatus, AppointmentType } from '../../interfaces/Appointment';

dayjs.locale('en-gb');

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

type Mode = 'create' | 'edit';

interface Props {
    mode: Mode;
    /** Pass the full appointment object for edit mode */
    initial?: Appointment;
    /** Called after a successful save */
    onSuccess: (saved: Appointment) => void;
}

const AppointmentForm: React.FC<Props> = ({ mode, initial, onSuccess }) => {
    /* ─────────────────────────────── state */
    const [customers, setCustomers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);

    const [customer, setCustomer]       = useState(initial?.customer.uuid ?? '');
    const [vehicle, setVehicle]         = useState(initial?.vehicle.uuid  ?? '');
    const [serviceType, setServiceType] = useState<AppointmentType>(
        (initial?.service_type as AppointmentType) ?? 'Service',
    );
    const [status, setStatus]           = useState<AppointmentStatus>(
        (initial?.status as AppointmentStatus) ?? 'Scheduled',
    );
    const initDate = initial ? dayjs(initial.date_time) : dayjs();
    const [date, setDate]               = useState<Dayjs | null>(initDate);
    const [time, setTime]               = useState<Dayjs | null>(initDate);
    const [duration, setDuration]       = useState(initial?.duration_minutes ?? 60);
    const [mechanic, setMechanic]       = useState(initial?.mechanic_assigned ?? '');
    const [notes, setNotes]             = useState(initial?.notes ?? '');

    const [saving, setSaving] = useState(false);
    const [error , setError ] = useState<string | null>(null);

    /* ─────────────────────────────── data sources */
    useEffect(() => {
        (async () => {
            const res = await getCustomers(1, 1000);
            setCustomers(res.data);
        })();
    }, []);

    useEffect(() => {
        if (!customer) { setVehicles([]); setVehicle(''); return; }
        (async () => {
            const res = await getVehicles(1, 1000, customer);
            setVehicles(res.data);
            /* keep selection if vehicle still belongs to new customer */
            if (vehicle && !res.data.find((v: any) => v.uuid === vehicle)) {
                setVehicle('');
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    /* ─────────────────────────────── submit */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) return;

        const dateTimeIso = date
            .hour(time.hour())
            .minute(time.minute())
            .second(0)
            .millisecond(0)
            .toISOString();

        const base = {
            customer_uuid  : customer,
            vehicle_uuid   : vehicle,
            service_type   : serviceType,
            date_time      : dateTimeIso,
            duration_minutes: duration,
            status,
            mechanic_assigned: mechanic || undefined,
            notes: notes || undefined,
        };

        setSaving(true);
        setError(null);
        try {
            const saved =
                mode === 'create'
                    ? await createAppointment(base as CreateAppointmentPayload)
                    : await updateAppointment(initial!.uuid, base as UpdateAppointmentPayload);
            onSuccess(saved);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error while saving');
        } finally {
            setSaving(false);
        }
    };

    /* ─────────────────────────────── UI */
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" mb={3} fontWeight="bold">
                {mode === 'create' ? 'New Appointment' : 'Edit Appointment'}
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
                            onChange={(e) => setServiceType(e.target.value as AppointmentType)}
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
                            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
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
                            onChange={(d) => setDate(d ? dayjs(d) : null)}
                            format="DD/MM/YYYY"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TimePicker
                            label="Time"
                            value={time}
                            onChange={(t) => setTime(t ? dayjs(t) : null)}
                            ampm={false}
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
                            slotProps={{ htmlInput: { min: 15 } }}
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
                                {saving ? 'Saving…' : mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default AppointmentForm;
