import React from "react";
import { Stack, TextField } from "@mui/material";
import EditorColorPicker from "./EditorColorPicker";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface EditorFooterProps {
    content: {
        companyName: string;
        address: string;
        unsubscribeText: string;
        backgroundColor: string;
        textColor: string;
    };
    updateContent: (key: string, value: string) => void;
    variables: CompanyVariable[];
    baseProps: Record<string, any>;
    buildSlotProps: (
        key: string,
        value: string,
        variables: CompanyVariable[],
        updateContent: (key: string, value: string) => void
    ) => Record<string, any>;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps
}) => {
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
                slotProps={buildSlotProps('unsubscribeText', content.unsubscribeText, variables, updateContent)}
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

export default EditorFooter;

