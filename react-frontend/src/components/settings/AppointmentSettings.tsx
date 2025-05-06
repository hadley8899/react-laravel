import React, {useState, useEffect, useCallback} from "react";
import {
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Typography,
    Button,
    CircularProgress,
    TextField,
    Alert,
    SelectChangeEvent
} from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import SaveIcon from '@mui/icons-material/Save';

import {getMyCompany, updateCompanySettings, UpdateCompanySettingsPayload} from "../../services/CompanyService.ts";
import {useNotifier} from "../../contexts/NotificationContext.tsx";
import {getAuthUser, setAuthUser} from "../../services/authService.ts";
import SettingsAccordionItem from "../layout/SettingsAccordionItem.tsx";

// Define the type for reminder timing options used in the component state
type ReminderTiming = '1h' | '3h' | '12h' | '24h' | '48h';
// Type for the component's state, allowing empty string for Select initial state
type ReminderTimingState = ReminderTiming | '';

const AppointmentSettings: React.FC = () => {

    const {showNotification} = useNotifier();

    // Company ID state
    const [companyUuId, setCompanyUuId] = useState<string | null>(null);

    // State for the form fields
    const [defaultDuration, setDefaultDuration] = useState<number>(60);
    const [enableOnlineBooking, setEnableOnlineBooking] = useState<boolean>(true);
    const [sendReminders, setSendReminders] = useState<boolean>(true);
    const [reminderTiming, setReminderTiming] = useState<ReminderTimingState>('24h'); // Use specific state type
    const [bufferTime, setBufferTime] = useState<number>(0);
    const [minNoticeHours, setMinNoticeHours] = useState<number>(24);

    // State for loading and saving status
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // State for feedback (errors and success)
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Fetch current company settings using the service
    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});
        try {
            // Use the service function
            const companyData = await getMyCompany();

            setCompanyUuId(companyData.uuid);

            // Update state with fetched values (provide defaults)
            setDefaultDuration(companyData.default_appointment_duration ?? 60);
            setEnableOnlineBooking(companyData.enable_online_booking ?? true);
            setSendReminders(companyData.send_appointment_reminders ?? true);
            // Handle potentially null reminder timing from backend
            setReminderTiming(companyData.appointment_reminder_timing as ReminderTiming || '24h');
            setBufferTime(companyData.appointment_buffer_time ?? 0);
            setMinNoticeHours(companyData.min_booking_notice_hours ?? 24);

        } catch (err: any) {
            console.error("Failed to fetch company settings via service:", err);
            // Check if error has response data (e.g., from axios error)
            const message = err.response?.data?.message || err.message || "Failed to load appointment settings.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Handle saving the settings using the service
    const handleSaveSettings = async () => {
        if (!companyUuId) {
            setError("Company ID not found. Cannot save settings.");
            return;
        }

        setIsSaving(true);
        setError(null);
        setValidationErrors({});

        // Prepare payload specifically for the settings service function
        const settingsToSave: UpdateCompanySettingsPayload = {
            default_appointment_duration: defaultDuration,
            enable_online_booking: enableOnlineBooking,
            send_appointment_reminders: sendReminders,
            appointment_reminder_timing: sendReminders && reminderTiming ? reminderTiming : null,
            appointment_buffer_time: bufferTime,
            min_booking_notice_hours: minNoticeHours,
        };

        try {
            // Use the service function to update settings
            const updatedCompany = await updateCompanySettings(companyUuId, settingsToSave);

            showNotification("Settings saved successfully!", "success");

            // Update local state based on response (especially if backend adjusted values like null timing)
            setReminderTiming(updatedCompany.appointment_reminder_timing as ReminderTiming || (sendReminders ? '24h' : ''));

            // Update the localStorage with the new company data using the authService
            getAuthUser().then((authUser) => {
                if (authUser) {
                    authUser.company = updatedCompany;
                    setAuthUser(authUser);
                }
            });

        } catch (err: any) {
            console.error("Failed to save settings via service:", err);
            // Check for validation errors (status 422 is common)
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                for (const key in backendErrors) {
                    formattedErrors[key] = backendErrors[key][0]; // Take the first error message
                }
                setValidationErrors(formattedErrors);
                setError("Please check the form for errors.");
            } else {
                // Use a more generic error message
                const message = err.response?.data?.message || err.message || "An unexpected error occurred while saving.";
                setError(message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, minHeight: '200px'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Loading Appointment Settings...</Typography>
            </Box>
        );
    }

    return (
        <SettingsAccordionItem
            title="Appointment Settings"
            icon={<EventNoteIcon/>}
            isLoading={isLoading}
            error={error && Object.keys(validationErrors).length === 0 ? error : null}
        >
            <Box sx={{mb: 5}}>
                {error && Object.keys(validationErrors).length === 0 && ( // Show general error only if no specific validation errors
                    (<Alert severity="error" sx={{mb: 2}}>{error}</Alert>)
                )}
                <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                    <Grid container spacing={3}>

                        {/* Default Duration - Updated Grid Syntax */}
                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <FormControl fullWidth error={!!validationErrors.default_appointment_duration}>
                                <InputLabel id="default-duration-label">Default Duration</InputLabel>
                                <Select
                                    labelId="default-duration-label"
                                    label="Default Duration"
                                    value={defaultDuration}
                                    onChange={(e: SelectChangeEvent<number>) => setDefaultDuration(Number(e.target.value))}
                                >
                                    <MenuItem value={30}>30 Minutes</MenuItem>
                                    <MenuItem value={45}>45 Minutes</MenuItem>
                                    <MenuItem value={60}>1 Hour</MenuItem>
                                    <MenuItem value={90}>1.5 Hours</MenuItem>
                                    <MenuItem value={120}>2 Hours</MenuItem>
                                </Select>
                                {validationErrors.default_appointment_duration &&
                                    <Typography color="error" variant="caption"
                                                sx={{mt: 0.5}}>{validationErrors.default_appointment_duration}</Typography>}
                            </FormControl>
                        </Grid>

                        {/* Buffer Time - Updated Grid Syntax */}
                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Booking Buffer Time (Minutes)"
                                value={bufferTime}
                                onChange={(e) => setBufferTime(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                helperText="Time before/after appointments that remains unavailable."
                                error={!!validationErrors.appointment_buffer_time}
                                slotProps={{
                                    input: {inputProps: {min: 0, step: 5}},
                                    formHelperText: validationErrors.appointment_buffer_time ? {error: true} : {}
                                }}/>
                            {validationErrors.appointment_buffer_time && <Typography color="error" variant="caption"
                                                                                     sx={{mt: 0.5}}>{validationErrors.appointment_buffer_time}</Typography>}
                        </Grid>

                        {/* Min Notice - Updated Grid Syntax */}
                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Booking Notice (Hours)"
                                value={minNoticeHours}
                                onChange={(e) => setMinNoticeHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                helperText="How far in advance bookings must be made (0 for anytime)."
                                error={!!validationErrors.min_booking_notice_hours}
                                slotProps={{
                                    input: {inputProps: {min: 0}},
                                    formHelperText: validationErrors.min_booking_notice_hours ? {error: true} : {}
                                }}/>
                            {validationErrors.min_booking_notice_hours && <Typography color="error" variant="caption"
                                                                                      sx={{mt: 0.5}}>{validationErrors.min_booking_notice_hours}</Typography>}
                        </Grid>


                        {/* Online Booking Switch - Updated Grid Syntax */}
                        {/* Use Grid purely for layout, FormControlLabel contains the element */}
                        <Grid size={{xs: 12, sm: 6, md: 4}} sx={{display: 'flex', alignItems: 'center'}}>
                            <FormControl error={!!validationErrors.enable_online_booking}
                                         sx={{width: '100%' /* Ensure FormControl takes space */}}>
                                <FormControlLabel
                                    control={<Switch checked={enableOnlineBooking}
                                                     onChange={(e) => setEnableOnlineBooking(e.target.checked)}/>}
                                    label="Enable Online Booking"
                                    sx={{mr: 0}} // Adjust spacing if needed
                                />
                                {validationErrors.enable_online_booking &&
                                    <Typography color="error" variant="caption" sx={{
                                        display: 'block',
                                        mt: -1
                                    }}>{validationErrors.enable_online_booking}</Typography>}
                            </FormControl>
                        </Grid>

                        {/* Send Reminders Switch - Updated Grid Syntax */}
                        <Grid size={{xs: 12, sm: 6, md: 4}} sx={{display: 'flex', alignItems: 'center'}}>
                            <FormControl error={!!validationErrors.send_appointment_reminders} sx={{width: '100%'}}>
                                <FormControlLabel
                                    control={<Switch checked={sendReminders}
                                                     onChange={(e) => {
                                                         setSendReminders(e.target.checked);
                                                         if (!e.target.checked) {
                                                             setReminderTiming('');
                                                             // Clear potential validation error for timing
                                                             setValidationErrors(prev => {
                                                                 const newErrors = {...prev};
                                                                 delete newErrors.appointment_reminder_timing;
                                                                 return newErrors;
                                                             });
                                                         } else if (!reminderTiming) {
                                                             // If turning on and no timing set, default to 24h
                                                             setReminderTiming('24h');
                                                         }
                                                     }}/>}
                                    label="Send Appointment Reminders"
                                    sx={{mr: 0}}
                                />
                                {validationErrors.send_appointment_reminders &&
                                    <Typography color="error" variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    mt: -1
                                                }}>{validationErrors.send_appointment_reminders}</Typography>}
                            </FormControl>
                        </Grid>


                        {/* Reminder Timing Select - Updated Grid Syntax */}
                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <FormControl fullWidth disabled={!sendReminders}
                                         error={!!validationErrors.appointment_reminder_timing}>
                                <InputLabel id="reminder-timing-label">Reminder Timing</InputLabel>
                                <Select
                                    labelId="reminder-timing-label"
                                    label="Reminder Timing"
                                    value={sendReminders ? reminderTiming : ''}
                                    onChange={(e: SelectChangeEvent<ReminderTimingState>) => setReminderTiming(e.target.value as ReminderTiming)}
                                    sx={{backgroundColor: !sendReminders ? 'action.disabledBackground' : 'inherit'}}
                                >
                                    {/* Avoid empty value if required when enabled */}
                                    {/* <MenuItem value={''} disabled>_Select Timing_</MenuItem> */}
                                    <MenuItem value={'1h'}>1 Hour Before</MenuItem>
                                    <MenuItem value={'3h'}>3 Hours Before</MenuItem>
                                    <MenuItem value={'12h'}>12 Hours Before</MenuItem>
                                    <MenuItem value={'24h'}>24 Hours Before</MenuItem>
                                    <MenuItem value={'48h'}>48 Hours Before</MenuItem>
                                </Select>
                                {validationErrors.appointment_reminder_timing &&
                                    <Typography color="error" variant="caption"
                                                sx={{mt: 0.5}}>{validationErrors.appointment_reminder_timing}</Typography>}
                            </FormControl>
                        </Grid>

                        <Grid size={12} sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={isSaving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon/>}
                                onClick={handleSaveSettings}
                                disabled={isSaving || isLoading}
                            >
                                {isSaving ? "Saving..." : "Save Appointment Settings"}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </SettingsAccordionItem>
    );
}

export default AppointmentSettings;
