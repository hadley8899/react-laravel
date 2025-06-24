import React from 'react';
import {
    Box,
    Breadcrumbs,
    Button,
    IconButton,
    InputAdornment,
    Slider,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Home, PhotoCamera } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import type { MediaDirectory } from '../../interfaces/MediaDirectory';

interface Props {
    breadcrumbPath: MediaDirectory[];
    onNavigateRoot: () => void;
    onBreadcrumbClick: (dir: MediaDirectory) => void;
    search: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    cols: number;
    onColsChange: (n: number) => void;
    onOpenUpload: () => void;
    currentDir: MediaDirectory | undefined;
}

const MediaLibraryTopBar: React.FC<Props> = ({
                                                 breadcrumbPath,
                                                 onNavigateRoot,
                                                 onBreadcrumbClick,
                                                 search,
                                                 onSearchChange,
                                                 cols,
                                                 onColsChange,
                                                 onOpenUpload,
                                                 currentDir,
                                             }) => (
    <Stack spacing={2} mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
            <IconButton size="small" onClick={onNavigateRoot}>
                <Home fontSize="small" />
            </IconButton>
            {breadcrumbPath.slice(1).map((dir) => (
                <Button
                    key={dir.uuid}
                    color="inherit"
                    onClick={() => onBreadcrumbClick(dir)}
                    sx={{ textTransform: 'none', minWidth: 0 }}
                >
                    {dir.name}
                </Button>
            ))}
        </Breadcrumbs>

        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
        >
            {/* search + (maybe) slider */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <TextField
                    size="small"
                    placeholder="Search…"
                    value={search}
                    onChange={onSearchChange}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* hide slider below md */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <Typography variant="body2">Columns</Typography>
                    <Slider
                        size="small"
                        min={2}
                        max={8}
                        step={1}
                        value={cols}
                        onChange={(_, v) => onColsChange(v as number)}
                        sx={{ width: 120 }}
                    />
                </Stack>
            </Stack>

            {/* upload */}
            <Box>
                <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    onClick={onOpenUpload}
                >
                    Upload to {currentDir?.name ?? 'Root'}
                </Button>
            </Box>
        </Stack>
    </Stack>
);

export default MediaLibraryTopBar;
