import React, {ReactNode, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
    Alert,
    CircularProgress
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SettingsAccordionItemProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
    isLoading?: boolean;
    error?: string | null;
    defaultExpanded?: boolean;
}

const SettingsAccordionItem: React.FC<SettingsAccordionItemProps> = ({
                                                                         title,
                                                                         icon,
                                                                         children,
                                                                         isLoading = false,
                                                                         error = null,
                                                                         defaultExpanded = false
                                                                     }) => {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

    const handleChange = (_: unknown, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={handleChange}
            sx={{mb: 2}}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`${title.toLowerCase().replace(/\s+/g, '-')}-content`}
                id={`${title.toLowerCase().replace(/\s+/g, '-')}-header`}
            >
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box sx={{mr: 1}}>{icon}</Box>
                    <Typography variant="h6" component="h2" fontWeight="medium">
                        {title}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {isLoading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        minHeight: '200px'
                    }}>
                        <CircularProgress/>
                        <Typography sx={{ml: 2}}>Loading {title}...</Typography>
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{mb: 2}}>{error}</Alert>
                        )}
                        {children}
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default SettingsAccordionItem;
