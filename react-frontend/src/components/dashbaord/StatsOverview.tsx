import {Card, CardContent, Grid, Typography, useTheme} from "@mui/material";
import {CalendarMonth, DirectionsCar, Menu as MenuIcon, ReceiptLong} from "@mui/icons-material";
import React from "react";

const StatsOverview: React.FC = () => {
    const theme = useTheme();
    return (
        <>
            {/* Stats Overview */}
            <Grid container spacing={3} sx={{mb: 4}}>
                <Grid>
                    <Card elevation={3}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <DirectionsCar sx={{fontSize: 40, color: theme.palette.primary.main}}/>
                            <Typography variant="h5" sx={{mt: 2}}>12</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Vehicles Managed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    <Card elevation={3}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <CalendarMonth sx={{fontSize: 40, color: theme.palette.secondary.main}}/>
                            <Typography variant="h5" sx={{mt: 2}}>8</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Upcoming Services
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    <Card elevation={3}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <ReceiptLong sx={{fontSize: 40, color: theme.palette.success.main}}/>
                            <Typography variant="h5" sx={{mt: 2}}>$4,250</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Revenue This Month
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    <Card elevation={3}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <MenuIcon sx={{fontSize: 40, color: theme.palette.info.main}}/>
                            <Typography variant="h5" sx={{mt: 2}}>24%</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Growth Rate
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default StatsOverview;