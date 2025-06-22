import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Tooltip,
    Button,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TagDialog from './TagDialog';
import MainLayout from '../../components/layout/MainLayout';
import { Tag } from '../../interfaces/Tag';
import { getTags, deleteTag } from '../../services/TagService';
import TagChip from '../../components/TagChip';
import { useNotifier } from '../../context/NotificationContext';

const TagListPage: React.FC = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Tag | null>(null);
    const { showNotification } = useNotifier();

    const loadTags = () => {
        setLoading(true);
        setError(null);
        getTags()
            .then(setTags)
            .catch((err) => setError(err.message ?? 'Failed to load tags'))
            .finally(() => setLoading(false));
    };

    useEffect(loadTags, []);

    const handleEdit = (tag: Tag) => {
        setTagToEdit(tag);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteTag(deleteConfirm.uuid);
            showNotification('Tag deleted');
            setDeleteConfirm(null);
            loadTags();
        } catch (err: any) {
            showNotification(err.message ?? 'Delete failed', 'error');
        }
    };

    return (
        <MainLayout title="Tags">
            <Container maxWidth="md">
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
                >
                    <Typography variant="h4">Tags</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setTagToEdit(null);
                            setDialogOpen(true);
                        }}
                    >
                        New Tag
                    </Button>
                </Box>

                <Paper elevation={3} sx={{ borderRadius: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : tags.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>No tags yet.</Box>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Colour</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tags.map((tag) => (
                                        <TableRow key={tag.uuid}>
                                            <TableCell>{tag.name}</TableCell>
                                            <TableCell>
                                                <TagChip tag={tag} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => handleEdit(tag)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => setDeleteConfirm(tag)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* create / edit dialog */}
            <TagDialog
                open={dialogOpen}
                tagToEdit={tagToEdit}
                onClose={() => setDialogOpen(false)}
                onSaved={loadTags}
            />

            {/* delete confirmation */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Delete Tag</DialogTitle>
                <DialogContent>Are you sure you want to delete “{deleteConfirm?.name}”?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default TagListPage;
