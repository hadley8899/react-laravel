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
    CircularProgress,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useNavigate} from 'react-router-dom';
import {useNotifier} from '../../context/NotificationContext';
import {groupBy} from 'lodash';
import SendIcon from '@mui/icons-material/Send';

import {
    createTemplate,
    updateTemplate,
    getTemplate,
    previewTemplate, getSectionTemplates,
} from '../../services/EmailTemplateService';
import {getCompanyVariables} from '../../services/CompanyVariableService';
import EmailEditorSidebarItem from './EmailEditorSidebarItem';
import EmailEditorPreviewSection from './EmailEditorPreviewSection';
import SectionEditForm from './SectionEditForm';
import EmailEditorSaveDialog from "./EmailEditorSaveDialog";
import {CompanyVariable} from '../../interfaces/CompanyVariable';
import {EmailSectionTemplate} from "../../interfaces/EmailSectionTemplate.ts";
import {MediaAsset} from '../../interfaces/MediaAsset';
import MediaLibrarySelector from "./MediaLibrarySelector.tsx";

interface Props {
    templateUuid?: string;
}

// Fix: add group property to EmailSectionTemplate type (if not already present)
// If you control the EmailSectionTemplate interface, add this property there instead.
type EmailSectionTemplateWithGroup = EmailSectionTemplate & { group?: string };

const EmailEditor: React.FC<Props> = ({templateUuid}) => {
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

    /* media library selector */
    const [mediaSelector, setMediaSelector] = useState<{
        open: boolean;
        field: string;
        type: 'image' | 'all';
    }>({
        open: false,
        field: '',
        type: 'image',
    });

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

    /* ---------------- media library ---------------- */
    const openMediaLibrary = (field: string, type: 'image' | 'all' = 'image') => {
        setMediaSelector({
            open: true,
            field,
            type,
        });
    };

    const handleMediaSelect = (asset: MediaAsset) => {
        handleUpdateContent(mediaSelector.field, asset.url);
        setMediaSelector({...mediaSelector, open: false});
    };

    /* ---------------- load existing template ---------------- */
    const loadTemplate = useCallback(async (): Promise<void> => {
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
        void loadTemplate();
    }, [loadTemplate]);

    /* ---------------- load company variables ---------------- */
    const loadVariables = useCallback(async (): Promise<void> => {
        try {
            const data = await getCompanyVariables();
            setVariables(data);
        } catch {
            showNotification('Could not load variables', 'error');
        }
    }, [showNotification]);

    useEffect(() => {
        void loadVariables();
    }, [loadVariables]);

    const loadSectionTemplates = useCallback(async (): Promise<void> => {
        try {
            const data = await getSectionTemplates();
            setSectionTemplates(data);
        } catch {
            showNotification('Could not load section templates', 'error');
        }
    }, [showNotification]);

    useEffect(() => {
        void loadSectionTemplates();
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
            // Filter out undefined before mapping
            const starterSections = [header, text, image, button, footer]
                .filter((tpl): tpl is EmailSectionTemplate => Boolean(tpl))
                .map((tpl: EmailSectionTemplate) => ({
                    id: Date.now() + Math.random(),
                    type: tpl.type,
                    title: tpl.title,
                    content: JSON.parse(JSON.stringify(tpl.default_content)),
                }));
            if (starterSections.length > 0) {
                setEmailSections(starterSections);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionTemplates, templateUuid]);

    const handleSave = async (): Promise<void> => {
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
    const handlePreview = async (): Promise<void> => {
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

    const handleSend = () => {
        if (!templateUuid) {
            showNotification('Save template first to send', 'error');
            return;
        }
        navigate(`/email-templates/send/${templateUuid}`);
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

    // Group section templates by group
    const groupedSectionTemplates = groupBy(
        sectionTemplates as EmailSectionTemplateWithGroup[],
        tpl => tpl.group || 'Other'
    );

    // Track which sidebar group is expanded (only one at a time)
    const [expandedGroup, setExpandedGroup] = useState<string | false>(false);

    // Expand only the first group by default on first load
    useEffect(() => {
        const groupNames = Object.keys(groupedSectionTemplates);
        setExpandedGroup(groupNames.length > 0 ? groupNames[0] : false);
    }, [sectionTemplates.length]);

    const handleAccordionToggle = (group: string) => {
        setExpandedGroup(prev =>
            prev === group ? false : group
        );
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

                    {/* Collapsible groups */}
                    {Object.entries(groupedSectionTemplates).map(([group, templates]) => (
                        <Accordion
                            key={group}
                            expanded={expandedGroup === group}
                            onChange={() => handleAccordionToggle(group)}
                            disableGutters
                            sx={{
                                mb: 1.5,
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    minHeight: 40,
                                    '& .MuiAccordionSummary-content': { my: 0.5 },
                                    fontWeight: 600,
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {group}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0, pt: 0.5 }}>
                                {templates.map(tpl => (
                                    <EmailEditorSidebarItem
                                        key={tpl.uuid}
                                        template={tpl}
                                        addSection={addSection}
                                        draggable
                                    />
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3}}
                        onClick={() => { void handleSave(); }}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={22} sx={{color: '#fff'}}/> : 'Save'}
                    </Button>

                    <Button
                        fullWidth
                        onClick={() => { void handlePreview(); }}
                        variant="outlined"
                        disabled={saving}
                        sx={{mt: 2}}
                    >
                        {saving ? <CircularProgress size={22} sx={{color: '#fff'}}/> : 'Preview'}
                    </Button>

                    <Button
                        fullWidth
                        onClick={handleSend}
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon />}
                        sx={{mt: 2}}
                        disabled={saving}
                    >
                        Send
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
                            openMediaLibrary={openMediaLibrary}
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

                <MediaLibrarySelector
                    open={mediaSelector.open}
                    onClose={() => setMediaSelector({...mediaSelector, open: false})}
                    onSelect={handleMediaSelect}
                    fileType={mediaSelector.type}
                />
            </Box>

            {/* ---------- first-time "template info" dialog ---------- */}
            <EmailEditorSaveDialog
                open={infoOpen}
                onClose={() => setInfoOpen(false)}
                onSave={() => {
                    setInfoOpen(false);
                    void handleSave();
                }}
                name={name}
                setName={setName}
                subject={subject}
                setSubject={setSubject}
                preview={preview}
                setPreview={setPreview}
                infoErrors={infoErrors}
            />
        </>
    );
};

export default EmailEditor;
