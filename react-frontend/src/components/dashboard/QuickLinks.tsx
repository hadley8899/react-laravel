import React, {JSX} from 'react';
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Avatar,
    useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { hasPermission as can } from '../../services/AuthService.ts';

import DirectionsCarIcon   from '@mui/icons-material/DirectionsCar';
import ReceiptLongIcon     from '@mui/icons-material/ReceiptLong';
import PeopleAltIcon       from '@mui/icons-material/PeopleAlt';
import EventAvailableIcon  from '@mui/icons-material/EventAvailable';

type QuickLink = {
    title: string;
    href: string;
    permissions: string[];
    icon: JSX.Element;
};

const links: QuickLink[] = [
    {
        title: 'Vehicles',
        href: '/vehicles',
        permissions: ['view_vehicles'],
        icon: <DirectionsCarIcon fontSize="large" />,
    },
    {
        title: 'Invoices',
        href: '/invoices',
        permissions: ['view_invoices'],
        icon: <ReceiptLongIcon fontSize="large" />,
    },
    {
        title: 'Customers',
        href: '/customers',
        permissions: ['view_customers'],
        icon: <PeopleAltIcon fontSize="large" />,
    },
    {
        title: 'Appointments',
        href: '/appointments',
        permissions: ['view_appointments'],
        icon: <EventAvailableIcon fontSize="large" />,
    },
];

const QuickLinks: React.FC = () => {
    const theme = useTheme();

    return (
        <Grid container spacing={3} mb={4}>
            {links.map(({ title, href, permissions, icon }) => {
                if (!can(permissions)) return null;

                return (
                    <Grid key={title} size={{ xs: 6, sm: 4, md: 3 }}>
                        <Card
                            sx={{
                                transition: 'transform 0.15s',
                                ':hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardActionArea component={Link} to={href}>
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        py: 5,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            width: 56,
                                            height: 56,
                                            mb: 1,
                                        }}
                                    >
                                        {icon}
                                    </Avatar>
                                    <Typography variant="subtitle1">{title}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default QuickLinks;
