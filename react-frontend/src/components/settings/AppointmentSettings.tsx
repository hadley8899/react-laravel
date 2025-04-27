import React, {useState} from "react";
import {
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem, Paper,
    Select,
    Switch,
    Typography
} from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
const AppointmentSettings: React.FC = () => {

    type ReminderTiming = '1h' | '3h' | '12h' | '24h' | '48h';

    // Appointments
    const [defaultDuration, setDefaultDuration] = useState<number>(60);
    const [enableOnlineBooking, setEnableOnlineBooking] = useState<boolean>(true);
    const [sendReminders, setSendReminders] = useState<boolean>(true);
    const [reminderTiming, setReminderTiming] = useState<ReminderTiming>('24h');

    return (

        <Box sx={{mb: 5}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <EventNoteIcon/>
                <Typography variant="h6" component="h2" fontWeight="medium">
                    Appointment Settings
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                <Grid container spacing={3} alignItems="center">
                    <Grid>
                        <FormControl fullWidth>
                            <InputLabel id="default-duration-label">Default Appointment Duration</InputLabel>
                            <Select
                                labelId="default-duration-label"
                                label="Default Appointment Duration"
                                value={defaultDuration}
                                onChange={(e) => setDefaultDuration(Number(e.target.value))}
                            >
                                <MenuItem value={30}>30 Minutes</MenuItem>
                                <MenuItem value={45}>45 Minutes</MenuItem>
                                <MenuItem value={60}>1 Hour</MenuItem>
                                <MenuItem value={90}>1.5 Hours</MenuItem>
                                <MenuItem value={120}>2 Hours</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid>
                        <FormControlLabel
                            control={<Switch checked={enableOnlineBooking}
                                             onChange={(e) => setEnableOnlineBooking(e.target.checked)}/>}
                            label="Enable Online Booking"
                        />
                    </Grid>
                    <Grid>
                        <FormControlLabel
                            control={<Switch checked={sendReminders}
                                             onChange={(e) => setSendReminders(e.target.checked)}/>}
                            label="Send Appointment Reminders"
                        />
                    </Grid>
                    <Grid>
                        <FormControl fullWidth disabled={!sendReminders}>
                            <InputLabel id="reminder-timing-label">Reminder Timing</InputLabel>
                            <Select
                                labelId="reminder-timing-label"
                                label="Reminder Timing"
                                value={reminderTiming}
                                onChange={(e) => setReminderTiming(e.target.value as ReminderTiming)}
                            >
                                <MenuItem value={'1h'}>1 Hour Before</MenuItem>
                                <MenuItem value={'3h'}>3 Hours Before</MenuItem>
                                <MenuItem value={'12h'}>12 Hours Before</MenuItem>
                                <MenuItem value={'24h'}>24 Hours Before</MenuItem>
                                <MenuItem value={'48h'}>48 Hours Before</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </Box>



    )
}

export default AppointmentSettings;