import React, {useState} from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
} from '@mui/material';

import {DEFAULT_SECTIONS, SECTION_TYPES} from '../../mock/editor/default-sections.ts';
import {renderEditForm} from '../../helpers/editor/renderEditForm.tsx';
import EmailEditorSidebarItem from "./EmailEditorSidebarItem.tsx";
import EmailEditorPreviewSection from "./EmailEditorPreviewSection.tsx";

const EmailEditor: React.FC = () => {
    const [emailSections, setEmailSections] = useState<any[]>([]);
    const [editingSection, setEditingSection] = useState<any | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const theme = useTheme();

    const addSection = (type: string) =>
        setEmailSections(prev => [
            ...prev,
            {...DEFAULT_SECTIONS[type], id: Date.now() + Math.random()},
        ]);

    const removeSection = (id: number) =>
        setEmailSections(prev => prev.filter(s => s.id !== id));

    const openEditor = (section: any) => {
        setEditingSection({...section});
        setEditOpen(true);
    };

    const saveSection = () => {
        setEmailSections(prev =>
            prev.map(s => (s.id === editingSection!.id ? editingSection : s)),
        );
        setEditOpen(false);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f5f5',
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    width: 300,
                    p: 2.5,
                    m: 2,
                    overflowY: 'auto',
                    flexShrink: 0,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Email Sections
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Click to add sections to your email
                </Typography>

                {Object.entries(SECTION_TYPES).map(([, type]) => (
                    <EmailEditorSidebarItem type={type} addSection={addSection}/>
                ))}
            </Paper>

            <EmailEditorPreviewSection
                emailSections={emailSections}
                setEmailSections={setEmailSections}
                openEditor={openEditor}
                removeSection={removeSection}
                setDraggedIndex={setDraggedIndex}
                draggedIndex={draggedIndex}
            />

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit {editingSection?.title}</DialogTitle>
                <DialogContent dividers sx={{pt: 2}}>
                    {renderEditForm(editingSection, (field, value) =>
                        setEditingSection((prev: any) => ({
                            ...prev,
                            content: {...prev.content, [field]: value},
                        })),
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={saveSection} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmailEditor;
