import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface TextProps {
    content: {
        text: string;
        fontSize: string;
        textAlign: string;
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

const EditorText: React.FC<TextProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps
}) => {
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
};

export default EditorText;

