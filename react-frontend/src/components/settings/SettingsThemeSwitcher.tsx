import {Box, Grid, Paper} from "@mui/material";
import ThemeSwitcher from "../ThemeSwitcher.tsx";
import React from "react";
import PaletteIcon from "@mui/icons-material/Palette";
import SettingsAccordionItem from "../layout/SettingsAccordionItem.tsx";

const SettingsThemeSwitcher: React.FC = () => {

    return (

        <SettingsAccordionItem
            title="Appearance"
            icon={<PaletteIcon/>}
        >
            <Box sx={{mb: 5}}>
                <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                    <Grid container spacing={2}>
                        <Grid>
                            <ThemeSwitcher/>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </SettingsAccordionItem>
    )
}

export default SettingsThemeSwitcher;
