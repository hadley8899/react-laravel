import React from 'react';
import {
    Box,
    Button,
    Divider,
    IconButton,
    MenuItem,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';
import dayjs from 'dayjs';
import { AppointmentStatus, AppointmentType } from "../../interfaces/Appointment.ts";

interface AppointmentsHeaderProps {
    start: dayjs.Dayjs;
    setStart: (date: dayjs.Dayjs) => void;
    type: AppointmentType | 'All';
    setType: (type: AppointmentType | 'All') => void;
    status: AppointmentStatus | 'All';
    setStatus: (status: AppointmentStatus | 'All') => void;
    onAddClick: () => void;
}

const formatHeading = (d: dayjs.Dayjs) => d.format('ddd, MMM D');
const weekStart = (d = dayjs()) => d.startOf('week').add(1, 'day'); // Monday

const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({
    start,
    setStart,
    type,
    setType,
    status,
    setStatus,
    onAddClick
}) => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    <EventIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                    Appointments Schedule
                </Typography>

                {/* week nav */}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                    <Tooltip title="Previous Week">
                        <IconButton size="small" onClick={() => setStart(start.subtract(7, 'day'))}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                    </Tooltip>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setStart(weekStart())}
                        startIcon={<TodayIcon/>}
                    >
                        Today
                    </Button>
                    <Tooltip title="Next Week">
                        <IconButton size="small" onClick={() => setStart(start.add(7, 'day'))}>
                            <ArrowForwardIosIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography
                        variant="subtitle1"
                        sx={{mx: 1, display: {xs: 'none', sm: 'block'}}}
                    >
                        {formatHeading(start)} – {formatHeading(start.add(6, 'day'))}
                    </Typography>
                </Box>

                {/* filters */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                        alignItems: { xs: 'stretch', sm: 'center' },
                        width: { xs: '100%', sm: 'auto' },
                        flex: 1,
                        maxWidth: { xs: '100%', sm: 'unset' },
                    }}
                >
                    <TextField
                        select
                        size="small"
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        sx={{
                            minWidth: { xs: 0, sm: 130 },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        <MenuItem value="All">All Types</MenuItem>
                        {([
                            'MOT',
                            'Service',
                            'Repair',
                            'Tire Change',
                            'Diagnostic',
                            'Check-up',
                        ] as AppointmentType[]).map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        sx={{
                            minWidth: { xs: 0, sm: 130 },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        <MenuItem value="All">All Statuses</MenuItem>
                        {([
                            'Scheduled',
                            'Confirmed',
                            'In Progress',
                            'Completed',
                            'Cancelled',
                            'No Show',
                        ] as AppointmentStatus[]).map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        size="medium"
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={onAddClick}
                        sx={{
                            width: { xs: '100%', sm: 'auto' },
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>

            <Divider sx={{mb: 2}}/>
        </>
    );
};

export default AppointmentsHeader;
