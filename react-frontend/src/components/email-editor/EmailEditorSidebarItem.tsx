import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {EmailSectionTemplate} from "../../interfaces/EmailSectionTemplate.tsx";

interface Props {
    template: EmailSectionTemplate;
    addSection: (tpl: EmailSectionTemplate) => void;
}

const EmailEditorSidebarItem: React.FC<Props> = ({ template, addSection }) => (
    <Paper
        variant="outlined"
        onClick={() => addSection(template)}
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
                textTransform: 'uppercase',
            }}
        >
            {template.type[0]}
        </Box>

        <Typography variant="body2" fontWeight={500}>
            {template.title}
        </Typography>

        <AddIcon sx={{ ml: 'auto', color: 'primary.main' }} />
    </Paper>
);

export default EmailEditorSidebarItem;
