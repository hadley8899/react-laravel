import React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        React Laravel Starter!
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2 }}>
                            <ThemeSwitcher />
                        </Box>

                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/login"
                        >
                            Login
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;