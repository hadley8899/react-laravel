import React from "react";
import MainLayout from "../components/layout/MainLayout";
import {Typography, Container, Paper} from "@mui/material";

const Vehicles: React.FC = () => {
    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Typography variant="h4" gutterBottom>
                    Vehicles
                </Typography>
                <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                    <Typography variant="body1">
                        This is the vehicles page. Content will be added soon.
                    </Typography>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Vehicles;