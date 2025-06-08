import React from "react";
import {AccordionSummary, AccordionDetails, Typography, Button, Box} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import {useNavigate} from "react-router-dom";
import SettingsAccordionItem from "../layout/SettingsAccordionItem.tsx";

const UserManagementLink: React.FC = () => {
    const navigate = useNavigate();

    return (
        <SettingsAccordionItem title={"User Management"} icon={<PeopleIcon/>}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <PeopleIcon sx={{mr: 1}}/>
                <Typography variant="h6">User Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1" sx={{mb: 2}}>
                    Manage users in your organization, including their roles, permissions, and access.
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/user-management")}
                    >
                        Manage Users
                    </Button>
                </Box>
            </AccordionDetails>
        </SettingsAccordionItem>
    );
};

export default UserManagementLink;