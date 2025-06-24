import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Button,
    Box,
    Typography,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideocamIcon from '@mui/icons-material/Videocam';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import dayjs from 'dayjs';
import type { MediaAsset } from '../../interfaces/MediaAsset';

interface Props {
    selected: MediaAsset | null;
    setSelected: (asset: MediaAsset | null) => void;
    isEditingName: boolean;
    setIsEditingName: (v: boolean) => void;
    handleRename: () => void;
    handleDelete: (id: string) => void;
}

const iconForMime = (mime = '') => {
    if (mime.startsWith('audio')) return MusicNoteIcon;
    if (mime.startsWith('video')) return VideocamIcon;
    if (mime === 'application/pdf') return PictureAsPdfIcon;
    return InsertDriveFileIcon;
};

const isImage = (mime?: string | null) => mime?.startsWith('image/');

const MediaLibraryUpdateFile: React.FC<Props> = ({
                                                     selected,
                                                     setSelected,
                                                     isEditingName,
                                                     setIsEditingName,
                                                     handleRename,
                                                     handleDelete,
                                                 }) => {
    if (!selected) return null;
    const Icon = iconForMime(selected.mime_type ?? '');

    return (
        <Dialog open onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                {isEditingName ? (
                    <TextField
                        value={selected.original_name}
                        onChange={(e) =>
                            setSelected({ ...selected, original_name: e.target.value })
                        }
                        size="small"
                        fullWidth
                    />
                ) : (
                    <Typography>{selected.alt || selected.original_name}</Typography>
                )}
                <IconButton
                    sx={{ ml: 'auto' }}
                    onClick={isEditingName ? handleRename : () => setIsEditingName(true)}
                >
                    {isEditingName ? <SaveIcon /> : <EditIcon />}
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {isImage(selected.mime_type) ? (
                    <Box
                        component="img"
                        src={selected.url}
                        alt={selected.original_name}
                        sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            pt: '56.25%', // 16:9
                            position: 'relative',
                            bgcolor: (t) => (t.palette.mode === 'dark' ? 'grey.800' : 'grey.100'),
                            borderRadius: 2,
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: (t) => (t.palette.mode === 'dark' ? 'grey.300' : 'grey.600'),
                            }}
                        >
                            <Icon sx={{ fontSize: 72 }} />
                        </Box>
                    </Box>
                )}

                <Typography variant="body2" gutterBottom>
                    Filename: {selected.original_name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Size: {selected.size} KB
                </Typography>
                <Typography variant="body2">
                    Uploaded: {dayjs(selected.created_at).format('DD MMM YYYY HH:mm')}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={selected.url}
                    target="_blank"
                    rel="noopener"
                >
                    Download
                </Button>
                <IconButton color="error" onClick={() => handleDelete(selected.uuid)}>
                    <DeleteIcon />
                </IconButton>
                <Button onClick={() => setSelected(null)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MediaLibraryUpdateFile;
