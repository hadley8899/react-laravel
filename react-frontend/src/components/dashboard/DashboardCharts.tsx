import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Skeleton,
    useTheme,
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

import {
    getDashboardCharts,
    type DashboardChartData,
} from '../../services/dashboardService';

/* ---- one-time Chart.js registration (safe to repeat) ---- */
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

const DashboardCharts: React.FC = () => {
    const theme = useTheme();
    const [data, setData] = useState<DashboardChartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        (async () => {
            try {
                const res = await getDashboardCharts();
                if (live) setData(res);
            } catch (e) {
                console.error('Chart API error', e);
            } finally {
                if (live) setLoading(false);
            }
        })();
        return () => {
            live = false;
        };
    }, []);

    if (loading) {
        return (
            <Grid container spacing={3}>
                {[0, 1].map((i) => (
                    <Grid key={i} size={{ xs: 12, md: 6 }}>
                        <Skeleton variant="rectangular" height={320} />
                    </Grid>
                ))}
            </Grid>
        );
    }
    if (!data) return null;

    /* ─── datasets ─── */
    const lineChartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Active Users',
                data: data.active_users,
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.light}50`,
                tension: 0.3,
                fill: true,
            },
            {
                label: 'New Sign-ups',
                data: data.new_signups,
                borderColor: theme.palette.success.main,
                backgroundColor: `${theme.palette.success.light}50`,
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const pieChartData = {
        labels: Object.keys(data.revenue_by_source),
        datasets: [
            {
                data: Object.values(data.revenue_by_source),
                backgroundColor: [
                    theme.palette.primary.main,
                    theme.palette.success.main,
                    theme.palette.warning.main,
                    theme.palette.info.main,
                ],
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
            },
        ],
    };

    return (
        <Box mb={4}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardHeader title="User Growth Trends" />
                        <Divider />
                        <CardContent>
                            <Box height={300}>
                                {/* unique id avoids double-mount canvas clash */}
                                <Line
                                    id="user-growth-chart"
                                    data={lineChartData}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardHeader title="Revenue (Paid)" />
                        <Divider />
                        <CardContent>
                            <Box height={300} display="flex" alignItems="center">
                                <Pie
                                    id="revenue-pie-chart"
                                    data={pieChartData}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardCharts;
