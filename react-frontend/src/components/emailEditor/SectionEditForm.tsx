import React from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    Box,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { SECTION_TYPES } from '../../mock/editor/default-sections';

interface Props {
    editingSection: any;
    updateContent: (field: string, value: any) => void;
}

const ColorField = ({
                        label,
                        value,
                        onChange,
                    }: {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
}) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
            {label}
        </Typography>
        <MuiColorInput
            format="hex"
            size="small"
            value={value}
            onChange={onChange}
            sx={{ width: '100%' }}
        />
    </Box>
);

const SectionEditForm: React.FC<Props> = ({ editingSection, updateContent }) => {
    if (!editingSection) {
        return null;
    }

    const { type, content } = editingSection;

    const textFieldProps = {
        size: 'small' as const,
        fullWidth: true,
        sx: { mb: 2 },
    };

    /* ------------------------------ HEADER ------------------------------ */
    if (type === SECTION_TYPES.HEADER)
        return (
            <Stack>
                <TextField
                    label="Heading"
                    {...textFieldProps}
                    value={content.heading}
                    onChange={e => updateContent('heading', e.target.value)}
                />
                <TextField
                    label="Sub‑heading"
                    {...textFieldProps}
                    value={content.subheading}
                    onChange={e => updateContent('subheading', e.target.value)}
                />
                <ColorField
                    label="Background"
                    value={content.backgroundColor}
                    onChange={newValue => updateContent('backgroundColor', newValue)}
                />
                <ColorField
                    label="Text colour"
                    value={content.textColor}
                    onChange={newValue => updateContent('textColor', newValue)}
                />
            </Stack>
        );

    if (type === SECTION_TYPES.TEXT)
        return (
            <Stack>
                <TextField
                    label="Text content"
                    multiline
                    minRows={4}
                    {...textFieldProps}
                    value={content.text}
                    onChange={e => updateContent('text', e.target.value)}
                />
                <TextField
                    label="Font size (e.g. 16px)"
                    {...textFieldProps}
                    value={content.fontSize}
                    onChange={e => updateContent('fontSize', e.target.value)}
                />
                <FormControl {...textFieldProps}>
                    <InputLabel id="align">Alignment</InputLabel>
                    <Select
                        labelId="align"
                        label="Alignment"
                        size="small"
                        value={content.textAlign}
                        onChange={e => updateContent('textAlign', e.target.value)}
                    >
                        <MenuItem value="left">Left</MenuItem>
                        <MenuItem value="center">Center</MenuItem>
                        <MenuItem value="right">Right</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        );

    if (type === SECTION_TYPES.IMAGE)
        return (
            <Stack>
                <TextField
                    label="Image URL"
                    {...textFieldProps}
                    value={content.src}
                    onChange={e => updateContent('src', e.target.value)}
                />
                <TextField
                    label="Alt text"
                    {...textFieldProps}
                    value={content.alt}
                    onChange={e => updateContent('alt', e.target.value)}
                />
                <TextField
                    label="Width (e.g. 600px or 100%)"
                    {...textFieldProps}
                    value={content.width}
                    onChange={e => updateContent('width', e.target.value)}
                />
                <TextField
                    label="Caption"
                    {...textFieldProps}
                    value={content.caption}
                    onChange={e => updateContent('caption', e.target.value)}
                />
            </Stack>
        );

    if (type === SECTION_TYPES.BUTTON)
        return (
            <Stack>
                <TextField
                    label="Button text"
                    {...textFieldProps}
                    value={content.text}
                    onChange={e => updateContent('text', e.target.value)}
                />
                <TextField
                    label="URL"
                    {...textFieldProps}
                    value={content.url}
                    onChange={e => updateContent('url', e.target.value)}
                />
                <ColorField
                    label="Background"
                    value={content.backgroundColor}
                    onChange={newValue => updateContent('backgroundColor', newValue)}
                />
                <ColorField
                    label="Text colour"
                    value={content.textColor}
                    onChange={newValue => updateContent('textColor', newValue)}
                />
                <FormControl {...textFieldProps}>
                    <InputLabel id="btn-align">Alignment</InputLabel>
                    <Select
                        labelId="btn-align"
                        label="Alignment"
                        size="small"
                        value={content.alignment}
                        onChange={e => updateContent('alignment', e.target.value)}
                    >
                        <MenuItem value="left">Left</MenuItem>
                        <MenuItem value="center">Center</MenuItem>
                        <MenuItem value="right">Right</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        );

    if (type === SECTION_TYPES.LIST) {
        return (
            <Stack>
                <FormControl {...textFieldProps}>
                    <InputLabel id="list-type">List type</InputLabel>
                    <Select
                        labelId="list-type"
                        label="List type"
                        size="small"
                        value={content.listType}
                        onChange={e => updateContent('listType', e.target.value)}
                    >
                        <MenuItem value="bullet">Bullet</MenuItem>
                        <MenuItem value="number">Numbered</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Items (one per line)"
                    multiline
                    minRows={4}
                    {...textFieldProps}
                    value={content.items.join('\n')}
                    onChange={e =>
                        updateContent('items', e.target.value.split('\n'))
                    }
                />
            </Stack>
        );
    }

    if (type === SECTION_TYPES.FOOTER)
        return (
            <Stack>
                <TextField
                    label="Company name"
                    {...textFieldProps}
                    value={content.companyName}
                    onChange={e => updateContent('companyName', e.target.value)}
                />
                <TextField
                    label="Address"
                    {...textFieldProps}
                    value={content.address}
                    onChange={e => updateContent('address', e.target.value)}
                />
                <TextField
                    label="Unsubscribe text"
                    {...textFieldProps}
                    value={content.unsubscribeText}
                    onChange={e => updateContent('unsubscribeText', e.target.value)}
                />
                <ColorField
                    label="Background"
                    value={content.backgroundColor}
                    onChange={newValue => updateContent('backgroundColor', newValue)}
                />
                <ColorField
                    label="Text colour"
                    value={content.textColor}
                    onChange={newValue => updateContent('textColor', newValue)}
                />
            </Stack>
        );

    return <Typography color="text.secondary">No edit form available</Typography>;
};

export default SectionEditForm;