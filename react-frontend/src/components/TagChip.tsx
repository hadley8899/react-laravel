import React from 'react';
import { Chip, ChipProps, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Tag } from '../interfaces/Tag';

interface TagChipProps extends Omit<ChipProps, 'label'> {
    tag: Tag;
}

const TagChip: React.FC<TagChipProps> = ({ tag, onDelete, ...chipProps }) => {
    const theme = useTheme();

    const bg = tag.color ?? theme.palette.grey[700];
    const fg = theme.palette.getContrastText(bg);

    return (
        <Chip
            label={tag.name}
            size="small"
            onDelete={onDelete}                             // delete icon shows when provided
            deleteIcon={onDelete ? <CloseIcon sx={{ fontSize: 18 }} /> : undefined}
            sx={{
                backgroundColor: bg,
                color: fg,
                '& .MuiChip-deleteIcon': { color: fg },
            }}
            {...chipProps}
        />
    );
};

export default TagChip;
