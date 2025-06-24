import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface Props {
    open: boolean;
    name: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<Props> = ({
                                                  open,
                                                  name,
                                                  onCancel,
                                                  onConfirm,
                                              }) => (
    <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Delete folder</DialogTitle>
        <DialogContent dividers>
            <DialogContentText>
                Delete “<strong>{name}</strong>” and everything inside it? This can’t be
                undone.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant="contained" color="error" onClick={onConfirm}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteConfirmDialog;
