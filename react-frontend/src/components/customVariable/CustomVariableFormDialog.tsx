import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Stack,
} from '@mui/material';
import {ContactCustomVariable} from '../../interfaces/ContactCustomVariable';
import {useNotifier} from '../../context/NotificationContext';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (payload: Partial<ContactCustomVariable>) => Promise<void>;
    editingVar?: ContactCustomVariable | null;
}

const CustomVariableFormDialog: React.FC<Props> = ({
                                                       open, onClose, onSave, editingVar,
                                                   }) => {
    const isEdit = Boolean(editingVar);
    const [friendlyName, setFriendlyName] = useState('');
    const [key, setKey] = useState('');
    const [type, setType] = useState<'text' | 'image'>('text');
    const {showNotification} = useNotifier();

    useEffect(() => {
        if (editingVar) {
            setFriendlyName(editingVar.friendly_name);
            setKey(editingVar.key.replace('CUSTOMER.', ''));
            setType(editingVar.type);
        } else {
            setFriendlyName('');
            setKey('');
            setType('text');
        }
    }, [editingVar]);

    // auto-generate key
    const handleNameBlur = () => {
        if (!isEdit && !key.trim()) {
            const generated = friendlyName
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
            setKey(generated);
        }
    };

    const handleSubmit = async () => {
        try {
            await onSave({friendly_name: friendlyName, key, type});
            onClose();
            showNotification(isEdit ? 'Field updated.' : 'Field created.');
        } catch (e: any) {
            showNotification(e?.message ?? 'Error saving field', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? 'Edit Contact Field' : 'New Contact Field'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Friendly name"
                        value={friendlyName}
                        onChange={(e) => setFriendlyName(e.target.value)}
                        onBlur={handleNameBlur}
                        required
                    />
                    <TextField
                        label="Variable key"
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase())}
                        helperText="UPPER_SNAKE_CASE. Will be prefixed with CUSTOMER."
                        required
                    />
                    <TextField
                        select
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'text' | 'image')}
                    >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="image">Image (URL or uploaded path)</MenuItem>
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomVariableFormDialog;
