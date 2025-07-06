import React from "react";
import {Stack, TextField} from "@mui/material";
import EditorColorPicker from "./EditorColorPicker.tsx";
import {TemplateVariable} from "../../../services/VariableCatalogueService.ts";

interface HeaderProps {
    content: {
        heading: string;
        subheading: string;
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

const EditorHeader: React.FC<HeaderProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps
}) => {
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
            <EditorColorPicker
                label="Background"
                value={content.backgroundColor}
                onChange={v => updateContent('backgroundColor', v)}
            />
            <EditorColorPicker label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
        </Stack>
    );
};

export default EditorHeader;
