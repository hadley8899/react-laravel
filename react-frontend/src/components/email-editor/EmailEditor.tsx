import React, {useEffect, useState, useCallback} from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useNotifier} from '../../context/NotificationContext';

import {
    createTemplate,
    updateTemplate,
    getTemplate,
} from '../../services/EmailTemplateService';

import {DEFAULT_SECTIONS, SECTION_TYPES} from '../../mock/editor/default-sections';
import EmailEditorSidebarItem from './EmailEditorSidebarItem';
import EmailEditorPreviewSection from './EmailEditorPreviewSection';
import SectionEditForm from "../emailEditor/SectionEditForm.tsx";

interface Props {
    templateUuid?: string;
}

const EmailEditor: React.FC<Props> = ({templateUuid}) => {
    /* ---------------- state ---------------- */
    const [emailSections, setEmailSections] = useState<any[]>([]);
    const [editingSection, setEditingSection] = useState<any | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    /* template meta */
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [preview, setPreview] = useState('');
    const [infoOpen, setInfoOpen] = useState(false);

    /* misc */
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const theme = useTheme();
    const navigate = useNavigate();
    const {showNotification} = useNotifier();

    /* ---------------- helpers ---------------- */
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

    /* ---------------- load existing ---------------- */
    const loadTemplate = useCallback(async () => {
        if (!templateUuid) return;
        setLoading(true);
        try {
            const tpl = await getTemplate(templateUuid);
            setName(tpl.name);
            setSubject(tpl.subject ?? '');
            setPreview(tpl.preview_text ?? '');
            setEmailSections(tpl.layout_json || []);
        } catch {
            showNotification('Failed to load template', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification, templateUuid]);

    useEffect(() => {
        loadTemplate().then(() => {});
    }, [loadTemplate]);

    /* ---------------- save ---------------- */
    const handleSave = async () => {
        if (!name.trim()) {
            setInfoOpen(true);
            return;
        }
        setSaving(true);
        try {
            const payload = {
                name,
                subject: subject || null,
                preview_text: preview || null,
                layout_json: emailSections,
            };

            let tpl;
            if (templateUuid) {
                await updateTemplate(templateUuid, payload);
                showNotification('Template updated');
            } else {
                tpl = await createTemplate(payload);
                console.log(tpl);
                showNotification('Template saved');
                navigate(`/editor/${tpl.uuid}`, {replace: true});
            }
        } catch {
            showNotification('Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Add this memoized function before the return statement
    const handleUpdateContent = React.useCallback(
        (field: string, value: any) => {
            setEditingSection((prev: any) => ({
                ...prev,
                content: { ...prev.content, [field]: value },
            }));
        },
        []
    );

    if (loading) {
        return (
            <Box sx={{p: 4, textAlign: 'center'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f5f5',
                }}
            >
                {/* ---------- sidebar ---------- */}
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
                        <EmailEditorSidebarItem key={type} type={type} addSection={addSection}/>
                    ))}

                    {/* ------- save button ------- */}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3}}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={22} sx={{color: '#fff'}}/> : 'Save'}
                    </Button>
                </Paper>

                {/* ---------- preview canvas ---------- */}
                <EmailEditorPreviewSection
                    emailSections={emailSections}
                    setEmailSections={setEmailSections}
                    openEditor={openEditor}
                    removeSection={removeSection}
                    setDraggedIndex={setDraggedIndex}
                    draggedIndex={draggedIndex}
                />

                {/* ---------- edit modal ---------- */}
                <Dialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit {editingSection?.title}</DialogTitle>
                    <DialogContent dividers sx={{pt: 2}}>
                        <SectionEditForm
                            editingSection={editingSection}
                            updateContent={handleUpdateContent}
                        />
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

            {/* ---------- first-time “template info” dialog ---------- */}
            <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Template Details</DialogTitle>
                <DialogContent sx={{pt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <TextField
                        label="Name *"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                    />
                    <TextField
                        label="Preview text"
                        value={preview}
                        onChange={e => setPreview(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInfoOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setInfoOpen(false);
                            handleSave();
                        }}
                        variant="contained"
                        disabled={!name.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmailEditor;
