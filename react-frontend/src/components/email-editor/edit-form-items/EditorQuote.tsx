import React from "react";
import { Stack, TextField } from "@mui/material";
import EditorColorPicker from "./EditorColorPicker";
import {TemplateVariable} from "../../../services/VariableCatalogueService.ts";

interface EditorQuoteProps {
    content: {
        text: string;
        author: string;
        backgroundColor: string;
        textColor: string;
    };
    updateContent: (key: string, value: string) => void;
    variables: TemplateVariable[];
    baseProps: Record<string, any>;
    buildSlotProps: (
        key: string,
        value: string,
        variables: TemplateVariable[],
        updateContent: (key: string, value: string) => void
    ) => Record<string, any>;
}

const EditorQuote: React.FC<EditorQuoteProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps
}) => (
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
        <EditorColorPicker label="Background" value={content.backgroundColor} onChange={v => updateContent('backgroundColor', v)} />
        <EditorColorPicker label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
    </Stack>
);

export default EditorQuote;

