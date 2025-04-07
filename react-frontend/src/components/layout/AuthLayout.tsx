import React from 'react';
import {
    Box,
    Card,
    useTheme,
    Fade
} from '@mui/material';

import Navbar from '../Navbar';
import AuthLeftLayoutContent from "./AuthLeftLayoutContent.tsx";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                // Radial gradient: darkest in center, lighter at edges
                background: `radial-gradient(
                             circle at center,
                             #FF6600 30%,
                             #FF9933 100%
                )`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            {/* Navbar at the top */}
            <Navbar />

            {/* Content Wrapper */}
            <Box
                sx={{
                    flex: '1 0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: { xs: 2, md: 4 },
                    py: { xs: 4, md: 8 },
                    // If needed, adjust margin-top to account for the navbar
                }}
            >
                {/* Fade in the card for a nice effect */}
                <Fade in timeout={800}>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            overflow: 'hidden',
                            borderRadius: 2,
                            boxShadow: 5,
                            maxWidth: 900,
                            width: '100%',
                        }}
                    >
                        {/* Left column: Info */}
                        <AuthLeftLayoutContent/>

                        {/* Right column: Auth Form */}
                        <Box
                            sx={{
                                flex: 1,
                                p: { xs: 3, md: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            {children}
                        </Box>
                    </Card>
                </Fade>
            </Box>
        </Box>
    );
};

export default AuthLayout;
