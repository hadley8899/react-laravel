import React from 'react';
import {
    Box,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Typography,
    useTheme,
    Chip,
    Tooltip,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideocamIcon from '@mui/icons-material/Videocam';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import ArchiveIcon from '@mui/icons-material/Archive';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ImageIcon from '@mui/icons-material/Image';
import {MediaAsset} from '../../interfaces/MediaAsset';

interface Props {
    groupedByDate: Record<string, MediaAsset[]>;
    cols: number;
    onItemClick: (item: MediaAsset) => void;
}

const iconForMime = (mime = '', name = '') => {
    if (mime.startsWith('audio')) return MusicNoteIcon;
    if (mime.startsWith('video')) return VideocamIcon;
    if (mime === 'application/pdf') return PictureAsPdfIcon;
    if (
        mime === 'application/msword' ||
        mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
        return DescriptionIcon;
    if (
        mime === 'application/vnd.ms-excel' ||
        mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
        return TableChartIcon;
    if (
        mime === 'application/vnd.ms-powerpoint' ||
        mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
        return SlideshowIcon;
    if (
        mime === 'application/zip' ||
        mime === 'application/x-7z-compressed' ||
        mime === 'application/x-rar-compressed' ||
        mime === 'application/x-tar'
    )
        return ArchiveIcon;
    if (
        mime.startsWith('text/') ||
        ['.txt', '.md', '.csv'].some(ext => name.endsWith(ext))
    )
        return ArticleIcon;
    if (
        [
            '.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.c', '.cpp', '.cs', '.php', '.rb', '.go', '.rs', '.html', '.css', '.json', '.xml', '.sh'
        ].some(ext => name.endsWith(ext))
    )
        return CodeIcon;
    if (mime.startsWith('image/')) return ImageIcon;
    return InsertDriveFileIcon;
};

const colorForMime = (theme?: any) => {
    if (!theme) return '#f5f5f5';
    return theme.palette.mode === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[200];
};

const iconColorForMime = (theme: any) => (
    theme.palette.mode === 'dark'
        ? theme.palette.grey[300]
        : theme.palette.grey[700]
);

const getFileExtension = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop()!.toUpperCase() : '';
};

const isImage = (mime?: string | null) => mime?.startsWith('image/');

const MediaLibraryImageList: React.FC<Props> = ({groupedByDate, cols, onItemClick}) => {
    const theme = useTheme();

    return (
        <>
            {Object.entries(groupedByDate).map(([label, group]) => (
                <Box key={label} sx={{mb: 4}}>
                    <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600}}>
                        {label} ({group.length})
                    </Typography>

                    <ImageList variant="masonry" cols={cols} gap={12}>
                        {group.map((item) => {
                            const Icon = iconForMime(item.mime_type ?? '', item.original_name ?? '');
                            const bgColor = colorForMime(theme);
                            const iconColor = iconColorForMime(theme);
                            const ext = getFileExtension(item.original_name ?? '');
                            return (
                                <ImageListItem
                                    key={item.uuid}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        '&:hover img': {transform: 'scale(1.05)'},
                                    }}
                                    onClick={() => onItemClick(item)}
                                >
                                    {isImage(item.mime_type) ? (
                                        <img
                                            src={`${item.url}?w=248&fit=crop&auto=format`}
                                            loading="lazy"
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                transition: 'transform 0.3s',
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                pt: '100%', // square
                                                bgcolor: bgColor,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            <Box sx={{position: 'absolute', top: 8, right: 8}}>
                                                {ext && (
                                                    <Chip
                                                        label={ext}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: theme.palette.background.paper,
                                                            color: theme.palette.text.secondary,
                                                            fontWeight: 700,
                                                            fontSize: 12,
                                                            borderRadius: 1,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Icon sx={{fontSize: 48, color: iconColor, mb: 1}}/>
                                            <Tooltip title={item.original_name} arrow>
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    sx={{
                                                        maxWidth: '80%',
                                                        fontWeight: 500,
                                                        color: theme.palette.text.primary,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {item.original_name}
                                                </Typography>
                                            </Tooltip>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    mt: 0.5,
                                                    fontSize: 11,
                                                }}
                                            >
                                                {item.mime_type}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Only show ImageListItemBar for images */}
                                    {isImage(item.mime_type) && (
                                        <ImageListItemBar
                                            title={item.alt || item.original_name}
                                            subtitle={item.mime_type}
                                        />
                                    )}
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </Box>
            ))}
        </>
    );
};

export default MediaLibraryImageList;
