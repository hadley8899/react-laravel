import React from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    Avatar
} from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                    <Grid>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {subtitle}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Avatar
                            sx={{
                                backgroundColor: color,
                                height: 56,
                                width: 56
                            }}
                        >
                            {icon}
                        </Avatar>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const StatsOverview: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
                <Grid>
                    <StatCard
                        title="TOTAL USERS"
                        value="1,294"
                        subtitle="+14% since last month"
                        icon={<PeopleAltIcon />}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid>
                    <StatCard
                        title="ACTIVE USERS"
                        value="854"
                        subtitle="+7% since last week"
                        icon={<PersonIcon />}
                        color={theme.palette.success.main}
                    />
                </Grid>
                <Grid>
                    <StatCard
                        title="REVENUE"
                        value="$23,500"
                        subtitle="+10% since last month"
                        icon={<AttachMoneyIcon />}
                        color={theme.palette.warning.main}
                    />
                </Grid>
                <Grid>
                    <StatCard
                        title="COMPLETED TASKS"
                        value="432"
                        subtitle="+19% since last week"
                        icon={<TaskAltIcon />}
                        color={theme.palette.info.main}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default StatsOverview;
