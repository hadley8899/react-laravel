import React, { useState, DragEvent } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { MediaDirectory } from '../../interfaces/MediaDirectory';

interface Props {
    open: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
    currentDir: MediaDirectory | undefined;
}

const UploadModal: React.FC<Props> = ({ open, onClose, onUpload, currentDir }) => {
    const [files, setFiles] = useState<File[]>([]);

    const addFiles = (f: FileList | null) => {
        if (!f) return;
        setFiles((prev) => [...prev, ...Array.from(f)]);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    };

    const clear = () => {
        setFiles([]);
        onClose();
    };

    return (
        <Dialog open={open} onClose={clear} maxWidth="sm" fullWidth>
            <DialogTitle>
                Upload to: <strong>{currentDir?.name ?? 'Root'}</strong>
            </DialogTitle>
            <DialogContent>
                <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('upload-input')?.click()}
                >
                    <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography>Select or drop files here</Typography>
                    <input
                        id="upload-input"
                        multiple
                        type="file"
                        hidden
                        onChange={(e) => addFiles(e.target.files)}
                    />
                </Box>

                {files.length > 0 && (
                    <List dense sx={{ mt: 2 }}>
                        {files.map((f, idx) => (
                            <ListItem key={idx}>
                                <ListItemText primary={f.name} secondary={`${(f.size / 1024).toFixed(1)} KB`} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={clear}>Cancel</Button>
                <Button
                    variant="contained"
                    disabled={files.length === 0}
                    onClick={() => {
                        onUpload(files);
                        clear();
                    }}
                >
                    Upload&nbsp;({files.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadModal;
