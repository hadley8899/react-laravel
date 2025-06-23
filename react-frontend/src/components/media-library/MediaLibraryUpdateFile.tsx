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
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
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

const MediaLibraryUpdateFile: React.FC<Props> = ({
    selected,
    setSelected,
    isEditingName,
    setIsEditingName,
    handleRename,
    handleDelete,
}) => {
    return (
        <Dialog
            open={!!selected}
            onClose={() => setSelected(null)}
            maxWidth="sm"
            fullWidth
        >
            {selected && (
                <>
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
                            selected.original_name
                        )}
                        <IconButton
                            sx={{ ml: 'auto' }}
                            onClick={
                                isEditingName ? handleRename : () => setIsEditingName(true)
                            }
                        >
                            {isEditingName ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            component="img"
                            src={selected.url}
                            alt={selected.original_name}
                            sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                        />
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
                        <IconButton color="error" onClick={() => handleDelete(selected.uuid)}>
                            <DeleteIcon />
                        </IconButton>
                        <Button onClick={() => setSelected(null)}>Close</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default MediaLibraryUpdateFile;