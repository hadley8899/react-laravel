import {Box, Grid, Paper, Typography} from "@mui/material";
import ThemeSwitcher from "../ThemeSwitcher.tsx";
import React from "react";
import PaletteIcon from "@mui/icons-material/Palette";

const SettingsThemeSwitcher: React.FC = () => {

    return (
        <Box sx={{mb: 5}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <PaletteIcon/>
                <Typography variant="h6" component="h2" fontWeight="medium">
                    Appearance
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                <Grid container spacing={2}>
                    <Grid>
                        <ThemeSwitcher/>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default SettingsThemeSwitcher;