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
import type { Directory } from '../../pages/MediaLibrary';

interface Props {
    onNavigateRoot: () => void;
    breadcrumbPath: Directory[];
    onBreadcrumbClick: (dir: Directory) => void;

    search: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    cols: number;
    onColsChange: (value: number) => void;

    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadClick: () => void;
}

const MediaLibraryTopBar: React.FC<Props> = ({
                                                 onNavigateRoot,
                                                 breadcrumbPath,
                                                 onBreadcrumbClick,
                                                 search,
                                                 onSearchChange,
                                                 cols,
                                                 onColsChange,
                                                 fileInputRef,
                                                 onFileChange,
                                                 onUploadClick,
                                             }) => (
    <Stack spacing={2} mb={3}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb">
            <IconButton size="small" onClick={onNavigateRoot}>
                <Home fontSize="small" />
            </IconButton>
            {breadcrumbPath.slice(1).map((dir) => (
                <Button
                    key={dir.id}
                    color="inherit"
                    onClick={() => onBreadcrumbClick(dir)}
                    sx={{ textTransform: 'none', minWidth: 0 }}
                >
                    {dir.name}
                </Button>
            ))}
        </Breadcrumbs>

        {/* Toolbar */}
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                    size="small"
                    placeholder="Search…"
                    value={search}
                    onChange={onSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack direction="row" alignItems="center" spacing={1}>
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

            <Box>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onFileChange}
                />
                <Button variant="contained" startIcon={<PhotoCamera />} onClick={onUploadClick}>
                    Upload
                </Button>
            </Box>
        </Stack>
    </Stack>
);

export default MediaLibraryTopBar;
