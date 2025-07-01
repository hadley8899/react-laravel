import React, {useCallback, useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import {getDirectories, getAssets} from '../../services/mediaLibrary';
import {MediaDirectory} from '../../interfaces/MediaDirectory';
import {MediaAsset} from '../../interfaces/MediaAsset';
import MediaLibraryImageList from "../media-library/MediaLibraryImageList.tsx";

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (asset: MediaAsset) => void;
    fileType?: 'image' | 'all'; // Filter to only show images or all files
}

const ROOT_ID = 'root';

const MediaLibrarySelector: React.FC<Props> = ({
                                                   open,
                                                   onClose,
                                                   onSelect,
                                                   fileType = 'image'
                                               }) => {
    // State
    const [directories, setDirectories] = useState<MediaDirectory[]>([]);
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [currentDirId, setCurrentDirId] = useState(ROOT_ID);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<MediaAsset | null>(null);

    // Load directories
    const loadDirectories = useCallback(async () => {
        setLoading(true);
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
        } catch (error) {
            console.error('Failed to load directories', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load assets
    const loadAssets = useCallback(async (dirId: string) => {
        setLoading(true);
        try {
            const res = await getAssets({
                directory_uuid: dirId === ROOT_ID ? null : dirId,
                per_page: 100,
            });

            let filteredAssets = res.data;

            // Filter assets by type if needed
            if (fileType === 'image') {
                filteredAssets = filteredAssets.filter(asset =>
                    asset.mime_type?.startsWith('image/') ?? false
                );
            }

            const mapped = filteredAssets.map<MediaAsset>((a) => ({
                ...a,
                directory_uuid: a.directory_uuid ?? ROOT_ID,
                size: Math.round(a.size / 1024),
            }));
            setAssets(mapped);
        } catch (error) {
            console.error('Failed to load assets', error);
        } finally {
            setLoading(false);
        }
    }, [fileType]);

    // Load data when dialog opens or directory changes
    useEffect(() => {
        if (open) {
            loadDirectories().then(() => {
            });
            setSelected(null);
            setSearch('');
        }
    }, [loadDirectories, open]);

    useEffect(() => {
        if (open) {
            loadAssets(currentDirId).then(() => {
            });
        }
    }, [currentDirId, loadAssets, open]);

    // Filter assets by search term
    const filteredAssets = assets.filter(asset =>
        asset.original_name.toLowerCase().includes(search.toLowerCase())
    );

    // Group assets by date for display
    const groupedByDate = filteredAssets.reduce((groups, asset) => {
        const date = new Date(asset.created_at).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(asset);
        return groups;
    }, {} as Record<string, MediaAsset[]>);

    const handleConfirmSelection = () => {
        if (selected) {
            onSelect(selected);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Select {fileType === 'image' ? 'Image' : 'File'} from Media Library
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Box>
                        <Grid container spacing={2} sx={{mb: 2}}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    placeholder="Search files..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    size="small"
                                />
                            </Grid>

                            <Grid size={12}>
                                <Tabs
                                    value={currentDirId}
                                    onChange={(_, value) => setCurrentDirId(value)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    {directories.map(dir => (
                                        <Tab key={dir.uuid} label={dir.name} value={dir.uuid}/>
                                    ))}
                                </Tabs>
                            </Grid>
                        </Grid>

                        {Object.keys(groupedByDate).length === 0 ? (
                            <Typography sx={{p: 2, textAlign: 'center'}}>
                                No {fileType === 'image' ? 'images' : 'files'} found
                            </Typography>
                        ) : (
                            <MediaLibraryImageList
                                groupedByDate={groupedByDate}
                                cols={3}
                                onItemClick={(asset) => setSelected(asset)}
                            />
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleConfirmSelection}
                    variant="contained"
                    disabled={!selected}
                >
                    Select
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MediaLibrarySelector;