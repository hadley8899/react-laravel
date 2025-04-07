import {Box, Grid, Paper, Typography, useTheme} from "@mui/material";
import {Doughnut, Line} from "react-chartjs-2";
import React from "react";

const DashboardCharts: React.FC = () => {
    const theme = useTheme();
    // Charts data and options
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Monthly Revenue',
                data: [3500, 4200, 5100, 4800, 6200, 7500, 6800],
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.main,
                tension: 0.2,
                fill: false
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {display: true},
            title: {display: false}
        },
        scales: {
            x: {grid: {display: false}},
            y: {grid: {color: theme.palette.divider}}
        }
    };

    const doughnutData = {
        labels: ['Sedans', 'SUVs', 'Trucks'],
        datasets: [
            {
                data: [60, 25, 15],
                backgroundColor: [
                    theme.palette.primary.main,
                    theme.palette.secondary.main,
                    theme.palette.info.main
                ],
                hoverOffset: 8
            }
        ]
    };


    return (
        <Grid container spacing={3}>
            <Grid>
                <Paper sx={{p: 3, height: '100%'}} elevation={3}>
                    <Typography variant="h6">Monthly Revenue</Typography>
                    <Box sx={{height: 300, mt: 2}}>
                        <Line data={lineChartData} options={lineChartOptions}/>
                    </Box>
                </Paper>
            </Grid>
            <Grid>
                <Paper sx={{p: 3, height: '100%'}} elevation={3}>
                    <Typography variant="h6">Vehicle Types</Typography>
                    <Box sx={{height: 250, mt: 2, display: 'flex', justifyContent: 'center'}}>
                        <Box sx={{width: 200}}>
                            <Doughnut data={doughnutData}/>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default DashboardCharts