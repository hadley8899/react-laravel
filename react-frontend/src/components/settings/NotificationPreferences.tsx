import {Box, FormControlLabel, Grid, Paper, Switch, Typography} from "@mui/material";
import React, {useState} from "react";
import PaletteIcon from "@mui/icons-material/Palette";

const NotificationPreferences: React.FC = () => {

    // Notifications (Example - simple toggles)
    const [notifyNewBooking, setNotifyNewBooking] = useState<boolean>(true);
    const [notifyJobComplete, setNotifyJobComplete] = useState<boolean>(false);

    return (

        <Box sx={{mb: 5}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
               <PaletteIcon/>
                <Typography variant="h6" component="h2" fontWeight="medium">
                    Notification Preferences
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                <Grid container spacing={2}>
                    <Grid>
                        <FormControlLabel
                            control={<Switch checked={notifyNewBooking}
                                             onChange={(e) => setNotifyNewBooking(e.target.checked)}/>}
                            label="Email me for new online bookings"
                        />
                    </Grid>
                    <Grid>
                        <FormControlLabel
                            control={<Switch checked={notifyJobComplete}
                                             onChange={(e) => setNotifyJobComplete(e.target.checked)}/>}
                            label="Email me when a job status is set to 'Completed'"
                        />
                    </Grid>
                    {/* Add more notification toggles here */}
                </Grid>
            </Paper>
        </Box>


    )
}

export default NotificationPreferences;