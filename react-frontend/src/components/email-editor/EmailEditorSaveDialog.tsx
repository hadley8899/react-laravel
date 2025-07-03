import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Button,
} from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    name: string;
    setName: (v: string) => void;
    subject: string;
    setSubject: (v: string) => void;
    preview: string;
    setPreview: (v: string) => void;
    infoErrors: { [key: string]: string[] };
}

const EmailEditorSaveDialog: React.FC<Props> = ({
    open,
    onClose,
    onSave,
    name,
    setName,
    subject,
    setSubject,
    preview,
    setPreview,
    infoErrors,
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Template Details</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <Button onClick={onClose}>Cancel</Button>
            <Button
                onClick={onSave}
                variant="contained"
                disabled={!name.trim()}
            >
                Save
            </Button>
        </DialogActions>
    </Dialog>
);

export default EmailEditorSaveDialog;

