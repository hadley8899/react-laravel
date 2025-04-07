import React, {useState} from "react";
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    TextField,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    FormControl,
    InputLabel,
    InputAdornment,
    FormHelperText,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette'; // Theme/Appearance
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Logo Upload
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import ThemeSwitcher from "../components/ThemeSwitcher.tsx"; // Integrations

// Define types for select options if needed
type PaymentTerms = 'DueOnReceipt' | 'Net7' | 'Net15' | 'Net30';
type ReminderTiming = '1h' | '3h' | '12h' | '24h' | '48h';

const Settings: React.FC = () => {
    // --- State for Demo Settings ---
    // General
    const [companyName, setCompanyName] = useState<string>("Example Garage Ltd.");
    const [companyAddress, setCompanyAddress] = useState<string>("1 Auto Way, Brierley Hill, DY5 1AA");
    const [companyPhone, setCompanyPhone] = useState<string>("01384 123456");
    const [companyEmail, setCompanyEmail] = useState<string>("contact@examplegarage.co.uk");
    const [vatNumber, setVatNumber] = useState<string>("GB123456789");

    // Appointments
    const [defaultDuration, setDefaultDuration] = useState<number>(60);
    const [enableOnlineBooking, setEnableOnlineBooking] = useState<boolean>(true);
    const [sendReminders, setSendReminders] = useState<boolean>(true);
    const [reminderTiming, setReminderTiming] = useState<ReminderTiming>('24h');

    // Invoicing
    const [invoicePrefix, setInvoicePrefix] = useState<string>("INV-");
    const [nextInvoiceNum, setNextInvoiceNum] = useState<number>(1056); // Display only example
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('Net15');
    const [invoiceNotes, setInvoiceNotes] = useState<string>("Thank you for your business. Payment is due within 15 days.");

    // Notifications (Example - simple toggles)
    const [notifyNewBooking, setNotifyNewBooking] = useState<boolean>(true);
    const [notifyJobComplete, setNotifyJobComplete] = useState<boolean>(false);

    const handleSaveSettings = () => {
        // --- Placeholder for Saving Settings ---
        // In a real app, gather all state values and send to an API endpoint
        console.log("Saving Settings (Demo):", {
            companyName, companyAddress, companyPhone, companyEmail, vatNumber,
            defaultDuration, enableOnlineBooking, sendReminders, reminderTiming,
            invoicePrefix, paymentTerms, invoiceNotes,
            notifyNewBooking, notifyJobComplete
        });
        // Show a success message (e.g., Snackbar)
        alert("Settings saved! (Demo)");
    };

    const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
        <Box sx={{mb: 5}}> {/* Increased margin bottom */}
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                {icon && React.cloneElement(icon as React.ReactElement, {sx: {mr: 1.5, color: 'primary.main'}})}
                <Typography variant="h6" component="h2" fontWeight="medium">
                    {title}
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                {children}
            </Paper>
        </Box>
    );

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        <SettingsIcon sx={{mr: 1, verticalAlign: 'middle', fontSize: '2rem'}}/>
                        Application Settings
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon/>}
                        onClick={handleSaveSettings}
                        // disabled // You might disable until changes are made
                    >
                        Save All Settings
                    </Button>
                </Box>


                {renderSection("General Company Info", <BusinessIcon/>, (
                    <Grid container spacing={3}>
                        <Grid>
                            <TextField label="Company Name" value={companyName}
                                       onChange={(e) => setCompanyName(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid>
                            <TextField label="VAT Number" value={vatNumber}
                                       onChange={(e) => setVatNumber(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid>
                            <TextField label="Company Address" value={companyAddress}
                                       onChange={(e) => setCompanyAddress(e.target.value)} fullWidth multiline
                                       rows={2}/>
                        </Grid>
                        <Grid>
                            <TextField label="Contact Phone" value={companyPhone}
                                       onChange={(e) => setCompanyPhone(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid>
                            <TextField label="Contact Email" value={companyEmail}
                                       onChange={(e) => setCompanyEmail(e.target.value)} fullWidth type="email"/>
                        </Grid>
                        <Grid>
                            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon/>}>
                                Upload Company Logo
                                <input type="file" hidden accept="image/*"/>
                            </Button>
                            <FormHelperText>Recommended: PNG/JPG, max 2MB</FormHelperText>
                        </Grid>
                    </Grid>
                ))}

                {renderSection("Appointment Settings", <EventNoteIcon/>, (
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
                ))}

                {renderSection("Invoicing & Payments", <ReceiptIcon/>, (
                    <Grid container spacing={3}>
                        <Grid>
                            <TextField
                                label="Invoice ID Prefix"
                                value={invoicePrefix}
                                onChange={(e) => setInvoicePrefix(e.target.value)}
                                InputProps={{startAdornment: <InputAdornment position="start">#</InputAdornment>}}
                                fullWidth
                            />
                        </Grid>
                        <Grid>
                            <TextField label="Next Invoice Number" value={nextInvoiceNum} disabled fullWidth
                                       helperText="Auto-increments, cannot be edited here."/>
                        </Grid>
                        <Grid>
                            <FormControl fullWidth>
                                <InputLabel id="payment-terms-label">Default Payment Terms</InputLabel>
                                <Select
                                    labelId="payment-terms-label"
                                    label="Default Payment Terms"
                                    value={paymentTerms}
                                    onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                                >
                                    <MenuItem value={'DueOnReceipt'}>Due On Receipt</MenuItem>
                                    <MenuItem value={'Net7'}>Net 7 Days</MenuItem>
                                    <MenuItem value={'Net15'}>Net 15 Days</MenuItem>
                                    <MenuItem value={'Net30'}>Net 30 Days</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Default Invoice Footer Notes" value={invoiceNotes}
                                       onChange={(e) => setInvoiceNotes(e.target.value)} fullWidth multiline rows={3}/>
                        </Grid>
                    </Grid>
                ))}

                {renderSection("Notification Preferences", <NotificationsIcon/>, (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={<Switch checked={notifyNewBooking}
                                                 onChange={(e) => setNotifyNewBooking(e.target.checked)}/>}
                                label="Email me for new online bookings"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={<Switch checked={notifyJobComplete}
                                                 onChange={(e) => setNotifyJobComplete(e.target.checked)}/>}
                                label="Email me when a job status is set to 'Completed'"
                            />
                        </Grid>
                        {/* Add more notification toggles here */}
                    </Grid>
                ))}

                {renderSection("Appearance", <PaletteIcon/>, (
                    <Grid container spacing={2}>
                        <Grid>
                            <ThemeSwitcher/>
                        </Grid>
                    </Grid>
                ))}

                {/* Example Placeholder for Integrations */}
                {renderSection("Integrations", <LinkIcon/>, (
                    <List dense>
                        <ListItem
                            secondaryAction={
                                <Button variant="outlined" size="small" disabled>Connect</Button>
                            }
                        >
                            <ListItemText primary="Xero Accounting"
                                          secondary="Connect your accounting software (Coming soon)"/>
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <Button variant="outlined" size="small" disabled>Connect</Button>
                            }
                        >
                            <ListItemText primary="Stripe Payments"
                                          secondary="Enable online payments via Stripe (Coming soon)"/>
                        </ListItem>
                    </List>
                ))}

                {/* Save Button at the bottom too */}
                <Box sx={{mt: 4, display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon/>}
                        onClick={handleSaveSettings}
                    >
                        Save All Settings
                    </Button>
                </Box>

            </Container>
        </MainLayout>
    );
};

export default Settings;
