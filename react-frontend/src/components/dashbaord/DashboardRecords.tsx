import {Avatar, Box, Paper, Typography, useTheme} from "@mui/material";
import React from "react";

const DashboardRecords: React.FC = () => {

    const theme = useTheme();

    return (
        <Paper elevation={3} sx={{p: 3, mt: 4}}>
            <Typography variant="h6" sx={{mb: 2}}>
                Recent Service Records
            </Typography>
            {[1, 2, 3].map((item) => (
                <Box
                    key={item}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 1
                    }}
                >
                    <Avatar sx={{bgcolor: theme.palette.primary.main, mr: 2}}>
                        {item}
                    </Avatar>
                    <Box sx={{flexGrow: 1}}>
                        <Typography variant="subtitle1">Honda Civic</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Oil Change + Filter (July 15, 2023)
                        </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        $89.99
                    </Typography>
                </Box>
            ))}
        </Paper>
    )
}

export default DashboardRecords