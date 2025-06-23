import React, { useMemo, useRef, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import dayjs from 'dayjs';
import MainLayout from '../components/layout/MainLayout';
import { useNotifier } from '../context/NotificationContext.tsx';
import { directoriesMock, itemsMock } from '../mock/mediaLibraryMockData.ts';
import MediaLibraryDirectoryTree from '../components/media-library/MediaLibraryDirectoryTree.tsx';
import MediaLibraryTopBar from '../components/media-library/MediaLibraryTopBar.tsx';
import MediaLibraryImageList from '../components/media-library/MediaLibraryImageList.tsx';

export interface Directory {
    id: string;
    name: string;
    parentId: string | null;
}

export interface MediaItem {
    id: string;
    directoryId: string;
    url: string;
    filename: string;
    name: string;
    sizeKb: number;
    createdAt: string;
}

const MediaLibrary: React.FC = () => {
    const { showNotification } = useNotifier();

    /* ── State ──────────────────────────────────────────────── */
    const [directories, setDirectories] = useState<Directory[]>(directoriesMock);
    const [items, setItems] = useState<MediaItem[]>(itemsMock);
    const [currentDirId, setCurrentDirId] = useState<string>('root');
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [search, setSearch] = useState('');
    const [cols, setCols] = useState<number>(4);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ── Helpers ────────────────────────────────────────────── */
    const findDir = (id: string) => directories.find((d) => d.id === id);

    const breadcrumbPath: Directory[] = useMemo(() => {
        const chain: Directory[] = [];
        let walker = findDir(currentDirId);
        while (walker) {
            chain.unshift(walker);
            walker = walker.parentId ? findDir(walker.parentId) : undefined;
        }
        return chain;
    }, [currentDirId, directories]);

    /* Recursive tree builder */
    const renderTree = (node: Directory): React.ReactNode => (
        <TreeItem key={node.id} itemId={node.id} label={node.name}>
            {directories
                .filter((d) => d.parentId === node.id)
                .map((child) => renderTree(child))}
        </TreeItem>
    );

    /* ── Mock upload / CRUD ─────────────────────────────────── */
    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newItem: MediaItem = {
            id: crypto.randomUUID(),
            directoryId: currentDirId,
            url: `https://picsum.photos/seed/${Date.now()}/600/400`,
            filename: file.name,
            name: file.name.replace(/\.[^.]+$/, ''),
            sizeKb: Math.round(file.size / 1024),
            createdAt: new Date().toISOString(),
        };
        setItems((prev) => [newItem, ...prev]);
        showNotification('Uploaded successfully');
    };

    const handleDelete = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setSelected(null);
        showNotification('Image deleted', 'error');
    };

    const handleRename = () => {
        if (!selected) return;
        setItems((prev) =>
            prev.map((i) => (i.id === selected.id ? { ...i, name: selected.name } : i)),
        );
        setIsEditingName(false);
        showNotification('Name updated');
    };

    const addDirectory = () => {
        const name = prompt('Folder name');
        if (!name) return;
        const dir: Directory = {
            id: crypto.randomUUID(),
            name,
            parentId: currentDirId,
        };
        setDirectories((prev) => [...prev, dir]);
        setCurrentDirId(dir.id);
    };

    /* ── Filter & group ─────────────────────────────────────── */
    const groupedByDate = useMemo(() => {
        const filtered = items
            .filter((i) => i.directoryId === currentDirId)
            .filter(
                (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) ||
                    i.filename.toLowerCase().includes(search.toLowerCase()),
            )
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );

        const out: Record<string, MediaItem[]> = {};
        filtered.forEach((i) => {
            const key = dayjs(i.createdAt).format('DD MMM YYYY');
            out[key] = out[key] ? [...out[key], i] : [i];
        });
        return out;
    }, [items, currentDirId, search]);

    /* ── UI ─────────────────────────────────────────────────── */
    return (
        <MainLayout title="Media Library">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    {/* Folder tree */}
                    <MediaLibraryDirectoryTree
                        onAddFolder={addDirectory}
                        selectedId={currentDirId}
                        onSelect={(dirId) => setCurrentDirId(dirId)}
                        root={renderTree(findDir('root')!)}
                    />

                    {/* Main panel */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <MediaLibraryTopBar
                            breadcrumbPath={breadcrumbPath}
                            onNavigateRoot={() => setCurrentDirId('root')}
                            onBreadcrumbClick={(dir) => setCurrentDirId(dir.id)}
                            search={search}
                            onSearchChange={(e) => setSearch(e.target.value)}
                            cols={cols}
                            onColsChange={(v) => setCols(v)}
                            fileInputRef={fileInputRef}
                            onFileChange={handleSelectFile}
                            onUploadClick={() => fileInputRef.current?.click()}
                        />

                        <MediaLibraryImageList
                            groupedByDate={groupedByDate}
                            cols={cols}
                            onItemClick={(item) => {
                                setSelected(item);
                                setIsEditingName(false);
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Preview / edit modal */}
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
                                    value={selected.name}
                                    onChange={(e) =>
                                        setSelected({ ...selected, name: e.target.value })
                                    }
                                    size="small"
                                    fullWidth
                                />
                            ) : (
                                selected.name
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
                                alt={selected.filename}
                                sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                            />
                            <Typography variant="body2" gutterBottom>
                                Filename: {selected.filename}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Size: {selected.sizeKb} KB
                            </Typography>
                            <Typography variant="body2">
                                Uploaded:{' '}
                                {dayjs(selected.createdAt).format('DD MMM YYYY HH:mm')}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <IconButton color="error" onClick={() => handleDelete(selected.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <Button onClick={() => setSelected(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </MainLayout>
    );
};

export default MediaLibrary;
