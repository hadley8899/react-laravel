import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import MainLayout from '../components/layout/MainLayout';
import {useNotifier} from '../context/NotificationContext.tsx';
import {
    getDirectories,
    createDirectory,
    getAssets,
    uploadAsset,
    updateAsset,
    deleteAsset,
    deleteDirectory,
} from '../services/mediaLibrary.ts';
import type {MediaDirectory} from '../interfaces/MediaDirectory.ts';
import type {MediaAsset} from '../interfaces/MediaAsset.ts';
import MediaLibraryDirectoryTree from '../components/media-library/MediaLibraryDirectoryTree.tsx';
import MediaLibraryTopBar from '../components/media-library/MediaLibraryTopBar.tsx';
import MediaLibraryImageList from '../components/media-library/MediaLibraryImageList.tsx';
import MediaLibraryUpdateFile from '../components/media-library/MediaLibraryUpdateFile.tsx';
import UploadModal from '../components/media-library/UploadModal.tsx';
import NewFolderModal from '../components/media-library/NewFolderModal.tsx';
import TreeItemRender from '../components/media-library/TreeItemRender.tsx';
import DeleteConfirmDialog from '../components/media-library/DeleteConfirmDialog.tsx';

const ROOT_ID = 'root';

const MediaLibrary: React.FC = () => {
    const {showNotification} = useNotifier();
    const theme = useTheme();
    const downMd = useMediaQuery(theme.breakpoints.down('md'));

    const [directories, setDirectories] = useState<MediaDirectory[]>([]);
    const [items, setItems] = useState<MediaAsset[]>([]);
    const [currentDirId, setCurrentDirId] = useState(ROOT_ID);
    const [selected, setSelected] = useState<MediaAsset | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [search, setSearch] = useState('');
    const [cols, setCols] = useState(4);
    const [loadingDirs, setLoadingDirs] = useState(false);
    const [loadingAssets, setLoadingAssets] = useState(false);

    // modals
    const [uploadOpen, setUploadOpen] = useState(false);
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [dirToDelete, setDirToDelete] = useState<MediaDirectory | null>(null);

    const findDir = (id: string) => directories.find((d) => d.uuid === id);

    const gatherDescendants = (id: string): string[] => {
        const direct = directories.filter((d) => d.parent_uuid === id).map((d) => d.uuid);
        return direct.reduce<string[]>(
            (acc, childId) => [...acc, ...gatherDescendants(childId)],
            [id],
        );
    };

    const loadDirectories = useCallback(async () => {
        setLoadingDirs(true);
        try {
            const res = await getDirectories();
            const mapped: MediaDirectory[] = [
                {uuid: ROOT_ID, name: 'Root', parent_uuid: null, created_at: '', updated_at: ''},
                ...res.map((d) => ({
                    ...d,
                    parent_uuid: d.parent_uuid ?? ROOT_ID,
                })),
            ];
            setDirectories(mapped);
        } catch {
            showNotification('Error loading folders', 'error');
        } finally {
            setLoadingDirs(false);
        }
    }, [showNotification]);

    const loadAssets = useCallback(
        async (dirId: string) => {
            setLoadingAssets(true);
            try {
                const res = await getAssets({
                    directory_uuid: dirId === ROOT_ID ? null : dirId,
                    per_page: 500,
                });
                const mapped = res.data.map<MediaAsset>((a) => ({
                    ...a,
                    directory_uuid: a.directory_uuid ?? ROOT_ID,
                    size: Math.round(a.size / 1024),
                }));
                setItems(mapped);
            } catch {
                showNotification('Error loading images', 'error');
            } finally {
                setLoadingAssets(false);
            }
        },
        [showNotification],
    );

    useEffect(() => {
        loadDirectories();
    }, [loadDirectories]);
    useEffect(() => {
        loadAssets(currentDirId);
    }, [currentDirId, loadAssets]);

    const breadcrumbPath = useMemo(() => {
        const chain: MediaDirectory[] = [];
        let walker = findDir(currentDirId);
        while (walker) {
            chain.unshift(walker);
            walker = walker.parent_uuid ? findDir(walker.parent_uuid) : undefined;
        }
        return chain;
    }, [currentDirId, directories]);

    const groupedByDate = useMemo(() => {
        const filtered = items
            .filter((i) => i.directory_uuid === currentDirId)
            .filter((i) =>
                i.original_name.toLowerCase().includes(search.toLowerCase()),
            )
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            );
        const out: Record<string, MediaAsset[]> = {};
        filtered.forEach((i) => {
            const key = dayjs(i.created_at).format('DD MMM YYYY');
            out[key] = out[key] ? [...out[key], i] : [i];
        });
        return out;
    }, [items, currentDirId, search]);

    const handleCreateFolder = async (name: string) => {
        try {
            const dir = await createDirectory({
                name,
                parent_uuid: currentDirId === ROOT_ID ? null : currentDirId,
            });
            setDirectories((prev) => [
                ...prev,
                {...dir, parent_uuid: dir.parent_uuid ?? ROOT_ID},
            ]);
            setCurrentDirId(dir.uuid);
            showNotification('Folder created');
        } catch {
            showNotification('Error creating folder', 'error');
        }
    };

    /** actual deletion after confirmation */
    const handleDeleteDirectory = async (dir: MediaDirectory) => {
        try {
            await deleteDirectory(dir.uuid);
            const idsToRemove = gatherDescendants(dir.uuid);
            setDirectories((prev) => prev.filter((d) => !idsToRemove.includes(d.uuid)));
            setItems((prev) =>
                prev.filter((a) => !idsToRemove.includes(a.directory_uuid ?? ROOT_ID)),
            );
            if (idsToRemove.includes(currentDirId)) setCurrentDirId(ROOT_ID);
            showNotification('Folder deleted');
        } catch {
            showNotification('Error deleting folder', 'error');
        }
    };

    const requestDeleteDirectory = (dir: MediaDirectory) => setDirToDelete(dir);

    const handleUploadFiles = async (files: File[]) => {
        const dirUuid = currentDirId === ROOT_ID ? null : currentDirId;
        for (const file of files) {
            try {
                const uploaded = await uploadAsset({file, directory_uuid: dirUuid});
                const mapped: MediaAsset = {
                    ...uploaded,
                    directory_uuid: uploaded.directory_uuid ?? ROOT_ID,
                    size: Math.round(uploaded.size / 1024),
                };
                setItems((prev) => [mapped, ...prev]);
            } catch {
                showNotification(`Failed to upload ${file.name}`, 'error');
            }
        }
        showNotification('Upload complete');
    };

    const handleRename = async () => {
        if (!selected) return;
        try {
            const updated = await updateAsset(selected.uuid, {
                alt: selected.original_name,
            });
            setItems((prev) =>
                prev.map((i) =>
                    i.uuid === selected.uuid ? {...i, alt: updated.alt} : i,
                ),
            );
            setIsEditingName(false);
        } catch {
            showNotification('Rename failed', 'error');
        }
    };

    const handleDelete = async (uuid: string) => {
        try {
            await deleteAsset(uuid);
            setItems((p) => p.filter((i) => i.uuid !== uuid));
            setSelected(null);
            showNotification('Deleted', 'error');
        } catch {
            showNotification('Delete failed', 'error');
        }
    };

    useEffect(() => {
        if (!selected) return;
        const list = items.filter((i) => i.directory_uuid === currentDirId);
        const idx = list.findIndex((i) => i.uuid === selected.uuid);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && idx < list.length - 1) {
                setSelected(list[idx + 1]);
            }
            if (e.key === 'ArrowLeft' && idx > 0) {
                setSelected(list[idx - 1]);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selected, items, currentDirId]);

    const rootDir = findDir(ROOT_ID);

    return (
        <MainLayout title="Media Library">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <MediaLibraryDirectoryTree
                        selectedId={currentDirId}
                        onSelect={setCurrentDirId}
                        root={
                            loadingDirs || !rootDir ? (
                                <CircularProgress size={20}/>
                            ) : (
                                <TreeItemRender
                                    node={rootDir}
                                    directories={directories}
                                    currentDirId={currentDirId}
                                    onDeleteDir={requestDeleteDirectory}
                                    rootId={ROOT_ID}
                                />
                            )
                        }
                        onAddFolder={() => setNewFolderOpen(true)}
                    />

                    <Grid size={{xs: 12, md: 9}}>
                        <MediaLibraryTopBar
                            breadcrumbPath={breadcrumbPath}
                            onNavigateRoot={() => setCurrentDirId(ROOT_ID)}
                            onBreadcrumbClick={(dir) => setCurrentDirId(dir.uuid)}
                            search={search}
                            onSearchChange={(e) => setSearch(e.target.value)}
                            cols={cols}
                            onColsChange={(n) => setCols(n)}
                            onOpenUpload={() => setUploadOpen(true)}
                            currentDir={findDir(currentDirId)}
                        />

                        {loadingAssets ? (
                            <Box sx={{textAlign: 'center', mt: 8}}>
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <MediaLibraryImageList
                                groupedByDate={groupedByDate}
                                cols={downMd ? 2 : cols}
                                onItemClick={(item) => {
                                    setSelected(item);
                                    setIsEditingName(false);
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* modals */}
            <UploadModal
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onUpload={handleUploadFiles}
                currentDir={findDir(currentDirId)}
            />
            <NewFolderModal
                open={newFolderOpen}
                onClose={() => setNewFolderOpen(false)}
                onCreate={handleCreateFolder}
                currentDir={findDir(currentDirId)}
            />
            <MediaLibraryUpdateFile
                selected={selected}
                setSelected={setSelected}
                isEditingName={isEditingName}
                setIsEditingName={setIsEditingName}
                handleRename={handleRename}
                handleDelete={handleDelete}
            />

            {/* delete confirmation */}
            {dirToDelete && (
                <DeleteConfirmDialog
                    open
                    name={dirToDelete.name}
                    onCancel={() => setDirToDelete(null)}
                    onConfirm={() => {
                        handleDeleteDirectory(dirToDelete);
                        setDirToDelete(null);
                    }}
                />
            )}
        </MainLayout>
    );
};

export default MediaLibrary;
