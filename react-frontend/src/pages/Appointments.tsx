import React, {useState, useMemo} from 'react';
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    Grid,
    List,
    ListItem,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    Button,
    TextField,
    MenuItem, // For Select dropdown
    Card,
    CardContent
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event'; // Calendar icon
import ScheduleIcon from '@mui/icons-material/Schedule'; // Clock icon
import PersonIcon from '@mui/icons-material/Person'; // Customer icon
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Vehicle icon
import BuildIcon from '@mui/icons-material/Build'; // Service Type icon
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TodayIcon from '@mui/icons-material/Today';
import AddIcon from "@mui/icons-material/Add";

// Import data and interface
import {Appointment, AppointmentStatus, AppointmentType} from "../interfaces/Appointment";
import appointmentsData from "../example-data/appointments"; // Default import

// Date Utilities (can be moved to a separate utils file)
const getWeekStart = (date: Date): Date => {
    const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday start
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0); // Set to start of the day
    return monday;
};

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatDateHeading = (date: Date): string => {
    return date.toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'});
};

const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', hour12: true});
}

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

// Component Start
const Appointments: React.FC = () => {
    // State for the start date of the week currently being viewed
    // Initialize to the start of the week containing the current real date
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date())); // Use current real date
    const [filterType, setFilterType] = useState<AppointmentType | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');

    // Generate dates for the current week view (Monday to Sunday)
    const weekDates = useMemo(() => {
        const dates: Date[] = [];
        for (let i = 0; i < 7; i++) {
            dates.push(addDays(currentWeekStart, i));
        }
        return dates;
    }, [currentWeekStart]);

    // Filter appointments based on current week and filters
    const filteredAppointments = useMemo(() => {
        const weekEnd = addDays(currentWeekStart, 7); // End date is start of next week

        return appointmentsData.filter(app => {
            const appDate = new Date(app.dateTime);
            const typeMatch = filterType === 'All' || app.serviceType === filterType;
            const statusMatch = filterStatus === 'All' || app.status === filterStatus;
            return appDate >= currentWeekStart && appDate < weekEnd && typeMatch && statusMatch;
        });
    }, [currentWeekStart, filterType, filterStatus]);

    // Group filtered appointments by date
    const appointmentsByDate = useMemo(() => {
        const grouped: { [key: string]: Appointment[] } = {};
        weekDates.forEach(date => {
            const dateString = date.toISOString().split('T')[0]; // Use YYYY-MM-DD as key
            grouped[dateString] = [];
        });

        filteredAppointments.forEach(app => {
            const appDate = new Date(app.dateTime);
            const dateString = appDate.toISOString().split('T')[0];
            if (grouped[dateString]) {
                // Sort appointments within the day by time
                grouped[dateString].push(app);
                grouped[dateString].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
            }
        });
        return grouped;
    }, [filteredAppointments, weekDates]);


    // Handlers for week navigation
    const goToPreviousWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
    const goToNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
    const goToToday = () => setCurrentWeekStart(getWeekStart(new Date()));

    // Get status chip styling
    const getStatusChip = (status: AppointmentStatus) => {
        let color: "success" | "warning" | "error" | "info" | "default" | "secondary" = "default";
        switch (status) {
            case 'Completed':
                color = "success";
                break;
            case 'Confirmed':
                color = "info";
                break; // Use info for confirmed
            case 'Scheduled':
                color = "secondary";
                break; // Use secondary for scheduled
            case 'In Progress':
                color = "warning";
                break;
            case 'Cancelled':
                color = "error";
                break;
            case 'No Show':
                color = "error";
                break;
        }
        return <Chip label={status} color={color} size="small" sx={{mr: 1, mb: 0.5}}/>;
    };
    // Get type chip styling
    const getTypeChip = (type: AppointmentType) => {
        let color: "primary" | "secondary" | "error" | "warning" | "info" | "success" = "primary";
        // Assign colors based on type if desired
        switch (type) {
            case 'MOT':
                color = 'error';
                break;
            case 'Service':
                color = 'info';
                break;
            case 'Repair':
                color = 'warning';
                break;
            case 'Tire Change':
                color = 'secondary';
                break;
            case 'Diagnostic':
                color = 'success';
                break;
            case 'Check-up':
                color = 'primary';
                break;
        }
        return <Chip icon={<BuildIcon fontSize='small'/>} label={type} color={color} size="small" variant='outlined'
                     sx={{mr: 1, mb: 0.5}}/>;
    }

    // Today's actual date for highlighting
    const today = new Date();

    return (
        <MainLayout>
            <Container maxWidth="xl" sx={{py: 4}}> {/* Use xl for more space */}
                <Paper sx={{p: {xs: 1, sm: 2, md: 3}, borderRadius: 2, overflow: 'hidden'}} elevation={3}>
                    {/* Header & Controls */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 3,
                            px: {xs: 1, sm: 0} // Padding adjustments
                        }}
                    >
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            <EventIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                            Appointments Schedule
                        </Typography>

                        {/* Week Navigation */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            flexGrow: {xs: 1, md: 0},
                            justifyContent: 'center'
                        }}>
                            <Tooltip title="Previous Week">
                                <IconButton onClick={goToPreviousWeek} size="small"><ArrowBackIosNewIcon/></IconButton>
                            </Tooltip>
                            <Button onClick={goToToday} variant="outlined" size="small" startIcon={<TodayIcon/>}>
                                Today
                            </Button>
                            <Tooltip title="Next Week">
                                <IconButton onClick={goToNextWeek} size="small"><ArrowForwardIosIcon/></IconButton>
                            </Tooltip>
                            <Typography variant="subtitle1" sx={{mx: 1, display: {xs: 'none', sm: 'block'}}}>
                                {formatDateHeading(weekDates[0])} - {formatDateHeading(weekDates[6])}
                            </Typography>
                        </Box>

                        {/* Filters & Add Button */}
                        <Box sx={{display: 'flex', gap: 1, flexWrap: 'nowrap', alignItems: 'center'}}>
                            <TextField
                                select
                                label="Type"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as AppointmentType | 'All')}
                                size="small"
                                sx={{minWidth: 130}}
                            >
                                <MenuItem value="All">All Types</MenuItem>
                                {(Object.keys(appointmentsData.reduce((acc, app) => ({
                                    ...acc,
                                    [app.serviceType]: true
                                }), {})) as AppointmentType[]).map(type => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Status"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | 'All')}
                                size="small"
                                sx={{minWidth: 130}}
                            >
                                <MenuItem value="All">All Statuses</MenuItem>
                                {(Object.keys(appointmentsData.reduce((acc, app) => ({
                                    ...acc,
                                    [app.status]: true
                                }), {})) as AppointmentStatus[]).map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                size="medium"
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{mb: 2}}/>

                    {/* Weekly Grid */}
                    <Grid container spacing={1}>
                        {weekDates.map((date,) => {
                            const dateString = date.toISOString().split('T')[0];
                            const dailyAppointments = appointmentsByDate[dateString] || [];
                            const isCurrentDay = isSameDay(date, today);

                            return (
                                <Grid key={dateString} sx={{minWidth: 180}}> {/* Ensure minimum width */}
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            height: '100%',
                                            bgcolor: isCurrentDay ? (theme) => theme.palette.action.selected : 'inherit', // Highlight today
                                            border: isCurrentDay ? (theme) => `2px solid ${theme.palette.primary.main}` : undefined,
                                        }}
                                    >
                                        <Typography variant="subtitle1" align="center" gutterBottom
                                                    fontWeight={isCurrentDay ? 'bold' : 'normal'}>
                                            {formatDateHeading(date)}
                                        </Typography>
                                        <Divider sx={{mb: 1}}/>
                                        {dailyAppointments.length > 0 ? (
                                            <List dense disablePadding>
                                                {dailyAppointments.map(app => (
                                                    <ListItem key={app.id} disableGutters sx={{p: 0, mb: 1}}>
                                                        <Card variant="outlined" sx={{width: '100%'}}>
                                                            <CardContent sx={{
                                                                p: 1.5,
                                                                '&:last-child': {pb: 1.5}
                                                            }}> {/* Reduce padding */}
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    mb: 0.5
                                                                }}>
                                                                    <ScheduleIcon fontSize="inherit" sx={{
                                                                        mr: 0.5,
                                                                        color: 'text.secondary'
                                                                    }}/>
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        {formatTime(app.dateTime)}
                                                                        <Typography component="span" variant="caption"
                                                                                    sx={{ml: 0.5}}>({app.durationMinutes}m)</Typography>
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{display: 'flex', flexWrap: 'wrap', mb: 0.5}}>
                                                                    {getStatusChip(app.status)}
                                                                    {getTypeChip(app.serviceType)}
                                                                </Box>

                                                                <Typography variant="body2" gutterBottom noWrap>
                                                                    <PersonIcon fontSize="inherit" sx={{
                                                                        mr: 0.5,
                                                                        verticalAlign: 'bottom',
                                                                        color: 'text.secondary'
                                                                    }}/>
                                                                    {app.customerName}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary"
                                                                            noWrap>
                                                                    <DirectionsCarIcon fontSize="inherit" sx={{
                                                                        mr: 0.5,
                                                                        verticalAlign: 'bottom'
                                                                    }}/>
                                                                    {app.vehicleMake} {app.vehicleModel} ({app.vehicleLicensePlate})
                                                                </Typography>
                                                                {app.mechanicAssigned && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                                display="block">
                                                                        Assigned: {app.mechanicAssigned}
                                                                    </Typography>
                                                                )}
                                                                {/* Add actions if needed */}
                                                                {/* <Box sx={{ textAlign: 'right', mt: 1 }}>
                                                                     <IconButton size="small"><VisibilityIcon fontSize="inherit"/></IconButton>
                                                                 </Box> */}
                                                            </CardContent>
                                                        </Card>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" align="center"
                                                        sx={{mt: 2}}>
                                                No appointments
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Appointments;
