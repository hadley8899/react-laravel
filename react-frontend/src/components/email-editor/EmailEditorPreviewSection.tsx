import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Paper,
    Typography,
    useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { renderSectionPreview } from '../../helpers/editor/renderSectionPreview';

interface Props {
    emailSections: any[];
    setEmailSections: React.Dispatch<React.SetStateAction<any[]>>;
    openEditor: (section: any) => void;
    removeSection: (id: number) => void;
    setDraggedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    draggedIndex: number | null;
}

const EmailEditorPreviewSection: React.FC<Props> = ({
                                                        emailSections,
                                                        setEmailSections,
                                                        openEditor,
                                                        removeSection,
                                                        setDraggedIndex,
                                                        draggedIndex,
                                                    }) => {
    const theme = useTheme();
    const textSecondary = theme.palette.text.secondary;

    /* which section is the current drop target? */
    const [overIndex, setOverIndex] = useState<number | null>(null);

    /* reorder helper */
    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null) return;
        const copy = [...emailSections];
        const [moving] = copy.splice(draggedIndex, 1);
        copy.splice(dropIndex, 0, moving);
        setEmailSections(copy);
        setDraggedIndex(null);
        setOverIndex(null);
    };

    return (
        <Paper
            elevation={1}
            sx={{
                flex: 1,
                m: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
            }}
        >
            {/* ---------- header ---------- */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : theme.palette.grey[50],
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    Email Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {emailSections.length} sections • Click sections to edit
                </Typography>
            </Box>

            {/* ---------- canvas ---------- */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
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
                        <Box sx={{ fontSize: 48, mb: 2, opacity: 0.3 }}>📧</Box>
                        <Typography variant="h5" gutterBottom>
                            Start Building Your Email
                        </Typography>
                        <Typography variant="body2">
                            Add sections from the left panel to create your email
                        </Typography>
                    </Box>
                ) : (
                    emailSections.map((section, idx) => (
                        <React.Fragment key={section.id}>
                            {/* blue bar ABOVE the card = drop target */}
                            {overIndex === idx && draggedIndex !== idx && (
                                <Box
                                    sx={{
                                        height: 6,
                                        bgcolor: 'primary.main',
                                        borderRadius: 1,
                                        mb: 1,
                                        transition: 'all .15s',
                                    }}
                                />
                            )}

                            <Paper
                                data-section-id={section.id}
                                variant="outlined"
                                draggable
                                onDragStart={() => setDraggedIndex(idx)}
                                onDragEnter={() =>
                                    draggedIndex !== null && idx !== draggedIndex && setOverIndex(idx)
                                }
                                onDragOver={e => e.preventDefault()}
                                onDragLeave={e => {
                                    /* if we leave the current card completely, clear bar */
                                    if (
                                        (e.relatedTarget as HTMLElement | null)?.closest(
                                            '[data-section-id]',
                                        ) !== e.currentTarget
                                    ) {
                                        setOverIndex(null);
                                    }
                                }}
                                onDrop={() => handleDrop(idx)}
                                onClick={() => openEditor(section)}
                                sx={{
                                    mb: 1,
                                    position: 'relative',
                                    borderRadius: 2,
                                    /* visual feedback while dragging */
                                    opacity: draggedIndex === idx ? 0.4 : 1,
                                    transform: draggedIndex === idx ? 'scale(.96)' : 'none',
                                    /* highlight hovered target */
                                    borderColor:
                                        overIndex === idx && draggedIndex !== idx
                                            ? 'primary.main'
                                            : 'divider',
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
                                        '.MuiPaper-root:hover &': {
                                            opacity: 1,
                                            pointerEvents: 'auto',
                                        },
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
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={e => {
                                            e.stopPropagation();
                                            removeSection(section.id);
                                        }}
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                    <IconButton size="small" sx={{ cursor: 'grab' }}>
                                        <DragIndicatorIcon fontSize="inherit" />
                                    </IconButton>
                                </Box>

                                {renderSectionPreview(section)}
                            </Paper>
                        </React.Fragment>
                    ))
                )}

                {/* drop at END of list */}
                {overIndex === emailSections.length && (
                    <Box
                        sx={{
                            height: 6,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                            mt: 1,
                        }}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default EmailEditorPreviewSection;
