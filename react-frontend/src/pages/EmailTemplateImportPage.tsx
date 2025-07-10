import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {
    Stack,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Typography,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MonacoEditor from '@monaco-editor/react';
import {useNotifier} from '../context/NotificationContext';
import {
    createTemplate,
    getTemplate,
    updateTemplate,
} from '../services/EmailTemplateService';
import TemplateVariableDrawer from '../components/TemplateVariableDrawer';

import type {editor as MonacoEditorNS} from 'monaco-editor';
import {getTemplateVariables, TemplateVariable} from "../services/VariableCatalogueService.ts";

interface FormState {
    name: string;
    subject: string;
    preview_text: string;
    html_source: string;
}

const EmailTemplateImportPage: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const isEdit = Boolean(uuid);

    const {showNotification} = useNotifier();
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);
    const [form, setForm] = useState<FormState>({
        name: '',
        subject: '',
        preview_text: '',
        html_source: '',
    });

    /* variables drawer */
    const [varsOpen, setVarsOpen] = useState(false);
    const [templateVars, setTemplateVars] = useState<TemplateVariable[]>([]);

    const editorRef = useRef<MonacoEditorNS.IStandaloneCodeEditor | null>(null);
    const handleEditorDidMount = (editor: MonacoEditorNS.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    useEffect(() => {
        if (!isEdit) return;

        (async () => {
            try {
                const tpl = await getTemplate(uuid!);
                setForm({
                    name: tpl.name,
                    subject: tpl.subject ?? '',
                    preview_text: tpl.preview_text ?? '',
                    html_source: tpl.html_source ?? '',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [isEdit, uuid]);

    useEffect(() => {
        (async () => {
            try {
                const vars = await getTemplateVariables();
                setTemplateVars(vars);
            } catch {
                /* ok – optional */
            }
        })();
    }, []);

    const disabled = !form.name.trim() || !form.html_source.trim();

    const save = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                await updateTemplate(uuid!, {
                    name: form.name,
                    subject: form.subject,
                    preview_text: form.preview_text,
                    html_source: form.html_source,
                    type: 'html',
                });
                showNotification('Template updated');
            } else {
                await createTemplate({...form, type: 'html'});
                showNotification('Template created');
            }
            navigate('/email-templates');
        } catch {
            showNotification('Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const insertVariable = (placeholder: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const sel = editor.getSelection();
        const range = sel ?? editor.getModel()!.getFullModelRange();
        editor.executeEdits('insert-var', [
            {
                range,
                text: `{{${placeholder}}}`,
                forceMoveMarkers: true,
            },
        ]);
        editor.focus();
    };

    if (loading) {
        return (
            <MainLayout>
                <Paper sx={{p: 6, maxWidth: 600, mx: 'auto', textAlign: 'center'}}>
                    <CircularProgress/>
                </Paper>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Paper sx={{p: 3, maxWidth: 1200, mx: 'auto'}}>
                <Typography variant="h5" fontWeight={600} mb={2}>
                    {isEdit ? 'Edit Raw HTML Template' : 'Import Raw HTML Template'}
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Template Name"
                        value={form.name}
                        required
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                    <TextField
                        label="Subject"
                        value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                    />
                    <TextField
                        label="Preview Text"
                        value={form.preview_text}
                        onChange={e => setForm({...form, preview_text: e.target.value})}
                    />

                    <MonacoEditor
                        height="60vh"
                        defaultLanguage="html"
                        value={form.html_source}
                        onChange={v => setForm({...form, html_source: v ?? ''})}
                        options={{fontSize: 14, minimap: {enabled: false}}}
                        onMount={handleEditorDidMount}
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        {/* Variables button is NOW OBVIOUS */}
                        <Button
                            variant="outlined"
                            startIcon={<ListAltIcon/>}
                            onClick={() => setVarsOpen(true)}
                        >
                            Variables
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate('/email-templates')}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={save}
                            disabled={saving || disabled}
                        >
                            {saving ? <CircularProgress size={24}/> : 'Save'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <TemplateVariableDrawer
                open={varsOpen}
                onClose={() => setVarsOpen(false)}
                variables={templateVars}
                onInsert={insertVariable}
            />
        </MainLayout>
    );
};

export default EmailTemplateImportPage;
