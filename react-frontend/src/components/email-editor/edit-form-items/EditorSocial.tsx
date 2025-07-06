import React from "react";
import { Stack, TextField } from "@mui/material";
import EditorColorPicker from "./EditorColorPicker";
import {TemplateVariable} from "../../../services/VariableCatalogueService.ts";

interface EditorSocialProps {
    content: {
        iconSize: string;
        iconColor: string;
        facebook: string;
        instagram: string;
        x: string;
        linkedin: string;
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

const EditorSocial: React.FC<EditorSocialProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps
}) => (
    <Stack>
        <TextField
            label="Icon size (px)"
            {...baseProps}
            value={content.iconSize}
            onChange={e => updateContent('iconSize', e.target.value)}
        />
        <EditorColorPicker label="Icon colour" value={content.iconColor} onChange={v => updateContent('iconColor', v)} />

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

export default EditorSocial;

