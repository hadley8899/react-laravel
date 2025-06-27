import {Box, IconButton, Paper, Typography, useTheme} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {renderSectionPreview} from "../../helpers/editor/renderSectionPreview.tsx";
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface EmailEditorPreviewSectionProps {
    emailSections: any[];
    setEmailSections: React.Dispatch<React.SetStateAction<any[]>>;
    openEditor: (section: any) => void;
    removeSection: (id: number) => void;
    setDraggedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    draggedIndex: number | null;
}

const EmailEditorPreviewSection: React.FC<EmailEditorPreviewSectionProps> = ({
                                                                                 emailSections,
                                                                                 setEmailSections,
                                                                                 openEditor,
                                                                                 removeSection,
                                                                                 setDraggedIndex,
                                                                                 draggedIndex,
                                                                             }) => {

    const theme = useTheme();
    const textSecondary = theme.palette.text.secondary;

    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null) return;
        const copy = [...emailSections];
        const [moving] = copy.splice(draggedIndex, 1);
        copy.splice(dropIndex, 0, moving);
        setEmailSections(copy);
        setDraggedIndex(null);
    };

    return (
        <Paper
            elevation={1}
            sx={{flex: 1, m: 2, display: 'flex', flexDirection: 'column', borderRadius: 2}}
        >
            <Box
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor:
                        theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    Email Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {emailSections.length} sections • Click sections to edit
                </Typography>
            </Box>

            <Box sx={{flex: 1, overflowY: 'auto', p: 2}}>
                {emailSections.length === 0 ? (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: textSecondary,
                            textAlign: 'center',
                        }}
                    >
                        <Box sx={{fontSize: 48, mb: 2, opacity: 0.3}}>📧</Box>
                        <Typography variant="h5" gutterBottom>
                            Start Building Your Email
                        </Typography>
                        <Typography variant="body2">
                            Add sections from the left panel to create your email
                        </Typography>
                    </Box>
                ) : (
                    emailSections.map((section, idx) => (
                        <Paper
                            key={section.id}
                            variant="outlined"
                            draggable
                            onDragStart={() => setDraggedIndex(idx)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => handleDrop(idx)}
                            onClick={() => openEditor(section)}
                            sx={{
                                mb: 1,
                                position: 'relative',
                                borderRadius: 2,
                                transition: 'all .15s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: 2,
                                },
                            }}
                        >
                            {/* floating controls (visible on hover) */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    display: 'flex',
                                    gap: 0.5,
                                    opacity: 0,
                                    transition: 'opacity .15s',
                                    pointerEvents: 'none',
                                    '.MuiPaper-root:hover &': {opacity: 1, pointerEvents: 'auto'},
                                }}
                            >
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={e => {
                                        e.stopPropagation();
                                        openEditor(section);
                                    }}
                                >
                                    <EditIcon fontSize="inherit"/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={e => {
                                        e.stopPropagation();
                                        removeSection(section.id);
                                    }}
                                >
                                    <DeleteIcon fontSize="inherit"/>
                                </IconButton>
                                <IconButton size="small" sx={{cursor: 'grab'}}>
                                    <DragIndicatorIcon fontSize="inherit"/>
                                </IconButton>
                            </Box>

                            {renderSectionPreview(section)}
                        </Paper>
                    ))
                )}
            </Box>
        </Paper>
    );
}

export default EmailEditorPreviewSection;