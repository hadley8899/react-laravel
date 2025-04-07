import {Box, Typography, useMediaQuery, useTheme} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmailIcon from "@mui/icons-material/Email";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentIcon from "@mui/icons-material/Payment";
import React from "react";

const AuthLeftLayoutContent: React.FC = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box
            sx={{
                flex: 1,
                p: {xs: 3, md: 4},
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Typography
                variant={isSmallScreen ? 'h5' : 'h4'}
                gutterBottom
                sx={{fontWeight: 'bold'}}
            >
                React Laravel Starter
            </Typography>

            <Typography variant="subtitle1" sx={{mb: 3}}>
                Manage your garage operations with ease.
            </Typography>

            <Typography variant="body1" sx={{mb: 3}}>
                We keep your workshop running smoothly with everything from
                booking customers to secure payments:
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
                <PeopleAltIcon sx={{mr: 1}}/>
                <Typography variant="body1">Book customers in</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{mr: 1}}/>
                <Typography variant="body1">Communicate via SMS/Email</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <AlarmOnIcon sx={{mr: 1}}/>
                <Typography variant="body1">MOT service reminders</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <LocalOfferIcon sx={{mr: 1}}/>
                <Typography variant="body1">Market offers to customers</Typography>
            </Box>

            <Box display="flex" alignItems="center">
                <PaymentIcon sx={{mr: 1}}/>
                <Typography variant="body1">Payment portal integration</Typography>
            </Box>
        </Box>
    )
}


export default AuthLeftLayoutContent;