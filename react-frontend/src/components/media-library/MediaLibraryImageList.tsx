import { Box, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import React from 'react';
import type { MediaItem } from '../../pages/MediaLibrary';

interface Props {
    groupedByDate: Record<string, MediaItem[]>;
    cols: number;
    onItemClick: (item: MediaItem) => void;
}

const MediaLibraryImageList: React.FC<Props> = ({ groupedByDate, cols, onItemClick }) => (
    <>
        {Object.entries(groupedByDate).map(([label, group]) => (
            <Box key={label} sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {label}
                </Typography>

                <ImageList variant="masonry" cols={cols} gap={12}>
                    {group.map((item) => (
                        <ImageListItem
                            key={item.id}
                            sx={{
                                cursor: 'pointer',
                                borderRadius: 2,
                                overflow: 'hidden',
                                '&:hover img': { transform: 'scale(1.05)' },
                            }}
                            onClick={() => onItemClick(item)}
                        >
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
                            <ImageListItemBar title={item.name} />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        ))}
    </>
);

export default MediaLibraryImageList;
