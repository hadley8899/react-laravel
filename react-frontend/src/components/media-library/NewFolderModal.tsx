import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import type { MediaDirectory } from '../../interfaces/MediaDirectory';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
    currentDir: MediaDirectory | undefined;
}

const NewFolderModal: React.FC<Props> = ({ open, onClose, onCreate, currentDir }) => {
    const [name, setName] = useState('');

    const done = () => {
        if (name.trim()) onCreate(name.trim());
        setName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>New folder in <strong>{currentDir?.name ?? 'Root'}</strong></DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    label="Folder name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && done()}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" disabled={!name.trim()} onClick={done}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewFolderModal;
