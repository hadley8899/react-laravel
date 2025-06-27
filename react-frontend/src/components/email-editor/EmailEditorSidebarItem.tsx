import React from "react";
import {Box, Paper, Typography} from "@mui/material";
import {DEFAULT_SECTIONS} from "../../mock/editor/default-sections.ts";
import AddIcon from "@mui/icons-material/Add";

interface EmailEditorSidebarItemProps {
    type: string;
    addSection: (type: string) => void;
}

const EmailEditorSidebarItem: React.FC<EmailEditorSidebarItemProps> = ({type, addSection}) => {
    return (
        <Paper
            key={type}
            variant="outlined"
            onClick={() => addSection(type)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                mb: 1,
                cursor: 'pointer',
                transition: 'all .15s',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                    transform: 'translateY(-1px)',
                },
            }}
        >
            <Box
                sx={{
                    width: 24,
                    height: 24,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    mr: 1.5,
                }}
            >
                {type.charAt(0).toUpperCase()}
            </Box>
            <Typography variant="body2" fontWeight={500}>
                {DEFAULT_SECTIONS[type].title}
            </Typography>
            <AddIcon sx={{ml: 'auto', color: 'primary.main'}}/>
        </Paper>);
}

export default EmailEditorSidebarItem;