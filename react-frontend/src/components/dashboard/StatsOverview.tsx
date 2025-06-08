import React, {useEffect, useState} from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Avatar,
    Skeleton,
    useTheme,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import {
    getDashboardOverview,
    type DashboardOverview,
} from '../../services/dashboardService';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({
                                               title,
                                               value,
                                               subtitle,
                                               icon,
                                               color,
                                           }) => (
    <Card sx={{height: '100%'}}>
        <CardContent>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid>
                    <Typography color="text.secondary" variant="overline">
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                </Grid>
                <Grid>
                    <Avatar sx={{bgcolor: color, width: 56, height: 56}}>{icon}</Avatar>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

const StatsOverview: React.FC = () => {
    const theme = useTheme();

    // plain-vanilla state + useEffect → no react-query required
    const [data, setData] = useState<DashboardOverview | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await getDashboardOverview();
                if (mounted) setData(res);
            } catch (err) {
                console.error('Dashboard overview error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                    <Grid key={i} size={{xs: 12, sm: 6, md: 3}}>
                        <Skeleton variant="rectangular" height={120}/>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (!data) return null;

    const cards: StatCardProps[] = [
        {
            title: 'TOTAL USERS',
            value: data.total_users.toLocaleString(),
            subtitle: `${(data.deltas.total_users * 100).toFixed(0)}% since last month`,
            icon: <PeopleAltIcon/>,
            color: theme.palette.primary.main,
        },
        {
            title: 'ACTIVE USERS',
            value: data.active_users.toLocaleString(),
            subtitle: `${(data.deltas.active_users * 100).toFixed(0)}% since last month`,
            icon: <PersonIcon/>,
            color: theme.palette.success.main,
        },
        {
            title: 'REVENUE',
            value: `£${data.revenue.toLocaleString()}`,
            subtitle: `${(data.deltas.revenue * 100).toFixed(0)}% since last month`,
            icon: <AttachMoneyIcon/>,
            color: theme.palette.warning.main,
        },
        {
            title: 'COMPLETED TASKS',
            value: data.completed_tasks.toLocaleString(),
            subtitle: `${(data.deltas.completed_tasks * 100).toFixed(0)}% since last month`,
            icon: <TaskAltIcon/>,
            color: theme.palette.info.main,
        },
    ];

    return (
        <Box mb={4}>
            <Grid container spacing={3}>
                {cards.map((c) => (
                    <Grid key={c.title} size={{xs: 12, sm: 6, md: 3}}>
                        <StatCard {...c} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StatsOverview;
