import React from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    useTheme
} from "@mui/material";
import { Line, Pie } from "react-chartjs-2";

const DashboardCharts: React.FC = () => {
    const theme = useTheme();

    // Sample data for line chart - Monthly user activity
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Active Users',
                data: [650, 590, 800, 810, 960, 1050, 1250, 1320, 1200, 1100, 1150, 1350],
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light + '50', // Adding 50% transparency
                tension: 0.3,
                fill: true,
            },
            {
                label: 'New Signups',
                data: [320, 280, 350, 390, 420, 480, 530, 590, 540, 480, 510, 590],
                borderColor: theme.palette.success.main,
                backgroundColor: theme.palette.success.light + '50',
                tension: 0.3,
                fill: true,
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly User Activity',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: theme.palette.divider
                }
            },
            x: {
                grid: {
                    color: theme.palette.divider
                }
            }
        }
    };

    // Sample data for pie chart - Revenue by source
    const pieChartData = {
        labels: ['Subscriptions', 'One-time Sales', 'Referrals', 'Advertising'],
        datasets: [
            {
                data: [45, 30, 15, 10],
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

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Revenue Distribution',
                font: {
                    size: 16
                }
            }
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
                <Grid>
                    <Card>
                        <CardHeader title="User Growth Trends" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300 }}>
                                <Line data={lineChartData} options={lineChartOptions} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    <Card>
                        <CardHeader title="Revenue Sources" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
                                <Pie data={pieChartData} options={pieChartOptions} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardCharts;
