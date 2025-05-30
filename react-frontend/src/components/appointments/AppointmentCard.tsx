import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Appointment, AppointmentStatus, AppointmentType } from "../../interfaces/Appointment.ts";
import {useNavigate} from "react-router-dom";

interface AppointmentCardProps {
    appointment: Appointment;
}

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment: a }) => {
    const nav = useNavigate();

    const statusChip = (s: AppointmentStatus) => {
        const c =
            {
                Completed: 'success',
                Confirmed: 'info',
                'In Progress': 'warning',
                Scheduled: 'secondary',
                Cancelled: 'error',
                'No Show': 'error',
            }[s] ?? 'default';
        return (
            <Chip
                size="small"
                label={s}
                color={c as any}
                sx={{mr: 1, mb: 0.5}}
            />
        );
    };

    const typeChip = (t: AppointmentType) => {
        const c =
            {
                MOT: 'error',
                Service: 'info',
                Repair: 'warning',
                'Tire Change': 'secondary',
                Diagnostic: 'success',
                'Check-up': 'primary',
            }[t] ?? 'primary';
        return (
            <Chip
                size="small"
                variant="outlined"
                color={c as any}
                icon={<BuildIcon fontSize="small"/>}
                label={t}
                sx={{mr: 1, mb: 0.5}}
            />
        );
    };

    return (
        <Card
            variant="outlined"
            sx={{width: '100%', cursor: 'pointer'}}
            onClick={() => nav(`/appointments/${a.uuid}`)}>
            <CardContent sx={{p: 1.5, '&:last-child': {pb: 1.5}}}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 0.5
                }}>
                    <ScheduleIcon
                        sx={{mr: 0.5, color: 'text.secondary'}}
                        fontSize="inherit"
                    />
                    <Typography variant="body2" fontWeight="bold">
                        {time(a.date_time)}
                        <Typography component="span" variant="caption"
                                    sx={{ml: 0.5}}>
                            ({a.duration_minutes}m)
                        </Typography>
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', flexWrap: 'wrap', mb: 0.5}}>
                    {statusChip(a.status)}
                    {typeChip(a.service_type)}
                </Box>

                <Typography variant="body2" noWrap gutterBottom>
                    <PersonIcon
                        fontSize="inherit"
                        sx={{
                            mr: 0.5,
                            verticalAlign: 'bottom',
                            color: 'text.secondary'
                        }}
                    />
                    {a.customer.first_name} {a.customer.last_name}
                </Typography>

                {a.vehicle && (
                    <Typography variant="body2" color="text.secondary"
                                noWrap>
                        <DirectionsCarIcon
                            fontSize="inherit"
                            sx={{mr: 0.5, verticalAlign: 'bottom'}}
                        />
                        {a.vehicle.make} {a.vehicle.model} ({a.vehicle.registration})
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default AppointmentCard;
