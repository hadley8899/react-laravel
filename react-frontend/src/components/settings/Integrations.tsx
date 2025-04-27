import {Box, Button, List, ListItem, ListItemText, Paper, Typography} from "@mui/material";
import React from "react";
import LinkIcon from "@mui/icons-material/Link";

const Integrations: React.FC = () => {
    return (
        <Box sx={{mb: 5}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <LinkIcon/>
                <Typography variant="h6" component="h2" fontWeight="medium">
                    Integrations
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
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
            </Paper>
        </Box>
    )
}

export default Integrations;