import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { Tag } from '../../interfaces/Tag';
import { createTag, updateTag, CreateTagPayload, UpdateTagPayload } from '../../services/TagService';
import { useNotifier } from '../../context/NotificationContext';

interface TagDialogProps {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    tagToEdit?: Tag | null;
}

const TagDialog: React.FC<TagDialogProps> = ({ open, onClose, onSaved, tagToEdit = null }) => {
    const isEditMode = !!tagToEdit;
    const { showNotification } = useNotifier();

    const [name, setName] = useState('');
    const [color, setColor] = useState<string | null>('#5E9CFF');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* pre-fill when editing */
    useEffect(() => {
        if (open) {
            setName(tagToEdit?.name ?? '');
            setColor(tagToEdit?.color ?? '#5E9CFF');
            setError(null);
            setSubmitting(false);
        }
    }, [open, tagToEdit]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        setSubmitting(true);
        try {
            if (isEditMode && tagToEdit) {
                const payload: UpdateTagPayload = { name: name.trim(), color };
                await updateTag(tagToEdit.uuid, payload);
            } else {
                const payload: CreateTagPayload = { name: name.trim(), color };
                await createTag(payload);
            }
            showNotification(`Tag ${isEditMode ? 'updated' : 'created'} successfully`);
            onSaved();
            onClose();
        } catch (err: any) {
            console.error('Save tag failed:', err);
            setError(err.message ?? 'Unexpected error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ p: 2 }}>
                {isEditMode ? 'Edit Tag' : 'New Tag'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                        />
                    </Grid>
                    <Grid size={12}>
                        {/* simple native colour input keeps bundle light */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <TextField
                                label="Colour"
                                type="color"
                                sx={{ width: 80 }}
                                value={color ?? '#5E9CFF'}
                                onChange={(e) => setColor(e.target.value)}
                                disabled={submitting}
                                slotProps={{
                                    htmlInput: { style: { padding: 0 } }
                                }}
                            />
                            <Box>{color}</Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
                <Button onClick={onClose} disabled={submitting} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                    startIcon={
                        submitting ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : isEditMode ? (
                            <SaveIcon />
                        ) : (
                            <AddIcon />
                        )
                    }
                >
                    {submitting ? 'Saving…' : isEditMode ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TagDialog;
