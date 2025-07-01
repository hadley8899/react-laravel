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
    previewTemplate, getSectionTemplates,
} from '../../services/EmailTemplateService';
import {getCompanyVariables} from '../../services/CompanyVariableService';
import EmailEditorSidebarItem from './EmailEditorSidebarItem';
import EmailEditorPreviewSection from './EmailEditorPreviewSection';
import SectionEditForm from '../emailEditor/SectionEditForm';

import {CompanyVariable} from '../../interfaces/CompanyVariable';
import {EmailSectionTemplate} from "../../interfaces/EmailSectionTemplate.tsx";

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

    /* catalogues */
    const [variables, setVariables] = useState<CompanyVariable[]>([]);
    const [sectionTemplates, setSectionTemplates] = useState<EmailSectionTemplate[]>([]);

    /* misc */
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [infoErrors, setInfoErrors] = useState<{ [key: string]: string[] }>({});

    const theme = useTheme();
    const navigate = useNavigate();
    const {showNotification} = useNotifier();

    /* ---------------- helpers ---------------- */
    const addSection = (tpl: EmailSectionTemplate) =>
        setEmailSections(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                type: tpl.type,
                title: tpl.title,
                content: JSON.parse(JSON.stringify(tpl.default_content)), // deep-copy
            },
        ]);

    const removeSection = (id: number) =>
        setEmailSections(prev => prev.filter(s => s.id !== id));

    const openEditor = (section: any) => {
        setEditingSection({...section});
        setEditOpen(true);
    };

    const saveSection = () => {
        setEmailSections(prev => prev.map(s => (s.id === editingSection!.id ? editingSection : s)));
        setEditOpen(false);
    };

    /* ---------------- load existing template ---------------- */
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
        loadTemplate();
    }, [loadTemplate]);

    /* ---------------- load company variables ---------------- */
    const loadVariables = useCallback(async () => {
        try {
            const data = await getCompanyVariables();
            setVariables(data);
        } catch {
            showNotification('Could not load variables', 'error');
        }
    }, [showNotification]);

    useEffect(() => {
        loadVariables();
    }, [loadVariables]);

    const loadSectionTemplates = useCallback(async () => {
        try {
            const data = await getSectionTemplates();
            console.log(data);
            setSectionTemplates(data);
        } catch {
            showNotification('Could not load section templates', 'error');
        }
    }, [showNotification]);

    useEffect(() => {
        loadSectionTemplates();
    }, [loadSectionTemplates]);

    // Add this after sectionTemplates are loaded, and only for new templates
    useEffect(() => {
        if (
            !templateUuid &&
            sectionTemplates.length > 0 &&
            emailSections.length === 0
        ) {
            const header = sectionTemplates.find(
                t => t.type.toLowerCase() === 'header'
            );
            const text = sectionTemplates.find(
                t => t.type.toLowerCase() === 'text'
            );
            const image = sectionTemplates.find(
                t => t.type.toLowerCase() === 'image'
            );
            const button = sectionTemplates.find(
                t => t.type.toLowerCase() === 'button'
            );

            const footer = sectionTemplates.find(
                t => t.type.toLowerCase() === 'footer'
            );
            const starterSections = [header, text, image, button, footer]
                .filter(Boolean)
                .map(tpl => ({
                    id: Date.now() + Math.random(),
                    type: tpl!.type,
                    title: tpl!.title,
                    content: JSON.parse(JSON.stringify(tpl!.default_content)),
                }));
            if (starterSections.length > 0) {
                setEmailSections(starterSections);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionTemplates, templateUuid]);

    const handleSave = async () => {
        if (!name.trim()) {
            setInfoOpen(true);
            setInfoErrors({});
            return;
        }
        setSaving(true);
        setInfoErrors({});
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
                showNotification('Template saved');
                navigate(`/email-templates/editor/${tpl.uuid}`, {replace: true});
            }
        } catch (err: any) {
            // Try to extract validation errors from backend
            let backendErrors: { [key: string]: string[] } = {};
            if (err?.response?.data?.errors) {
                backendErrors = err.response.data.errors;
            }
            if (Object.keys(backendErrors).length > 0) {
                setInfoErrors(backendErrors);
                setInfoOpen(true); // Open info dialog so user can fix errors
            } else {
                showNotification('Save failed', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const handlePreview = async () => {
        if (!templateUuid) {
            showNotification('Save template first to preview', 'error');
            return;
        }
        try {
            const data = await previewTemplate(templateUuid);
            setPreviewHtml(data.html);
        } catch {
            showNotification('Preview failed', 'error');
        }
    };

    /* ---------------- inline content updater ---------------- */
    const handleUpdateContent = useCallback((field: string, value: any) => {
        setEditingSection((prev: any) => ({
            ...prev,
            content: {...prev.content, [field]: value},
        }));
    }, []);

    // Add this ref for the preview canvas
    const previewRef = React.useRef<HTMLDivElement>(null);

    // Handler for dropping a sidebar section onto the canvas at a specific index
    const handleSidebarSectionDrop = (tpl: EmailSectionTemplate, dropIndex?: number) => {
        setEmailSections(prev => {
            const newSection = {
                id: Date.now() + Math.random(),
                type: tpl.type,
                title: tpl.title,
                content: JSON.parse(JSON.stringify(tpl.default_content)),
            };
            if (typeof dropIndex === 'number') {
                const next = [...prev];
                next.splice(dropIndex, 0, newSection);
                return next;
            }
            return [...prev, newSection];
        });
    };

    /* ---------------- render ---------------- */
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
                        Click or drag to add sections to your email
                    </Typography>

                    {sectionTemplates.map(tpl => (
                        <EmailEditorSidebarItem
                            key={tpl.uuid}
                            template={tpl}
                            addSection={addSection}
                            draggable
                        />
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

                    <Button onClick={handlePreview} variant="outlined" sx={{mt: 1}}>
                        Preview
                    </Button>

                    {/* preview dialog */}
                    <Dialog
                        open={Boolean(previewHtml)}
                        onClose={() => setPreviewHtml(null)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Live Preview</DialogTitle>
                        <DialogContent dividers sx={{p: 0}}>
                            {previewHtml && (
                                <iframe
                                    title="preview"
                                    srcDoc={previewHtml}
                                    style={{border: 0, width: '100%', height: '70vh'}}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </Paper>

                {/* ---------- preview canvas ---------- */}
                <Box
                    ref={previewRef}
                    sx={{flex: 1, p: 3, overflowY: 'auto'}}
                >
                    <EmailEditorPreviewSection
                        emailSections={emailSections}
                        setEmailSections={setEmailSections}
                        openEditor={openEditor}
                        removeSection={removeSection}
                        setDraggedIndex={setDraggedIndex}
                        draggedIndex={draggedIndex}
                        onSidebarSectionDrop={handleSidebarSectionDrop}
                    />
                </Box>

                {/* ---------- edit modal ---------- */}
                <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Edit {editingSection?.title}</DialogTitle>
                    <DialogContent dividers sx={{pt: 2}}>
                        <SectionEditForm
                            editingSection={editingSection}
                            updateContent={handleUpdateContent}
                            variables={variables}
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
                        error={!!infoErrors.name}
                        helperText={infoErrors.name ? infoErrors.name.join(' ') : ''}
                    />
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        error={!!infoErrors.subject}
                        helperText={infoErrors.subject ? infoErrors.subject.join(' ') : ''}
                    />
                    <TextField
                        label="Preview text"
                        value={preview}
                        onChange={e => setPreview(e.target.value)}
                        error={!!infoErrors.preview_text}
                        helperText={infoErrors.preview_text ? infoErrors.preview_text.join(' ') : ''}
                    />
                    {infoErrors.layout_json && (
                        <Typography color="error" variant="body2">
                            {infoErrors.layout_json.join(' ')}
                        </Typography>
                    )}
                    {infoErrors.message && (
                        <Typography color="error" variant="body2">
                            {infoErrors.message.join(' ')}
                        </Typography>
                    )}
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
