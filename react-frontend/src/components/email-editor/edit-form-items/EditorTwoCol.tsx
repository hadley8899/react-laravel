import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface EditorTwoColProps {
    content: {
        layout: string;
        image: string;
        alt: string;
        heading: string;
        body: string;
        button: {
            text: string;
            url: string;
        };
    };
    updateContent: (key: string, value: any) => void;
    variables: CompanyVariable[];
    baseProps: Record<string, any>;
    buildSlotProps: (
        key: string,
        value: string,
        variables: CompanyVariable[],
        updateContent: (key: string, value: string) => void
    ) => Record<string, any>;
}

const EditorTwoCol: React.FC<EditorTwoColProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps
}) => (
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

export default EditorTwoCol;

