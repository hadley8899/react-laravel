import React, { useState, useEffect } from 'react';
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
    onSidebarSectionDrop?: (tpl: any, dropIndex?: number) => void;
}

const EmailEditorPreviewSection: React.FC<Props> = ({
    emailSections,
    setEmailSections,
    openEditor,
    removeSection,
    setDraggedIndex,
    draggedIndex,
    onSidebarSectionDrop,
}) => {
    const theme = useTheme();
    const textSecondary = theme.palette.text.secondary;

    // Track which drop zone is active (between sections)
    const [overIndex, setOverIndex] = useState<number | null>(null);

    // Helper to handle drop from sidebar or internal drag
    const handleDrop = (dropIndex: number, e: React.DragEvent) => {
        e.preventDefault();
        setOverIndex(null);

        // Sidebar drag
        const tplStr = e.dataTransfer.getData('application/x-section-template');
        if (tplStr && onSidebarSectionDrop) {
            try {
                const tpl = JSON.parse(tplStr);
                onSidebarSectionDrop(tpl, dropIndex);
                return;
            } catch (error) {
                console.error('Invalid section template data:', error);
            }
        }

        // Internal drag
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            const copy = [...emailSections];
            const [moving] = copy.splice(draggedIndex, 1);
            // Adjust dropIndex if moving downwards
            const insertAt = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
            copy.splice(insertAt, 0, moving);
            setEmailSections(copy);
            setDraggedIndex(null);
        }
    };

    // Helper to render section preview, supporting async if needed
    const [previews, setPreviews] = useState<Record<number, React.ReactNode>>({});

    useEffect(() => {
        let isMounted = true;
        const loadPreviews = async () => {
            const newPreviews: Record<number, React.ReactNode> = {};
            for (const section of emailSections) {
                const result = renderSectionPreview(section);
                if (result instanceof Promise) {
                    newPreviews[section.id] = await result;
                } else {
                    newPreviews[section.id] = result;
                }
            }
            if (isMounted) setPreviews(newPreviews);
        };
        loadPreviews();
        return () => { isMounted = false; };
    }, [emailSections]);

    // Render drop zone between sections
    const renderDropZone = (idx: number) => {
        // Don't show drop zone if dragging this section to its own position
        if (draggedIndex === idx || draggedIndex === idx - 1) {
            return <Box key={`dropzone-${idx}`} sx={{ height: 12, my: 0.5 }} />;
        }
        return (
            <Box
                key={`dropzone-${idx}`}
                onDragOver={e => {
                    // Accept both sidebar and internal drags
                    if (
                        e.dataTransfer.types.includes('application/x-section-template') ||
                        draggedIndex !== null
                    ) {
                        e.preventDefault();
                        if (overIndex !== idx) setOverIndex(idx);
                    }
                }}
                onDrop={e => handleDrop(idx, e)}
                sx={{
                    height: 36, // Increased height for easier aiming
                    my: 1,
                    borderRadius: 1,
                    transition: 'background .15s, border .15s',
                    background:
                        overIndex === idx
                            ? theme.palette.primary.main + '22'
                            : 'transparent',
                    border: overIndex === idx ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    position: 'relative',
                    cursor: 'pointer',
                    minHeight: 36,
                }}
            >
                {overIndex === idx && (
                    <Box
                        sx={{
                            width: '90%',
                            height: 14, // Increased blue bar height
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                            boxShadow: 1,
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </Box>
        );
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
                        {/* Allow drop at index 0 when empty */}
                        {renderDropZone(0)}
                    </Box>
                ) : (
                    <>
                        {emailSections.map((section, idx) => (
                            <React.Fragment key={section.id}>
                                {/* Drop zone above each section */}
                                {renderDropZone(idx)}
                                <Paper
                                    data-section-id={section.id}
                                    variant="outlined"
                                    draggable
                                    onDragStart={e => {
                                        setDraggedIndex(idx);
                                        // For internal drag, clear any sidebar drag data
                                        e.dataTransfer.setData('text/plain', '');
                                    }}
                                    onDragEnd={() => setDraggedIndex(null)}
                                    onClick={() => openEditor(section)}
                                    sx={{
                                        mb: 1,
                                        position: 'relative',
                                        borderRadius: 2,
                                        opacity: draggedIndex === idx ? 0.4 : 1,
                                        transform: draggedIndex === idx ? 'scale(.96)' : 'none',
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

                                    {previews[section.id] ?? null}
                                </Paper>
                            </React.Fragment>
                        ))}
                        {/* Drop zone at end */}
                        {renderDropZone(emailSections.length)}
                    </>
                )}
            </Box>
        </Paper>
    );
};

export default EmailEditorPreviewSection;
