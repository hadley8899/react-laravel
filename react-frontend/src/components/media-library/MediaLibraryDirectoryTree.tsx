import React from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

interface Props {
    onAddFolder: () => void;
    selectedId: string;
    onSelect: (id: string) => void;
    root: React.ReactNode;
}

const MediaLibraryDirectoryTree: React.FC<Props> = ({
                                                        onAddFolder,
                                                        selectedId,
                                                        onSelect,
                                                        root,
                                                    }) => (
    <Grid size={{ xs: 12, md: 3 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Folders</Typography>
            <IconButton onClick={onAddFolder} size="small">
                <AddIcon fontSize="small" />
            </IconButton>
        </Stack>

        <SimpleTreeView
            selectedItems={selectedId}
            onSelectedItemsChange={(_, id) =>
                onSelect(Array.isArray(id) ? id[0] : (id as string))
            }
            defaultExpandedItems={['root']}
            sx={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            {root}
        </SimpleTreeView>
    </Grid>
);

export default MediaLibraryDirectoryTree;
