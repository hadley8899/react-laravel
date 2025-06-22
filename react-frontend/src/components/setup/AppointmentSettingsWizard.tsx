import React, {useEffect, useState} from 'react';
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Typography,
    FormControl,
    InputLabel,
    Select,
    Paper,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import {Company} from '../../interfaces/Company';

type ReminderTiming = '1h' | '3h' | '12h' | '24h' | '48h';
type ReminderTimingState = ReminderTiming | '';

interface Props {
    company: Company | null;
    setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

const AppointmentSettingsWizard: React.FC<Props> = ({company, setCompany}) => {
    /* -------------------- local state -------------------- */
    const [defaultDuration, setDefaultDuration] = useState<number>(60);
    const [enableOnlineBooking, setEnableOnlineBooking] = useState<boolean>(true);
    const [sendReminders, setSendReminders] = useState<boolean>(true);
    const [reminderTiming, setReminderTiming] = useState<ReminderTimingState>('24h');
    const [bufferTime, setBufferTime] = useState<number | ''>(0);
    const [minNoticeHours, setMinNoticeHours] = useState<number | ''>(24);
    const [errors, setErrors] = useState({
        defaultDuration: '',
        bufferTime: '',
        minNoticeHours: '',
        reminderTiming: '',
    });

    /* ------------------- initialise ---------------------- */
    useEffect(() => {
        if (!company) return;

        setDefaultDuration(company.default_appointment_duration ?? 60);
        setEnableOnlineBooking(company.enable_online_booking ?? true);
        setSendReminders(company.send_appointment_reminders ?? true);
        setReminderTiming(
            (company.appointment_reminder_timing as ReminderTiming) || '24h',
        );
        setBufferTime(
            company.appointment_buffer_time === null || company.appointment_buffer_time === undefined
                ? ''
                : company.appointment_buffer_time
        );
        setMinNoticeHours(
            company.min_booking_notice_hours === null || company.min_booking_notice_hours === undefined
                ? ''
                : company.min_booking_notice_hours
        );
    }, [company]);

    /* ---------------- propagate up ----------------------- */
    const update = (field: keyof Company, value: any) =>
        setCompany(c => (c ? {...c, [field]: value} as Company : c));

    // Validation logic
    const validateField = (field: keyof typeof errors, value: any) => {
        switch (field) {
            case 'defaultDuration':
                if (![30, 45, 60, 90, 120].includes(value)) return 'Select a valid duration';
                return '';
            case 'bufferTime':
                if (value < 0 || value > 120) return 'Must be between 0 and 120';
                return '';
            case 'minNoticeHours':
                if (value < 0 || value > 168) return 'Must be between 0 and 168';
                return '';
            case 'reminderTiming':
                if (sendReminders && !['1h', '3h', '12h', '24h', '48h'].includes(value))
                    return 'Select a valid reminder timing';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (field: keyof typeof errors, value: any) => {
        setErrors(prev => ({
            ...prev,
            [field]: validateField(field, value)
        }));
    };

    const handleChange = (
        field: keyof typeof errors,
        value: any,
        setter: (v: any) => void
    ) => {
        setter(value);
        update(
            field === 'defaultDuration'
                ? 'default_appointment_duration'
                : field === 'bufferTime'
                    ? 'appointment_buffer_time'
                    : field === 'minNoticeHours'
                        ? 'min_booking_notice_hours'
                        : field === 'reminderTiming'
                            ? 'appointment_reminder_timing'
                            : (field as keyof Company),
            value
        );
        setErrors(prev => ({
            ...prev,
            [field]: prev[field] ? validateField(field, value) : ''
        }));
    };

    /* --------------------- ui ---------------------------- */
    if (!company) return null;

    return (
        <Box>
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 3,
                    p: {xs: 2, sm: 3},
                    // Match CompanyInfoWizard: remove custom background color
                }}
            >
                <Typography variant="h6" mb={2} sx={{display: 'flex', alignItems: 'center'}}>
                    <EventNoteIcon sx={{mr: 1}}/>
                    Appointment Settings
                </Typography>
                <Grid container spacing={3}>
                    {/* Default Duration */}
                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                        <FormControl fullWidth error={!!errors.defaultDuration}>
                            <InputLabel id="default-duration-label">Default Duration</InputLabel>
                            <Select
                                labelId="default-duration-label"
                                label="Default Duration"
                                value={defaultDuration}
                                onChange={event => handleChange('defaultDuration', Number(event.target.value), setDefaultDuration)}
                                onBlur={() => handleBlur('defaultDuration', defaultDuration)}
                            >
                                <MenuItem value={30}>30 Minutes</MenuItem>
                                <MenuItem value={45}>45 Minutes</MenuItem>
                                <MenuItem value={60}>1 Hour</MenuItem>
                                <MenuItem value={90}>1.5 Hours</MenuItem>
                                <MenuItem value={120}>2 Hours</MenuItem>
                            </Select>
                            {errors.defaultDuration && (
                                <Typography color="error" variant="caption">{errors.defaultDuration}</Typography>
                            )}
                        </FormControl>
                    </Grid>
                    {/* Buffer Time */}
                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Booking Buffer (mins)"
                            value={bufferTime === '' ? '' : bufferTime}
                            onChange={event => {
                                const val = event.target.value;
                                if (val === '') {
                                    setBufferTime('');
                                    update('appointment_buffer_time', null);
                                    setErrors(prev => ({
                                        ...prev,
                                        bufferTime: ''
                                    }));
                                } else {
                                    const num = parseInt(val, 10);
                                    setBufferTime(isNaN(num) ? '' : num);
                                    update('appointment_buffer_time', isNaN(num) ? null : num);
                                    setErrors(prev => ({
                                        ...prev,
                                        bufferTime: prev.bufferTime ? validateField('bufferTime', isNaN(num) ? '' : num) : ''
                                    }));
                                }
                            }}
                            onBlur={() => {
                                setErrors(prev => ({
                                    ...prev,
                                    bufferTime: validateField('bufferTime', bufferTime === '' ? '' : bufferTime)
                                }));
                            }}
                            error={!!errors.bufferTime}
                            helperText={errors.bufferTime}
                            slotProps={{
                                htmlInput: {min: 0, step: 5}
                            }}
                        />
                    </Grid>
                    {/* Min Notice */}
                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Min Booking Notice (h)"
                            value={minNoticeHours === '' ? '' : minNoticeHours}
                            onChange={event => {
                                const val = event.target.value;
                                if (val === '') {
                                    setMinNoticeHours('');
                                    update('min_booking_notice_hours', null);
                                    setErrors(prev => ({
                                        ...prev,
                                        minNoticeHours: ''
                                    }));
                                } else {
                                    const num = parseInt(val, 10);
                                    setMinNoticeHours(isNaN(num) ? '' : num);
                                    update('min_booking_notice_hours', isNaN(num) ? null : num);
                                    setErrors(prev => ({
                                        ...prev,
                                        minNoticeHours: prev.minNoticeHours ? validateField('minNoticeHours', isNaN(num) ? '' : num) : ''
                                    }));
                                }
                            }}
                            onBlur={() => {
                                setErrors(prev => ({
                                    ...prev,
                                    minNoticeHours: validateField('minNoticeHours', minNoticeHours === '' ? '' : minNoticeHours)
                                }));
                            }}
                            error={!!errors.minNoticeHours}
                            helperText={errors.minNoticeHours}
                            slotProps={{
                                htmlInput: {min: 0}
                            }}
                        />
                    </Grid>
                    {/* Online Booking */}
                    <Grid size={{xs: 12, sm: 6, md: 4}} display="flex" alignItems="center">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={enableOnlineBooking}
                                    onChange={event => {
                                        setEnableOnlineBooking(event.target.checked);
                                        update('enable_online_booking', event.target.checked);
                                    }}
                                />
                            }
                            label="Enable Online Booking"
                        />
                    </Grid>
                    {/* Send Reminders */}
                    <Grid size={{xs: 12, sm: 6, md: 4}} display="flex" alignItems="center">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={sendReminders}
                                    onChange={event => {
                                        const checked = event.target.checked;
                                        setSendReminders(checked);
                                        update('send_appointment_reminders', checked);
                                        if (!checked) {
                                            setReminderTiming('');
                                            update('appointment_reminder_timing', null);
                                        } else if (!reminderTiming) {
                                            setReminderTiming('24h');
                                            update('appointment_reminder_timing', '24h');
                                        }
                                        setErrors(prev => ({
                                            ...prev,
                                            reminderTiming: ''
                                        }));
                                    }}
                                />
                            }
                            label="Send Appointment Reminders"
                        />
                    </Grid>
                    {/* Reminder Timing */}
                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                        <FormControl fullWidth disabled={!sendReminders} error={!!errors.reminderTiming}>
                            <InputLabel id="reminder-timing-label">Reminder Timing</InputLabel>
                            <Select
                                labelId="reminder-timing-label"
                                label="Reminder Timing"
                                value={sendReminders ? reminderTiming : ''}
                                onChange={event => handleChange('reminderTiming', event.target.value as ReminderTiming, setReminderTiming)}
                                onBlur={() => handleBlur('reminderTiming', reminderTiming)}
                            >
                                <MenuItem value={'1h'}>1 Hour Before</MenuItem>
                                <MenuItem value={'3h'}>3 Hours Before</MenuItem>
                                <MenuItem value={'12h'}>12 Hours Before</MenuItem>
                                <MenuItem value={'24h'}>24 Hours Before</MenuItem>
                                <MenuItem value={'48h'}>48 Hours Before</MenuItem>
                            </Select>
                            {errors.reminderTiming && (
                                <Typography color="error" variant="caption">{errors.reminderTiming}</Typography>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AppointmentSettingsWizard;
