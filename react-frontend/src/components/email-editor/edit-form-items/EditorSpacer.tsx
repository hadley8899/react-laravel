import React from "react";
import { Stack, TextField } from "@mui/material";

interface EditorSpacerProps {
    content: {
        height: string;
    };
    updateContent: (key: string, value: string) => void;
    baseProps: Record<string, any>;
}

const EditorSpacer: React.FC<EditorSpacerProps> = ({
    content,
    updateContent,
    baseProps
}) => (
    <Stack>
        <TextField
            label="Height (e.g. 24px)"
            {...baseProps}
            value={content.height}
            onChange={e => updateContent('height', e.target.value)}
        />
    </Stack>
);

export default EditorSpacer;

