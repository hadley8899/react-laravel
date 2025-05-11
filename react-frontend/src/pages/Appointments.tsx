import React, {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Container,
    Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {useNavigate} from 'react-router-dom';
import {Appointment, AppointmentStatus, AppointmentType} from "../interfaces/Appointment.ts";
import {getAppointments} from '../services/appointmentService.ts';
import MainLayout from "../components/layout/MainLayout.tsx";
import AppointmentsHeader from '../components/appointments/AppointmentsHeader';
import AppointmentList from '../components/appointments/AppointmentList';

dayjs.extend(isBetween);

/* ---------- helpers ---------- */
const weekStart = (d = dayjs()) => d.startOf('week').add(1, 'day'); // Monday
const weekDates = (start: dayjs.Dayjs) =>
    Array.from({length: 7}, (_, i) => start.add(i, 'day'));
const toIsoDate = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');

/* ---------- component ---------- */
const Appointments: React.FC = () => {
    const nav = useNavigate();
    const [start, setStart] = useState(() => weekStart());
    const [type, setType] = useState<AppointmentType | 'All'>('All');
    const [status, setStatus] = useState<AppointmentStatus | 'All'>('All');

    const [data, setData] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* load */
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getAppointments({
                    date_from: toIsoDate(start),
                    date_to: toIsoDate(start.add(6, 'day')),
                    service_type: type,
                    status,
                });
                setData(res.data);
            } catch (e: any) {
                setError('Failed to load appointments');
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [start, type, status]);

    /* group by day */
    const grouped = useMemo(() => {
        const map: Record<string, Appointment[]> = {};
        weekDates(start).forEach((d) => (map[toIsoDate(d)] = []));
        data.forEach((a) => {
            const key = a.date_time.slice(0, 10);
            if (map[key]) map[key].push(a);
        });
        Object.values(map).forEach((arr) =>
            arr.sort(
                (a, b) =>
                    new Date(a.date_time).getTime() - new Date(b.date_time).getTime(),
            ),
        );
        return map;
    }, [data, start]);

    const handleAddClick = () => nav('/appointments/create');

    return (
        <MainLayout>
            <Container maxWidth="xl" sx={{py: 4}}>
                <Paper sx={{p: {xs: 1, sm: 2, md: 3}}} elevation={3}>
                    <AppointmentsHeader
                        start={start}
                        setStart={setStart}
                        type={type}
                        setType={setType}
                        status={status}
                        setStatus={setStatus}
                        onAddClick={handleAddClick}
                    />

                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    <AppointmentList
                        groupedAppointments={grouped}
                        weekDates={weekDates(start)}
                        loading={loading}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Appointments;
