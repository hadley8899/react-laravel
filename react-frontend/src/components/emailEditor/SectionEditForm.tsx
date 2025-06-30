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
    InputAdornment,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import InsertVariableMenu from '../email-editor/InsertVariableMenu';
import { CompanyVariable } from '../../interfaces/CompanyVariable';

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

const ColorField = ({
                        label,
                        value,
                        onChange,
                    }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
            {label}
        </Typography>
        <MuiColorInput format="hex" size="small" value={value} onChange={onChange} sx={{ width: '100%' }} />
    </Box>
);

const buildSlotProps = (
    field: string,
    value: string,
    vars: CompanyVariable[],
    update: (f: string, v: string) => void,
) => ({
    input: {
        endAdornment: (
            <InputAdornment position="end">
                <InsertVariableMenu variables={vars} onInsert={token => update(field, value + token)} />
            </InputAdornment>
        ),
    },
});

/* ------------------------------------------------------------------ */
/* main component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
    editingSection: any;
    updateContent: (field: string, value: any) => void;
    variables: CompanyVariable[];
}

const SectionEditForm: React.FC<Props> = ({ editingSection, updateContent, variables }) => {
    if (!editingSection) return null;

    const { type, content } = editingSection;
    const baseProps = { size: 'small' as const, fullWidth: true, sx: { mb: 2 } };

    /* ======================================================================
     * EXISTING BLOCKS (header / text / image / button / list / footer)
     *  — unchanged except we key off string literals rather than SECTION_TYPES
     * ==================================================================== */
    if (type === 'header')
        return (
            <Stack>
                <TextField
                    label="Heading"
                    {...baseProps}
                    value={content.heading}
                    onChange={e => updateContent('heading', e.target.value)}
                    slotProps={buildSlotProps('heading', content.heading, variables, updateContent)}
                />
                <TextField
                    label="Sub-heading"
                    {...baseProps}
                    value={content.subheading}
                    onChange={e => updateContent('subheading', e.target.value)}
                    slotProps={buildSlotProps('subheading', content.subheading, variables, updateContent)}
                />
                <ColorField
                    label="Background"
                    value={content.backgroundColor}
                    onChange={v => updateContent('backgroundColor', v)}
                />
                <ColorField label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
            </Stack>
        );

    if (type === 'text')
        return (
            <Stack>
                <TextField
                    label="Text content"
                    multiline
                    minRows={4}
                    {...baseProps}
                    value={content.text}
                    onChange={e => updateContent('text', e.target.value)}
                    slotProps={buildSlotProps('text', content.text, variables, updateContent)}
                />
                <TextField
                    label="Font size (e.g. 16px)"
                    {...baseProps}
                    value={content.fontSize}
                    onChange={e => updateContent('fontSize', e.target.value)}
                />
                <FormControl {...baseProps}>
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

    if (type === 'image')
        return (
            <Stack>
                <TextField
                    label="Image URL"
                    {...baseProps}
                    value={content.src}
                    onChange={e => updateContent('src', e.target.value)}
                    slotProps={buildSlotProps('src', content.src, variables, updateContent)}
                />
                <TextField
                    label="Alt text"
                    {...baseProps}
                    value={content.alt}
                    onChange={e => updateContent('alt', e.target.value)}
                    slotProps={buildSlotProps('alt', content.alt, variables, updateContent)}
                />
                <TextField
                    label="Width (e.g. 600px or 100%)"
                    {...baseProps}
                    value={content.width}
                    onChange={e => updateContent('width', e.target.value)}
                />
                <TextField
                    label="Caption"
                    {...baseProps}
                    value={content.caption}
                    onChange={e => updateContent('caption', e.target.value)}
                    slotProps={buildSlotProps('caption', content.caption, variables, updateContent)}
                />
            </Stack>
        );

    if (type === 'button')
        return (
            <Stack>
                <TextField
                    label="Button text"
                    {...baseProps}
                    value={content.text}
                    onChange={e => updateContent('text', e.target.value)}
                    slotProps={buildSlotProps('text', content.text, variables, updateContent)}
                />
                <TextField
                    label="URL"
                    {...baseProps}
                    value={content.url}
                    onChange={e => updateContent('url', e.target.value)}
                />
                <ColorField
                    label="Background"
                    value={content.backgroundColor}
                    onChange={v => updateContent('backgroundColor', v)}
                />
                <ColorField label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
                <FormControl {...baseProps}>
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

    if (type === 'list')
        return (
            <Stack>
                <FormControl {...baseProps}>
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
                    {...baseProps}
                    value={content.items.join('\n')}
                    onChange={e => updateContent('items', e.target.value.split('\n'))}
                />
            </Stack>
        );

    if (type === 'footer')
        return (
            <Stack>
                <TextField
                    label="Company name"
                    {...baseProps}
                    value={content.companyName}
                    onChange={e => updateContent('companyName', e.target.value)}
                    slotProps={buildSlotProps('companyName', content.companyName, variables, updateContent)}
                />
                <TextField
                    label="Address"
                    {...baseProps}
                    value={content.address}
                    onChange={e => updateContent('address', e.target.value)}
                    slotProps={buildSlotProps('address', content.address, variables, updateContent)}
                />
                <TextField
                    label="Unsubscribe text"
                    {...baseProps}
                    value={content.unsubscribeText}
                    onChange={e => updateContent('unsubscribeText', e.target.value)}
                    slotProps={buildSlotProps(
                        'unsubscribeText',
                        content.unsubscribeText,
                        variables,
                        updateContent,
                    )}
                />
                <ColorField
                    label="Background"
                    value={content.backgroundColor}
                    onChange={v => updateContent('backgroundColor', v)}
                />
                <ColorField label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
            </Stack>
        );

    /* ======================================================================
     * NEW BLOCKS
     * ==================================================================== */

    /* -------- Divider -------- */
    if (type === 'divider')
        return (
            <Stack>
                <TextField
                    label="Height (e.g. 1px)"
                    {...baseProps}
                    value={content.height}
                    onChange={e => updateContent('height', e.target.value)}
                />
                <ColorField label="Colour" value={content.color} onChange={v => updateContent('color', v)} />
            </Stack>
        );

    /* -------- Spacer -------- */
    if (type === 'spacer')
        return (
            <Stack>
                <TextField
                    label="Height (e.g. 24px)"
                    {...baseProps}
                    value={content.height}
                    onChange={e => updateContent('height', e.target.value)}
                />
            </Stack>
        );

    /* -------- Quote -------- */
    if (type === 'quote')
        return (
            <Stack>
                <TextField
                    label="Quote text"
                    multiline
                    minRows={3}
                    {...baseProps}
                    value={content.text}
                    onChange={e => updateContent('text', e.target.value)}
                    slotProps={buildSlotProps('text', content.text, variables, updateContent)}
                />
                <TextField
                    label="Author"
                    {...baseProps}
                    value={content.author}
                    onChange={e => updateContent('author', e.target.value)}
                    slotProps={buildSlotProps('author', content.author, variables, updateContent)}
                />
                <ColorField label="Background" value={content.backgroundColor} onChange={v => updateContent('backgroundColor', v)} />
                <ColorField label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
            </Stack>
        );

    /* -------- Two-column -------- */
    if (type === 'two_column')
        return (
            <Stack>
                <FormControl {...baseProps}>
                    <InputLabel id="layout">Layout</InputLabel>
                    <Select
                        labelId="layout"
                        label="Layout"
                        size="small"
                        value={content.layout}
                        onChange={e => updateContent('layout', e.target.value)}
                    >
                        <MenuItem value="image_left">Image left</MenuItem>
                        <MenuItem value="image_right">Image right</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Image URL"
                    {...baseProps}
                    value={content.image}
                    onChange={e => updateContent('image', e.target.value)}
                    slotProps={buildSlotProps('image', content.image, variables, updateContent)}
                />
                <TextField
                    label="Alt text"
                    {...baseProps}
                    value={content.alt}
                    onChange={e => updateContent('alt', e.target.value)}
                />
                <TextField
                    label="Heading"
                    {...baseProps}
                    value={content.heading}
                    onChange={e => updateContent('heading', e.target.value)}
                    slotProps={buildSlotProps('heading', content.heading, variables, updateContent)}
                />
                <TextField
                    label="Body"
                    multiline
                    minRows={3}
                    {...baseProps}
                    value={content.body}
                    onChange={e => updateContent('body', e.target.value)}
                    slotProps={buildSlotProps('body', content.body, variables, updateContent)}
                />
                <TextField
                    label="Button text"
                    {...baseProps}
                    value={content.button.text}
                    onChange={e => updateContent('button', { ...content.button, text: e.target.value })}
                />
                <TextField
                    label="Button URL"
                    {...baseProps}
                    value={content.button.url}
                    onChange={e => updateContent('button', { ...content.button, url: e.target.value })}
                />
            </Stack>
        );

    /* -------- Social links -------- */
    if (type === 'social')
        return (
            <Stack>
                <TextField
                    label="Icon size (px)"
                    {...baseProps}
                    value={content.iconSize}
                    onChange={e => updateContent('iconSize', e.target.value)}
                />
                <ColorField label="Icon colour" value={content.iconColor} onChange={v => updateContent('iconColor', v)} />

                {['facebook', 'instagram', 'x', 'linkedin'].map(net => (
                    <TextField
                        key={net}
                        label={`${net.charAt(0).toUpperCase()}${net.slice(1)} URL`}
                        {...baseProps}
                        value={content[net]}
                        onChange={e => updateContent(net, e.target.value)}
                        slotProps={buildSlotProps(net, content[net], variables, updateContent)}
                    />
                ))}
            </Stack>
        );

    /* -------------------------------------------------------------------- */
    return <Typography color="text.secondary">No edit form available</Typography>;
};

export default SectionEditForm;
