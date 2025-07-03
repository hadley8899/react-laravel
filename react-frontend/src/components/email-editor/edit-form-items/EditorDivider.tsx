import React from "react";
import { Stack, TextField } from "@mui/material";
import EditorColorPicker from "./EditorColorPicker";

interface EditorDividerProps {
    content: {
        height: string;
        color: string;
    };
    updateContent: (key: string, value: string) => void;
    baseProps: Record<string, any>;
}

const EditorDivider: React.FC<EditorDividerProps> = ({
    content,
    updateContent,
    baseProps
}) => (
    <Stack>
        <TextField
            label="Height (e.g. 1px)"
            {...baseProps}
            value={content.height}
            onChange={e => updateContent('height', e.target.value)}
        />
        <EditorColorPicker
            label="Colour"
            value={content.color}
            onChange={v => updateContent('color', v)}
        />
    </Stack>
);

export default EditorDivider;

